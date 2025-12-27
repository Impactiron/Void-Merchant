// FILE: js/scenes/GameScene.js

/**
 * 📘 PROJECT: VOID MERCHANT
 * SCENE: GAME SCENE (Active Sector)
 * * UPDATE Phase 2.1: Integrated SectorThreatManager & Mining Events
 * * FIX: Updated ProjectileManager Access (No more getGroup)
 * * FIX: NPC Auto-Scaling
 */

import InputManager from '../core/InputManager.js';
import Ship from '../entities/Ship.js';
import ProjectileManager from '../core/ProjectileManager.js';
import FXManager from '../core/FXManager.js';
import Loot from '../entities/Loot.js';
import SaveSystem from '../core/SaveSystem.js';
import AudioManager from '../core/AudioManager.js';
import MissionManager from '../core/MissionManager.js';
import SectorManager from '../core/SectorManager.js';
import SectorThreatManager from '../core/SectorThreatManager.js'; 
import { CONFIG } from '../core/config.js';
import StationMenu from '../ui/StationMenu.js';
import { enforceSpriteSize } from '../core/SpriteHelper.js'; // NEU für Konsistenz

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.npcMap = new Map();
    }

    init(data) {
        this.currentSectorId = data.targetSector || 'sec_argon_prime';
        this.entryGateId = data.entryGate || null;
        this.transferPlayerData = data.playerData || null;
        this.npcMap.clear();
    }

    preload() {
        if (!this.textures.exists('spr_npc_trader')) {
            const gr = this.make.graphics({ x: 0, y: 0, add: false });
            gr.fillStyle(0xffcc00, 1);
            gr.fillRect(0, 0, 24, 24);
            gr.generateTexture('spr_npc_trader', 24, 24);
        }
        // Fallback texture for Kha'ak if not present
        if (!this.textures.exists('khk_s_fighter_queen_guard')) {
             const gr = this.make.graphics({ x: 0, y: 0, add: false });
             gr.fillStyle(0xff00ff, 1); // Purple
             gr.fillTriangle(0, 0, 20, 10, 0, 20); // Spike shape
             gr.generateTexture('khk_s_fighter_queen_guard', 20, 20);
        }
    }

    create() {
        console.log("GameScene: Active.");

        // --- MANAGERS ---
        this.sectorManager = new SectorManager(this);
        this.audioManager = new AudioManager(this);
        this.projectileManager = new ProjectileManager(this);
        this.fxManager = new FXManager(this);
        this.saveSystem = new SaveSystem();
        this.inputManager = new InputManager(this);
        this.stationMenu = new StationMenu(this);
        
        // Threat Manager (Hive Mind)
        this.threatManager = new SectorThreatManager(this);

        if (!window.game.missionManager) {
            window.game.missionManager = new MissionManager(this);
        }
        this.missionManager = window.game.missionManager;

        // --- GROUPS ---
        this.asteroids = this.add.group({ runChildUpdate: false });
        this.lootGroup = this.add.group({ runChildUpdate: true });
        this.enemies = this.add.group({ runChildUpdate: true });
        this.gates = this.add.group({ runChildUpdate: false });
        this.stations = this.add.group({ runChildUpdate: false });

        // --- LOAD SECTOR ---
        this.sectorManager.loadSector(this.currentSectorId);

        // --- PLAYER SETUP ---
        this.createPlayer();

        // --- CAMERA ---
        this.cameras.main.startFollow(this.player, true, 0.09, 0.09);
        this.cameras.main.setZoom(1.0);

        // --- UI LAUNCH ---
        this.scene.launch('UIScene');

        // --- STATE FLAGS ---
        this.isDocked = false;
        this.isJumping = false;
        this.isGameOver = false;

        // --- NPC SYNC ---
        this.time.addEvent({
            delay: 100,
            callback: this.syncNPCs,
            callbackScope: this,
            loop: true
        });

        // --- COLLISIONS ---
        this.setupCollisions();
    }

    createPlayer() {
        let spawnX = 0;
        let spawnY = 0;

        if (this.entryGateId) {
            const gate = this.gates.getChildren().find(g => g.id === this.entryGateId);
            if (gate) {
                spawnX = gate.x;
                spawnY = gate.y + 300;
            }
        }

        let dbId = 'arg_s_fighter_elite';
        
        // Load Logic...
        let savedData = null;
        if (!this.transferPlayerData) {
            savedData = this.saveSystem.load();
            if (savedData && savedData.player && savedData.player.currentShipId) {
                dbId = savedData.player.currentShipId;
            }
        } else if (this.transferPlayerData.shipId) {
            dbId = this.transferPlayerData.shipId;
        }

        this.player = new Ship(this, spawnX, spawnY, dbId, this.projectileManager);
        this.player.id = 'player';
        this.player.faction = 'PLAYER';

        // RESTORE STATE
        if (this.transferPlayerData) {
            this.player.health.setData(this.transferPlayerData.stats.hullCurrent, this.transferPlayerData.stats.shieldCurrent);
            this.player.cargo.items = this.transferPlayerData.cargo.items || {};
            if (this.transferPlayerData.weaponId) this.player.weaponSystem.equip(this.transferPlayerData.weaponId);
        } else if (savedData) {
            this.player.credits = savedData.player.credits;
            
            if (savedData.player.hullCurrent !== undefined) {
                this.player.health.setData(savedData.player.hullCurrent, savedData.player.shieldCurrent);
            }
            if (savedData.player.cargo) this.player.cargo.items = savedData.player.cargo;
            if (savedData.ship && savedData.ship.activeWeaponId) this.player.weaponSystem.equip(savedData.ship.activeWeaponId);
            if (savedData.missions) this.missionManager.importMissions(savedData.missions);
        }
    }

    setupCollisions() {
        // Static Collisions
        this.physics.add.collider(this.player, this.asteroids);
        this.physics.add.collider(this.player, this.stations);
        this.physics.add.collider(this.asteroids, this.asteroids);
        this.physics.add.collider(this.enemies, this.asteroids);
        this.physics.add.collider(this.enemies, this.enemies);
        this.physics.add.collider(this.player, this.enemies);

        // Projectile Collisions (Direct Property Access Fix)
        if (this.projectileManager) {
            // Player Lasers
            if (this.projectileManager.playerLasers) {
                this.physics.add.overlap(this.projectileManager.playerLasers, this.enemies, this.handleLaserHitEnemy, null, this);
                this.physics.add.overlap(this.projectileManager.playerLasers, this.asteroids, this.handleLaserHitAsteroid, null, this);
                this.physics.add.overlap(this.projectileManager.playerLasers, this.stations, (st, l) => this.projectileManager.killBullet(l));
            }
            // Enemy Lasers
            if (this.projectileManager.enemyLasers) {
                this.physics.add.overlap(this.projectileManager.enemyLasers, this.player, this.handleLaserHitPlayer, null, this);
                this.physics.add.overlap(this.projectileManager.enemyLasers, this.asteroids, this.handleLaserHitAsteroid, null, this);
                this.physics.add.overlap(this.projectileManager.enemyLasers, this.stations, (st, l) => this.projectileManager.killBullet(l));
            }
        }

        // Loot
        this.physics.add.overlap(this.player, this.lootGroup, this.handleLootCollection, null, this);
    }

    update(time, delta) {
        this.inputManager.update();
        this.updateNPCSprites();

        if (this.isGameOver) {
            if (this.inputManager.getFire()) window.location.reload();
            return;
        }

        // Threat Logic
        if (this.threatManager) this.threatManager.update(time, delta);

        if (this.isDocked || this.isJumping) return;

        // UI Toggles
        if (this.inputManager.getMapToggle()) {
            this.audioManager.playSfx('sfx_ui_select');
            this.scene.pause('GameScene');
            this.scene.pause('UIScene');
            this.scene.launch('MapScene');
            return;
        }

        if (this.inputManager.getBuildToggle()) {
            this.audioManager.playSfx('sfx_ui_select');
            this.scene.pause('GameScene');
            this.scene.pause('UIScene');
            this.scene.launch('BuilderScene');
            return;
        }

        // Updates
        if (this.projectileManager) this.projectileManager.update(time, delta);
        if (this.player && this.player.active) this.player.update(this.inputManager, time, delta);

        this.sectorManager.handlePopulation(time);

        // Gate Proximity
        this.gates.children.iterate(gate => {
            if (gate.active && !this.isJumping) {
                const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, gate.x, gate.y);
                if (dist < 100) {
                    this.sectorManager.handleGateJump(this.player, gate);
                }
            }
        });

        this.handleDockingProximity();

        this.bg.tilePositionX = this.cameras.main.scrollX * 0.5;
        this.bg.tilePositionY = this.cameras.main.scrollY * 0.5;
    }

    updateNPCSprites() {
        this.npcMap.forEach((sprite, id) => {
            if (sprite.targetX !== undefined && sprite.targetY !== undefined) {
                sprite.x = Phaser.Math.Linear(sprite.x, sprite.targetX, 0.05);
                sprite.y = Phaser.Math.Linear(sprite.y, sprite.targetY, 0.05);
                // Rotate visual if needed
                if (sprite.targetX !== sprite.x) {
                    sprite.rotation = Phaser.Math.Angle.Between(sprite.x, sprite.y, sprite.targetX, sprite.targetY);
                }
            }
        });
    }

    handleDockingProximity() {
        let nearestStation = null;
        let minDist = Infinity;
        this.stations.children.iterate(station => {
            const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, station.x, station.y);
            if (dist < minDist) {
                minDist = dist;
                nearestStation = station;
            }
        });

        const uiScene = this.scene.get('UIScene');
        if (nearestStation && minDist < nearestStation.dockingRange) {
            this.currentStation = nearestStation;
            if (uiScene && uiScene.setDockingAvailable) {
                uiScene.setDockingAvailable(true, nearestStation.name);
            }
            if (this.inputManager.getInteract()) {
                this.audioManager.playSfx('sfx_ui_select');
                this.openStationMenu();
            }
        } else {
            this.currentStation = null;
            if (uiScene && uiScene.setDockingAvailable) {
                uiScene.setDockingAvailable(false);
            }
        }
    }

    syncNPCs() {
        if (!window.game || !window.game.universe) return;
        const agentsInSector = window.game.universe.getAgentsInSector(this.currentSectorId);
        const currentFrameIds = new Set();
        agentsInSector.forEach(agent => {
            currentFrameIds.add(agent.id);
            if (this.npcMap.has(agent.id)) {
                const sprite = this.npcMap.get(agent.id);
                sprite.targetX = agent.x;
                sprite.targetY = agent.y;
            } else {
                this.spawnNPC(agent);
            }
        });
        this.npcMap.forEach((sprite, id) => {
            if (!currentFrameIds.has(id)) this.despawnNPC(id);
        });
    }

    spawnNPC(agent) {
        // Fallback or specific texture logic
        let texture = 'spr_npc_trader';
        if (agent.id.includes('khk') || (agent.faction && agent.faction === 'KHAAK')) {
            texture = 'khk_s_fighter_queen_guard';
        }

        const sprite = this.add.sprite(agent.x, agent.y, texture);
        
        // FIX: Nutze globalen Scaler statt Hardcoded Werte
        enforceSpriteSize(sprite, 64); // Traders/NPCs als M-Class Standard
        
        sprite.targetX = agent.x;
        sprite.targetY = agent.y;
        this.npcMap.set(agent.id, sprite);
    }

    despawnNPC(id) {
        const sprite = this.npcMap.get(id);
        if (sprite) {
            sprite.destroy();
            this.npcMap.delete(id);
        }
    }

    handleLaserHitEnemy(laser, enemy) {
        if (!laser.active || !enemy.active) return;
        const dmg = laser.damage || 10;
        this.fxManager.showFloatingText(enemy.x, enemy.y - 20, Math.floor(dmg), '#ffaa00');
        this.audioManager.playSfx('sfx_impact_hull', { volume: 0.3 });
        
        if (typeof enemy.takeDamage === 'function') {
            enemy.takeDamage(dmg);
        } else {
            enemy.destroy();
        }
        this.projectileManager.killBullet(laser);
    }

    handleLaserHitPlayer(player, laser) {
        if (!laser.active || !player.active || this.isGameOver) return;
        
        const dmg = laser.damage || 10;
        this.fxManager.showFloatingText(player.x, player.y - 20, Math.floor(dmg), '#ff3333');
        this.audioManager.playSfx('sfx_impact_hull');

        const uiScene = this.scene.get('UIScene');
        if (uiScene && uiScene.triggerDamageFlash) uiScene.triggerDamageFlash();

        player.takeDamage(dmg);
        this.projectileManager.killBullet(laser);

        if (player.health.isDead) this.handlePlayerDeath();
    }

    handlePlayerDeath() {
        this.isGameOver = true;
        this.fxManager.playExplosion(this.player.x, this.player.y, 2.0);
        this.player.setActive(false);
        this.player.setVisible(false);
        this.player.body.stop();
        // UI Scene handles 'entity-died' event
    }

    handleLaserHitAsteroid(obj1, obj2) {
        let laser = (obj1.texture && obj1.texture.key.includes('laser')) ? obj1 : obj2;
        let asteroid = (obj1 === laser) ? obj2 : obj1;
        if (!laser || !asteroid || !laser.active || !asteroid.active) return;
        const dmg = laser.damage || 10;
        this.fxManager.showFloatingText(asteroid.x, asteroid.y, Math.floor(dmg), '#aaaaaa');
        this.audioManager.playSfx('sfx_impact_hull', { volume: 0.2 });
        if (typeof asteroid.takeDamage === 'function') asteroid.takeDamage(dmg);
        this.projectileManager.killBullet(laser);
    }

    handleLootCollection(player, lootItem) {
        if (!lootItem.active) return;
        this.audioManager.playSfx('sfx_ui_select', { volume: 0.5 });
        
        const success = player.cargo.add(lootItem.wareId, lootItem.amount);
        
        const uiScene = this.scene.get('UIScene');
        if (success) {
            if (uiScene && uiScene.showLootNotification) {
                uiScene.showLootNotification(lootItem.wareId.toUpperCase(), lootItem.amount);
            }
            lootItem.destroy();
        } else {
            if (uiScene && uiScene.showLootNotification) {
                uiScene.showLootNotification('CARGO FULL', '0');
            }
        }
    }

    saveGameData() {
        if (!this.player || this.isGameOver) return;
        const shipData = { activeWeaponId: this.player.weaponSystem.activeWeaponId };
        
        const extendedPlayerData = {
            credits: this.player.credits,
            cargo: this.player.cargo.items,
            currentShipId: 'arg_s_fighter_elite', 
            hullCurrent: this.player.health.currentHp,
            shieldCurrent: this.player.health.currentShield,
            hullMax: this.player.health.maxHp, 
            shieldMax: this.player.health.maxShield
        };
        const missionData = this.missionManager ? this.missionManager.exportMissions() : [];
        this.saveSystem.save(extendedPlayerData, shipData, missionData);
    }

    openStationMenu() {
        if (!this.currentStation) return;
        this.isDocked = true;
        this.player.body.stop();
        this.player.body.setImmovable(true);
        this.stationMenu.open(this.currentStation);
    }

    handleUndock() {
        this.isDocked = false;
        this.player.body.setImmovable(false);
        const angle = Phaser.Math.Angle.Between(this.currentStation.x, this.currentStation.y, this.player.x, this.player.y);
        this.physics.velocityFromRotation(angle, 200, this.player.body.velocity);
    }

    spawnLoot(x, y, wareId, amount) {
        const loot = new Loot(this, x, y, wareId, amount);
        this.lootGroup.add(loot);
        const angle = Phaser.Math.Between(0, 360);
        const speed = Phaser.Math.Between(50, 150);
        this.physics.velocityFromAngle(angle, speed, loot.body.velocity);

        // Global Event for Threat Manager
        if (this.events) {
            this.events.emit('mining-complete', { sector: this.currentSectorId, amount: amount });
        }
    }
}
