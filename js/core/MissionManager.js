// FILE: js/core/MissionManager.js

/**
 * 📘 PROJECT: VOID MERCHANT
 * MODULE: MISSION MANAGER
 * * Generiert Aufträge basierend auf wirtschaftlichen Engpässen (TDD Vol 2, 3.2).
 * * Singleton Pattern via window.game.missionManager
 * * UPDATE: Added Persistence Methods (Import/Export).
 */

import { WARE_DB, getWare } from '../data/WareDB.js';
import { SECTOR_DB } from '../data/SectorDB.js';

export default class MissionManager {
    constructor(scene) {
        this.scene = scene;
        this.activeMissions = []; // Missionen, die der Spieler angenommen hat
    }

    /**
     * Generiert Missionen für eine spezifische Station basierend auf deren Bedarf.
     * @param {Station} station - Die Station Entity
     * @returns {Array} Liste von Missionsobjekten
     */
    generateStationMissions(station) {
        const missions = [];

        // 1. SUPPLY MISSIONS (Bedarf an Ressourcen)
        // Wir prüfen das Market-Objekt der Station (welches mit der Sim gesynct ist)
        for (const [wareId, marketData] of Object.entries(station.market)) {
            // Logik: Wenn Lagerbestand < 30% der Kapazität -> Generiere Mission
            const fillRatio = marketData.stock / marketData.capacity;

            if (fillRatio < 0.3) {
                // Je leerer, desto dringender
                const urgency = fillRatio < 0.1 ? 'CRITICAL' : 'HIGH';
                const amountNeeded = Math.floor((marketData.capacity * 0.5) - marketData.stock);

                if (amountNeeded > 0) {
                    const ware = getWare(wareId);
                    // Reward Calculation: Base Price * Amount * Urgency Multiplier
                    const multiplier = urgency === 'CRITICAL' ? 2.5 : 1.5;
                    const reward = Math.floor(ware.basePrice * amountNeeded * multiplier);

                    missions.push({
                        id: `mis_${station.name}_${wareId}_${Date.now()}`,
                        type: 'SUPPLY',
                        title: `Urgent: ${ware.name} needed`,
                        description: `Our stocks of ${ware.name} are critically low. We need a reliable pilot to deliver supplies immediately.`,
                        wareId: wareId,
                        amount: amountNeeded,
                        reward: reward,
                        targetStation: station.name, // Name or ID
                        urgency: urgency,
                        expiry: Date.now() + 600000 // 10 Minuten gültig
                    });
                }
            }
        }

        // 2. RANDOM PATROL MISSIONS (Placeholder für später)
        if (Math.random() > 0.7) {
            missions.push({
                id: `mis_patrol_${Date.now()}`,
                type: 'PATROL',
                title: 'Security Patrol',
                description: 'Xenon activity reported in this sector. Patrol the perimeter.',
                reward: 5000,
                urgency: 'NORMAL',
                expiry: Date.now() + 300000
            });
        }

        return missions;
    }

    acceptMission(mission) {
        this.activeMissions.push(mission);
        console.log(`Mission accepted: ${mission.title}`);
        return true;
    }

    /**
     * Prüft, ob eine Lieferung eine Mission erfüllt.
     * @param {string} stationName 
     * @param {string} wareId 
     * @param {number} amountDelivered 
     * @returns {number} Total Reward ausgezahlt
     */
    checkSupplyMissionCompletion(stationName, wareId, amountDelivered) {
        // Finde passenden Auftrag
        const missionIndex = this.activeMissions.findIndex(m => 
            m.type === 'SUPPLY' && 
            m.targetStation === stationName && 
            m.wareId === wareId &&
            m.amount <= amountDelivered // Vereinfachung: Muss alles auf einmal liefern
        );

        if (missionIndex !== -1) {
            const mission = this.activeMissions[missionIndex];
            // Mission Complete
            this.activeMissions.splice(missionIndex, 1);
            return mission.reward;
        }

        return 0;
    }

    // --- PERSISTENCE METHODS ---

    /**
     * Gibt die aktuellen Missionen für das SaveSystem zurück.
     */
    exportMissions() {
        // Filtere abgelaufene Missionen vor dem Speichern raus
        const now = Date.now();
        this.activeMissions = this.activeMissions.filter(m => m.expiry > now);
        return this.activeMissions;
    }

    /**
     * Lädt Missionen aus dem Savegame.
     */
    importMissions(data) {
        if (!Array.isArray(data)) return;
        
        const now = Date.now();
        // Importiere nur Missionen, die noch nicht abgelaufen sind
        this.activeMissions = data.filter(m => m.expiry > now);
        
        console.log(`MissionManager: Restored ${this.activeMissions.length} active missions.`);
    }
}


