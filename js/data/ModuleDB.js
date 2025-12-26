// FILE: js/data/ModuleDB.js

/**
 * 📘 PROJECT: VOID MERCHANT
 * MODULE: MODULE DATABASE
 * * Definiert Stations-Module und ihre Sockets (Anschlüsse) für den Builder.
 * * TDD Vol 10: 1.1 The "Socket" Data Structure
 */

export const MODULE_DB = {
    // --- PRODUCTION ---
    'mod_prod_energy_cells': {
        id: 'mod_prod_energy_cells',
        name: 'Solar Array Mk1',
        type: 'PRODUCTION',
        price: 25000,
        texture: 'spr_station_solar_array', // Fallback to station sprite
        size: { w: 128, h: 128 },
        // Sockets: Wo können andere Module andocken?
        // x/y relativ zur Mitte (0,0)
        sockets: [
            { id: 0, x: -64, y: 0, angle: 180 }, // Links
            { id: 1, x: 64, y: 0, angle: 0 }     // Rechts
        ]
    },
    
    // --- DOCKS ---
    'mod_dock_basic': {
        id: 'mod_dock_basic',
        name: 'Basic Dock (1M6S)',
        type: 'DOCK',
        price: 50000,
        texture: 'spr_station_hub_terran',
        size: { w: 128, h: 128 },
        sockets: [
            { id: 0, x: 0, y: -64, angle: 270 }, // Oben
            { id: 1, x: 0, y: 64, angle: 90 }    // Unten
        ]
    },

    // --- STRUCTURAL ---
    'mod_connector_cross': {
        id: 'mod_connector_cross',
        name: 'Cross Connector',
        type: 'STRUCTURE',
        price: 5000,
        texture: 'spr_loot_container', // Placeholder
        size: { w: 64, h: 64 },
        sockets: [
            { id: 0, x: 0, y: -32, angle: 270 },
            { id: 1, x: 0, y: 32, angle: 90 },
            { id: 2, x: -32, y: 0, angle: 180 },
            { id: 3, x: 32, y: 0, angle: 0 }
        ]
    }
};

export const getModule = (id) => MODULE_DB[id];


