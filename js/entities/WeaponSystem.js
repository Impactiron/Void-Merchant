// FILE: js/entities/WeaponSystem.js

/**
 * 📘 PROJECT: VOID MERCHANT
 * MODULE: WEAPON SYSTEM
 * * Verwaltet Waffen-Slots, Cooldowns und feuert via ProjectileManager.
 * * UPDATE: Added Beam Weapon Logic & Player Auto-Targeting for Beams.
 */

import { WEAPON_DB } from '../data/WeaponDB.js';

export default class WeaponSystem {
    /**
     * @param {Phaser.Scene} scene 
     * @param {Ship} ship 
     * @param {ProjectileManager} projectileManager 
     * @param {BeamComponent} beamComponent - Optional/Neu
     */
    constructor(scene, ship, projectileManager, beamComponent = null) {
        this.scene = scene;
        this.ship = ship;
        this.projectileManager = projectileManager;
        this.beamComponent = beamComponent;

        // Default Loadout
        this.activeWeaponId = 'wpn_laser_pulse_s';
        this.weaponStats = WEAPON_DB[this.activeWeaponId];

        this.lastFired = 0;
        this.cooldown = 1000 / this.weaponStats.fireRate;

        // Cache für Input-Position (für Player Beam Targeting)
        this.lastAimPosition = null;
    }

    equip(weaponId) {
        if (!WEAPON_DB[weaponId]) {
            console.error(`WeaponSystem: Unknown weapon ID ${weaponId}`);
            return;
        }

        this.activeWeaponId = weaponId;
        this.weaponStats = WEAPON_DB[weaponId];
        this.cooldown = 1000 / this.weaponStats.fireRate;

        console.log(`WeaponSystem: Equipped ${this.weaponStats.name}`);
    }

    update(input, time) {
        // Input merken für Targeting (falls InputManager eine Methode hat)
        if (input && typeof input.getAimPosition === 'function') {
            this.lastAimPosition = input.getAimPosition();
        }

        if (input.getFire()) {
            this.tryFire(time);
        }
    }

    tryFire(time) {
        if (time > this.lastFired + this.cooldown) {
            this.fire(time);
        }
    }

    fire(time) {
        this.lastFired = time;

        // --- BRANCH: BEAM WEAPON ---
        if (this.weaponStats.type === 'BEAM') {
            if (!this.beamComponent) {
                console.warn("WeaponSystem: Beam weapon equipped but no BeamComponent attached.");
                return;
            }

            let target = null;

            // TARGETING LOGIC
            if (this.ship.faction === 'PLAYER') {
                // Player Targeting: Finde Gegner nahe der Mausposition (Aim Assist)
                target = this.getPlayerTarget();
            } else {
                // AI Targeting: Nutze das gespeicherte Ziel der KI
                target = this.ship.target;
            }

            // FEUER (Nur wenn valides Ziel existiert)
            if (target && target.active) {
                // Sound Effect (Optional, falls Beam eigenen Sound hat)
                // this.playFireSound(); // Aktuell macht das BeamComponent oder wir fügen es hier ein

                // Strahl feuern (Visual + Damage)
                this.beamComponent.fire(this.ship, target, this.weaponStats.damage);
            }
            
            return; // Beende hier, kein Projektil feuern
        }

        // --- BRANCH: PROJECTILE WEAPON (Standard) ---
        
        const wingOffset = 20;

        const vecLeft = new Phaser.Math.Vector2(0, -wingOffset).rotate(this.ship.rotation);
        const vecRight = new Phaser.Math.Vector2(0, wingOffset).rotate(this.ship.rotation);
        const forward = new Phaser.Math.Vector2(30, 0).rotate(this.ship.rotation);

        const spawnLeft = {
            x: this.ship.x + vecLeft.x + forward.x,
            y: this.ship.y + vecLeft.y + forward.y
        };
        const spawnRight = {
            x: this.ship.x + vecRight.x + forward.x,
            y: this.ship.y + vecRight.y + forward.y
        };

        const isPlayer = (this.ship.faction === 'PLAYER');

        this.playFireSound(isPlayer);

        // Fire Left
        this.projectileManager.fireBullet(
            spawnLeft.x, spawnLeft.y, this.ship.rotation,
            this.weaponStats.speed, this.weaponStats.damage, this.weaponStats.color,
            isPlayer
        );

        // Fire Right
        this.projectileManager.fireBullet(
            spawnRight.x, spawnRight.y, this.ship.rotation,
            this.weaponStats.speed, this.weaponStats.damage, this.weaponStats.color,
            isPlayer
        );
    }

    /**
     * Hilfsmethode: Findet das beste Ziel für den Spieler (Beam Weapons)
     * Sucht nach Gegnern unter dem Mauszeiger oder in der Nähe.
     */
    getPlayerTarget() {
        if (!this.lastAimPosition || !this.scene.enemies) return null;

        let closestEnemy = null;
        let closestDist = 100; // Pixel Toleranz (Aim Assist Radius)

        // Iteriere über alle aktiven Gegner
        this.scene.enemies.children.iterate(enemy => {
            if (enemy.active) {
                const dist = Phaser.Math.Distance.Between(
                    this.lastAimPosition.x, this.lastAimPosition.y,
                    enemy.x, enemy.y
                );

                if (dist < closestDist) {
                    closestDist = dist;
                    closestEnemy = enemy;
                }
            }
        });

        return closestEnemy;
    }

    playFireSound(isPlayer) {
        if (this.scene.audioManager) {
            const vol = isPlayer ? 0.3 : 0.1;
            const cam = this.scene.cameras.main;
            if (cam.worldView.contains(this.ship.x, this.ship.y)) {
                this.scene.audioManager.playSfx('sfx_laser_shoot', { volume: vol });
            }
        }
    }
}


