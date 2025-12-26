// FILE: js/entities/Ship.js

/**
 * 📘 PROJECT: VOID MERCHANT
 * MODULE: SHIP ENTITY
 * * Basis-Klasse für steuerbare Schiffe.
 * * UPDATE Phase 2: Refactored to use Components (Health & Cargo).
 */

import WeaponSystem from './WeaponSystem.js';
import { getShipStats } from '../data/ShipDB.js';
import events from '../core/EventsCenter.js';
import HealthComponent from '../components/HealthComponent.js'; // NEU
import CargoComponent from '../components/CargoComponent.js';   // NEU

export default class Ship extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, shipId, projectileManager) {
        // 1. LOAD STATS
        const dbStats = getShipStats(shipId);
        const texture = 'spr_ship_terran_fighter'; // TODO: Dynamic Texture based on ID

        super(scene, x, y, texture);

        this.scene = scene;
        this.id = shipId; // Achtung: Das ist die SHIP_TYPE_ID. Für Instances bräuchten wir UUIDs. 
                          // Für Player okay, für NPCs später eindeutige ID generieren!
        // FIX: Wir weisen dem Player eine eindeutige Instance ID zu, wenn er Player ist
        if (shipId === 'player_ship') { 
             // Logic handled externally usually, but strictly speaking this.id refers to DB ID currently.
             // We assign a property 'instanceId' for Events.
             this.instanceId = 'player';
        } else {
             this.instanceId = `ship_${Date.now()}_${Math.random()}`;
        }
        // Override id getter for components to work with 'player' check in UI
        Object.defineProperty(this, 'id', { value: this.instanceId, writable: true });


        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        // --- IFF IDENTIFICATION ---
        this.faction = dbStats.faction || 'ARG';

        // --- COMPONENTS SETUP (REFACTOR) ---
        // Stats Container for Metadata (Name, Class)
        this.meta = {
            name: dbStats.name,
            class: dbStats.class,
            basePrice: dbStats.price
        };

        // 1. Health Component (Replaces stats.hull/shield)
        this.health = new HealthComponent(this.scene, this, dbStats.hull, dbStats.shield);

        // 2. Cargo Component (Replaces stats.cargo)
        this.cargo = new CargoComponent(this, dbStats.cargo);

        // 3. Credits (Only relevant for Player, logic kept simpler via property + event)
        this._credits = 0;

        // --- PROXY FOR CREDITS EVENT ---
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

        // --- VISUAL SCALING ---
        let targetSize = 64;
        if (this.meta.class === 'M') targetSize = 128;
        if (this.meta.class === 'L') targetSize = 256;
        if (this.meta.class === 'XL') targetSize = 512;

        this.setDisplaySize(targetSize, targetSize);
        const hitboxSize = targetSize * 0.8;
        this.body.setSize(hitboxSize, hitboxSize);
        this.body.setOffset((this.width - hitboxSize) / 2, (this.height - hitboxSize) / 2);

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

    /**
     * Delegiert Schaden an die HealthComponent
     */
    takeDamage(amount) {
        this.health.takeDamage(amount);
        // Visual Shake if Player
        if (this.id === 'player') {
            this.scene.cameras.main.shake(100, 0.005);
        }
    }

    /**
     * Wrapper für Cargo Add (Kompatibilität)
     */
    addCargo(wareId, amount) {
        return this.cargo.add(wareId, amount);
    }

    update(input, time, delta) {
        if (!input) return;
        if (!this.body) return;
        if (this.health.isDead) return;

        // UPDATE COMPONENTS
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


