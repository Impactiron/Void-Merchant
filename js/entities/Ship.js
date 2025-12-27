import HealthComponent from '../components/HealthComponent.js';
import CargoComponent from '../components/CargoComponent.js';
import { WeaponSystem } from './WeaponSystem.js';
import events from '../core/EventsCenter.js';

export class Ship extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, config = {}) {
        super(scene, x, y, texture);

        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        // Physics Setup
        this.setCollideWorldBounds(true);
        this.setDrag(config.drag || 100);
        this.setDamping(true);
        this.setMaxVelocity(config.maxSpeed || 200);

        // Config Data
        this.id = config.id || 'player_ship';
        this.type = 'player';
        this.category = config.category || 'fighter';

        // Components
        // WICHTIG: HealthComponent und CargoComponent sind Default Exports
        this.health = new HealthComponent(this, config.hp || 100, config.shield || 50);
        this.cargo = new CargoComponent(this, config.cargoSpace || 50);
        
        // Weapon System (Named Export)
        this.weapons = new WeaponSystem(this.scene, this);

        // Movement State
        this.targetPosition = null;
        this.isAutoPiloting = false;
        this.rotationSpeed = config.rotationSpeed || 3;

        // Events Init
        this.setupEvents();
    }

    setupEvents() {
        // Global Events Listening
        // Beispiel: Wenn wir auf Heilung von außen reagieren müssten
        // events.on('heal-player', this.heal, this);
    }

    update(time, delta) {
        // Update Components
        if (this.weapons) {
            this.weapons.update(time, delta);
        }

        this.health.regenerate(delta);

        // Movement Logic
        if (this.isAutoPiloting && this.targetPosition) {
            this.moveToTarget();
        } else {
            this.handleInput();
        }

        // UI Updates via EventBus (Performance: Nicht jeden Frame, aber hier der Einfachheit halber)
        // Besser: Nur bei Änderung emitten. Hier ein Beispiel für Health-Update.
        // events.emit('ui-update-hull', this.health.currentHP, this.health.maxHP);
    }

    handleInput() {
        // Wird vom PlayerController oder GameScene gesteuert, 
        // hier nur die physikalische Umsetzung, falls Input direkt übergeben wird
        // (Aktuell steuert die GameScene meist direkt via InputManager die Velocity)
    }

    moveToTarget() {
        const distance = Phaser.Math.Distance.Between(this.x, this.y, this.targetPosition.x, this.targetPosition.y);
        
        if (distance < 10) {
            this.body.setVelocity(0);
            this.isAutoPiloting = false;
            this.targetPosition = null;
            events.emit('autopilot-arrived');
            return;
        }

        const angle = Phaser.Math.Angle.Between(this.x, this.y, this.targetPosition.x, this.targetPosition.y);
        this.scene.physics.velocityFromRotation(angle, this.body.maxVelocity.x, this.body.velocity);
        this.setRotation(angle + Math.PI / 2);
    }

    setTarget(x, y) {
        this.targetPosition = new Phaser.Math.Vector2(x, y);
        this.isAutoPiloting = true;
    }

    receiveDamage(amount) {
        const damageTaken = this.health.takeDamage(amount);
        
        // Visuelles Feedback
        this.scene.tweens.add({
            targets: this,
            alpha: 0.5,
            duration: 50,
            yoyo: true,
            repeat: 1
        });

        // Event für UI und GameLogic
        events.emit('player-damaged', { 
            currentHP: this.health.currentHP, 
            maxHP: this.health.maxHP,
            damage: damageTaken 
        });

        if (this.health.isDead()) {
            this.die();
        }
    }

    die() {
        events.emit('player-destroyed', this.x, this.y);
        this.destroy();
    }
}
