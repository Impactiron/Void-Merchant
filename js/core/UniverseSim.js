// FILE: js/core/UniverseSim.js

/**
 * 📘 PROJECT: VOID MERCHANT
 * MODULE: UNIVERSE SIMULATION (THE GOD ENGINE)
 * * Handhabt die Hintergrund-Logik für alle Sektoren (OOS & IS Economy).
 * * UPDATE: Uses EventsCenter to announce checks.
 */

import { SECTOR_DB } from '../data/SectorDB.js';
import { WARE_DB } from '../data/WareDB.js';
import { CONSTANTS } from './config.js';
import TradeAgent from '../entities/TradeAgent.js';
import events from './EventsCenter.js'; // NEU

export default class UniverseSim {
    constructor() {
        this.tickRate = 1000; // 1 Tick pro Sekunde
        this.intervalId = null;
        this.isRunning = false;
        this.tickCount = 0;

        // GLOBAL REGISTRY
        this.stationRegistry = new Map();

        // AGENT REGISTRY
        this.agents = [];

        console.log("UniverseSim: Engine instantiated. Systems nominal.");
    }

    start() {
        if (this.isRunning) return;

        console.log("UniverseSim: Initializing Economy...");
        this.initializeEconomy();

        console.log("UniverseSim: Spawning Trade Fleet...");
        this.initializeAgents();

        console.log("UniverseSim: Starting Timeline...");
        this.isRunning = true;
        this.intervalId = setInterval(() => {
            this.tick();
        }, this.tickRate);
    }

    stop() {
        if (!this.isRunning) return;
        console.log("UniverseSim: Freezing Timeline.");
        this.isRunning = false;
        clearInterval(this.intervalId);
    }

    initializeEconomy() {
        this.stationRegistry.clear();
        let stationCount = 0;

        Object.values(SECTOR_DB).forEach(sector => {
            if (sector.stations) {
                sector.stations.forEach((stationData, index) => {
                    const simId = `${sector.id}_st_${index}`;

                    const registryData = {
                        id: simId,
                        name: stationData.name,
                        sectorId: sector.id,
                        stock: {},
                        production: [],
                        credits: 100000,
                        storageVolumeCap: 500000
                    };

                    const template = this.getStationTemplate(stationData.name, stationData.type);
                    registryData.production = template.production;
                    registryData.stock = template.initialStock;

                    this.stationRegistry.set(simId, registryData);
                    stationCount++;
                });
            }
        });

        console.log(`UniverseSim: Economy initialized. Registered ${stationCount} stations.`);
    }

    initializeAgents() {
        this.agents = [];
        Object.values(SECTOR_DB).forEach(sector => {
            if (sector.faction !== 'XEN' && sector.stations && sector.stations.length > 0) {
                for (let i = 0; i < 2; i++) {
                    const agentId = `agent_${sector.faction}_${sector.id}_${i}`;
                    const agent = new TradeAgent(agentId, sector.faction, sector.id);
                    this.agents.push(agent);
                }
            }
        });
        console.log(`UniverseSim: Deployed ${this.agents.length} trade agents.`);
    }

    getStationTemplate(name, type) {
        const nameLower = name.toLowerCase();

        if (nameLower.includes('solar') || nameLower.includes('energy')) {
            return {
                production: [{
                    output: 'energy_cells',
                    outputAmount: 400,
                    inputs: [],
                    cycleTime: 60,
                    progress: 0
                }],
                initialStock: { 'energy_cells': 5000 }
            };
        }

        if (nameLower.includes('refinery')) {
            return {
                production: [{
                    output: 'refined_metal',
                    outputAmount: 20,
                    inputs: [
                        { id: 'energy_cells', amount: 100 },
                        { id: 'ore_iron', amount: 20 }
                    ],
                    cycleTime: 120,
                    progress: 0
                }],
                initialStock: { 'energy_cells': 2000, 'ore_iron': 500, 'refined_metal': 0 }
            };
        }

        if (nameLower.includes('trading') || nameLower.includes('wharf') || nameLower.includes('shipyard')) {
            return {
                production: [],
                initialStock: {
                    'energy_cells': 10000,
                    'refined_metal': 500,
                    'hull_parts': 200,
                    'ore_iron': 0
                }
            };
        }

        return {
            production: [{
                output: 'refined_metal',
                outputAmount: 10,
                inputs: [{ id: 'energy_cells', amount: 50 }],
                cycleTime: 120,
                progress: 0
            }],
            initialStock: { 'energy_cells': 1000 }
        };
    }

    tick() {
        this.tickCount++;

        // 1. Produktion simulieren
        this.simulateEconomy();

        // 2. Logistik simulieren (Agents)
        this.simulateAgents();

        // Event emitting for debugging / other systems listening
        events.emit('universe-tick', this.tickCount);

        if (this.tickCount % 10 === 0) {
            this.logEconomicStatus();
        }
    }

    simulateEconomy() {
        this.stationRegistry.forEach(station => {
            this.processStationProduction(station);
        });
    }

    processStationProduction(station) {
        if (!station.production || station.production.length === 0) return;

        station.production.forEach(line => {
            let canProduce = true;
            if (line.inputs.length > 0) {
                for (let input of line.inputs) {
                    const currentStock = station.stock[input.id] || 0;
                    if (currentStock < input.amount) {
                        canProduce = false;
                        break;
                    }
                }
            }

            if (canProduce) {
                line.progress += 1;
                if (line.progress >= line.cycleTime) {
                    line.inputs.forEach(input => {
                        station.stock[input.id] -= input.amount;
                    });

                    if (!station.stock[line.output]) station.stock[line.output] = 0;

                    const ware = WARE_DB[line.output];
                    const volPerUnit = ware ? ware.volume : 1;
                    const amountToAdd = line.outputAmount;

                    const currentVol = station.stock[line.output] * volPerUnit;
                    const maxVolForWare = station.storageVolumeCap * 0.5;

                    if (currentVol + (amountToAdd * volPerUnit) <= maxVolForWare) {
                        station.stock[line.output] += amountToAdd;
                    }

                    line.progress = 0;
                }
            }
        });
    }

    simulateAgents() {
        this.agents.forEach(agent => {
            if (agent.state === 'IDLE') {
                this.findTradeRoute(agent);
            } else if (agent.state === 'TRAVEL_TO_BUY' || agent.state === 'TRAVEL_TO_SELL') {
                this.processAgentTravel(agent);
            }
        });
    }

    findTradeRoute(agent) {
        const candidates = Array.from(this.stationRegistry.values());
        const commodities = ['energy_cells', 'refined_metal', 'ore_iron'];

        for (const wareId of commodities) {
            const sellers = candidates.filter(st => {
                const stock = st.stock[wareId] || 0;
                return stock > 500;
            });

            const buyers = candidates.filter(st => {
                const stock = st.stock[wareId] || 0;
                return stock < 2000;
            });

            if (sellers.length > 0 && buyers.length > 0) {
                const seller = sellers[Math.floor(Math.random() * sellers.length)];
                const buyer = buyers[Math.floor(Math.random() * buyers.length)];

                if (seller.id !== buyer.id) {
                    agent.state = 'TRAVEL_TO_BUY';
                    agent.targetStationId = seller.id;
                    agent.targetSectorId = seller.sectorId;
                    agent.targetWare = wareId;

                    const sameSector = (agent.currentSectorId === seller.sectorId);
                    agent.travelTimer = sameSector ? 10 : 30;

                    return;
                }
            }
        }
    }

    processAgentTravel(agent) {
        agent.travelTimer--;

        if (agent.travelTimer <= 0) {
            const station = this.stationRegistry.get(agent.targetStationId);

            if (!station) {
                agent.state = 'IDLE';
                return;
            }

            agent.currentSectorId = station.sectorId;

            if (agent.state === 'TRAVEL_TO_BUY') {
                const wareId = agent.targetWare;
                const available = station.stock[wareId] || 0;
                const amount = Math.min(available, agent.cargoCapacity);

                if (amount > 0) {
                    station.stock[wareId] -= amount;
                    station.credits += amount * 10;
                    agent.cargo[wareId] = amount;
                    this.findBuyerForCargo(agent);
                } else {
                    agent.state = 'IDLE';
                }

            } else if (agent.state === 'TRAVEL_TO_SELL') {
                const wareId = agent.targetWare;
                const amount = agent.cargo[wareId] || 0;

                if (amount > 0) {
                    if (!station.stock[wareId]) station.stock[wareId] = 0;
                    station.stock[wareId] += amount;
                    station.credits -= amount * 10;

                    agent.cargo[wareId] = 0;
                    agent.credits += amount * 15;
                }

                agent.state = 'IDLE';
            }
        }
    }

    findBuyerForCargo(agent) {
        const wareId = agent.targetWare;
        const candidates = Array.from(this.stationRegistry.values());

        const buyers = candidates.filter(st => {
            const stock = st.stock[wareId] || 0;
            return stock < 3000 && st.id !== agent.targetStationId;
        });

        if (buyers.length > 0) {
            const buyer = buyers[Math.floor(Math.random() * buyers.length)];

            agent.state = 'TRAVEL_TO_SELL';
            agent.targetStationId = buyer.id;
            agent.targetSectorId = buyer.sectorId;

            const sameSector = (agent.currentSectorId === buyer.sectorId);
            agent.travelTimer = sameSector ? 10 : 30;
        } else {
            agent.state = 'IDLE';
        }
    }

    logEconomicStatus() {
        let totalEnergy = 0;
        let totalMetal = 0;
        this.stationRegistry.forEach(st => {
            totalEnergy += st.stock['energy_cells'] || 0;
            totalMetal += st.stock['refined_metal'] || 0;
        });

        const idleAgents = this.agents.filter(a => a.state === 'IDLE').length;
        // console.log(`[UniverseSim] Ticks: ${this.tickCount} | Stations: ${this.stationRegistry.size} | Agents: ${this.agents.length} (Idle: ${idleAgents})`);
    }

    getStationData(sectorId, stationName) {
        for (let [id, st] of this.stationRegistry) {
            if (st.sectorId === sectorId && st.name === stationName) {
                return st;
            }
        }
        return null;
    }

    getAgentsInSector(sectorId) {
        return this.agents.filter(a => a.currentSectorId === sectorId && a.state !== 'IDLE');
    }
}


