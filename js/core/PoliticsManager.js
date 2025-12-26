// FILE: js/core/PoliticsManager.js

/**
 * 📘 PROJECT: VOID MERCHANT
 * MODULE: POLITICS MANAGER
 * * Verwaltet dynamische Beziehungen zwischen Fraktionen.
 * * Singleton Pattern via window.game.politics
 */

import { FACTION_DB } from '../data/FactionDB.js';
import events from './EventsCenter.js';

export default class PoliticsManager {
    constructor() {
        // Nested Object für Laufzeit-Beziehungen: this.relations[ID_A][ID_B] = Wert
        this.relations = {};

        this.initRelations();
        console.log("PoliticsManager: Diplomacy initialized.");
    }

    /**
     * Baut die dynamische Matrix basierend auf der DB auf.
     */
    initRelations() {
        const factionKeys = Object.keys(FACTION_DB);

        // 1. Matrix initialisieren
        factionKeys.forEach(idA => {
            this.relations[idA] = {};
            factionKeys.forEach(idB => {
                // Default: 0 (Neutral)
                this.relations[idA][idB] = 0;
            });
        });

        // 2. Werte aus DB laden (Symmetrie wird erzwungen für Einfachheit)
        factionKeys.forEach(idA => {
            const data = FACTION_DB[idA];
            if (data.initialRelations) {
                for (const [idB, val] of Object.entries(data.initialRelations)) {
                    // Setze A -> B
                    this.relations[idA][idB] = val;
                    // Setze B -> A (Symmetrie), falls B existiert
                    if (this.relations[idB]) {
                        this.relations[idB][idA] = val;
                    }
                }
            }
        });

        // 3. Hardcoded Hate für XEN & KHK (Safety)
        ['XEN', 'KHK'].forEach(badGuy => {
            factionKeys.forEach(other => {
                if (badGuy !== other) {
                    this.relations[badGuy][other] = -30;
                    this.relations[other][badGuy] = -30;
                }
            });
        });
    }

    /**
     * Gibt den Beziehungswert zurück (-30 bis 30).
     */
    getReputation(factionA, factionB) {
        if (!this.relations[factionA] || this.relations[factionA][factionB] === undefined) {
            // Fallback für unbekannte Fraktionen
            return 0;
        }
        return this.relations[factionA][factionB];
    }

    /**
     * Prüft, ob Fraktion A feindlich gegenüber B ist.
     * Threshold laut Spec: < -10
     */
    isHostile(factionA, factionB) {
        if (factionA === factionB) return false; // Self is always friend
        return this.getReputation(factionA, factionB) < -10;
    }

    /**
     * Ändert den Ruf.
     * @param {string} factionA 
     * @param {string} factionB 
     * @param {number} amount - Delta (z.B. +1 oder -5)
     */
    modifyReputation(factionA, factionB, amount) {
        if (factionA === factionB) return;
        if (!this.relations[factionA] || !this.relations[factionB]) return;

        // XEN und KHK ändern ihre Meinung nie
        if (['XEN', 'KHK'].includes(factionA) || ['XEN', 'KHK'].includes(factionB)) return;

        const oldVal = this.relations[factionA][factionB];
        let newVal = oldVal + amount;

        // Clamp -30 bis 30
        newVal = Math.max(-30, Math.min(30, newVal));

        // Update Symmetrisch
        this.relations[factionA][factionB] = newVal;
        this.relations[factionB][factionA] = newVal;

        // Event Trigger wenn Spieler involviert
        if (factionA === 'PLAYER' || factionB === 'PLAYER') {
            const otherFaction = (factionA === 'PLAYER') ? factionB : factionA;
            if (oldVal !== newVal) {
                console.log(`Reputation Change: PLAYER <-> ${otherFaction}: ${newVal}`);
                events.emit('reputation-changed', {
                    faction: otherFaction,
                    value: newVal,
                    delta: amount
                });
            }
        }
    }
}

