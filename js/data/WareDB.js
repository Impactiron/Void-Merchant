// FILE: js/data/WareDB.js

/**
 * 📘 PROJECT: VOID MERCHANT
 * MODULE: WARE DATABASE
 * * Definition aller handelbaren Güter basierend auf TDD Vol 5 & 8.
 * * Kategorien: Energy, Bio, Refined, Tech, Ship Parts.
 */

export const WARE_DB = {
    // --- TIER 0: ENERGY & RAW ---
    'energy_cells': {
        name: 'Energy Cells',
        tier: 0,
        volume: 1,
        transportClass: 'S',
        basePrice: 16,
        description: 'Universal energy storage units. Required for almost all production.'
    },
    'ore_iron': {
        name: 'Iron Ore',
        tier: 0,
        volume: 10,
        transportClass: 'M',
        basePrice: 45,
        description: 'Raw iron mined from asteroids.'
    },
    'ore_ice': {
        name: 'Ice',
        tier: 0,
        volume: 6,
        transportClass: 'M',
        basePrice: 30,
        description: 'Water ice. Essential for food production and cooling.'
    },
    'ore_silicon': {
        name: 'Silicon',
        tier: 0,
        volume: 12,
        transportClass: 'M',
        basePrice: 110,
        description: 'Raw silicon chunks. Base material for electronics.'
    },

    // --- TIER 1: REFINED ---
    'refined_metal': {
        name: 'Refined Metals',
        tier: 1,
        volume: 14,
        transportClass: 'M',
        basePrice: 140,
        description: 'Processed iron plates used for construction.'
    },
    'silicon_wafers': {
        name: 'Silicon Wafers',
        tier: 1,
        volume: 18,
        transportClass: 'S',
        basePrice: 280,
        description: 'Purified silicon slices ready for circuitry.'
    },
    'water': {
        name: 'Water',
        tier: 1,
        volume: 6,
        transportClass: 'S',
        basePrice: 55,
        description: 'Purified water for biological and industrial use.'
    },
    'graphene': {
        name: 'Graphene',
        tier: 1,
        volume: 20,
        transportClass: 'S',
        basePrice: 180,
        description: 'Advanced carbon structure. Strong and conductive.'
    },

    // --- TIER 2: COMPONENTS ---
    'hull_parts': {
        name: 'Hull Parts',
        tier: 2,
        volume: 35,
        transportClass: 'L',
        basePrice: 450,
        description: 'Prefabricated hull sections for ships and stations.'
    },
    'microchips': {
        name: 'Microchips',
        tier: 2,
        volume: 2,
        transportClass: 'S',
        basePrice: 950,
        description: 'Basic processing units for avionics and machinery.'
    },
    'scanning_arrays': {
        name: 'Scanning Arrays',
        tier: 2,
        volume: 5,
        transportClass: 'S',
        basePrice: 1200,
        description: 'Sensor components for radar and targeting systems.'
    },

    // --- TIER 3: HIGH-TECH ---
    'advanced_electronics': {
        name: 'Adv. Electronics',
        tier: 3,
        volume: 8,
        transportClass: 'S',
        basePrice: 3500,
        description: 'High-end computing clusters for AI and Jump Drives.'
    },
    'weapon_components': {
        name: 'Weapon Components',
        tier: 3,
        volume: 25,
        transportClass: 'M',
        basePrice: 2200,
        description: 'Focal lenses, barrels and triggers.'
    },
    'shield_components': {
        name: 'Shield Components',
        tier: 3,
        volume: 25,
        transportClass: 'M',
        basePrice: 2400,
        description: 'Emitter coils and capacitors for shielding.'
    },

    // --- ILLEGAL / SPECIAL ---
    'spacefly_eggs': {
        name: 'Spacefly Eggs',
        tier: 9,
        volume: 1,
        transportClass: 'S',
        basePrice: 25000,
        description: 'Illegal biological goods. Highly sought after by collectors.'
    },
    'security_decryption': {
        name: 'Decryption System',
        tier: 9,
        volume: 1,
        transportClass: 'S',
        basePrice: 50000,
        description: 'Banned software used for hacking station terminals.'
    }
};

/**
 * Hilfsfunktion um Waren-Objekt zu holen (mit Fallback)
 */
export function getWare(id) {
    return WARE_DB[id] || { name: 'Unknown Ware', basePrice: 0 };
}

