// FILE: js/core/ProjectileManager.js

/**
 * 📘 PROJECT: VOID MERCHANT
 * MODULE: PROJECTILE MANAGER
 * * Implementiert Object Pooling für Projektile.
 * * UPDATE: Getrennte Gruppen für Player und Enemy Projectiles (Friendly Fire Logic).
 */

export default class ProjectileManager {
    constructor(scene) {
        this.scene = scene;

        // Gruppe A: Spieler Schüsse (Treffen Gegner + Asteroiden)
        this.playerLasers = this.scene.physics.add.group({
            defaultKey: 'spr_proj_laser_red',
            maxSize: 50
        });

        // Gruppe B: Gegner Schüsse (Treffen Spieler + Asteroiden)
        this.enemyLasers = this.scene.physics.add.group({
            defaultKey: 'spr_proj_laser_red',
            maxSize: 50
        });
    }

    /**
     * Feuert ein Projektil ab.
     * @param {number} x 
     * @param {number} y 
     * @param {number} rotation 
     * @param {number} speed 
     * @param {number} damage 
     * @param {number} color 
     * @param {boolean} isPlayerSource - TRUE wenn vom Spieler, FALSE wenn vom Gegner
     */
    fireBullet(x, y, rotation, speed, damage, color, isPlayerSource = true) {
        // Wähle die korrekte Gruppe
        const group = isPlayerSource ? this.playerLasers : this.enemyLasers;
        
        const bullet = group.get(x, y);

        if (bullet) {
            bullet.setActive(true);
            bullet.setVisible(true);
            bullet.setRotation(rotation);

            // Visuals
            if (color) {
                bullet.setTint(color);
            } else {
                bullet.clearTint();
            }

            bullet.damage = damage;
            bullet.isPlayerShot = isPlayerSource; // Tagging für Logik

            this.scene.physics.world.enable(bullet);
            this.scene.physics.velocityFromRotation(rotation, speed, bullet.body.velocity);

            bullet.bornTime = this.scene.time.now;
            bullet.lifeSpan = 2000; 
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


