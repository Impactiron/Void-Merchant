// FILE: js/entities/Ship.js

/**
 * 📘 PROJECT: VOID MERCHANT
 * MODULE: SHIP ENTITY
 * * Basis-Klasse für steuerbare Schiffe.
 * * UPDATE Phase 2: Refactored to use Components (Health & Cargo).
 * * UPDATE Phase 3: Auto-Scaling via SpriteHelper.
 */

import WeaponSystem from './WeaponSystem.js';
import { getShipStats } from '../data/ShipDB.js';
import events from '../core/EventsCenter.js';
import HealthComponent from '../components/HealthComponent.js';
import CargoComponent from '../components/CargoComponent.js';
import { enforceSpriteSize } from '../core/SpriteHelper.js'; // NEU

export default class Ship extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, shipId, projectileManager) {
        // 1. LOAD STATS
        const dbStats = getShipStats(shipId);
        const texture = 'spr_ship_terran_fighter'; // Placeholder Textur

        super(scene, x, y, texture);

        this.scene = scene;
        this.id = shipId; 
        
        // Instance ID Logic
        if (shipId === 'player_ship') { 
             this.instanceId = 'player';
        } else {
             this.instanceId = `ship_${Date.now()}_${Math.random()}`;
        }
        Object.defineProperty(this, 'id', { value: this.instanceId, writable: true });

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        // --- IFF IDENTIFICATION ---
        this.faction = dbStats.faction || 'ARG';

        // --- COMPONENTS SETUP ---
        this.meta = {
            name: dbStats.name,
            class: dbStats.class,
            basePrice: dbStats.price
        };

        this.health = new HealthComponent(this.scene, this, dbStats.hull, dbStats.shield);
        this.cargo = new CargoComponent(this, dbStats.cargo);
        this._credits = 0;

        Object.defineProperty(this, 'credits', {
            get: () => this._credits,
            set: (value) => {
                const old = this._credits;
                this._credits = value;
                if (old !== value) {
                    events.emit('update-credits', this._credits);
                }
            },
            enumerable: true,
            configurable: true
        });

        // --- VISUAL SCALING (AUTO-SCALER) ---
        // Bestimme Zielgröße basierend auf Schiffsklasse
        let targetSize = 32; // Default S
        if (this.meta.class === 'M') targetSize = 64;   // Reduziert für bessere Spielbarkeit
        if (this.meta.class === 'L') targetSize = 128;
        if (this.meta.class === 'XL') targetSize = 256;

        // Nutze den neuen Helper für konsistente Größe & Hitbox
        enforceSpriteSize(this, targetSize, false); // false = Box Hitbox

        // Hitbox etwas verkleinern für besseres "Game Feel" (80% der visuellen Größe)
        const hitboxSize = targetSize * 0.8;
        this.body.setSize(hitboxSize, hitboxSize);
        // Offset zentrieren
        this.body.setOffset((this.displayWidth - hitboxSize) / 2, (this.displayHeight - hitboxSize) / 2);


        // --- PHYSICS CONFIGURATION ---
        this.speed = dbStats.speed;
        this.strafeSpeed = this.speed * 0.6;
        this.turnSpeed = dbStats.turnSpeed;
        this.baseDrag = 0.92;
        this.brakeDrag = 0.05;

        this.body.setDamping(true);
        this.body.setDrag(this.baseDrag);
        this.body.setAngularDrag(0.50);
        this.body.setMaxVelocity(this.speed * 3.0);
        this.body.setCollideWorldBounds(false);

        // --- WEAPON SYSTEM ---
        if (projectileManager) {
            this.weaponSystem = new WeaponSystem(this.scene, this, projectileManager);
            this.weaponSystem.equip('wpn_laser_pulse_s');
        }
    }

    takeDamage(amount) {
        this.health.takeDamage(amount);
        if (this.id === 'player') {
            this.scene.cameras.main.shake(100, 0.005);
        }
    }

    addCargo(wareId, amount) {
        return this.cargo.add(wareId, amount);
    }

    update(input, time, delta) {
        if (!input) return;
        if (!this.body) return;
        if (this.health.isDead) return;

        this.health.update(time, delta);
        if (this.weaponSystem) this.weaponSystem.update(input, time);

        // 1. ROTATION
        const aimPos = input.getAimPosition();
        const targetAngle = Phaser.Math.Angle.Between(this.x, this.y, aimPos.x, aimPos.y);
        let diff = Phaser.Math.Angle.Wrap(targetAngle - this.rotation);

        if (Math.abs(diff) < 0.05) {
            this.setAngularVelocity(0);
            this.setRotation(targetAngle);
        } else {
            this.setAngularVelocity(diff * this.turnSpeed);
        }

        // 2. BRAKE LOGIC
        if (input.getBrake()) {
            this.body.setDrag(this.brakeDrag);
            this.setAcceleration(0);
            return;
        } else {
            this.body.setDrag(this.baseDrag);
        }

        // 3. MOVEMENT
        const moveVec = input.getMoveVector();
        this.setAcceleration(0);

        if (moveVec.y !== 0) {
            let currentThrust = (moveVec.y > 0) ? this.speed : this.speed * 0.5;
            if (moveVec.y > 0 && input.getBoost && input.getBoost()) {
                currentThrust *= 2.5;
            }
            this.scene.physics.velocityFromRotation(
                this.rotation,
                currentThrust * moveVec.y,
                this.body.acceleration
            );
        }

        if (moveVec.x !== 0) {
            const strafeAngle = this.rotation + (Math.PI / 2);
            const strafeAccel = this.scene.physics.velocityFromRotation(
                strafeAngle,
                this.strafeSpeed * moveVec.x
            );
            this.body.acceleration.x += strafeAccel.x;
            this.body.acceleration.y += strafeAccel.y;
        }
    }
}
