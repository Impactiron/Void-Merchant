import { HealthComponent } from '../components/HealthComponent.js';
import { CargoComponent } from '../components/CargoComponent.js';
// KORRIGIERTER IMPORT: Named Import statt Default
import { WeaponSystem } from './WeaponSystem.js'; 
import { EventsCenter } from '../core/EventsCenter.js';

export class Ship extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, shipId = 'shp_fighter_mk1') {
        super(scene, x, y, texture);

        this.scene = scene;
        this.shipId = shipId;

        // Physics Setup
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        
        this.setCollideWorldBounds(true);
        this.setDamping(true);
        this.setDrag(0.5); // "Drift" Faktor (0.5 = starkes Bremsen, 0.99 = Eis)
        this.setMaxVelocity(400);

        // Components Init
        this.health = new HealthComponent(this, 100, 100);
        this.cargo = new CargoComponent(this, 50);
        
        // Waffen-System initialisieren (Referenz übergeben)
        // Wir benötigen den ProjectileManager aus der Scene. 
        // Annahme: Scene hat public property `projectileManager`
        this.weaponSystem = new WeaponSystem(
            this.scene, 
            this, 
            this.scene.projectileManager
        );

        // Input Marker (für Player Logic)
        this.isPlayer = false;
        
        // Debug
        // console.log(`[Ship] Spawned ${shipId} at ${x}:${y}`);
    }

    update(time, delta) {
        // Components Updates
        this.weaponSystem.updateCooling(); // Könnte man auch über Events lösen, aber Update ist sicherer für Frames
    }

    /**
     * Wird vom InputManager oder AI Controller aufgerufen
     */
    firePrimary(time) {
        this.weaponSystem.fire(time);
    }

    takeDamage(amount) {
        const destroyed = this.health.damage(amount);
        if (destroyed) {
            this.explode();
        } else {
            // Flash Effect oder ähnliches
            this.setTint(0xff0000);
            this.scene.time.delayedCall(100, () => this.clearTint());
        }
    }

    explode() {
        EventsCenter.emit('ship-destroyed', this);
        // Explosion FX (TODO)
        this.destroy();
    }
}
