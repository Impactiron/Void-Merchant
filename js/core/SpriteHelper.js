// FILE: js/core/SpriteHelper.js

/**
 * 📘 PROJECT: VOID MERCHANT
 * MODULE: SPRITE HELPER
 * * Hilfsfunktionen für visuelle Konsistenz.
 */

import { GAME_CONFIG } from './config.js';

/**
 * Zwingt ein Game Object auf die definierte Standardgröße.
 * Passt sowohl die visuelle Darstellung (setDisplaySize) als auch den Physics-Body an.
 * * @param {Phaser.GameObjects.Sprite | Phaser.GameObjects.Image} gameObject - Das zu skalierende Objekt.
 * @param {number} [overrideSize] - Optional: Eine spezifische Größe, falls abweichend vom Standard.
 * @param {boolean} [isCircle] - Optional: Ob der Physics-Body ein Kreis sein soll (Default: false/Box).
 */
export function enforceSpriteSize(gameObject, overrideSize = null, isCircle = false) {
    const targetSize = overrideSize || GAME_CONFIG.SPRITE_SIZE;
    
    // 1. Visuelle Skalierung
    // setDisplaySize berechnet scaleX/scaleY automatisch, um die Zielpixel zu erreichen.
    if (gameObject && gameObject.setDisplaySize) {
        gameObject.setDisplaySize(targetSize, targetSize);
    }

    // 2. Physics Body Anpassung
    // WICHTIG: setDisplaySize ändert NICHT die Body-Größe bei Arcade Physics, 
    // das muss manuell geschehen, um Ghost-Hits zu vermeiden.
    if (gameObject.body) {
        if (isCircle) {
            // Radius ist halbe Breite. Offset sorgt für Zentrierung.
            const radius = targetSize / 2;
            gameObject.body.setCircle(radius);
            
            // Bei setCircle müssen wir den Offset oft korrigieren, da Phaser den Circle
            // standardmäßig oben links ansetzt relative zum Frame.
            // Da wir skalieren, ist es oft sicherer, den Radius relativ zur Textur zu setzen
            // oder einfach sicherzustellen, dass der Anchor (Origin) stimmt.
            // Für diesen simplen Helper verlassen wir uns auf Phasers Center-Handling bei setCircle
            // wenn wir keine Argumente für x/y übergeben, aber da wir skalieren:
            
            // Einfacher Fix für Arcade Physics nach Scaling:
            // Wir nutzen setCircle mit dem Radius, Phaser berechnet den Offset basierend auf der Texturgröße.
            // Da setDisplaySize genutzt wurde, müssen wir aufpassen.
            
            // Um Probleme zu vermeiden, setzen wir den Circle basierend auf der visuellen Größe:
            gameObject.body.setCircle(gameObject.displayWidth / 2);
            
        } else {
            // Standard Box Body
            gameObject.body.setSize(targetSize, targetSize);
            // Zentrierung sicherstellen (Falls Textur viel größer war)
            // Wir setzen den Offset auf 0,0, da setSize relativ zur skalierten Ansicht arbeiten sollte,
            // aber in Phaser Arcade ist setSize oft in Textur-Pixeln.
            // Workaround für Robustheit:
            // Wenn wir setDisplaySize nutzen, ändert sich `scale`. 
            // body.setSize(width, height) setzt die Größe der Hitbox.
            gameObject.body.setSize(targetSize, targetSize);
        }
    }
}
