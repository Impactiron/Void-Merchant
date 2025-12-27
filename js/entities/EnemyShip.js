// FILE: js/entities/EnemyShip.js

/**
 * 📘 PROJECT: VOID MERCHANT
 * MODULE: ENEMY SHIP (AI)
 * * Implementiert einfache Gegner-KI (Chase & Shoot).
 * * UPDATE: Auto-Scaling via SpriteHelper
 */

import WeaponSystem from './WeaponSystem.js';
import { enforceSpriteSize } from '../core/SpriteHelper.js'; // NEU

export default class EnemyShip extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, target, projectileManager) {
        super(scene, x, y, texture);

        this.scene = scene;
        this.target = target; 
        this.projectileManager = projectileManager;

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        // --- IFF IDENTIFICATION ---
        this.faction = 'XENON';

        // --- STATS ---
        this.hp = 200;
        this.maxHp = 200;
        this.speed = 250; 
        this.turnSpeed = 180;
        this.detectionRange = 1000;
        this.attackRange = 600;
        this.stopRange = 200; 

        // --- VISUAL SCALING (AUTO-SCALER) ---
        // Feinde standardmäßig etwas größer als Spieler (48px)
        enforceSpriteSize(this, 48, true); // true = Circle Hitbox

        // Manuelle Hitbox-Korrektur (optional, da Helper schon gute Arbeit leistet)
        // Wir machen die Hitbox etwas kleiner als das Sprite (Fehlertoleranz)
        this.body.setCircle(20); 
        // Offset muss neu berechnet werden, da setCircle den Offset zurücksetzt
        // Bei 48x48 Sprite und Radius 20 (Durchmesser 40) ist Offset (4,4)
        this.body.setOffset(4, 4);


        // --- PHYSICS ---
        this.body.setDamping(true);
        this.body.setDrag(0.7);
        this.body.setAngularDrag(200);
        this.body.setMaxVelocity(300);
        this.body.setCollideWorldBounds(false); 

        // --- WEAPON SYSTEM ---
        if (projectileManager) {
            this.weaponSystem = new WeaponSystem(this.scene, this, projectileManager);
            this.weaponSystem.equip('wpn_laser_pulse_s');
            // KI Balancing
            this.weaponSystem.weaponStats.fireRate = 2.0; 
            this.weaponSystem.cooldown = 500;
        }

        this.state = 'IDLE'; 
    }

    update(time, delta) {
        if (!this.target || !this.target.active) {
            this.state = 'IDLE';
        } else {
            const dist = Phaser.Math.Distance.Between(this.x, this.y, this.target.x, this.target.y);

            if (dist < this.detectionRange) {
                this.state = 'CHASE';
            } else {
                this.state = 'IDLE';
            }

            if (this.state === 'CHASE') {
                this.handleChase(dist, time);
            } else {
                this.handleIdle();
            }
        }

        // Waffen Update via simuliertem Input
        if (this.weaponSystem) {
            const aiInput = {
                getFire: () => this.isFiring
            };
            this.weaponSystem.update(aiInput, time);
        }
    }

    handleChase(dist, time) {
        // 1. ROTATION
        const targetAngle = Phaser.Math.Angle.Between(this.x, this.y, this.target.x, this.target.y);
        let diff = Phaser.Math.Angle.Wrap(targetAngle - this.rotation);

        if (Math.abs(diff) < 0.1) {
            this.setAngularVelocity(0);
            this.setRotation(targetAngle);
        } else {
            this.setAngularVelocity(Math.sign(diff) * this.turnSpeed);
        }

        // 2. MOVEMENT
        if (dist > this.stopRange) {
            this.scene.physics.velocityFromRotation(this.rotation, this.speed, this.body.acceleration);
        } else {
            this.setAcceleration(0);
            this.body.setDrag(0.95); 
        }

        // 3. ATTACK
        if (dist < this.attackRange && Math.abs(diff) < 0.3) {
            this.isFiring = true;
        } else {
            this.isFiring = false;
        }
    }

    handleIdle() {
        this.setAcceleration(0);
        this.setAngularVelocity(0);
        this.isFiring = false;
    }

    takeDamage(amount) {
        this.hp -= amount;

        // Visual Feedback
        this.setTint(0xff0000);
        this.scene.time.delayedCall(100, () => {
            if(this.active) this.clearTint();
        });

        if (this.hp <= 0) {
            this.explode();
        }
    }

    explode() {
        if (this.scene.fxManager) {
            this.scene.fxManager.playExplosion(this.x, this.y, 0.8);
        }
        if (typeof this.scene.spawnLoot === 'function') {
            if (Math.random() > 0.5) {
                this.scene.spawnLoot(this.x, this.y, 'energy_cells', Phaser.Math.Between(5, 20));
            }
        }
        this.destroy();
    }
}
