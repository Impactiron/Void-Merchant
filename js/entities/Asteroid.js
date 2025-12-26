// FILE: js/entities/Asteroid.js

/**
 * 📘 PROJECT: VOID MERCHANT
 * MODULE: ASTEROID ENTITY
 * * Zerstörbares Umgebungsobjekt.
 * * UPDATE: Trigger Loot Drop on Destroy
 */

export default class Asteroid extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, size = 'medium') {
        super(scene, x, y, 'spr_asteroid_iron');

        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        this.sizeCategory = size;
        this.hp = 0;
        this.maxHp = 0;
        this.mass = 5000;

        // --- AUTO-SCALING & STATS ---
        this.configureStats(size);

        // --- PHYSICS ---
        this.body.setVelocity(
            Phaser.Math.Between(-20, 20),
            Phaser.Math.Between(-20, 20)
        );
        this.body.setAngularVelocity(Phaser.Math.Between(-10, 10));
        this.body.setBounce(0.2);
        this.body.setDrag(0);
        this.body.setImmovable(false);
    }

    configureStats(size) {
        let targetDiameter = 64; 

        switch (size) {
            case 'small':
                targetDiameter = 32;
                this.hp = 100;
                this.mass = 1000;
                break;
            case 'large':
                targetDiameter = 128;
                this.hp = 800;
                this.mass = 10000;
                break;
            case 'medium':
            default:
                targetDiameter = 64;
                this.hp = 300;
                this.mass = 5000;
                break;
        }

        // VISUAL SCALING
        this.setDisplaySize(targetDiameter, targetDiameter);

        // HITBOX SCALING
        const hitboxRadius = (this.width / 2) * 0.85;
        const offset = (this.width - (hitboxRadius * 2)) / 2;
        this.body.setCircle(hitboxRadius, offset, offset);
        this.body.setMass(this.mass);

        this.maxHp = this.hp;
    }

    takeDamage(amount) {
        this.hp -= amount;

        // Visual Feedback: Flash Red
        this.setTint(0xff5555);
        this.scene.time.delayedCall(100, () => {
            if (this.active) this.clearTint();
        });

        if (this.hp <= 0) {
            this.destroyAsteroid();
        }
    }

    destroyAsteroid() {
        // 1. FX
        if (this.scene.fxManager) {
            let scale = 1.0;
            if (this.sizeCategory === 'small') scale = 0.5;
            if (this.sizeCategory === 'large') scale = 2.0;
            this.scene.fxManager.playExplosion(this.x, this.y, scale);
        }

        // 2. LOOT DROP (NEU)
        // Wir rufen die spawnLoot Funktion der Scene auf
        if (typeof this.scene.spawnLoot === 'function') {
            // Menge basierend auf Größe
            let amount = 1;
            if (this.sizeCategory === 'medium') amount = Phaser.Math.Between(2, 5);
            if (this.sizeCategory === 'large') amount = Phaser.Math.Between(5, 10);
            
            // Zufälliger Ware-Drop (Simuliert)
            const type = (Math.random() > 0.5) ? 'ore_iron' : 'ore_ice';
            
            this.scene.spawnLoot(this.x, this.y, type, amount);
        }

        this.destroy();
    }
}


