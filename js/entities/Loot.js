// FILE: js/entities/Loot.js

/**
 * 📘 PROJECT: VOID MERCHANT
 * MODULE: LOOT ENTITY
 * * Repräsentiert drobbare Container im Weltraum.
 * * TDD Vol 5: 5.0 LOOT DROPS 
 */

export default class Loot extends Phaser.Physics.Arcade.Sprite {
    /**
     * @param {Phaser.Scene} scene 
     * @param {number} x 
     * @param {number} y 
     * @param {string} wareId - ID der Ware (z.B. 'ore_iron')
     * @param {number} amount - Menge
     */
    constructor(scene, x, y, wareId, amount) {
        super(scene, x, y, 'spr_loot_container');

        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        // --- DATA ---
        this.wareId = wareId;
        this.amount = amount;

        // --- PHYSICS ---
        // Loot soll etwas driften, wenn es spawnt
        this.body.setDrag(0.5); 
        this.body.setAngularDrag(0.5);
        this.body.setDamping(true);

        // Visual Auto-Scaling
        this.setDisplaySize(32, 32); // Loot ist klein
        
        // Hitbox etwas größer für einfacheres Einsammeln
        this.body.setCircle(20);

        // Despawn Timer (60 Sekunden)
        this.lifeTime = 0;
        this.maxLifeTime = 60000; 
    }

    update(time, delta) {
        this.lifeTime += delta;

        // Blinken bevor es verschwindet
        if (this.lifeTime > this.maxLifeTime - 5000) {
            this.alpha = Math.abs(Math.sin(time / 200));
        }

        if (this.lifeTime > this.maxLifeTime) {
            this.destroy();
        }
    }
}

