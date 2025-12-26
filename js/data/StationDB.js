// FILE: js/data/StationDB.js

/**
 * 📘 PROJECT: VOID MERCHANT
 * MODULE: STATION DATABASE (COMPLETE COLLECTION VOL 1-11)
 * * Enthält alle Stationsmodule, Baupläne, Produktionszyklen und Socket-Definitionen.
 * Abdeckt: Terran, Argon, Teladi, Paranid, Split, Boron, Xenon, Kha'ak.
 */

// --- SOCKET TEMPLATES (Vol 10) ---
// Definiert Anschlüsse für den Station Builder.
// Winkel: 0 = Rechts, 90 = Unten, 180 = Links, 270 = Oben
const SOCKETS = {
    NONE: [],
    SINGLE_BOTTOM: [
        { id: 0, type: "CONN_STD", x: 0, y: 128, angle: 90 }
    ],
    LINE_H: [
        { id: 0, type: "CONN_STD", x: -128, y: 0, angle: 180 },
        { id: 1, type: "CONN_STD", x: 128, y: 0, angle: 0 }
    ],
    CROSS: [
        { id: 0, type: "CONN_STD", x: -128, y: 0, angle: 180 },
        { id: 1, type: "CONN_STD", x: 128, y: 0, angle: 0 },
        { id: 2, type: "CONN_STD", x: 0, y: -128, angle: 270 },
        { id: 3, type: "CONN_STD", x: 0, y: 128, angle: 90 }
    ],
    DOCK_HUB: [
        { id: 0, type: "CONN_HVY", x: 0, y: -200, angle: 270 }, // Heavy Connection to station
        { id: 1, type: "DOCK_PATH", x: 0, y: 300, angle: 90 }    // Flight Path
    ]
};

export const STATION_DB = {

    // ========================================================================
    // 1. PRODUCTION MODULES (ENERGY & RAW PROCESSING) - TIER 0
    // ========================================================================

    'mod_prod_energy_cells': {
        name: "Solar Power Plant Mk1",
        type: "PRODUCTION",
        race: "COMMON", // Used by everyone
        description: "Wandelt Sonnenlicht in Energiezellen um. Basis der Wirtschaft.",
        price: 2500000, // Blueprint Cost
        volume: 1, // Size Multiplier
        sockets: SOCKETS.CROSS,
        production: {
            cycleTime: 60, // Seconds
            inputs: [], // Sunlight is free
            output: { id: "ware_energy_cells", amount: 400 }
        },
        buildCost: [
            { id: "ware_hull_parts", amount: 200 },
            { id: "ware_energy_cells", amount: 1000 }
        ]
    },

    'mod_prod_water': {
        name: "Water Purification Unit",
        type: "PRODUCTION",
        race: "BORON",
        description: "Filtert Wasser aus Eis-Asteroiden.",
        price: 1500000,
        volume: 1,
        sockets: SOCKETS.LINE_H,
        production: {
            cycleTime: 60,
            inputs: [
                { id: "ware_ice", amount: 80 },
                { id: "ware_energy_cells", amount: 40 }
            ],
            output: { id: "ware_water", amount: 100 }
        },
        buildCost: [
            { id: "ware_claytronics", amount: 50 },
            { id: "ware_energy_cells", amount: 500 }
        ]
    },

    // ========================================================================
    // 2. PRODUCTION MODULES (REFINED GOODS) - TIER 1
    // ========================================================================

    'mod_prod_refined_metals': {
        name: "Ore Refinery Mk1",
        type: "PRODUCTION",
        race: "ARGON",
        description: "Verarbeitet rohes Erz zu nutzbaren Metallplatten.",
        price: 4000000,
        volume: 2,
        sockets: SOCKETS.LINE_H,
        production: {
            cycleTime: 120,
            inputs: [
                { id: "ware_ore", amount: 40 },
                { id: "ware_energy_cells", amount: 120 }
            ],
            output: { id: "ware_refined_metals", amount: 20 }
        },
        buildCost: [
            { id: "ware_hull_parts", amount: 400 },
            { id: "ware_claytronics", amount: 100 }
        ]
    },

    'mod_prod_silicon_wafers': {
        name: "Silicon Refinery",
        type: "PRODUCTION",
        race: "ARGON",
        description: "Schmilzt Siliziumbrocken zu Wafern für Chips.",
        price: 3800000,
        volume: 2,
        sockets: SOCKETS.LINE_H,
        production: {
            cycleTime: 180,
            inputs: [
                { id: "ware_silicon", amount: 60 },
                { id: "ware_energy_cells", amount: 100 }
            ],
            output: { id: "ware_silicon_wafers", amount: 30 }
        },
        buildCost: [
            { id: "ware_hull_parts", amount: 350 },
            { id: "ware_claytronics", amount: 80 }
        ]
    },

    'mod_prod_graphene': {
        name: "Graphene Lab",
        type: "PRODUCTION",
        race: "TELADI",
        description: "Verarbeitet Methan-Gas zu Graphen.",
        price: 4200000,
        volume: 2,
        sockets: SOCKETS.CROSS,
        production: {
            cycleTime: 150,
            inputs: [
                { id: "ware_methane", amount: 80 },
                { id: "ware_energy_cells", amount: 80 }
            ],
            output: { id: "ware_graphene", amount: 40 }
        },
        buildCost: [
            { id: "ware_hull_parts", amount: 400 },
            { id: "ware_energy_cells", amount: 2000 }
        ]
    },

    // ========================================================================
    // 3. PRODUCTION MODULES (COMPONENTS) - TIER 2
    // ========================================================================

    'mod_prod_hull_parts': {
        name: "Hull Part Factory",
        type: "PRODUCTION",
        race: "ARGON",
        description: "Standardisierte Hüllenplatten für Schiffe und Stationen.",
        price: 8500000,
        volume: 3,
        sockets: SOCKETS.CROSS,
        production: {
            cycleTime: 900, // 15 Min
            inputs: [
                { id: "ware_refined_metals", amount: 280 },
                { id: "ware_graphene", amount: 60 },
                { id: "ware_energy_cells", amount: 200 }
            ],
            output: { id: "ware_hull_parts", amount: 220 }
        },
        buildCost: [
            { id: "ware_hull_parts", amount: 800 },
            { id: "ware_claytronics", amount: 200 }
        ]
    },

    'mod_prod_microchips': {
        name: "Microchip Fab",
        type: "PRODUCTION",
        race: "PARANID",
        description: "Basis-Elektronik für Steuerungen.",
        price: 9000000,
        volume: 2,
        sockets: SOCKETS.VERTICAL,
        production: {
            cycleTime: 600,
            inputs: [
                { id: "ware_silicon_wafers", amount: 200 },
                { id: "ware_energy_cells", amount: 100 }
            ],
            output: { id: "ware_microchips", amount: 80 }
        },
        buildCost: [
            { id: "ware_hull_parts", amount: 600 },
            { id: "ware_claytronics", amount: 400 }
        ]
    },

    // ========================================================================
    // 4. PRODUCTION MODULES (HIGH-TECH) - TIER 3
    // ========================================================================

    'mod_prod_advanced_electronics': {
        name: "Adv. Electronics Lab",
        type: "PRODUCTION",
        race: "TERRAN",
        description: "Militärische Grade-Chips.",
        price: 15000000,
        volume: 3,
        sockets: SOCKETS.CROSS,
        production: {
            cycleTime: 1200,
            inputs: [
                { id: "ware_microchips", amount: 60 },
                { id: "ware_quantum_tubes", amount: 40 },
                { id: "ware_energy_cells", amount: 400 }
            ],
            output: { id: "ware_advanced_electronics", amount: 30 }
        },
        buildCost: [
            { id: "ware_hull_parts", amount: 1500 },
            { id: "ware_claytronics", amount: 800 }
        ]
    },

    'mod_prod_claytronics': {
        name: "Claytronics Factory",
        type: "PRODUCTION",
        race: "ARGON",
        description: "Programmierbare Materie für Stationsbau.",
        price: 22000000,
        volume: 4,
        sockets: SOCKETS.CROSS,
        production: {
            cycleTime: 1800, // 30 Min
            inputs: [
                { id: "ware_microchips", amount: 120 },
                { id: "ware_quantum_tubes", amount: 80 },
                { id: "ware_antimatter_cells", amount: 40 },
                { id: "ware_energy_cells", amount: 600 }
            ],
            output: { id: "ware_claytronics", amount: 60 }
        },
        buildCost: [
            { id: "ware_hull_parts", amount: 2500 },
            { id: "ware_claytronics", amount: 1000 }
        ]
    },

    // ========================================================================
    // 5. TERRAN ECONOMY (SIMPLIFIED CHAIN)
    // ========================================================================

    'mod_prod_ter_computronic_substrate': {
        name: "Computronic Substrate Plant",
        type: "PRODUCTION",
        race: "TERRAN",
        description: "Terranische Basis-Ressource (High Tech).",
        price: 18000000,
        volume: 4,
        sockets: SOCKETS.CROSS,
        production: {
            cycleTime: 600,
            inputs: [
                { id: "ware_silicon", amount: 2000 }, // Huge resource sink!
                { id: "ware_ore", amount: 2000 },
                { id: "ware_energy_cells", amount: 2000 }
            ],
            output: { id: "ware_ter_computronic", amount: 200 }
        },
        buildCost: [
            { id: "ware_ter_computronic", amount: 200 },
            { id: "ware_ter_microlattice", amount: 100 },
            { id: "ware_ter_carbide", amount: 50 }
        ]
    },

    // ========================================================================
    // 6. DOCKING MODULES
    // ========================================================================

    'mod_dock_s_m_basic': {
        name: "Standard Dock Area (1M6S)",
        type: "DOCK",
        race: "COMMON",
        description: "Erlaubt das Andocken von 1 M-Klasse und 6 S-Klasse Schiffen.",
        price: 500000,
        volume: 2,
        sockets: SOCKETS.DOCK_HUB,
        buildCost: [
            { id: "ware_hull_parts", amount: 100 },
            { id: "ware_energy_cells", amount: 200 }
        ]
    },

    'mod_dock_l_pier': {
        name: "L-Class Pier (1-Dock)",
        type: "DOCK",
        race: "COMMON",
        description: "Ein langer Pier für Zerstörer und Frachter.",
        price: 1200000,
        volume: 5,
        sockets: SOCKETS.SINGLE_BOTTOM,
        buildCost: [
            { id: "ware_hull_parts", amount: 500 },
            { id: "ware_claytronics", amount: 50 }
        ]
    },

    'mod_dock_xl_fabrication': {
        name: "XL Shipyard Bay",
        type: "DOCK",
        race: "COMMON",
        description: "Massive Werft für Trägerschiffe. Beinhaltet Bau-Drohnen.",
        price: 150000000,
        volume: 20,
        sockets: SOCKETS.CROSS,
        buildCost: [
            { id: "ware_hull_parts", amount: 50000 },
            { id: "ware_claytronics", amount: 10000 }
        ]
    },

    // ========================================================================
    // 7. STORAGE MODULES
    // ========================================================================

    'mod_store_container_s': {
        name: "Container Storage S",
        type: "STORAGE",
        race: "COMMON",
        description: "Lagert Stückgut (Waffen, High-Tech, Nahrung). Cap: 25k",
        price: 250000,
        volume: 1,
        sockets: SOCKETS.LINE_H,
        storage: { type: "CONTAINER", capacity: 25000 },
        buildCost: [{ id: "ware_hull_parts", amount: 50 }]
    },

    'mod_store_solid_m': {
        name: "Solid Storage M",
        type: "STORAGE",
        race: "COMMON",
        description: "Lagert Erze und Silizium. Cap: 100k",
        price: 800000,
        volume: 2,
        sockets: SOCKETS.CROSS,
        storage: { type: "SOLID", capacity: 100000 },
        buildCost: [{ id: "ware_hull_parts", amount: 200 }]
    },

    'mod_store_liquid_l': {
        name: "Liquid Storage L",
        type: "STORAGE",
        race: "COMMON",
        description: "Massiver Tank für Gas und Wasser. Cap: 1M",
        price: 2500000,
        volume: 4,
        sockets: SOCKETS.CROSS,
        storage: { type: "LIQUID", capacity: 1000000 },
        buildCost: [{ id: "ware_hull_parts", amount: 1000 }]
    },

    // ========================================================================
    // 8. SPECIAL & SCRAP (VOL 8)
    // ========================================================================

    'mod_prod_scrap_processor': {
        name: "Scrap Recycler",
        type: "PRODUCTION",
        race: "TELADI", // Avarice DLC Logic
        description: "Schmilzt Schiffswracks ein.",
        price: 12000000,
        volume: 5,
        sockets: SOCKETS.SINGLE_BOTTOM,
        production: {
            cycleTime: 60,
            inputs: [
                { id: "ware_raw_scrap", amount: 1 },
                { id: "ware_energy_cells", amount: 1000 } // High Energy Cost!
            ],
            output: { id: "ware_scrap_metal", amount: 100 }
        },
        buildCost: [
            { id: "ware_hull_parts", amount: 2000 },
            { id: "ware_claytronics", amount: 500 }
        ]
    }
};