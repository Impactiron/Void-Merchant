import { HealthComponent } from '../components/HealthComponent.js';
import { CargoComponent } from '../components/CargoComponent.js';
import { WeaponSystem } from './WeaponSystem.js';
import { EventsCenter } from '../core/EventsCenter.js';

export class Ship extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, config = {}) {
        super(scene, x, y, texture);
        
        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        // --- Config ---
        this.shiptype = config.shiptype || 'fighter';
        this.speed = config.speed || 200;
        this.turnSpeed = config.turnSpeed || 150;
        this.faction = config.faction || 'neutral';

        // --- Physics Setup ---
        this.setDamping(true);
        this.setDrag(0.95); // Space drift effect
        this.setMaxVelocity(this.speed);
        
        // --- Components ---
        // Health: HP, Shields handled by component
        this.health = new HealthComponent(this, config.hp || 100, config.shield || 50);
        
        // Cargo: Capacity handled by component
        this.cargo = new CargoComponent(this, config.cargoSpace || 20);

        // Weapons: Slots and firing handled by system
        this.weaponSystem = new WeaponSystem(this.scene, this);

        // --- MODIFICATION SYSTEM (NEW) ---
        // Speichert installierte Mods für SaveSystem und Logik
        this.installedMods = config.installedMods || []; 

        // --- Input States ---
        this.cursors = null;
        this.keys = {};
        this.isPlayer = false; // Flag if controlled by player

        // Init Events
        this.on('destroy', this.onDestroy, this);
    }

    setupPlayerControl() {
        this.isPlayer = true;
        this.cursors = this.scene.input.keyboard.createCursorKeys();
        this.keys = this.scene.input.keyboard.addKeys({
            fire: Phaser.Input.Keyboard.KeyCodes.SPACE,
            interact: Phaser.Input.Keyboard.KeyCodes.F
        });
        
        // Kamera folgt dem Spieler
        this.scene.cameras.main.startFollow(this);
    }

    update(time, delta) {
        if (!this.active) return;

        // Komponenten Updates
        this.health.update(time, delta);
        this.weaponSystem.update(time, delta);

        // Movement Logic
        if (this.isPlayer) {
            this.handlePlayerInput(delta);
        } else {
            // AI Logic placeholder
        }
    }

    handlePlayerInput(delta) {
        if (this.cursors.up.isDown) {
            this.scene.physics.velocityFromRotation(this.rotation, this.speed, this.body.acceleration);
        } else {
            this.body.setAcceleration(0);
        }

        if (this.cursors.left.isDown) {
            this.setAngularVelocity(-this.turnSpeed);
        } else if (this.cursors.right.isDown) {
            this.setAngularVelocity(this.turnSpeed);
        } else {
            this.setAngularVelocity(0);
        }

        // Shooting
        if (this.keys.fire.isDown) {
            this.weaponSystem.fire();
        }
    }

    onDestroy() {
        // Cleanup if needed
        if (this.health) this.health.destroy();
    }
}
