// FILE: js/core/ProjectileManager.js
import { WEAPON_DB } from '../data/WeaponDB.js';

/**
 * 📘 PROJECT: VOID MERCHANT
 * MODULE: PROJECTILE MANAGER
 * * Implementiert Object Pooling für Projektile.
 * * UPDATE: Auto-Scaling und DB-Lookup für Projektile.
 */

export default class ProjectileManager {
    constructor(scene) {
        this.scene = scene;

        // Gruppe A: Spieler Schüsse (Treffen Gegner + Asteroiden)
        this.playerLasers = this.scene.physics.add.group({
            defaultKey: 'spr_proj_laser_red',
            maxSize: 100 // Erhöht für Rapid Fire
        });

        // Gruppe B: Gegner Schüsse (Treffen Spieler + Asteroiden)
        this.enemyLasers = this.scene.physics.add.group({
            defaultKey: 'spr_proj_laser_red',
            maxSize: 100
        });
    }

    /**
     * Feuert ein Projektil basierend auf der Waffen-ID ab.
     * Nutzt Datenbank-Werte für Grafik und Physik.
     * * @param {number} x - Start X
     * @param {number} y - Start Y
     * @param {number} rotation - Flugrichtung (Radiant)
     * @param {string} weaponId - ID aus der WeaponDB (z.B. 'wpn_plasma_cannon_m')
     * @param {number} damageOverride - Optional: Überschreibt DB Schaden (für Mods/Buffs). Falls null, nimm DB Wert.
     * @param {boolean} isPlayerSource - TRUE wenn vom Spieler, FALSE wenn vom Gegner
     */
    fireBullet(x, y, rotation, weaponId, damageOverride = null, isPlayerSource = true) {
        // 1. Hole die Waffendaten
        const weaponData = WEAPON_DB[weaponId];
        
        // Fallback, falls ID ungültig
        if (!weaponData) {
            console.warn(`[ProjectileManager] Unknown Weapon ID: ${weaponId}`);
            return;
        }

        // Beam Waffen feuern keine Projektile (Logik sollte im BeamComponent liegen)
        if (weaponData.type === 'BEAM') return;

        // Wähle die korrekte Gruppe
        const group = isPlayerSource ? this.playerLasers : this.enemyLasers;
        
        // Sprite Key ermitteln (Fallback auf Standard Laser Rot)
        const spriteKey = weaponData.sprite || 'spr_proj_laser_red';

        // 2. Erstelle oder hole Sprite aus dem Pool mit spezifischem Key
        // Hinweis: group.get() nutzt defaultKey, wenn kein Key übergeben wird. 
        // Wir setzen die Textur explizit danach, um sicherzugehen.
        const bullet = group.get(x, y, spriteKey);

        if (bullet) {
            bullet.setActive(true);
            bullet.setVisible(true);
            
            // Textur explizit setzen (falls Pool-Objekt vorher andere Textur hatte)
            bullet.setTexture(spriteKey);

            // 3. WENDE SKALIERUNG AN
            // Fallback auf 1.0, falls 'scale' in der DB fehlt
            const targetScale = weaponData.scale !== undefined ? weaponData.scale : 1.0;
            bullet.setScale(targetScale);

            // 4. WICHTIG: Hitbox anpassen!
            // Da sich die Texturgröße geändert hat, muss der Physics-Body neu berechnet werden.
            if (bullet.body) {
                bullet.body.updateFromGameObject();
                // Optional: Hitbox etwas kleiner machen für Fair-Play (0.8 Faktor)
                // bullet.body.setCircle(bullet.width * 0.4); 
            }

            bullet.setRotation(rotation);

            // Visuals: Farbe (Tint) anwenden
            if (weaponData.color) {
                bullet.setTint(weaponData.color);
            } else {
                bullet.clearTint();
            }

            // Stats setzen
            bullet.damage = damageOverride !== null ? damageOverride : weaponData.damage;
            bullet.isPlayerShot = isPlayerSource; // Tagging für Collision Logic

            this.scene.physics.world.enable(bullet);
            
            // Geschwindigkeit aus DB
            const speed = weaponData.speed || 1000;
            this.scene.physics.velocityFromRotation(rotation, speed, bullet.body.velocity);

            bullet.bornTime = this.scene.time.now;
            // Lebensdauer basierend auf Range und Speed berechnen (Range / Speed * 1000 ms) + Puffer
            // Oder fix 2s wie vorher, aber Range-basierend ist genauer:
            bullet.lifeSpan = (weaponData.range / speed) * 1000; 
        }
    }

    update(time, delta) {
        // Cleanup für BEIDE Gruppen
        const cleanup = (bullet) => {
            if (bullet && bullet.active) {
                if (time > bullet.bornTime + bullet.lifeSpan) {
                    this.killBullet(bullet);
                }
            }
        };

        this.playerLasers.children.iterate(cleanup);
        this.enemyLasers.children.iterate(cleanup);
    }

    killBullet(bullet) {
        bullet.setActive(false);
        bullet.setVisible(false);
        bullet.body.stop();
    }
}
