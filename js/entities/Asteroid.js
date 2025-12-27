import { HealthComponent } from '../components/HealthComponent.js';

export class Asteroid extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, type = 'rock') {
        super(scene, x, y, 'asteroid_medium'); // Nutzt Platzhalter-Asset, falls 'asteroid_medium' nicht in preload

        this.scene = scene;
        this.type = type;

        // Zur Szene und Physik hinzufügen
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Physik-Eigenschaften
        this.setCollideWorldBounds(false);
        this.setBounce(0.5);
        this.setImmovable(false);
        
        // Zufällige Rotation und Geschwindigkeit
        this.setVelocity(
            Phaser.Math.Between(-20, 20),
            Phaser.Math.Between(-20, 20)
        );
        this.setAngularVelocity(Phaser.Math.Between(-10, 10));

        // Komponenten
        this.components = {};
        this.components.health = new HealthComponent(this, 50, 50);

        // Event-Listener für Zerstörung
        this.components.health.on('death', this.explode, this);
    }

    update() {
        // OOS Logic (Out of Sector) Check
        // Wenn zu weit weg, despawnen?
        if (Phaser.Math.Distance.Between(this.x, this.y, 0, 0) > 20000) {
            this.destroy();
        }
    }

    explode() {
        console.log("🪨 Asteroid zerfallen");
        // TODO: Drop Loot (Erz)
        // this.scene.dropLoot(this.x, this.y, 'ore_iron');
        this.destroy();
    }
}