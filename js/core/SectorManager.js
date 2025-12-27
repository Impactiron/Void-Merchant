import { SECTOR_DB } from '../data/SectorDB.js';
// Wir importieren Asteroid vorerst als Default, falls es noch einer ist, 
// aber idealerweise stellen wir später alles um. 
// Da der Prompt nur spezifische Dateien nannte, lasse ich Asteroid Import defensiv.
import Asteroid from '../entities/Asteroid.js'; 
import { EventsCenter } from './EventsCenter.js';

export default class SectorManager {
    constructor(scene) {
        this.scene = scene;
        this.currentSectorId = null;
        this.activeEntities = [];
    }

    /**
     * Lädt einen Sektor und erstellt alle statischen Objekte
     * @param {string} sectorId 
     */
    loadSector(sectorId) {
        if (!SECTOR_DB[sectorId]) {
            console.error(`[SectorManager] Sektor ${sectorId} existiert nicht!`);
            return;
        }

        console.log(`[SectorManager] Loading Sector: ${SECTOR_DB[sectorId].name}`);
        this.currentSectorId = sectorId;
        const sectorData = SECTOR_DB[sectorId];

        // 1. Hintergrund setzen (Einfach Farbe oder später TileSprite)
        this.scene.cameras.main.setBackgroundColor(0x000010); // Deep Space Black

        // 2. Weltgrenzen setzen
        // Wir nehmen an, ein Sektor ist 20.000 x 20.000 Pixel groß (laut TDD)
        this.scene.physics.world.setBounds(0, 0, 20000, 20000);
        
        // Hintergrund-Gitter/Sterne (Optional TODO)

        // 3. Asteroiden spawnen
        this.spawnAsteroids(sectorData.asteroids);

        // 4. Stationen spawnen (TODO)
        
        // 5. Tore spawnen (TODO)

        // Event feuern, dass Sektor geladen ist
        EventsCenter.emit('sector-loaded', sectorId);
    }

    spawnAsteroids(config) {
        // config = { count: 20, type: 'ore' }
        if (!config) return;

        for (let i = 0; i < config.count; i++) {
            // Zufällige Position im Sektor
            const x = Phaser.Math.Between(100, 19900);
            const y = Phaser.Math.Between(100, 19900);

            // Create Asteroid Entity
            // Da Asteroid noch ein Default Export ist (laut Analyse), nutzen wir new Asteroid
            const asteroid = new Asteroid(this.scene, x, y, config.type);
            this.activeEntities.push(asteroid);
        }
    }

    /**
     * Bereinigt den aktuellen Sektor vor einem Wechsel
     */
    clearSector() {
        this.activeEntities.forEach(entity => {
            if (entity.destroy) entity.destroy();
        });
        this.activeEntities = [];
    }
}
