// FILE: js/core/FXManager.js

/**
 * 📘 PROJECT: VOID MERCHANT
 * MODULE: FX MANAGER
 * * Verwaltet visuelle Effekte.
 * * UPDATE: Added Audio to Explosions.
 */

export default class FXManager {
    constructor(scene) {
        this.scene = scene;

        // --- EXPLOSION POOL (SPRITES) ---
        this.explosions = this.scene.add.group({
            defaultKey: 'spr_fx_explosion',
            maxSize: 20
        });

        // --- FLOATING TEXT POOL ---
        this.textPool = this.scene.add.group({
            classType: Phaser.GameObjects.Text,
            maxSize: 50,
            runChildUpdate: false
        });
    }

    /**
     * Spielt einen Explosions-Effekt an der Position ab.
     */
    playExplosion(x, y, relativeScale = 1.0) {
        const explosion = this.explosions.get(x, y);

        if (!explosion) return;

        explosion.setActive(true);
        explosion.setVisible(true);
        explosion.setDepth(30); // CONSTANTS.DEPTH.FX

        // Audio Trigger
        if (this.scene.audioManager) {
            // Lautstärke basierend auf Skalierung und Distanz (einfach)
            const vol = Math.min(0.6, 0.2 * relativeScale);
            this.scene.audioManager.playSfx('sfx_explosion', { volume: vol });
        }

        // Auto-Scaling Fix
        const frameWidth = explosion.width;
        const safeWidth = frameWidth || 64;
        const targetBaseSize = 64;
        const textureScaleFactor = targetBaseSize / safeWidth;
        const finalScale = textureScaleFactor * relativeScale;

        explosion.setScale(finalScale);

        if (this.scene.anims.exists('anim_explosion')) {
            explosion.play('anim_explosion');
            explosion.once('animationcomplete', () => {
                this.returnToPool(explosion);
            });
        } else {
            // Fallback
            this.scene.tweens.add({
                targets: explosion,
                alpha: { from: 1, to: 0 },
                scale: { from: finalScale, to: finalScale * 1.5 },
                duration: 500,
                onComplete: () => {
                    explosion.setAlpha(1);
                    this.returnToPool(explosion);
                }
            });
        }

        // Screen Shake bei großen Explosionen
        if (relativeScale > 1.5) {
            this.scene.cameras.main.shake(100, 0.005);
        }
    }

    /**
     * Zeigt eine aufsteigende Schadenszahl an.
     * @param {number} x - World X
     * @param {number} y - World Y
     * @param {string|number} text - Der Text (z.B. damage amount)
     * @param {string} color - Hex String (z.B. '#ff0000')
     */
    showFloatingText(x, y, text, color = '#ffffff') {
        const floatingText = this.textPool.get(x, y);

        if (!floatingText) return;

        floatingText.setActive(true);
        floatingText.setVisible(true);
        floatingText.setText(text);
        floatingText.setStyle({
            font: '16px "Segoe UI", monospace',
            fill: color,
            stroke: '#000000',
            strokeThickness: 2,
            fontStyle: 'bold'
        });
        floatingText.setOrigin(0.5);
        floatingText.setDepth(100); // Über allem anderen im World Space

        // Reset Properties (falls wiederverwendet)
        floatingText.setAlpha(1);
        floatingText.y = y;

        // Tween: Nach oben schweben und ausfaden
        this.scene.tweens.add({
            targets: floatingText,
            y: y - 50,
            alpha: 0,
            duration: 1000,
            ease: 'Power1',
            onComplete: () => {
                floatingText.setActive(false);
                floatingText.setVisible(false);
            }
        });
    }

    returnToPool(entity) {
        entity.setActive(false);
        entity.setVisible(false);
    }
}


