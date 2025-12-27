/**
 * @class Asteroid
 * @extends Phaser.Physics.Arcade.Sprite
 * * Repräsentiert einen abbaubaren Asteroiden.
 * ÄNDERUNG: Import von Loot entfernt, Delegation an Scene.
 */
export default class Asteroid extends Phaser.Physics.Arcade.Sprite {
    /**
     * @param {Phaser.Scene} scene 
     * @param {number} x 
     * @param {number} y 
     * @param {string} size 'small', 'medium', 'large'
     */
    constructor(scene, x, y, size = 'medium') {
        // Wir nutzen hier ein generisches Asteroiden-Sprite. 
        // Falls Assets fehlen, nutzt Phaser oft ein Platzhalter-Rechteck, wenn der Key nicht existiert.
        super(scene, x, y, 'spr_asteroid_iron');
        
        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        
        this.sizeCategory = size;
        this.configureStats(size);
        
        // Physics Setup
        // Zufällige Bewegung und Rotation für mehr Dynamik im All
        this.body.setVelocity(Phaser.Math.Between(-20, 20), Phaser.Math.Between(-20, 20));
        this.body.setAngularVelocity(Phaser.Math.Between(-10, 10));
        this.body.setBounce(0.2); // Leichter Abprall
        this.body.setDrag(10);    // Etwas Reibung im "Vakuum" (Gameplay > Realismus)
    }

    /**
     * Konfiguriert HP, Masse und Größe basierend auf der Kategorie.
     * @param {string} size 
     */
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
            default: // medium
                targetDiameter = 64; 
                this.hp = 300; 
                this.mass = 5000; 
                break;
        }

        // Skaliere das Sprite (angenommen das Original ist ca. 64-128px)
        // Wir setzen hier die DisplaySize fix, um Konsistenz zu wahren.
        this.setDisplaySize(targetDiameter, targetDiameter);
        
        // Hitbox anpassen (etwas kleiner als das Bild für faires Gefühl)
        const hitboxRadius = (this.displayWidth / 2) * 0.85;
        this.body.setCircle(hitboxRadius);
        // Zentrieren des Offsets ist bei setCircle manchmal tricky, oft reicht der Radius wenn Origin 0.5,0.5 ist
        
        this.body.setMass(this.mass);
        this.maxHp = this.hp;
    }

    /**
     * Verarbeitet Schaden.
     * @param {number} amount 
     */
    takeDamage(amount) {
        this.hp -= amount;
        
        // Visuelles Feedback: Roter Blitz
        this.setTint(0xff5555);
        this.scene.time.delayedCall(100, () => {
            if (this.active) this.clearTint();
        });

        if (this.hp <= 0) {
            this.destroyAsteroid();
        }
    }

    /**
     * Zerstört den Asteroiden, spielt FX und droppt Loot via Scene.
     */
    destroyAsteroid() {
        // 1. FX (Explosion)
        if (this.scene.fxManager) {
            // Skalierung der Explosion basierend auf Asteroiden-Größe
            let scale = (this.sizeCategory === 'large') ? 2.0 : (this.sizeCategory === 'small' ? 0.5 : 1.0);
            this.scene.fxManager.playExplosion(this.x, this.y, scale);
        }

        // 2. LOOT DROP DELEGATION
        // Wir prüfen sicherheitshalber, ob die Scene die Methode hat
        if (typeof this.scene.spawnLoot === 'function') {
            let amount = (this.sizeCategory === 'large') ? Phaser.Math.Between(5, 10) : Phaser.Math.Between(2, 5);
            if (this.sizeCategory === 'small') amount = 1;

            // Zufallsauswahl Erz-Typ (könnte später via Parameter gesteuert werden)
            const type = (Math.random() > 0.5) ? 'ore_iron' : 'ore_ice';
            
            this.scene.spawnLoot(this.x, this.y, type, amount);
        } else {
            console.warn('GameScene.spawnLoot is not a function!');
        }

        // 3. Objekt entfernen
        this.destroy();
    }
}
