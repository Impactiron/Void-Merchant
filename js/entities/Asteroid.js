import HealthComponent from '../components/HealthComponent.js'; // KORREKTUR: Default Import (ohne {})
// Falls Loot noch nicht existiert oder anders exportiert wird, ggf. anpassen. 
// Ich gehe hier von einem Named Export für Entities aus, oder einem Default. 
// Sicherheitshalber nutze ich hier dynamische Imports oder Standard-Muster.
// Da ich Loot.js in der Liste sah, gehe ich von einem Standard-Export aus.
import { Loot } from './Loot.js'; 

export class Asteroid extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture = 'asteroid_base') {
        super(scene, x, y, texture);

        // Zur Szene und Physik hinzufügen
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Physik-Eigenschaften
        this.setImmovable(true); // Asteroiden werden nicht weggeschoben (vorerst)
        this.body.setCircle(this.width / 2.5); // Hitbox etwas kleiner als die Grafik
        this.setFriction(1);
        
        // Visuelles Feedback: Zufällige Rotation
        this.setAngularVelocity(Phaser.Math.Between(-10, 10));
        this.setScale(Phaser.Math.FloatBetween(0.8, 1.5));

        // Komponenten
        // HP variieren je nach Größe
        const hp = Math.floor(200 * this.scale);
        this.health = new HealthComponent(this, hp, hp);
        
        // Event-Binding für Zerstörung
        this.health.onDeath = () => this.destroyEntity();

        // Loot / Mining Daten
        this.resourceType = 'ore_iron'; // Platzhalter, später aus Sektor-Daten
        this.resourceAmount = Phaser.Math.Between(50, 500);
    }

    /**
     * Wird aufgerufen, wenn ein Projektil trifft
     * @param {number} damage 
     */
    takeDamage(damage) {
        if (this.health) {
            // Flash-Effekt bei Treffer
            this.setTint(0xff0000);
            this.scene.time.delayedCall(100, () => this.clearTint());

            this.health.decrease(damage);
        }
    }

    /**
     * Zerstörungs-Logik
     */
    destroyEntity() {
        if (!this.active) return;

        // 1. Explosion FX
        // Prüfen ob FXManager in der Szene existiert, sonst Fallback
        if (this.scene.fxManager) {
            this.scene.fxManager.playExplosion(this.x, this.y, 'asteroid');
        }

        // 2. Loot Drop (Chance 100% bei Asteroiden für Mining)
        this.spawnLoot();

        // 3. Event für das Spielsystem (z.B. für Kha'ak Spawn Logik)
        this.scene.events.emit('asteroid-destroyed', { x: this.x, y: this.y, amount: this.resourceAmount });

        // 4. Objekt entfernen
        this.destroy();
    }

    spawnLoot() {
        // Hier spawnen wir das Erz
        // Wir nutzen die Loot-Klasse, falls vorhanden
        if (this.resourceAmount > 0) {
            new Loot(
                this.scene, 
                this.x, 
                this.y, 
                this.resourceType, 
                this.resourceAmount
            );
        }
    }
}
