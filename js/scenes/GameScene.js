import { PlayerShip } from '../entities/Ship.js';
import { SectorManager } from '../core/SectorManager.js';
import { UniverseSim } from '../core/UniverseSim.js';
import { SectorThreatManager } from '../core/SectorThreatManager.js';
import { ProjectileManager } from '../core/ProjectileManager.js';
import { FXManager } from '../core/FXManager.js';
import { AudioManager } from '../core/AudioManager.js';
import { EventsCenter } from '../core/EventsCenter.js';
import { InputManager } from '../core/InputManager.js';
import { Loot } from '../entities/Loot.js';

export class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    init(data) {
        // Daten vom vorherigen Sektor oder Boot
        this.targetSector = data.targetSector || 'sec_01';
        this.entryGateId = data.entryGate; 
        this.transferPlayerData = data.playerData || null;
        
        this.isJumping = false;
        console.log("GameScene Init:", this.targetSector, this.transferPlayerData);
    }

    create() {
        // 1. Manager initialisieren
        this.eventsCenter = EventsCenter;
        this.audioManager = new AudioManager(this);
        this.fxManager = new FXManager(this);
        this.inputManager = new InputManager(this);
        this.projectileManager = new ProjectileManager(this);
        
        // WICHTIG: Die Simulation muss laufen
        if (!window.universeSim) {
            window.universeSim = new UniverseSim();
        }
        this.universeSim = window.universeSim;

        this.sectorManager = new SectorManager(this);
        this.threatManager = new SectorThreatManager(this);

        // 2. Sektor aufbauen (Hintergrund, Tore)
        this.sectorManager.initSector(this.targetSector);

        // 3. Spieler erstellen
        this.createPlayer();

        // 4. Stationen und Asteroiden laden (aus UniverseSim Daten oder DB)
        this.populateSector();

        // 5. Kollisionen einrichten
        this.setupCollisions();

        // 6. UI starten (Overlay)
        this.scene.launch('UIScene');
        this.scene.bringToTop('UIScene');

        // 7. Kamera Follow
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setZoom(1);
        
        // Fade In
        this.cameras.main.fadeIn(500, 0, 0, 0);

        // Input Listener für Menü etc.
        this.input.keyboard.on('keydown-ESC', () => {
            this.scene.pause();
            this.scene.launch('MenuScene'); 
        });
    }

    update(time, delta) {
        if (this.player) {
            this.player.update(time, delta);
            
            // Input an Spieler weitergeben
            this.inputManager.handleInput(this.player);
        }

        // Projektile updaten
        this.projectileManager.update(time, delta);

        // Bedrohungen managen (Spawns etc.)
        this.threatManager.update(time, delta);
    }

    createPlayer() {
        // Standard Spawn-Punkt (Mitte des Sektors)
        let spawnX = 2000;
        let spawnY = 2000;

        // Wenn wir durch ein Tor kommen, suchen wir das Gegenstück
        if (this.entryGateId) {
            const gates = this.sectorManager.getGates().getChildren();
            const entryGate = gates.find(g => g.id === this.entryGateId);
            if (entryGate) {
                spawnX = entryGate.x;
                spawnY = entryGate.y;
                // Ein bisschen Offset, damit wir nicht IM Tor spawnen
                spawnX += 100; 
                spawnY += 100;
            }
        }

        // Schiffstyp bestimmen (Default oder aus Transfer)
        const shipId = this.transferPlayerData ? this.transferPlayerData.shipId : 'arg_s_fighter_elite';

        this.player = new PlayerShip(this, spawnX, spawnY, shipId);
        
        // --- FIX: Daten wiederherstellen ---
        if (this.transferPlayerData) {
            // 1. Health & Shield wiederherstellen
            if (this.transferPlayerData.stats && this.player.health) {
                // Wir nutzen setData, wie im HealthComponent definiert
                this.player.health.setData(
                    this.transferPlayerData.stats.hullCurrent,
                    this.transferPlayerData.stats.hullMax,
                    this.transferPlayerData.stats.shieldCurrent,
                    this.transferPlayerData.stats.shieldMax
                );
            }

            // 2. Fracht wiederherstellen
            if (this.transferPlayerData.cargo && this.player.cargo) {
                this.player.cargo.items = { ...this.transferPlayerData.cargo.items };
                // UI Update triggern, da sich Cargo geändert hat
                EventsCenter.emit('ui-update-cargo', this.player.cargo.items);
            }

            // 3. Waffe wiederherstellen (TODO: WeaponSystem prüfen)
            if (this.transferPlayerData.weaponId && this.player.weaponSystem) {
                this.player.weaponSystem.equipWeapon(this.transferPlayerData.weaponId);
            }
        }
    }

    populateSector() {
        // Hier würden wir Stationen und Asteroiden erstellen
        // Einfacher Test: Asteroiden aus DB oder Random
        // Das wird später über UniverseSim geregelt
        
        // Beispiel: Station aus DB laden
        const sectorData = this.sectorManager.activeSectorId;
        // ... Logik für Stationen ...
    }

    setupCollisions() {
        // Player vs. Gates
        this.physics.add.overlap(this.player, this.sectorManager.getGates(), (player, gate) => {
            this.sectorManager.handleGateJump(player, gate);
        });

        // Player vs. Loot
        // Wir brauchen eine Loot-Gruppe
        this.lootGroup = this.physics.add.group();
        
        this.physics.add.overlap(this.player, this.lootGroup, (player, loot) => {
            if (player.cargo.addItem(loot.itemId, loot.amount)) {
                this.audioManager.playSfx('sfx_loot_pickup');
                loot.destroy();
                EventsCenter.emit('ui-message', `Loot: ${loot.itemId} erhalten`);
            } else {
                EventsCenter.emit('ui-message', `Frachtraum voll!`);
            }
        });

        // Projektile vs. Enemies (kommt noch)
    }

    // Hilfsmethode, um Loot zu droppen (z.B. wenn Gegner stirbt)
    spawnLoot(x, y, itemId, amount) {
        const loot = new Loot(this, x, y, itemId, amount);
        this.lootGroup.add(loot);
    }
}
