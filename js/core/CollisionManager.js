import { config } from './config.js';

export class CollisionManager {
    /**
     * @param {Phaser.Scene} scene 
     */
    constructor(scene) {
        this.scene = scene;
    }

    /**
     * Initialisiert alle Kollisions-Listener für die aktive Szene
     */
    init() {
        console.log("🛡️ CollisionManager: Initialisiere Physik-System...");

        // Referenzen auf Gruppen aus der Scene holen (sofern vorhanden)
        const player = this.scene.player;
        const enemies = this.scene.enemies;
        const asteroids = this.scene.asteroids;
        const projectiles = this.scene.projectiles;
        const enemyProjectiles = this.scene.enemyProjectiles;
        const loot = this.scene.loot;

        // 1. Spieler vs. Asteroiden (Kollision)
        if (player && asteroids) {
            this.scene.physics.add.collider(player, asteroids, this.handlePlayerAsteroidCollision, null, this);
        }

        // 2. Spieler vs. Feinde (Kollision)
        if (player && enemies) {
            this.scene.physics.add.collider(player, enemies, this.handlePlayerEnemyCollision, null, this);
        }

        // 3. Projektile (Spieler) vs. Feinde
        if (projectiles && enemies) {
            this.scene.physics.add.overlap(projectiles, enemies, this.handleProjectileEnemyHit, null, this);
        }

        // 4. Projektile (Spieler) vs. Asteroiden
        if (projectiles && asteroids) {
            this.scene.physics.add.overlap(projectiles, asteroids, this.handleProjectileAsteroidHit, null, this);
        }

        // 5. Projektile (Feind) vs. Spieler
        if (enemyProjectiles && player) {
            this.scene.physics.add.overlap(enemyProjectiles, player, this.handleEnemyProjectilePlayerHit, null, this);
        }

        // 6. Spieler vs. Loot
        if (player && loot) {
            this.scene.physics.add.overlap(player, loot, this.handlePlayerLootCollection, null, this);
        }
    }

    // --- HANDLER ---

    handlePlayerAsteroidCollision(player, asteroid) {
        // Leichter Schaden durch Aufprall
        // TODO: Schild-Logik hier einfügen
        console.log("💥 Aufprall: Asteroid");
        const impactDmg = 10;
        if (player.components.health) {
            player.components.health.takeDamage(impactDmg);
        }
        
        // Physik-Bounce ist automatisch durch Collider aktiv
    }

    handlePlayerEnemyCollision(player, enemy) {
        console.log("💥 Aufprall: Feindschiff");
        const ramDmg = 20;
        
        if (player.components.health) player.components.health.takeDamage(ramDmg);
        if (enemy.components.health) enemy.components.health.takeDamage(ramDmg);
    }

    handleProjectileEnemyHit(projectile, enemy) {
        // Projektil zerstören
        projectile.destroy();

        // Schaden am Feind
        if (enemy.components.health) {
            enemy.components.health.takeDamage(projectile.damage || 10);
        }

        // Visuelles Feedback
        this.createExplosion(enemy.x, enemy.y, 'small');
    }

    handleProjectileAsteroidHit(projectile, asteroid) {
        projectile.destroy();
        
        if (asteroid.components.health) {
            asteroid.components.health.takeDamage(projectile.damage || 10);
        }

        this.createExplosion(asteroid.x, asteroid.y, 'dust');
    }

    handleEnemyProjectilePlayerHit(player, projectile) {
        projectile.destroy();

        if (player.components.health) {
            player.components.health.takeDamage(projectile.damage || 5);
        }

        this.scene.cameras.main.shake(100, 0.005);
    }

    handlePlayerLootCollection(player, lootItem) {
        // Loot einsammeln Logik
        console.log(`💰 Loot eingesammelt: ${lootItem.type}`);
        
        // TODO: Zum Inventar hinzufügen
        // player.components.cargo.add(lootItem.type, lootItem.amount);

        // Zerstören/Despawnen
        lootItem.destroy();
    }

    createExplosion(x, y, type) {
        // Platzhalter für FXManager Aufruf
        // this.scene.fxManager.playExplosion(x, y, type);
    }
}
