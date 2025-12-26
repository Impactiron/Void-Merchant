// FILE: js/scenes/BuilderScene.js

import { CONFIG } from '../core/config.js';
import { MODULE_DB } from '../data/ModuleDB.js';

export default class BuilderScene extends Phaser.Scene {
    constructor() {
        super('BuilderScene');
        // Core State
        this.isActive = false;
        this.gridGraphics = null;

        // Builder State
        this.selectedModuleId = 'mod_prod_energy_cells';
        this.ghost = null; // Das Vorschaubild an der Maus
        this.placedModules = []; // Liste aller gebauten Stationsteile

        // Config
        this.GRID_SIZE = 64; // Ein Raster-Feld ist 64x64 Pixel
        this.SNAP_THRESHOLD = 30; // Pixel-Distanz für magnetisches Einrasten
    }

    create() {
        console.log("BuilderScene: Initialized (Overlay Mode)");

        // 1. Grid Visualisierung (Hintergrund-Raster)
        this.createGrid();

        // 2. Ghost (Vorschau-Objekt)
        this.createGhost();

        // 3. UI Overlay (Baumenü rechts)
        this.createBuilderUI();

        // 4. Input Listener
        this.input.on('pointermove', (pointer) => {
            this.updateGhost(pointer);
        });

        this.input.on('pointerdown', (pointer) => {
            // Nur bauen, wenn wir nicht auf das UI klicken
            if (pointer.x < CONFIG.width - 200) {
                this.placeModule();
            }
        });

        // Exit Key (B oder ESC)
        this.input.keyboard.on('keydown-ESC', () => this.closeBuilder());
        this.input.keyboard.on('keydown-B', () => this.closeBuilder());

        // DEBUG: Initiales Modul platzieren (Hub), damit wir etwas zum Snappen haben
        // Wir simulieren, dass schon ein Dock in der Mitte steht
        if (this.placedModules.length === 0) {
            this.forcePlaceModule('mod_dock_basic', CONFIG.width / 2, CONFIG.height / 2);
        }
    }

    /**
     * Zeichnet ein feines Raster, damit der Spieler sieht, wo er baut.
     */
    createGrid() {
        this.gridGraphics = this.add.graphics();
        this.gridGraphics.lineStyle(1, 0x00ff00, 0.3); // Grün, transparent

        const width = CONFIG.width;
        const height = CONFIG.height;

        // Vertikale Linien
        for (let x = 0; x <= width; x += this.GRID_SIZE) {
            this.gridGraphics.moveTo(x, 0);
            this.gridGraphics.lineTo(x, height);
        }

        // Horizontale Linien
        for (let y = 0; y <= height; y += this.GRID_SIZE) {
            this.gridGraphics.moveTo(0, y);
            this.gridGraphics.lineTo(width, y);
        }

        this.gridGraphics.strokePath();
    }

    /**
     * Erstellt das transparente Vorschau-Objekt
     */
    createGhost() {
        // Start mit Default Modul
        let modData = MODULE_DB[this.selectedModuleId];

        // SAFETY CHECK
        if (!modData) {
            console.warn(`BuilderScene: Unknown Module ID '${this.selectedModuleId}'. Resetting to default.`);
            const keys = Object.keys(MODULE_DB);
            if (keys.length > 0) {
                this.selectedModuleId = keys[0];
                modData = MODULE_DB[this.selectedModuleId];
            } else {
                console.error("BuilderScene: MODULE_DB is empty!");
                return;
            }
        }

        const textureKey = this.textures.exists(modData.texture) ? modData.texture : 'spr_missing';

        // Fallback Textur On-The-Fly
        if (!this.textures.exists(textureKey)) {
            const g = this.make.graphics().fillStyle(0xff00ff).fillRect(0, 0, 32, 32);
            g.generateTexture('temp_fallback', 32, 32);
            this.ghost = this.add.image(0, 0, 'temp_fallback');
        } else {
            this.ghost = this.add.image(0, 0, textureKey);
        }

        this.ghost.setAlpha(0.6); // Halb-Transparent
        this.ghost.setOrigin(0.5); // Mitte

        // AUTO-SCALE
        const targetW = modData.size.w;
        const targetH = modData.size.h;
        this.ghost.setDisplaySize(targetW, targetH);
    }

    createBuilderUI() {
        const uiX = CONFIG.width - 180;
        this.add.rectangle(uiX + 90, CONFIG.height / 2, 180, CONFIG.height, 0x000000, 0.8);

        this.add.text(uiX + 10, 20, "ARCHITECT MODE", {
            fontSize: '16px',
            color: '#00ff00',
            fontFamily: 'monospace'
        });

        // Liste der Module
        let y = 60;
        Object.values(MODULE_DB).forEach(mod => {
            const btn = this.add.text(uiX + 10, y, `[${mod.name}]`, {
                fontSize: '14px',
                color: '#ffffff',
                backgroundColor: '#333333',
                padding: { x: 5, y: 5 }
            }).setInteractive({ useHandCursor: true });

            btn.on('pointerover', () => btn.setStyle({ color: '#00ff00' }));
            btn.on('pointerout', () => btn.setStyle({ color: '#ffffff' }));

            btn.on('pointerdown', () => {
                this.selectedModuleId = mod.id;
                this.refreshGhost();
            });

            y += 40;
        });
    }

    refreshGhost() {
        let modData = MODULE_DB[this.selectedModuleId];
        if (!modData) return;

        const textureKey = this.textures.exists(modData.texture) ? modData.texture : 'spr_missing';

        if (this.textures.exists(textureKey)) {
            this.ghost.setTexture(textureKey);
        }

        const targetW = modData.size.w;
        const targetH = modData.size.h;
        this.ghost.setDisplaySize(targetW, targetH);
    }

    /**
     * UPDATE LOGIC: Grid vs Snapping
     */
    updateGhost(pointer) {
        if (!this.ghost) return;

        // 1. Grid Position (Standard)
        const gridSnapX = Math.floor(pointer.x / this.GRID_SIZE) * this.GRID_SIZE + (this.GRID_SIZE / 2);
        const gridSnapY = Math.floor(pointer.y / this.GRID_SIZE) * this.GRID_SIZE + (this.GRID_SIZE / 2);

        // 2. Check Magnetic Snapping (TDD 1.2)
        const snapResult = this.getClosestSnapPoint(pointer.x, pointer.y);

        if (snapResult) {
            // SNAP FOUND!
            this.ghost.setPosition(snapResult.x, snapResult.y);
            this.ghost.setTint(0x00ff00); // Grün = Valid Snap
        } else {
            // NO SNAP -> Use Grid
            this.ghost.setPosition(gridSnapX, gridSnapY);
            this.ghost.clearTint(); // Normal
        }
    }

    /**
     * Kernlogik für das magnetische Einrasten
     */
    getClosestSnapPoint(pointerX, pointerY) {
        if (this.placedModules.length === 0) return null;

        const currentModData = MODULE_DB[this.selectedModuleId];
        if (!currentModData || !currentModData.sockets) return null;

        let bestSnap = null;
        let minDist = this.SNAP_THRESHOLD;

        // Iteriere über alle bereits gebauten Module
        for (const placedMod of this.placedModules) {
            const placedModData = MODULE_DB[placedMod.id];
            if (!placedModData || !placedModData.sockets) continue;

            // Iteriere über alle Sockets des gebauten Moduls
            for (const placedSocket of placedModData.sockets) {
                // Berechne Weltposition des Sockets (Rotation hier noch ignoriert/0 angenommen)
                const placedSocketWX = placedMod.x + placedSocket.x;
                const placedSocketWY = placedMod.y + placedSocket.y;

                // Checke Distanz zur Maus, um Rechenleistung zu sparen
                const distToMouse = Phaser.Math.Distance.Between(pointerX, pointerY, placedSocketWX, placedSocketWY);
                
                // Wir suchen großzügig (2x Threshold), da der Ghost ja versetzt sein kann
                if (distToMouse < this.SNAP_THRESHOLD * 4) {

                    // Iteriere über alle Sockets des Ghost-Moduls (Wir versuchen jeden Socket anzudocken)
                    for (const ghostSocket of currentModData.sockets) {
                        
                        // Wenn Socket A (Ghost) an Socket B (Placed) andockt, muss der Ghost so verschoben werden:
                        // GhostPos = PlacedSocketWorldPos - GhostSocketRelPos
                        const targetX = placedSocketWX - ghostSocket.x;
                        const targetY = placedSocketWY - ghostSocket.y;

                        // Wie weit ist diese Zielposition von der Maus entfernt?
                        const distToTarget = Phaser.Math.Distance.Between(pointerX, pointerY, targetX, targetY);

                        if (distToTarget < minDist) {
                            minDist = distToTarget;
                            bestSnap = { x: targetX, y: targetY };
                        }
                    }
                }
            }
        }

        return bestSnap;
    }

    /**
     * Hilfsmethode um Module ohne Ghost zu platzieren (für Initial-Hub)
     */
    forcePlaceModule(id, x, y) {
        const modData = MODULE_DB[id];
        if (!modData) return;

        const textureKey = this.textures.exists(modData.texture) ? modData.texture : 'spr_missing';
        const placed = this.add.image(x, y, textureKey);
        placed.setDisplaySize(modData.size.w, modData.size.h);
        
        this.placedModules.push({
            id: id,
            x: x,
            y: y,
            gridW: modData.size.w,
            gridH: modData.size.h
        });
    }

    placeModule() {
        const modData = MODULE_DB[this.selectedModuleId];
        if (!modData) return;

        const textureKey = this.textures.exists(modData.texture) ? modData.texture : 'spr_missing';

        // Echtes Objekt platzieren an Ghost Position
        const placed = this.add.image(this.ghost.x, this.ghost.y, textureKey);

        const targetW = modData.size.w;
        const targetH = modData.size.h;
        placed.setDisplaySize(targetW, targetH);

        // Speichern in lokaler Liste
        this.placedModules.push({
            id: this.selectedModuleId,
            x: this.ghost.x,
            y: this.ghost.y,
            gridW: modData.size.w,
            gridH: modData.size.h
        });

        // Feedback
        this.cameras.main.shake(50, 0.002);

        const gameScene = this.scene.get('GameScene');
        if (gameScene && gameScene.audioManager) {
            gameScene.audioManager.playSfx('sfx_ui_select'); 
        }
    }

    closeBuilder() {
        console.log("Builder: Closing...");
        this.scene.resume('GameScene');
        this.scene.stop(); 
    }
}


