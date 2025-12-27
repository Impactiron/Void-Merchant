/**
 * 📘 PROJECT: VOID MERCHANT
 * MODULE: WEAPON DATABASE
 * * Stats für alle Waffen im Spiel.
 * * UPDATE: Hinzugefügt 'scale' und 'sprite' für visuelle Differenzierung.
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
        sprite: 'spr_proj_laser_red', // Standard Asset
        scale: 0.02,      // Standard Größe
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
        sprite: 'spr_proj_laser_red',
        scale: 1.3,      // 30% Größer als Mk1
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
        sprite: 'spr_proj_laser_red', // Placeholder, später eigenes Asset
        scale: 0.8,      // Kleiner, kompakter Schuss
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
        sprite: 'spr_proj_laser_red',
        scale: 0.6,      // Sehr kleine Projektile
        price: 5500,
        description: 'High rate of fire gatling gun. Good for dogfights.'
    },

    // 4. BEAM (Instant Hit - Player/Argon Variant)
    'wpn_beam_emitter_s': {
        name: 'Beam Emitter Mk1',
        type: 'BEAM',         
        damage: 5,            
        fireRate: 60.0,       
        speed: 0,             
        range: 1000,
        color: 0x00d4ff,      
        sprite: null,         // Beams nutzen kein Projektil-Sprite
        scale: 1.0,
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
        sprite: 'spr_proj_plasma_green', // Neues Asset nutzen
        scale: 2.5,      // Sehr groß!
        price: 15000,
        description: 'Slow moving plasma balls. Devastating against stations and large ships.'
    },

    // --- KHAAK WEAPONS (Enemy Only) ---
    'wpn_kyon_emitter_s': {
        name: 'Kyon Emitter (Alpha)',
        type: 'BEAM',         
        damage: 2,            
        fireRate: 60.0,       
        speed: 0,             
        range: 1500,          
        color: 0xff00ff,      
        sprite: null,
        scale: 1.0,
        price: 0,
        description: 'Alien beam technology.'
    }
};

export function getWeapon(id) {
    return WEAPON_DB[id] || WEAPON_DB['wpn_laser_pulse_s'];
}

