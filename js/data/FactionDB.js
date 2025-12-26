// FILE: js/data/FactionDB.js

/**
 * 📘 PROJECT: VOID MERCHANT
 * MODULE: FACTION DATABASE
 * * Statische Definitionen aller Fraktionen und ihrer Standard-Beziehungen.
 * * Referenz: Volume 9 (Politics).
 * * Relations-Skala: 30 (Ally), 10 (Friend), 0 (Neutral), -10 (Unfriendly), -30 (Enemy/War).
 */

export const FACTION_DB = {
    'PLAYER': {
        name: 'Player',
        color: 0x00ff00, // Grün
        description: 'Independent Pilot',
        initialRelations: {
            'ARG': 0, 'ANT': 0, 'TEL': 0, 'HOP': 0, 'PAR': 0,
            'TER': 0, 'HAT': 0, 'SPL': 0, 'PIR': -10,
            'XEN': -30, 'KHK': -30
        }
    },
    'ARG': {
        name: 'Argon Federation',
        color: 0x00d4ff, // Blau
        description: 'The primary human government in the network.',
        initialRelations: {
            'ANT': 30, 'HAT': 10, 'TEL': 0, 'PAR': 0, 'SPL': -10,
            'TER': -10, 'HOP': -20, 'XEN': -30, 'KHK': -30, 'PIR': -10
        }
    },
    'ANT': {
        name: 'Antigone Republic',
        color: 0x33aaff, // Helles Blau
        description: 'Allied state to the Argon Federation.',
        initialRelations: {
            'ARG': 30, 'HAT': 10, 'TEL': 0, 'HOP': -20,
            'TER': -10, 'XEN': -30, 'KHK': -30, 'PIR': -10
        }
    },
    'TEL': {
        name: 'Teladi Company',
        color: 0xeebb00, // Gold/Gelb
        description: 'Profit-oriented reptile trade guild.',
        initialRelations: {
            'ARG': 0, 'ANT': 0, 'PAR': 0, 'HOP': 0, 'SPL': 0, 'TER': 0,
            'HAT': 10, 'PIR': 0, // Teladi handeln sogar mit Piraten
            'XEN': -30, 'KHK': -30
        }
    },
    'HOP': {
        name: 'Holy Order of the Pontifex',
        color: 0xff6600, // Orange
        description: 'Religious fanatics at war with almost everyone.',
        initialRelations: {
            'PAR': -30, 'ARG': -20, 'ANT': -20, 'TEL': 0,
            'TER': -10, 'XEN': -30, 'KHK': -30
        }
    },
    'PAR': {
        name: 'Godrealm of the Paranid',
        color: 0xaa00cc, // Lila
        description: 'The orthodox Paranid government.',
        initialRelations: {
            'HOP': -30, 'ARG': 0, 'TEL': 0,
            'XEN': -30, 'KHK': -30
        }
    },
    'TER': {
        name: 'Terran Protectorate',
        color: 0xffffff, // Weiß
        description: 'Isolationist humans from Sol. High tech, high arrogance.',
        initialRelations: {
            'ARG': -10, 'ANT': -10, 'TEL': 0, 'HOP': -10,
            'XEN': -30, 'KHK': -30 // Hassen KI über alles
        }
    },
    'SPL': {
        name: 'Split Patriarchy',
        color: 0xcc2222, // Dunkelrot
        description: 'Aggressive warrior families.',
        initialRelations: {
            'ARG': -10, 'TEL': 0, 'XEN': -30
        }
    },
    'HAT': {
        name: 'Hatikvah Free League',
        color: 0xaaaaaa, // Grau
        description: 'Independent traders, formerly pirates.',
        initialRelations: {
            'ARG': 10, 'ANT': 10, 'TEL': 10, 'PIR': 0,
            'XEN': -30
        }
    },
    'PIR': {
        name: 'Scale Plate Pact',
        color: 0xff0088, // Pink/Rot
        description: 'Loose alliance of pirates and smugglers.',
        initialRelations: {
            'TEL': 0, 'HAT': 0,
            'ARG': -10, 'ANT': -10, 'TER': -20, 'HOP': -10,
            'XEN': -30 // Selbst Piraten mögen keine Xenon
        }
    },
    'XEN': {
        name: 'Xenon',
        color: 0xff0000, // Reines Rot
        description: 'Terraformer AGI. Kill on sight.',
        initialRelations: {
            // Xenon hassen ALLE (-30 default logic im Manager)
        }
    },
    'KHK': {
        name: 'Kha\'ak',
        color: 0xcc00cc, // Magenta
        description: 'Hive mind insectoids.',
        initialRelations: {
            // Kha'ak hassen ALLE (-30 default logic im Manager)
        }
    }
};

/**
 * Hilfsfunktion zum Abrufen der Daten
 */
export function getFaction(id) {
    return FACTION_DB[id] || FACTION_DB['ARG'];
}

