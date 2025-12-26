// FILE: js/core/SaveSystem.js

/**
 * 📘 PROJECT: VOID MERCHANT
 * MODULE: SAVE SYSTEM
 * * Handhabt Serialisierung und Speicherung.
 * * UPDATE v0.4.4: Added Mission Persistence.
 */

import { getShipStats } from '../data/ShipDB.js';

export default class SaveSystem {
    constructor() {
        this.saveKey = 'void_merchant_save_v1';
    }

    /**
     * Speichert den aktuellen Spielstand.
     * @param {Object} playerData 
     * @param {Object} shipData 
     * @param {Array} missionData - NEU: Array der aktiven Missionen
     */
    save(playerData, shipData, missionData = []) {
        const data = {
            meta: {
                timestamp: Date.now(),
                version: "0.4.4"
            },
            player: {
                credits: playerData.credits,
                cargo: playerData.cargo,
                currentShipId: playerData.currentShipId,
                
                // Wir speichern den RELATIVEN Schaden, nicht die absoluten HP
                hullDamage: playerData.hullMax - playerData.hullCurrent,
                shieldDamage: playerData.shieldMax - playerData.shieldCurrent
            },
            ship: {
                activeWeaponId: shipData.activeWeaponId
            },
            missions: missionData // NEU
        };

        try {
            const json = JSON.stringify(data);
            localStorage.setItem(this.saveKey, json);
            console.log("SaveSystem: Game saved successfully.", data);
            return true;
        } catch (e) {
            console.error("SaveSystem: Failed to save.", e);
            return false;
        }
    }

    load() {
        const json = localStorage.getItem(this.saveKey);
        if (!json) return null;

        try {
            const data = JSON.parse(json);

            // RECONSTRUCTION
            const shipId = data.player.currentShipId || 'arg_s_fighter_elite';
            const freshStats = getShipStats(shipId);

            const restoredPlayer = {
                credits: data.player.credits,
                cargo: data.player.cargo,
                currentShipId: shipId,

                // Recalculate Current Values
                hullMax: freshStats.hull,
                shieldMax: freshStats.shield,

                // Apply Damage (Clamp to 0 min)
                hullCurrent: Math.max(0, freshStats.hull - (data.player.hullDamage || 0)),
                shieldCurrent: Math.max(0, freshStats.shield - (data.player.shieldDamage || 0))
            };

            // Return reconstructed object compatible with GameScene
            return {
                meta: data.meta,
                player: restoredPlayer,
                ship: data.ship,
                missions: data.missions || [] // NEU (Fallback empty array)
            };

        } catch (e) {
            console.error("SaveSystem: Failed to parse save file.", e);
            return null;
        }
    }

    clear() {
        localStorage.removeItem(this.saveKey);
        console.log("SaveSystem: Save file deleted.");
    }
}


