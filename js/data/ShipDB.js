// FILE: js/data/ShipDB.js

/**
 * 📘 PROJECT: VOID MERCHANT
 * MODULE: SHIP DATABASE
 * * Stats für Schiffe der verschiedenen Fraktionen.
 * * Referenz: TDD Volume 7.
 */

export const SHIP_DB = {
    // --- ARGON FEDERATION (Balanced) ---
    'arg_s_fighter_elite': {
        name: 'Elite Vanguard',
        class: 'S',
        faction: 'ARG',
        hull: 1200,
        shield: 800,
        speed: 400,
        turnSpeed: 250,
        cargo: 150,
        price: 85000,
        description: 'The backbone of the Argon federation. Balanced and reliable.'
    },
    'arg_s_scout_discoverer': {
        name: 'Discoverer Vanguard',
        class: 'S',
        faction: 'ARG',
        hull: 600,
        shield: 400,
        speed: 650,
        turnSpeed: 320,
        cargo: 50,
        price: 45000,
        description: 'Light scout ship. Excellent for exploration but weak in combat.'
    },
    'arg_s_fighter_nova': {
        name: 'Nova Vanguard',
        class: 'S',
        faction: 'ARG',
        hull: 2200,
        shield: 1500,
        speed: 320,
        turnSpeed: 180,
        cargo: 200,
        price: 180000,
        description: 'Heavy fighter with reinforced plating.'
    },
    'arg_m_trans_mercury': {
        name: 'Mercury Vanguard',
        class: 'M',
        faction: 'ARG',
        hull: 8000,
        shield: 5000,
        speed: 180,
        turnSpeed: 80,
        cargo: 8000,
        price: 450000,
        description: 'Standard medium transporter.'
    },

    // --- XENON HIVE (Enemy AI) ---
    'xen_s_fighter_n': {
        name: 'Xenon N',
        class: 'S',
        faction: 'XEN',
        hull: 300,
        shield: 200,
        speed: 550,
        turnSpeed: 400,
        cargo: 0,
        price: 0, // Not for sale
        description: 'Agile automated drone.'
    },
    'xen_s_fighter_m': {
        name: 'Xenon M',
        class: 'S',
        faction: 'XEN',
        hull: 900,
        shield: 800,
        speed: 450,
        turnSpeed: 300,
        cargo: 0,
        price: 0,
        description: 'Primary combat drone of the terraformers.'
    },
    'xen_m_corvette_p': {
        name: 'Xenon P',
        class: 'M',
        faction: 'XEN',
        hull: 12000,
        shield: 8000,
        speed: 280,
        turnSpeed: 120,
        cargo: 0,
        price: 0,
        description: 'Heavy corvette. Extremely dangerous.'
    },

    // --- TERRAN PROTECTORATE (High Tech) ---
    'ter_s_fighter_kukri': {
        name: 'Kukri',
        class: 'S',
        faction: 'TER',
        hull: 1800,
        shield: 2500,
        speed: 380,
        turnSpeed: 220,
        cargo: 120,
        price: 250000,
        description: 'Advanced Terran fighter with superior shielding.'
    }
};

export function getShipStats(id) {
    return SHIP_DB[id] || SHIP_DB['arg_s_fighter_elite'];
}

