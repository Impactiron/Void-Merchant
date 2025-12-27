import events from './EventsCenter.js';
import { SectorDB } from '../data/SectorDB.js';

export class SectorManager {
    constructor(scene) {
        this.scene = scene;
        this.currentSectorId = 'sector_01'; // Start Sektor
        this.visitedSectors = new Set(['sector_01']);
    }

    init() {
        console.log(`SectorManager initialisiert. Start-Sektor: ${this.currentSectorId}`);
    }

    getCurrentSector() {
        return SectorDB.find(s => s.id === this.currentSectorId);
    }

    // Wechselt den Sektor, lädt neue Daten und feuert Events
    changeSector(gateId) {
        // Logik um herauszufinden, wohin das Tor führt
        // Hier vereinfacht: Wir simulieren, dass wir wissen, wohin es geht.
        // In einer echten Implementierung würde das Gate-Objekt die Ziel-ID enthalten.
        
        // Dummy-Logic für Prototyping:
        // Wenn wir in sector_01 sind, und ein Gate nutzen, gehen wir zu sector_02 (falls vorhanden)
        const targetSectorId = this.currentSectorId === 'sector_01' ? 'sector_02' : 'sector_01';
        
        const targetSector = SectorDB.find(s => s.id === targetSectorId);

        if (!targetSector) {
            console.warn(`Ziel-Sektor ${targetSectorId} nicht in DB gefunden.`);
            return;
        }

        console.log(`Springe von ${this.currentSectorId} nach ${targetSectorId}...`);

        this.currentSectorId = targetSectorId;
        this.visitedSectors.add(targetSectorId);

        // Globales Event feuern, damit GameScene, UniverseSim und UI reagieren können
        events.emit('sector-changed', {
            previous: this.currentSectorId,
            current: targetSector
        });

        // Visuellen Übergangseffekt triggern (optional)
        // this.scene.cameras.main.fade(500, 0, 0, 0);
    }

    getSectorInfo(id) {
        return SectorDB.find(s => s.id === id);
    }
}
