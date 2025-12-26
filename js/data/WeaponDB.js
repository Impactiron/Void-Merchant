/**
 * 📘 PROJECT: VOID MERCHANT
 * MODULE: WEAPON DATABASE
 * * Stats für alle Waffen im Spiel.
 * * Referenz: TDD Volume 7.
 */

export const WEAPON_DB = {
    // --- S-CLASS WEAPONS ---
    
    // 1. ENERGY (Standard)
    'wpn_laser_pulse_s': {
        name: 'Pulse Laser Mk1',
        type: 'ENERGY',
        damage: 45,
        fireRate: 6.0,
        speed: 1800,
        range: 1200,
        color: 0xff0000, // Red
        price: 2500,
        description: 'Standard fighter weapon. Reliable against shields.'
    },
    'wpn_laser_pulse_m': {
        name: 'Pulse Laser Mk2',
        type: 'ENERGY',
        damage: 85,
        fireRate: 5.0,
        speed: 1800,
        range: 1400,
        color: 0xff3333,
        price: 8500,
        description: 'Upgraded pulse laser with higher damage output.'
    },

    // 2. KINETIC (Hull Shredder)
    'wpn_kinetic_mass_s': {
        name: 'Mass Driver Mk1',
        type: 'KINETIC',
        damage: 120,
        fireRate: 1.5,
        speed: 1200,
        range: 1500,
        color: 0xffff00, // Yellow
        price: 4500,
        description: 'Physical rounds that shred hull armor. Requires leading.'
    },

    // 3. RAPID FIRE (Machine Gun)
    'wpn_bolt_repeater_s': {
        name: 'Bolt Repeater Mk1',
        type: 'KINETIC',
        damage: 18,
        fireRate: 12.0,
        speed: 1600,
        range: 1000,
        color: 0xffaa00, // Orange
        price: 5500,
        description: 'High rate of fire gatling gun. Good for dogfights.'
    },

    // 4. BEAM (Instant Hit - Player/Argon Variant)
    'wpn_beam_emitter_s': {
        name: 'Beam Emitter Mk1',
        type: 'BEAM',         // CHANGED TO BEAM
        damage: 5,            // Low damage PER TICK/UPDATE
        fireRate: 60.0,       // Fires every frame theoretically
        speed: 0,             // Instant
        range: 1000,
        color: 0x00d4ff,      // Argon Blue
        price: 12000,
        description: 'Pinpoint accuracy beam laser. Perfect against fast scouts.'
    },

    // 5. PLASMA (Capital Killer)
    'wpn_plasma_cannon_m': {
        name: 'Plasma Cannon Mk1',
        type: 'EXPLOSIVE',
        damage: 650,
        fireRate: 0.8,
        speed: 500, // Very Slow
        range: 2500,
        color: 0x00ff00, // Green
        price: 15000,
        description: 'Slow moving plasma balls. Devastating against stations and large ships.'
    },

    // --- KHAAK WEAPONS (Enemy Only) ---
    'wpn_kyon_emitter_s': {
        name: 'Kyon Emitter (Alpha)',
        type: 'BEAM',         // CRITICAL: Type set to BEAM for logic switch
        damage: 2,            // Very low damage but continuous hit
        fireRate: 60.0,       
        speed: 0,             // Instant
        range: 1500,          // High range
        color: 0xff00ff,      // Purple
        price: 0,
        description: 'Alien beam technology.'
    }
};

export function getWeapon(id) {
    return WEAPON_DB[id] || WEAPON_DB['wpn_laser_pulse_s'];
}


