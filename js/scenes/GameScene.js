import { Player } from '../entities/Ship.js';
import { SectorManager } from '../core/SectorManager.js';
import { InputManager } from '../core/InputManager.js';
import { ProjectileManager } from '../core/ProjectileManager.js';
import { CollisionManager } from '../core/CollisionManager.js';
import { FXManager } from '../core/FXManager.js';
import { UIManager } from '../scenes/UIScene.js'; // Falls wir UI direkt ansprechen, sonst via Events

export class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    init(data) {
        this.targetSector = data.sector || 'sector_01';
    }

    preload() {
        // Assets werden normalerweise in der BootScene geladen.
        // Hier laden wir nur falls nötig spezifische Level-Assets nach.
    }

    create() {
        console.log("🚀 GameScene gestartet");

        // 1. Core Systeme initialisieren
        this.inputManager = new InputManager(this);
        this.projectileManager = new ProjectileManager(this);
        this.fxManager = new FXManager(this);
        this.sectorManager = new SectorManager(this);
        this.collisionManager = new CollisionManager(this);

        // 2. Physik-Gruppen erstellen (WICHTIG für CollisionManager)
        this.asteroids = this.physics.add.group();
        this.enemies = this.physics.add.group();
        this.stations = this.physics.add.staticGroup(); // Stationen bewegen sich meist nicht
        this.gates = this.physics.add.staticGroup();
        this.projectiles = this.physics.add.group();
        this.enemyProjectiles = this.physics.add.group();
        this.loot = this.physics.add.group();

        // 3. Spieler erstellen
        this.player = new Player(this, 0, 0);
        
        // 4. Kamera Setup
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setZoom(1);

        // 5. Sektor laden
        this.sectorManager.loadSector(this.targetSector);

        // 6. Kollisionen aktivieren (NACHDEM Gruppen erstellt wurden)
        this.collisionManager.init();

        // 7. UI Scene parallel starten
        this.scene.launch('UIScene');
    }

    update(time, delta) {
        if (this.player) {
            this.player.update(time, delta);
            this.inputManager.handleInput(this.player);
        }

        this.sectorManager.update(time, delta);
        this.projectileManager.update(time, delta);
    }
}
