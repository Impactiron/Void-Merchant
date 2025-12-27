import { Gate } from '../entities/Gate.js';
import { Station } from '../entities/Station.js';
import { Asteroid } from '../entities/Asteroid.js';
import { EnemyShip } from '../entities/EnemyShip.js';
import { SectorDB } from '../data/SectorDB.js';

export class SectorManager {
    constructor(scene) {
        this.scene = scene;
        this.currentSector = null;
        this.entities = {
            asteroids: [],
            stations: [],
            gates: [],
            enemies: []
        };
    }

    init(sectorId) {
        this.currentSector = SectorDB[sectorId];
        if (!this.currentSector) {
            console.error(`SectorManager: Sector ${sectorId} not found! Defaulting to 0-0.`);
            this.currentSector = SectorDB["0-0"];
        }
        
        // Clear old entities
        this.entities.asteroids = [];
        this.entities.stations = [];
        this.entities.gates = [];
        this.entities.enemies = [];

        console.log(`SectorManager: Initialized Sector ${this.currentSector.name} (${sectorId})`);
        
        // Setup World Bounds
        this.scene.physics.world.setBounds(0, 0, this.currentSector.width, this.currentSector.height);
        
        // Background color based on security level (visual debug)
        const hexColor = this.currentSector.securityLevel > 0 ? 0x000022 : 0x110000;
        this.scene.cameras.main.setBackgroundColor(hexColor);
    }

    spawnSectorEntities() {
        if (!this.currentSector) return;

        // 1. Spawn Asteroids
        if (this.currentSector.asteroids) {
            this.currentSector.asteroids.forEach(data => {
                const asteroid = new Asteroid(this.scene, data.x, data.y, data.type);
                this.entities.asteroids.push(asteroid);
            });
        }

        // 2. Spawn Stations
        if (this.currentSector.stations) {
            this.currentSector.stations.forEach(data => {
                const station = new Station(this.scene, data.x, data.y, data.type, data.id);
                this.entities.stations.push(station);
            });
        }

        // 3. Spawn Gates
        if (this.currentSector.gates) {
            this.currentSector.gates.forEach(data => {
                const gate = new Gate(this.scene, data.x, data.y, data.targetSector, data.id, data.targetGateId);
                this.entities.gates.push(gate);
            });
        }

        // 4. Spawn Enemies (Simple initial spawn logic)
        // In Zukunft: SectorThreatManager übernimmt das
        if (this.currentSector.securityLevel < 0.5) {
            // Gefährlicher Sektor - Spawn Piraten
            const count = Math.floor(Math.random() * 3) + 1;
            for (let i = 0; i < count; i++) {
                const x = Math.random() * this.currentSector.width;
                const y = Math.random() * this.currentSector.height;
                const enemy = new EnemyShip(this.scene, x, y, 'pir_s_fighter_standard');
                this.entities.enemies.push(enemy);
            }
        }
    }

    handleGateJump(player, gate) {
        if (this.scene.isJumping) return;
        
        this.scene.isJumping = true;
        this.scene.audioManager.playSfx('sfx_ui_select');

        console.log(`SectorManager: Jumping to ${gate.targetSector}...`);

        this.scene.cameras.main.fade(1000, 0, 0, 0);
        player.body.stop();

        // --- FIX: Extract Data from Components cleanly ---
        // Wir greifen auf die Components (health, cargo) zu, nicht auf das Ship-Objekt direkt.
        // Dies verhindert Circular Reference Errors und stellt sicher, dass wir nur reine Daten übergeben.
        
        const playerData = {
            shipId: player.id, // ID des Schiffstyps (z.B. 'arg_s_fighter_elite')
            stats: {
                hullCurrent: player.health ? player.health.currentHp : 100,
                shieldCurrent: player.health ? player.health.currentShield : 0,
                hullMax: player.health ? player.health.maxHp : 100,
                shieldMax: player.health ? player.health.maxShield : 0
            },
            cargo: {
                // Shallow Copy der Items, um Referenzen zu brechen
                items: player.cargo ? { ...player.cargo.items } : {}
            },
            weaponId: player.weaponSystem ? player.weaponSystem.activeWeaponId : null
        };

        this.scene.time.delayedCall(1000, () => {
            this.scene.scene.restart({
                targetSector: gate.targetSector,
                entryGate: gate.targetGateId,
                playerData: playerData
            });
        });
    }

    getGateAt(x, y) {
        // Hilfsfunktion, falls wir Gates per Klick suchen (für Autopilot später)
        return this.entities.gates.find(g => Phaser.Math.Distance.Between(g.x, g.y, x, y) < 100);
    }
}
