// FILE: js/data/SectorDB.js

/**
 * 📘 PROJECT: VOID MERCHANT
 * VOLUME 11: EXPANDED UNIVERSE (X4 TOPOLOGY)
 * * Datenbank aller Sektoren, Verbindungen (Gates) und statischen Eigenschaften.
 * * Implementiert Kern-Sektoren aller Hauptfraktionen (ARG, TEL, PAR, HOP, TER, SPL, XEN).
 * * Map-Layout basiert auf einem Grid-System für die MapScene.
 */

export const SECTOR_DB = {
    // -------------------------------------------------------------------------
    // --- ARGON FEDERATION (CENTER WEST) ---
    // -------------------------------------------------------------------------
    'sec_argon_prime': {
        id: 'sec_argon_prime',
        name: 'Argon Prime',
        faction: 'ARG',
        securityLevel: 1.0,
        description: 'Das politische und industrielle Herz der Föderation.',
        background: 'bg_stars_01',
        music: 'mus_ambience_deep_space',
        mapPosition: { x: 0, y: 0 },
        resources: { ore: 0.2, silicon: 0.1, ice: 0.0, hydrogen: 0.0 },
        hazards: [],
        enemies: null, // Safe Zone
        gates: [
            { id: 'gate_north', x: 0, y: -3000, targetSector: 'sec_hatikvahs_choice', targetGateId: 'gate_south', name: 'N: Hatikvah' },
            { id: 'gate_west', x: -3000, y: 0, targetSector: 'sec_the_void', targetGateId: 'gate_east', name: 'W: The Void' },
            { id: 'gate_south', x: 0, y: 3000, targetSector: 'sec_second_contact', targetGateId: 'gate_north', name: 'S: Second Contact' }
        ],
        stations: [
            { type: 'spr_station_hub_terran', x: 0, y: 0, name: 'Argon Shipyard' },
            { type: 'spr_station_dock_arm', x: 1500, y: -1000, name: 'Federal Trade Post' },
            { type: 'spr_station_solar_array', x: -2000, y: 1500, name: 'Argon Prime Solar I' }
        ]
    },

    'sec_hatikvahs_choice': {
        id: 'sec_hatikvahs_choice',
        name: "Hatikvah's Choice I",
        faction: 'HAT',
        securityLevel: 0.3,
        description: 'Ein gefährlicher Handelsknotenpunkt. Tor zur Xenon-Bedrohung.',
        background: 'bg_stars_01',
        music: 'mus_combat_low',
        mapPosition: { x: 0, y: -1 },
        resources: { ore: 0.6, silicon: 0.3, ice: 0.8, hydrogen: 0.0 },
        hazards: [],
        enemies: {
            faction: 'XENON',
            density: 0.8,
            types: ['xen_s_fighter_n', 'xen_m_corvette_p']
        },
        gates: [
            { id: 'gate_south', x: 0, y: 3000, targetSector: 'sec_argon_prime', targetGateId: 'gate_north', name: 'S: Argon Prime' },
            { id: 'gate_east', x: 3000, y: 0, targetSector: 'sec_silent_witness', targetGateId: 'gate_west', name: 'E: Silent Witness' },
            { id: 'gate_north', x: 0, y: -3000, targetSector: 'sec_tharkas_cascade', targetGateId: 'gate_south', name: 'N: Tharka (DANGER)' }
        ],
        stations: [
            { type: 'spr_station_hub_terran', x: -1000, y: 500, name: 'Hatikvah Free Port' }
        ]
    },

    'sec_the_void': {
        id: 'sec_the_void',
        name: 'The Void',
        faction: 'ARG',
        securityLevel: 0.5,
        description: 'Asteroidenfeld an der Grenze zum Terraner-Raum. Hohe Strahlung.',
        background: 'bg_stars_01',
        music: 'mus_ambience_void',
        mapPosition: { x: -1, y: 0 },
        resources: { ore: 1.0, silicon: 0.8, ice: 0.0, hydrogen: 0.0 },
        hazards: ['radiation'],
        enemies: { faction: 'XENON', density: 0.3, types: ['xen_s_fighter_n'] },
        gates: [
            { id: 'gate_east', x: 3000, y: 0, targetSector: 'sec_argon_prime', targetGateId: 'gate_west', name: 'E: Argon Prime' },
            { id: 'gate_west', x: -3000, y: 0, targetSector: 'sec_getsu_fune', targetGateId: 'gate_east', name: 'W: Getsu Fune' }
        ],
        stations: [
            { type: 'spr_station_dock_arm', x: 0, y: -2000, name: 'Antigone Memorial Refinery' }
        ]
    },

    'sec_black_hole_sun': {
        id: 'sec_black_hole_sun',
        name: 'Black Hole Sun',
        faction: 'ARG',
        securityLevel: 0.8,
        description: 'Einstige Heimat legendärer Schlachten, heute Rückgrat der Ost-Flanke.',
        background: 'bg_stars_01',
        music: 'mus_ambience_deep_space',
        mapPosition: { x: 1, y: 0 }, // East of Argon Prime (via 2nd Contact logic in X4, but simplified here)
        resources: { ore: 0.4, silicon: 0.4, ice: 0.0, hydrogen: 0.5 },
        hazards: [],
        enemies: { faction: 'XENON', density: 0.1, types: ['xen_s_fighter_n'] },
        gates: [
            { id: 'gate_west', x: -3000, y: 0, targetSector: 'sec_second_contact', targetGateId: 'gate_east', name: 'W: Second Contact' },
            { id: 'gate_east', x: 3000, y: 0, targetSector: 'sec_grand_exchange', targetGateId: 'gate_west', name: 'E: Grand Exchange' }
        ],
        stations: [
            { type: 'spr_station_solar_array', x: 1000, y: 1000, name: 'Solar Power Plant XL' }
        ]
    },

    // -------------------------------------------------------------------------
    // --- ANTIGONE / TERRAN BORDER (FAR WEST) ---
    // -------------------------------------------------------------------------
    'sec_getsu_fune': {
        id: 'sec_getsu_fune',
        name: 'Getsu Fune',
        faction: 'TER',
        securityLevel: 0.9,
        description: 'Grenzsektor des Terranischen Protektorats. Hochsicherheitszone.',
        background: 'bg_stars_01',
        music: 'mus_ambience_deep_space',
        mapPosition: { x: -2, y: 0 },
        resources: { ore: 0.3, silicon: 0.3, ice: 1.0, hydrogen: 0.0 },
        hazards: [],
        enemies: { faction: 'XENON', density: 0.5, types: ['xen_s_fighter_n', 'xen_m_corvette_p'] }, // Savage Spur influx
        gates: [
            { id: 'gate_east', x: 3000, y: 0, targetSector: 'sec_the_void', targetGateId: 'gate_west', name: 'E: The Void' },
            { id: 'gate_north', x: 0, y: -3000, targetSector: 'sec_asteroid_belt', targetGateId: 'gate_south', name: 'N: Asteroid Belt' }
        ],
        stations: [
            { type: 'spr_station_hub_terran', x: -1500, y: 0, name: 'Terran Defense Grid' }
        ]
    },

    'sec_asteroid_belt': {
        id: 'sec_asteroid_belt',
        name: 'Asteroid Belt',
        faction: 'TER',
        securityLevel: 1.0,
        description: 'Sol-System Peripherie. Massiver Bergbau und Patrouillen.',
        background: 'bg_stars_01',
        music: 'mus_ambience_deep_space',
        mapPosition: { x: -2, y: -1 },
        resources: { ore: 1.5, silicon: 1.0, ice: 1.0, hydrogen: 0.2 },
        hazards: [],
        enemies: null,
        gates: [
            { id: 'gate_south', x: 0, y: 3000, targetSector: 'sec_getsu_fune', targetGateId: 'gate_north', name: 'S: Getsu Fune' }
            // Sol Gate blocked for now
        ],
        stations: [
            { type: 'spr_station_dock_arm', x: 2000, y: -1000, name: 'Orbital Logistics Dock' }
        ]
    },

    // -------------------------------------------------------------------------
    // --- TELADI COMPANY (EAST) ---
    // -------------------------------------------------------------------------
    'sec_grand_exchange': {
        id: 'sec_grand_exchange',
        name: 'Grand Exchange I',
        faction: 'TEL',
        securityLevel: 0.6,
        description: 'Der zentrale Handelsknotenpunkt des bekannten Universums. Profituuu!',
        background: 'bg_stars_01',
        music: 'mus_ambience_deep_space',
        mapPosition: { x: 2, y: 0 },
        resources: { ore: 0.5, silicon: 0.5, ice: 0.5, hydrogen: 0.5 },
        hazards: [],
        enemies: { faction: 'XENON', density: 0.2, types: ['xen_s_fighter_n'] },
        gates: [
            { id: 'gate_west', x: -3000, y: 0, targetSector: 'sec_black_hole_sun', targetGateId: 'gate_east', name: 'W: Black Hole Sun' },
            { id: 'gate_north', x: 0, y: -3000, targetSector: 'sec_ianamus_zura', targetGateId: 'gate_south', name: 'N: Ianamus Zura' },
            { id: 'gate_south', x: 0, y: 3000, targetSector: 'sec_trinity_sanctum', targetGateId: 'gate_north', name: 'S: Trinity Sanctum' }
        ],
        stations: [
            { type: 'spr_station_hub_terran', x: 0, y: 0, name: 'Teladi Trade Station' },
            { type: 'spr_station_dock_arm', x: 2000, y: 2000, name: 'Spaceweed Factory' } // Flavor text
        ]
    },

    'sec_ianamus_zura': {
        id: 'sec_ianamus_zura',
        name: 'Ianamus Zura IV',
        faction: 'TEL',
        securityLevel: 0.5,
        description: 'Frontsektor gegen die Xenon Matrix. Hier wird hart gekämpft.',
        background: 'bg_stars_01',
        music: 'mus_combat_low',
        mapPosition: { x: 2, y: -1 },
        resources: { ore: 0.8, silicon: 0.0, ice: 0.0, hydrogen: 0.0 },
        hazards: [],
        enemies: { faction: 'XENON', density: 0.6, types: ['xen_s_fighter_m', 'xen_m_corvette_p'] },
        gates: [
            { id: 'gate_south', x: 0, y: 3000, targetSector: 'sec_grand_exchange', targetGateId: 'gate_north', name: 'S: Grand Exchange' },
            { id: 'gate_east', x: 3000, y: 0, targetSector: 'sec_matrix_451', targetGateId: 'gate_west', name: 'E: Matrix #451' }
        ],
        stations: [
            { type: 'spr_station_dock_arm', x: -1000, y: 0, name: 'Teladi Equipment Dock' }
        ]
    },

    'sec_silent_witness': {
        id: 'sec_silent_witness',
        name: 'Silent Witness',
        faction: 'ARG', // Technically neutral/mixed
        securityLevel: 0.4,
        description: 'Ein gesetzloses Gebiet. Perfekt für Schmuggel.',
        background: 'bg_stars_01',
        music: 'mus_ambience_void',
        mapPosition: { x: 1, y: -1 },
        resources: { ore: 0.0, silicon: 0.0, ice: 0.0, hydrogen: 0.0 }, // Empty space
        hazards: [],
        enemies: { faction: 'PIRATE', density: 0.5, types: ['arg_s_scout_discoverer'] }, // Pirate placeholders
        gates: [
            { id: 'gate_west', x: -3000, y: 0, targetSector: 'sec_hatikvahs_choice', targetGateId: 'gate_east', name: 'W: Hatikvah' }
        ],
        stations: [
            { type: 'spr_station_dock_arm', x: 0, y: 0, name: 'Cove Pirate Base' }
        ]
    },

    // -------------------------------------------------------------------------
    // --- PARANID & HOP (SOUTH) ---
    // -------------------------------------------------------------------------
    'sec_second_contact': {
        id: 'sec_second_contact',
        name: 'Second Contact II',
        faction: 'ARG', // Contested
        securityLevel: 0.4,
        description: 'Hauptfrontlinie im Krieg zwischen Argonen und dem Heiligen Orden.',
        background: 'bg_stars_01',
        music: 'mus_ambience_tension',
        mapPosition: { x: 0, y: 1 },
        resources: { ore: 0.5, silicon: 0.5, ice: 0.0, hydrogen: 0.6 },
        hazards: [],
        enemies: { faction: 'HOP', density: 0.4, types: ['par_s_fighter_perseus'] },
        gates: [
            { id: 'gate_north', x: 0, y: -3000, targetSector: 'sec_argon_prime', targetGateId: 'gate_south', name: 'N: Argon Prime' },
            { id: 'gate_east', x: 3000, y: 0, targetSector: 'sec_black_hole_sun', targetGateId: 'gate_west', name: 'E: Black Hole Sun' },
            { id: 'gate_south', x: 0, y: 3000, targetSector: 'sec_holy_vision', targetGateId: 'gate_north', name: 'S: Holy Vision' }
        ],
        stations: [
            { type: 'spr_station_hub_terran', x: -2000, y: 1000, name: 'Antigone Defense Station' }
        ]
    },

    'sec_holy_vision': {
        id: 'sec_holy_vision',
        name: 'Holy Vision',
        faction: 'HOP', // Holy Order of the Pontifex
        securityLevel: 0.9,
        description: 'Kernsektor des Heiligen Ordens. Fremde sind hier nicht willkommen.',
        background: 'bg_stars_01',
        music: 'mus_ambience_deep_space',
        mapPosition: { x: 0, y: 2 },
        resources: { ore: 0.8, silicon: 0.8, ice: 0.0, hydrogen: 0.0 },
        hazards: [],
        enemies: { faction: 'PAR', density: 0.3, types: ['par_s_fighter_perseus'] }, // Enemy to Godrealm
        gates: [
            { id: 'gate_north', x: 0, y: -3000, targetSector: 'sec_second_contact', targetGateId: 'gate_south', name: 'N: Second Contact' }
        ],
        stations: [
            { type: 'spr_station_hub_terran', x: 0, y: 0, name: 'Pontifex Shrine Shipyard' },
            { type: 'spr_station_solar_array', x: 2000, y: -2000, name: 'Holy Sunlight Fab' }
        ]
    },

    'sec_trinity_sanctum': {
        id: 'sec_trinity_sanctum',
        name: 'Trinity Sanctum III',
        faction: 'PAR', // Godrealm of the Paranid
        securityLevel: 0.9,
        description: 'Ein Ort der Ruhe und Meditation... und schwerer Kreuzer.',
        background: 'bg_stars_01',
        music: 'mus_ambience_deep_space',
        mapPosition: { x: 2, y: 1 },
        resources: { ore: 0.3, silicon: 0.3, ice: 0.3, hydrogen: 0.3 },
        hazards: [],
        enemies: null,
        gates: [
            { id: 'gate_north', x: 0, y: -3000, targetSector: 'sec_grand_exchange', targetGateId: 'gate_south', name: 'N: Grand Exchange' }
        ],
        stations: [
            { type: 'spr_station_hub_terran', x: 1000, y: 1000, name: 'Paranid Wharf' }
        ]
    },

    // -------------------------------------------------------------------------
    // --- XENON & ENEMY SPACE (DANGER) ---
    // -------------------------------------------------------------------------
    'sec_tharkas_cascade': {
        id: 'sec_tharkas_cascade',
        name: "Tharka's Cascade XV",
        faction: 'XEN',
        securityLevel: 0.0,
        description: 'WARNUNG: Xenon Sektor. Extreme Gefahr. Sofort umkehren.',
        background: 'bg_stars_01',
        music: 'mus_combat_low',
        mapPosition: { x: 0, y: -2 },
        resources: { ore: 2.0, silicon: 2.0, ice: 2.0, hydrogen: 2.0 }, // High risk, high reward
        hazards: ['radiation', 'mines'],
        enemies: { faction: 'XENON', density: 2.0, types: ['xen_s_fighter_m', 'xen_m_corvette_p'] }, // Swarm
        gates: [
            { id: 'gate_south', x: 0, y: 3000, targetSector: 'sec_hatikvahs_choice', targetGateId: 'gate_north', name: 'S: Hatikvah' },
            { id: 'gate_north', x: 0, y: -3000, targetSector: 'sec_zyarths_dominion', targetGateId: 'gate_south', name: 'N: Zyarth' }
        ],
        stations: [
            // Xenon Stations (Placeholder: Using standard assets but treating as enemy)
            { type: 'spr_station_hub_terran', x: 0, y: 0, name: 'Xenon Solar Power Plant' }
        ]
    },

    'sec_matrix_451': {
        id: 'sec_matrix_451',
        name: 'Matrix #451',
        faction: 'XEN',
        securityLevel: 0.0,
        description: 'WARNUNG: Xenon Kernsektor.',
        background: 'bg_stars_01',
        music: 'mus_combat_low',
        mapPosition: { x: 3, y: -1 },
        resources: { ore: 0.0, silicon: 0.0, ice: 0.0, hydrogen: 0.0 },
        hazards: [],
        enemies: { faction: 'XENON', density: 1.5, types: ['xen_s_fighter_m'] },
        gates: [
            { id: 'gate_west', x: -3000, y: 0, targetSector: 'sec_ianamus_zura', targetGateId: 'gate_east', name: 'W: Ianamus Zura' }
        ],
        stations: []
    },

    // -------------------------------------------------------------------------
    // --- SPLIT (NORTH) ---
    // -------------------------------------------------------------------------
    'sec_zyarths_dominion': {
        id: 'sec_zyarths_dominion',
        name: "Zyarth's Dominion I",
        faction: 'SPL', // Split Patriarchy
        securityLevel: 0.5,
        description: 'Das Patriarchat kämpft hier ums Überleben gegen die Xenon.',
        background: 'bg_stars_01',
        music: 'mus_ambience_tension',
        mapPosition: { x: 0, y: -3 },
        resources: { ore: 1.2, silicon: 0.2, ice: 0.0, hydrogen: 0.0 },
        hazards: [],
        enemies: { faction: 'XENON', density: 0.7, types: ['xen_s_fighter_m'] },
        gates: [
            { id: 'gate_south', x: 0, y: 3000, targetSector: 'sec_tharkas_cascade', targetGateId: 'gate_north', name: 'S: Tharka (Blockade)' }
        ],
        stations: [
            { type: 'spr_station_hub_terran', x: 0, y: -1000, name: 'Zyarth Defense Platform' }
        ]
    }
};

/**
 * Hilfsfunktion zum Abrufen eines Sektors (mit Error Handling).
 */
export function getSector(id) {
    if (SECTOR_DB[id]) {
        return SECTOR_DB[id];
    }
    console.warn(`SectorDB: Unknown Sector ID '${id}'`);
    return SECTOR_DB['sec_argon_prime']; // Fallback
}


