import { SectorDB } from '../data/SectorDB.js';
import { Asteroid } from '../entities/Asteroid.js';
import { Station } from '../entities/Station.js';
import { EnemyShip } from '../entities/EnemyShip.js';
import { Gate } from '../entities/Gate.js';

export class SectorManager {
    constructor(scene) {
        this.scene = scene;
        this.currentSectorId = null;
        this.activeEntities = {
            asteroids: [],
            stations: [],
            gates: [],
            enemies: []
        };
    }

    loadSector(sectorId) {
        console.log(`🌌 Lade Sektor: ${sectorId}`);
        this.clearCurrentSector();
        
        const sectorData = SectorDB[sectorId];
        if (!sectorData) {
            console.error(`❌ Sektor ${sectorId} nicht in DB gefunden!`);
            return;
        }

        this.currentSectorId = sectorId;
        
        // Hintergrund setzen (falls vorhanden)
        // this.scene.add.image(0, 0, 'bg_space').setScrollFactor(0);

        // 1. Stationen spawnen
        sectorData.stations.forEach(stationData => {
            const station = new Station(
                this.scene, 
                stationData.x, 
                stationData.y, 
                stationData.type,
                stationData.id
            );
            this.activeEntities.stations.push(station);
            this.scene.stations.add(station);
        });

        // 2. Tore spawnen
        sectorData.gates.forEach(gateData => {
            const gate = new Gate(
                this.scene,
                gateData.x,
                gateData.y,
                gateData.toSector
            );
            this.activeEntities.gates.push(gate);
            this.scene.gates.add(gate);
        });

        // 3. Asteroiden generieren (prozedural basierend auf Dichte)
        this.spawnAsteroids(sectorData.asteroidDensity || 0.5);

        // 4. Weltgrenzen setzen
        this.scene.physics.world.setBounds(-5000, -5000, 10000, 10000);
        
        console.log(`✅ Sektor ${sectorData.name} initialisiert.`);
    }

    spawnAsteroids(density) {
        const count = Math.floor(density * 50); // Beispiel-Formel
        for (let i = 0; i < count; i++) {
            const x = Phaser.Math.Between(-3000, 3000);
            const y = Phaser.Math.Between(-3000, 3000);
            
            // Sicherstellen, dass nicht auf Stationen gespawnt wird
            const asteroid = new Asteroid(this.scene, x, y);
            this.activeEntities.asteroids.push(asteroid);
            this.scene.asteroids.add(asteroid);
        }
    }

    clearCurrentSector() {
        // Alle existierenden Entitäten bereinigen
        this.activeEntities.stations.forEach(e => e.destroy());
        this.activeEntities.gates.forEach(e => e.destroy());
        this.activeEntities.asteroids.forEach(e => e.destroy());
        this.activeEntities.enemies.forEach(e => e.destroy());

        this.activeEntities = {
            asteroids: [],
            stations: [],
            gates: [],
            enemies: []
        };
    }
    
    update() {
        // Hier könnte periodischer Feind-Spawn oder Cleanup passieren
    }
}