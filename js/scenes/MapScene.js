// FILE: js/scenes/MapScene.js

/**
 * 📘 PROJECT: VOID MERCHANT
 * SCENE: GALAXY MAP (UI OVERLAY)
 * * Visualisiert die Sektoren und Verbindungen.
 * * TDD Vol 6 & 9.
 */

import { SECTOR_DB } from '../data/SectorDB.js';
import { CONFIG } from '../core/config.js';

export default class MapScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MapScene' });
    }

    create() {
        console.log("MapScene: Active.");

        // Hintergrund (Halbtransparentes Schwarz)
        this.add.rectangle(0, 0, CONFIG.width, CONFIG.height, 0x000000, 0.9).setOrigin(0);

        // Header
        this.add.text(40, 40, "GALAXY MAP", {
            font: '32px "Courier New", monospace',
            fill: '#00d4ff',
            fontStyle: 'bold'
        });

        this.add.text(40, 80, "[TAB] CLOSE MAP", {
            font: '16px "Segoe UI", monospace',
            fill: '#888888'
        });

        // Grafik-Objekt für Linien
        this.linesGraphics = this.add.graphics();
        
        // Container für Map-Elemente (zum Zentrieren)
        this.mapContainer = this.add.container(CONFIG.width / 2, CONFIG.height / 2);

        this.drawMap();

        // Input Listener zum Schließen
        this.input.keyboard.on('keydown-TAB', () => {
            this.closeMap();
        });
    }

    drawMap() {
        // Grid Settings
        const GRID_SIZE = 150;
        const NODE_SIZE = 20;

        // 1. Hole aktuellen Sektor vom GameScene State
        const gameScene = this.scene.get('GameScene');
        const currentSectorId = gameScene ? gameScene.currentSectorId : 'sec_argon_prime';

        // 2. Zeichne Verbindungen (Linien)
        this.linesGraphics.clear();
        this.linesGraphics.lineStyle(2, 0x444444);

        Object.values(SECTOR_DB).forEach(sector => {
            if (!sector.mapPosition) return;
            
            const startX = sector.mapPosition.x * GRID_SIZE;
            const startY = sector.mapPosition.y * GRID_SIZE;

            // Zeichne Linien zu Zielsektoren
            if (sector.gates) {
                sector.gates.forEach(gate => {
                    const targetSector = SECTOR_DB[gate.targetSector];
                    if (targetSector && targetSector.mapPosition) {
                        const endX = targetSector.mapPosition.x * GRID_SIZE;
                        const endY = targetSector.mapPosition.y * GRID_SIZE;
                        
                        // Wir zeichnen Linien im Container-Space
                        this.mapContainer.add(this.add.line(0, 0, startX, startY, endX, endY, 0x444444).setOrigin(0));
                    }
                });
            }
        });

        // 3. Zeichne Sektoren (Nodes)
        Object.values(SECTOR_DB).forEach(sector => {
            if (!sector.mapPosition) return;

            const x = sector.mapPosition.x * GRID_SIZE;
            const y = sector.mapPosition.y * GRID_SIZE;

            const isCurrent = (sector.id === currentSectorId);
            
            // Node Color based on Faction
            let color = 0x888888; // Default
            if (sector.faction === 'ARG') color = 0x00d4ff;
            if (sector.faction === 'HAT') color = 0xaaaaaa;
            if (sector.faction === 'XEN') color = 0xff0000;
            if (sector.faction === 'TER') color = 0xffffff;

            // Node Circle
            const circle = this.add.circle(x, y, isCurrent ? NODE_SIZE + 5 : NODE_SIZE, color);
            
            // Pulsing Effect for current sector
            if (isCurrent) {
                this.tweens.add({
                    targets: circle,
                    scale: 1.2,
                    alpha: 0.8,
                    duration: 800,
                    yoyo: true,
                    repeat: -1
                });
            }

            // Sector Name
            const text = this.add.text(x, y + 30, sector.name.toUpperCase(), {
                font: '12px "Segoe UI", monospace',
                fill: isCurrent ? '#ffffff' : '#aaaaaa',
                align: 'center'
            }).setOrigin(0.5);

            // Add to container
            this.mapContainer.add(circle);
            this.mapContainer.add(text);
        });
    }

    closeMap() {
        console.log("MapScene: Closing.");
        this.scene.stop();
        this.scene.resume('GameScene');
        this.scene.resume('UIScene');
    }
}

