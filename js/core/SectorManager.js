// FILE: js/core/SectorManager.js

/**
 * 📘 PROJECT: VOID MERCHANT
 * MODULE: SECTOR MANAGER
 * * Kapselt die Logik zum Laden und Verwalten von Sektoren.
 * * Entlastet die GameScene.
 */

import { SECTOR_DB } from '../data/SectorDB.js';
import Asteroid from '../entities/Asteroid.js'; // <-- KORRIGIERT: Default Import (keine { })
import EnemyShip from '../entities/EnemyShip.js';
import Station from '../entities/Station.js';
import Gate from '../entities/Gate.js';
import { CONFIG } from './config.js';

export default class SectorManager {
    constructor(scene) {
        this.scene = scene;
        
        // Spawn Timer initialisieren
        this.lastEnemySpawn = 0;
        this.enemySpawnDelay = 10000; // 10 Sekunden
        this.lastAsteroidSpawn = 0;
        this.asteroidSpawnDelay = 5000; // 5 Sekunden
    }

    /**
     * Lädt einen Sektor komplett neu.
     * @param {string} sectorId - Die ID des zu ladenden Sektors
     */
    loadSector(sectorId) {
        console.log(`SectorManager: Loading ${sectorId}...`);

        // 1. Daten aus der Datenbank holen
        this.sectorData = SECTOR_DB[sectorId];
        if (!this.sectorData) {
            console.warn(`SectorManager: Sector ${sectorId} not found! Fallback to Argon Prime.`);
            this.sectorData = SECTOR_DB['sec_argon_prime'];
        }

        // 2. Alte Gruppen bereinigen (falls vorhanden)
        this.clearGroups();

        // 3. Umgebung (Hintergrund, Weltgrenzen, Musik) setzen
        this.setupEnvironment();

        // 4. Statische Entities (Stationen, Tore) spawnen
        this.spawnStaticEntities();

        // 5. Initiale dynamische Population (Asteroiden, Gegner)
        this.spawnAsteroids(20 * (this.sectorData.asteroids?.density || 1));
        
        const enemyDensity = this.sectorData.enemies?.density || 0.5;
        this.spawnEnemies(Math.floor(3 * enemyDensity));

        // 6. UI Update (via Scene Access)
        const uiScene = this.scene.scene.get('UIScene');
        if (uiScene && uiScene.txtSector) {
            uiScene.txtSector.setText(`SEC: ${this.sectorData.name.toUpperCase()}`);
        }
    }

    /**
     * Entfernt alle Objekte aus dem vorherigen Sektor.
     */
    clearGroups() {
        if (this.scene.asteroids) this.scene.asteroids.clear(true, true);
        if (this.scene.enemies) this.scene.enemies.clear(true, true);
        if (this.scene.gates) this.scene.gates.clear(true, true);
        if (this.scene.stations) this.scene.stations.clear(true, true);
        if (this.scene.lootGroup) this.scene.lootGroup.clear(true, true);
    }

    /**
     * Richtet Hintergrund, Musik und Physik-Grenzen ein.
     */
    setupEnvironment() {
        // World Bounds (Grenzen der Physik-Welt)
        this.scene.physics.world.setBounds(-4000, -4000, 8000, 8000);

        // Hintergrund
        const bgKey = this.scene.textures.exists(this.sectorData.background) ? this.sectorData.background : 'bg_stars_01';
        if (this.scene.bg) {
            this.scene.bg.setTexture(bgKey);
        } else {
            this.scene.bg = this.scene.add.tileSprite(0, 0, CONFIG.width, CONFIG.height, bgKey)
                .setOrigin(0)
                .setScrollFactor(0);
        }

        // Musik
        const musicKey = this.sectorData.music || 'mus_ambience_deep_space';
        if (this.scene.audioManager) {
            this.scene.audioManager.playMusic(musicKey, 2000);
        }
    }

    /**
     * Erstellt Stationen und Sprungtore basierend auf den Sektordaten.
     */
    spawnStaticEntities() {
        // Stationen
        if (this.sectorData.stations) {
            this.sectorData.stations.forEach(stData => {
                const station = new Station(this.scene, stData.x, stData.y, stData.type, stData.name);
                this.scene.stations.add(station);
            });
        }

        // Tore (Gates)
        if (this.sectorData.gates) {
            this.sectorData.gates.forEach(gData => {
                const gate = new Gate(this.scene, gData.x, gData.y, gData.id, gData.targetSector, gData.targetGateId);
                this.scene.gates.add(gate);
            });
        }
    }

    /**
     * Verwaltet das Nachspawnen von Asteroiden und Gegnern (wird im Update-Loop aufgerufen).
     * @param {number} time - Aktuelle Zeit
     */
    handlePopulation(time) {
        const density = this.sectorData.asteroids?.density || 1.0;
        const enemyDensity = this.sectorData.enemies?.density || 0.5;

        // Asteroiden Respawn
        if (time > this.lastAsteroidSpawn + this.asteroidSpawnDelay) {
            const currentAsteroids = this.scene.asteroids.countActive();
            if (currentAsteroids < 15 * density) {
                this.spawnAsteroids(3);
            }
            this.lastAsteroidSpawn = time;
        }

        // Gegner Respawn
        if (time > this.lastEnemySpawn + this.enemySpawnDelay) {
            const currentEnemies = this.scene.enemies.countActive();
            if (currentEnemies < 2 * enemyDensity) {
                if (enemyDensity > 0) {
                    this.spawnEnemies(1);
                }
            }
            this.lastEnemySpawn = time;
        }
    }

    /**
     * Spawnt eine bestimmte Anzahl Asteroiden an sicheren Positionen.
     * @param {number} count 
     */
    spawnAsteroids(count) {
        for (let i = 0; i < count; i++) {
            let x, y;
            let safe = false;
            let attempts = 0;
            
            // Versuche eine Position zu finden, die nicht zu nah am Spieler oder Stationen ist
            while(!safe && attempts < 10) {
                x = Phaser.Math.Between(-3500, 3500);
                y = Phaser.Math.Between(-3500, 3500);
                
                let tooClose = false;
                if (this.scene.player) {
                    if (Phaser.Math.Distance.Between(x, y, this.scene.player.x, this.scene.player.y) < 500) tooClose = true;
                }
                
                this.scene.stations.children.iterate(st => {
                    if (Phaser.Math.Distance.Between(x, y, st.x, st.y) < 800) tooClose = true;
                });
                
                if (!tooClose) safe = true;
                attempts++;
            }
            
            const sizes = ['small', 'medium', 'large'];
            const size = sizes[Phaser.Math.Between(0, 2)];
            const asteroid = new Asteroid(this.scene, x, y, size);
            this.scene.asteroids.add(asteroid);
        }
    }

    /**
     * Spawnt Gegner in einiger Entfernung zum Spieler.
     * @param {number} count 
     */
    spawnEnemies(count) {
        if (!this.sectorData.enemies || this.sectorData.enemies.density <= 0) return;
        if (!this.scene.player) return;

        for(let i=0; i<count; i++) {
            let x, y;
            let safe = false;
            let attempts = 0;
            
            // Spawn nicht direkt auf dem Spieler, aber auch nicht zu weit weg
            while(!safe && attempts < 10) {
                x = Phaser.Math.Between(-3500, 3500);
                y = Phaser.Math.Between(-3500, 3500);
                
                const distPlayer = Phaser.Math.Distance.Between(x, y, this.scene.player.x, this.scene.player.y);
                if (distPlayer > 1500 && distPlayer < 3000) safe = true;
                attempts++;
            }
            
            // Einfacher Gegner-Typ Selector (hier fest 'spr_ship_xenon_n')
            const type = 'spr_ship_xenon_n'; 
            const enemy = new EnemyShip(this.scene, x, y, type, this.scene.player, this.scene.projectileManager);
            this.scene.enemies.add(enemy);
        }
    }

    /**
     * Logik für den Sektorsprung durch ein Tor.
     * @param {Phaser.GameObjects.Sprite} player 
     * @param {Gate} gate 
     */
    handleGateJump(player, gate) {
        if (this.scene.isJumping) return;
        
        this.scene.isJumping = true;
        this.scene.audioManager.playSfx('sfx_ui_select');

        console.log(`SectorManager: Jumping to ${gate.targetSector}...`);

        // Fade Out Effekt
        this.scene.cameras.main.fade(1000, 0, 0, 0);
        player.body.stop();

        // Persistenz: Daten für den nächsten Sektor speichern
        const playerData = {
            shipId: player.id,
            stats: player.stats,
            cargo: player.cargo,
            weaponId: player.weaponSystem.activeWeaponId
        };

        // Neustart der Szene mit neuen Parametern nach kurzer Verzögerung
        this.scene.time.delayedCall(1000, () => {
            this.scene.scene.restart({
                targetSector: gate.targetSector,
                entryGate: gate.targetGateId,
                playerData: playerData
            });
        });
    }
}
