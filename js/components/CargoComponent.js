// FILE: js/components/CargoComponent.js

/**
 * 📘 PROJECT: VOID MERCHANT
 * COMPONENT: CARGO SYSTEM
 * * Verwaltet Inventar und Volumen.
 * * Prüft Limits gegen WARE_DB.
 */

import events from '../core/EventsCenter.js';
import { WARE_DB, getWare } from '../data/WareDB.js';

export default class CargoComponent {
    /**
     * @param {Object} parentEntity - Besitzer (Schiff/Station)
     * @param {number} maxVolume - Maximales Frachtvolumen
     */
    constructor(parentEntity, maxVolume) {
        this.parent = parentEntity;
        this.maxVolume = maxVolume;
        
        // Speicherformat: { 'ware_id': amount }
        this.items = {};
    }

    /**
     * Fügt Ware hinzu. Gibt true zurück bei Erfolg.
     * @param {string} wareId
     * @param {number} amount
     * @returns {boolean}
     */
    add(wareId, amount) {
        if (amount <= 0) return false;

        const ware = getWare(wareId);
        const volumePerUnit = ware.volume || 1;
        const requiredVolume = amount * volumePerUnit;

        if (this.getUsedVolume() + requiredVolume > this.maxVolume) {
            // Passt nicht
            return false;
        }

        if (!this.items[wareId]) {
            this.items[wareId] = 0;
        }
        this.items[wareId] += amount;

        this.emitUpdate();
        return true;
    }

    /**
     * Entfernt Ware. Gibt true zurück bei Erfolg.
     * @param {string} wareId
     * @param {number} amount
     * @returns {boolean}
     */
    remove(wareId, amount) {
        if (amount <= 0) return false;
        if (!this.items[wareId] || this.items[wareId] < amount) {
            return false;
        }

        this.items[wareId] -= amount;

        // Clean up empty keys
        if (this.items[wareId] === 0) {
            delete this.items[wareId];
        }

        this.emitUpdate();
        return true;
    }

    has(wareId, amount) {
        return (this.items[wareId] && this.items[wareId] >= amount);
    }

    getAmount(wareId) {
        return this.items[wareId] || 0;
    }

    getUsedVolume() {
        let volume = 0;
        for (const [id, amount] of Object.entries(this.items)) {
            const ware = getWare(id);
            volume += amount * (ware.volume || 1);
        }
        return volume;
    }

    emitUpdate() {
        events.emit('cargo-updated', {
            id: this.parent.id,
            items: this.items,
            usedVolume: this.getUsedVolume(),
            maxVolume: this.maxVolume
        });
    }
}

