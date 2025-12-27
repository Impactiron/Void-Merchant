import { Ship } from '../entities/Ship.js';
import { SectorManager } from '../core/SectorManager.js';
import { ProjectileManager } from '../core/ProjectileManager.js';
import { FXManager } from '../core/FXManager.js';
import { CollisionManager } from '../core/CollisionManager.js'; // Falls existiert, sonst Logik hier
import { InputManager } from '../core/InputManager.js';
import { UIScene } from './UIScene.js';
import { Loot } from '../entities/Loot.js';
import { AudioManager } from '../core/AudioManager.js';

export class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    init(data) {
        // Data Transfer from Menu or Gate Jump
        this.targetSectorId = data.targetSector || '0-0'; // Default start sector
        this.entryGateId = data.entryGate || null;        // Wo kommen wir raus?
        this.transferPlayerData = data.playerData || null; // Schiffszustand
        
        this.isJumping = false; // Flag to prevent double jumps
    }

    preload() {
        // Assets are loaded in BootScene usually, but we ensure basic placeholders here if needed
    }

    create() {
        console.log(`GameScene: Starting in Sector ${this.targetSectorId}`);

        // 1. Managers Init
        this.audioManager = new AudioManager(this);
        this.fxManager = new FXManager(this);
        this.projectileManager = new ProjectileManager(this);
        this.sectorManager = new SectorManager(this);
        this.inputManager = new InputManager(this);

        // 2. Setup World & Sector
        this.sectorManager.init(this.targetSectorId);
        this.sectorManager.spawnSectorEntities();

        // 3. Create Player
        this.createPlayer();

        // 4. Setup Collision & Physics
        this.physics.world.setBoundsCollision(true, true, true, true);
        this.setupCollisions();

        // 5. Camera Follow
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setZoom(1); // Standard Zoom

        // 6. Launch UI Scene (Parallel)
        this.scene.launch('UIScene', { 
            player: this.player,
            sectorName: this.sectorManager.currentSector.name
        });

        // 7. Input Listeners
        this.inputManager.setupControls();

        // 8. Fade In
        this.cameras.main.fadeIn(500, 0, 0, 0);

        // Music (Optional: Sector specific music later)
        // this.audioManager.playMusic('music_exploration');
    }

    update(time, delta) {
        if (this.isJumping) return;

        // Player Update
        if (this.player && this.player.active) {
            this.player.update(time, delta);
            this.inputManager.handleInput(this.player, time);
        }

        // Entities Update
        this.sectorManager.entities.enemies.forEach(enemy => enemy.update(time, delta, this.player));
        this.sectorManager.entities.asteroids.forEach(asteroid => asteroid.update(time, delta));
        this.projectileManager.update(time, delta);
    }

    createPlayer() {
        // Default spawn point (center) if no gate specified
        let spawnX = 2000;
        let spawnY = 2000;

        // If entering through a gate, find that gate's position
        if (this.entryGateId) {
            const gate = this.sectorManager.entities.gates.find(g => g.id === this.entryGateId);
            if (gate) {
                spawnX = gate.x + 100; // Offset damit man nicht IM Tor spawnt
                spawnY = gate.y + 100;
            }
        }

        // Determine Ship ID
        const shipId = this.transferPlayerData ? this.transferPlayerData.shipId : 'arg_s_fighter_elite';

        // Instantiate Ship
        this.player = new Ship(this, spawnX, spawnY, shipId, true); // true = isPlayer

        // --- APPLY TRANSFERRED DATA ---
        if (this.transferPlayerData) {
            console.log("GameScene: Restoring Player Data...", this.transferPlayerData);
            
            // 1. Stats (Health & Shield)
            if (this.transferPlayerData.stats && this.player.health) {
                // Wir nutzen setData oder setzen die Werte direkt, falls Component keine setData hat.
                // Erwartet: stats: { hullCurrent, shieldCurrent, hullMax, shieldMax }
                if (typeof this.player.health.setData === 'function') {
                    this.player.health.setData(
                        this.transferPlayerData.stats.hullCurrent,
                        this.transferPlayerData.stats.shieldCurrent
                    );
                } else {
                    // Fallback Direct Assign
                    this.player.health.currentHp = this.transferPlayerData.stats.hullCurrent;
                    this.player.health.currentShield = this.transferPlayerData.stats.shieldCurrent;
                }
            }

            // 2. Cargo
            if (this.transferPlayerData.cargo && this.player.cargo) {
                this.player.cargo.items = { ...this.transferPlayerData.cargo.items };
                console.log("GameScene: Cargo restored.", this.player.cargo.items);
            }

            // 3. Weapons
            if (this.transferPlayerData.weaponId && this.player.weaponSystem) {
                this.player.weaponSystem.setActiveWeapon(this.transferPlayerData.weaponId);
            }
        }
    }

    setupCollisions() {
        // Player vs Asteroids
        this.physics.add.collider(this.player, this.sectorManager.entities.asteroids);

        // Player vs Stations (Docking Trigger handled in Station Update or here?)
        // For now collision
        this.physics.add.collider(this.player, this.sectorManager.entities.stations);

        // Projectiles vs Enemies
        this.physics.add.overlap(this.projectileManager.projectiles, this.sectorManager.entities.enemies, (projectile, enemy) => {
            if (projectile.owner === 'player') {
                enemy.takeDamage(projectile.damage);
                projectile.destroy();
                this.fxManager.createExplosion(projectile.x, projectile.y, 0.5);
            }
        });

        // Projectiles vs Player
        this.physics.add.overlap(this.projectileManager.projectiles, this.player, (player, projectile) => {
            if (projectile.owner !== 'player') {
                player.takeDamage(projectile.damage);
                projectile.destroy();
                this.fxManager.createExplosion(projectile.x, projectile.y, 0.5);
            }
        });

        // Player vs Gates (Jump)
        this.physics.add.overlap(this.player, this.sectorManager.entities.gates, (player, gate) => {
            this.sectorManager.handleGateJump(player, gate);
        });
        
        // Player vs Loot
        // Loot needs a group or manager access. Assuming global group or manual check for now.
        // TODO: Centralize Loot Management
    }
}
