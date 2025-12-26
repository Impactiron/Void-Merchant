// FILE: js/entities/Station.js

/**
 * 📘 PROJECT: VOID MERCHANT
 * MODULE: STATION ENTITY
 * * Statische Handelsstation / Docking Hub.
 * * UPDATE: Added Missions Logic & MissionManager integration.
 */

import { WEAPON_DB } from '../data/WeaponDB.js';
import { WARE_DB, getWare } from '../data/WareDB.js';
import MissionManager from '../core/MissionManager.js';

export default class Station extends Phaser.Physics.Arcade.Sprite {
    /**
     * @param {Phaser.Scene} scene
     * @param {number} x
     * @param {number} y
     * @param {string} texture
     * @param {string} name
     */
    constructor(scene, x, y, texture, name = "Unknown Outpost") {
        super(scene, x, y, texture);

        this.scene = scene;
        this.name = name;

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this, true); // true = Static Body

        // --- VISUAL SETUP ---
        this.setDisplaySize(256, 256);
        this.body.setCircle(100, 28, 28);

        // --- GAMEPLAY PROPERTIES ---
        this.dockingRange = 400;

        // --- MARKET LOGIC ---
        this.market = {};
        this.shipyard = [];
        this.availableMissions = []; // NEU: Missions-Liste

        // Initialer Sync (falls Sim schon läuft) oder Fallback
        if (window.game && window.game.universe) {
            this.syncWithSimulation();
        } else {
            this.configureFallbackMarket();
        }

        this.configureShipyard();
        
        // Setup Mission Manager Helper (Local Instance just for generation helpers)
        this.missionHelper = new MissionManager(this.scene);
    }

    /**
     * Zieht aktuelle Daten aus der God Engine (UniverseSim)
     * und baut das lokale Markt-Objekt für das UI auf.
     */
    syncWithSimulation() {
        if (!window.game.universe) return;

        // 1. Hole Sim-Daten
        const simData = window.game.universe.getStationData(this.scene.currentSectorId, this.name);

        if (simData) {
            this.market = {}; // Reset

            // 2. Konvertiere Sim-Stock in UI-Market-Items
            for (const [wareId, amount] of Object.entries(simData.stock)) {
                const wareInfo = getWare(wareId);
                const capacity = 50000; // Hardcoded Cap per Station/Ware vorerst

                this.market[wareId] = {
                    stock: Math.floor(amount),
                    capacity: capacity,
                    basePrice: wareInfo.basePrice,
                    // Dynamic Price Calculation
                    getPrice: function() {
                        const ratio = this.stock / this.capacity;
                        const swing = 0.5; // +/- 50%
                        const modifier = swing * (1 - (2 * ratio));
                        return Math.max(1, Math.floor(wareInfo.basePrice + (wareInfo.basePrice * modifier)));
                    }
                };
            }
            // console.log(`Station ${this.name} synced with UniverseSim.`);
        }
        
        // 3. GENERATE MISSIONS (Refresh on sync)
        if (this.missionHelper) {
            this.availableMissions = this.missionHelper.generateStationMissions(this);
        }
    }

    /**
     * Fallback für Tests ohne Simulation
     */
    configureFallbackMarket() {
        console.warn("Station running in Fallback Mode (No UniverseSim)");
        this.addItemToFallbackMarket('ore_iron', 0, 1000, 15);
        this.addItemToFallbackMarket('energy_cells', 2000, 5000, 4);
    }

    addItemToFallbackMarket(wareId, stock, capacity, basePrice) {
        this.market[wareId] = {
            stock: stock,
            capacity: capacity,
            basePrice: basePrice,
            getPrice: function() {
                return basePrice;
            }
        };
    }

    configureShipyard() {
        // Wir bieten alle Waffen aus der DB an
        this.shipyard = [];
        for (const [id, stats] of Object.entries(WEAPON_DB)) {
            this.shipyard.push({
                id: id,
                ...stats
            });
        }
    }
}


