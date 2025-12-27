/**
 * RecipeDB.js
 * Enthält alle Crafting-Rezepte für Modifikationen.
 *
 * Struktur:
 * - id: Eindeutiger Key
 * - name: Anzeigename
 * - requirements: Benötigte Ressourcen
 * - effect: Funktion, die auf das Schiff angewendet wird
 */

export const RecipeDB = {
    // TDD 4.2: Damage Mod
    'mod_damage_t1': {
        name: 'Waffen-Übertaktung Mk1',
        description: 'Erhöht Waffenschaden zufällig um 10-30%.',
        requirements: [
            { id: 'item_tuning_software_basic', count: 1 }
        ],
        effect: (ship) => {
            // Zufallswert zwischen 10% und 30%
            const boost = Phaser.Math.FloatBetween(0.10, 0.30);
            
            if (ship.weaponSystem) {
                // Basis-Multiplikator erhöhen
                ship.weaponSystem.damageMult = (ship.weaponSystem.damageMult || 1.0) + boost;
            }

            return `Waffenschaden um ${(boost * 100).toFixed(1)}% gesteigert.`;
        }
    },

    // TDD 4.2: Cooling Mod
    'mod_cooling_t1': {
        name: 'Hochenergie-Kühlkammer',
        description: 'Reduziert die Hitzeentwicklung der Waffen.',
        requirements: [
            { id: 'item_weapon_chamber_high_energy', count: 1 }
        ],
        effect: (ship) => {
            const reduction = 0.15; // 15% weniger Hitze
            
            if (ship.weaponSystem) {
                ship.weaponSystem.coolingRate = (ship.weaponSystem.coolingRate || 1.0) + reduction;
            }

            return `Waffenkühlung um ${(reduction * 100).toFixed(0)}% verbessert.`;
        }
    },

    // TDD 4.2: Drag Mod
    'mod_drag_t1': {
        name: 'Void-Injektor Antrieb',
        description: 'Verringert den Widerstand und erhöht die Endgeschwindigkeit.',
        requirements: [
            { id: 'item_engine_injector_purple', count: 1 } // Rare Item
        ],
        effect: (ship) => {
            const speedBoost = 20; // +20 Pixel/sek
            
            // Anpassung der Arcade Physics Werte
            ship.speed += speedBoost;
            if (ship.body) {
                ship.body.setMaxSpeed(ship.speed);
            }

            return `Maximalgeschwindigkeit um ${speedBoost} erhöht.`;
        }
    }
};
