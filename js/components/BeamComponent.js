// FILE: js/components/BeamComponent.js

/**
 * 📘 PROJECT: VOID MERCHANT
 * COMPONENT: BEAM WEAPON VISUALS
 * * Grafische Darstellung für Instant-Hit Beam Waffen (z.B. Kyon Emitter).
 * * Wird vom WeaponSystem genutzt.
 */

export default class BeamComponent extends Phaser.GameObjects.Graphics {
    /**
     * @param {Phaser.Scene} scene 
     */
    constructor(scene) {
        super(scene, { x: 0, y: 0 });
        this.scene = scene;
        this.scene.add.existing(this);
        this.setDepth(200); // Über Schiffe, unter UI (CONSTANTS.DEPTH.FX wäre sauberer, aber hardcoded 200 passt laut Config)
    }

    /**
     * Feuert einen Strahl ab.
     * @param {Phaser.GameObjects.Sprite} source - Das schießende Schiff
     * @param {Phaser.GameObjects.Sprite} target - Das Zielschiff
     * @param {number} damage - Schaden, der angewendet werden soll
     */
    fire(source, target, damage) {
        if (!source || !target || !source.active || !target.active) return;

        // Wir erstellen ein temporäres Grafik-Objekt für diesen spezifischen Schuss.
        // Das erlaubt mehrere gleichzeitige Beams, ohne dass .clear() alle löscht.
        const beam = this.scene.add.graphics({ x: 0, y: 0 });
        beam.setDepth(199); // Knapp unter der Component selbst

        // 1. Core Beam (Weiß, scharf)
        beam.lineStyle(2, 0xffffff, 1.0);
        beam.lineBetween(source.x, source.y, target.x, target.y);

        // 2. Outer Glow (Magenta, breit, halbtransparent)
        beam.lineStyle(6, 0xff00ff, 0.5);
        beam.lineBetween(source.x, source.y, target.x, target.y);

        // 3. Animation: Schnell ausblenden
        this.scene.tweens.add({
            targets: beam,
            alpha: 0,
            duration: 150, // Kurzes Aufblitzen
            onComplete: () => {
                beam.destroy();
            }
        });

        // 4. Schaden anwenden
        if (typeof target.takeDamage === 'function') {
            target.takeDamage(damage);
        }

        // Optional: Hit-Effekt am Ziel (Funken)
        if (this.scene.fxManager) {
            // Wir nutzen Floating Text oder eine kleine Explosion als Feedback
            // this.scene.fxManager.playExplosion(target.x, target.y, 0.2);
        }
    }
}


