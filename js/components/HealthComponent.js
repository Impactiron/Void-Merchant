// FILE: js/components/HealthComponent.js

/**
 * 📘 PROJECT: VOID MERCHANT
 * COMPONENT: HEALTH SYSTEM
 * * Verwaltet Health Points (HP) und Schilde.
 * * Implementiert Shield Gating und Regeneration (TDD Vol 4).
 * * Event-Driven Updates.
 */

import events from '../core/EventsCenter.js';

export default class HealthComponent {
    /**
     * @param {Phaser.Scene} scene
     * @param {Object} parentEntity - Das Eltern-Objekt (z.B. Ship), muss eine .id haben
     * @param {number} maxHp
     * @param {number} maxShield
     */
    constructor(scene, parentEntity, maxHp, maxShield) {
        this.scene = scene;
        this.parent = parentEntity;

        this.maxHp = maxHp;
        this.currentHp = maxHp;

        this.maxShield = maxShield;
        this.currentShield = maxShield;

        // Settings aus TDD Vol 4
        this.regenDelay = 3000; // 3 Sekunden Pause nach Treffer
        this.regenRate = 0.05;  // 5% pro Sekunde
        this.lastDamageTime = 0;

        this.isDead = false;
    }

    /**
     * Verarbeitet eingehenden Schaden.
     * @param {number} amount
     */
    takeDamage(amount) {
        if (this.isDead) return;

        this.lastDamageTime = this.scene.time.now;

        let hullDamage = 0;
        let shieldDamage = 0;

        if (this.currentShield > 0) {
            if (amount > this.currentShield) {
                // Shield Gate: Restschaden geht auf Hülle
                shieldDamage = this.currentShield;
                hullDamage = amount - this.currentShield;
                this.currentShield = 0;
                // FX: Schildbruch könnte hier getriggert werden
            } else {
                shieldDamage = amount;
                this.currentShield -= amount;
            }
        } else {
            hullDamage = amount;
        }

        this.currentHp -= hullDamage;

        if (this.currentHp <= 0) {
            this.currentHp = 0;
            this.isDead = true;
            this.emitDeath();
        }

        this.emitUpdate();
    }

    update(time, delta) {
        if (this.isDead) return;

        // Shield Regeneration
        if (this.currentShield < this.maxShield) {
            if (time > this.lastDamageTime + this.regenDelay) {
                const regenAmount = (this.maxShield * this.regenRate) * (delta / 1000);
                this.currentShield += regenAmount;
                if (this.currentShield > this.maxShield) this.currentShield = this.maxShield;
                
                // Wir emitten hier nicht jeden Frame, um Performance zu sparen, 
                // sondern könnten das drosseln. Fürs erste: UI pollt HP im Update, 
                // aber Events sind sauberer. Wir senden Event bei voller Heilung oder Intervallen.
                // Für Reactive UI (wie angefordert) senden wir es hier.
                // Optimierung: Nur senden, wenn sich Integer-Wert ändert.
                this.emitUpdate(); 
            }
        }
    }

    emitUpdate() {
        events.emit('entity-damaged', {
            id: this.parent.id,
            currentHp: this.currentHp,
            maxHp: this.maxHp,
            currentShield: this.currentShield,
            maxShield: this.maxShield
        });
    }

    emitDeath() {
        events.emit('entity-died', {
            id: this.parent.id,
            x: this.parent.x,
            y: this.parent.y
        });
    }

    // Hilfsmethode für SaveSystem
    getData() {
        return {
            hullCurrent: this.currentHp,
            shieldCurrent: this.currentShield
        };
    }

    // Hilfsmethode für LoadSystem
    setData(currentHp, currentShield) {
        this.currentHp = currentHp;
        this.currentShield = currentShield;
        this.emitUpdate();
    }
}
