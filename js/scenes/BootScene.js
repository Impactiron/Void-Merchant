import { CONFIG } from '../core/config.js'; // Optional, falls config benötigt wird

export default class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        console.log("BootScene: System Init...");

        // Fehler-Überwachung beim Laden
        this.load.on('loaderror', (file) => {
            console.warn(`BootScene: Asset konnte nicht geladen werden: ${file.key}`);
        });

        // Ladebalken Visualisierung
        this.createLoadingBar();

        // --- 1. SPRITES (Ships & Stations) ---
        // Basis-Pfad für Sprites setzen (Relative Pfade beachten!)
        this.load.setPath('assets/sprites/');

        // Ships (Terran)
        this.load.image('spr_ship_terran_scout', 'ships/spr_ship_terran_scout.png');
        this.load.image('spr_ship_terran_fighter', 'ships/spr_ship_terran_fighter.png');
        this.load.image('spr_ship_terran_freighter', 'ships/spr_ship_terran_freighter.png');

        // Ships (Xenon / Enemy)
        this.load.image('spr_ship_xenon_n', 'ships/spr_ship_xenon_n.png');
        this.load.image('spr_ship_xenon_m', 'ships/spr_ship_xenon_m.png');
        this.load.image('spr_ship_xenon_k', 'ships/spr_ship_xenon_k.png');

        // Ships (NPC / Civilians)
        this.load.image('spr_npc_trader', 'ships/spr_npc_trader.png');

        // Stations & Modules
        this.load.image('spr_station_hub_terran', 'stations/spr_station_hub_terran.png');
        this.load.image('spr_station_solar_array', 'stations/spr_station_solar_array.png');
        this.load.image('spr_station_dock_arm', 'stations/spr_station_dock_arm.png');

        // Environment & FX
        this.load.image('bg_stars_01', 'environment/spr_bg_stars_01.png');
        this.load.image('spr_asteroid_iron', 'environment/spr_asteroid_iron.png');
        this.load.image('spr_asteroid_ice', 'environment/spr_asteroid_ice.png');
        this.load.image('spr_gate_jump', 'environment/spr_gate_jump.png');
        this.load.image('spr_loot_container', 'environment/spr_loot_container.png');

        // Projectiles
        this.load.image('spr_proj_laser_red', 'fx/spr_proj_laser_red.png');
        this.load.image('spr_proj_plasma_green', 'fx/spr_proj_plasma_green.png');

        // FX Spritesheets
        this.load.spritesheet('spr_fx_explosion', 'fx/spr_fx_explosion.png', { frameWidth: 64, frameHeight: 64 });

        // --- 2. UI ASSETS ---
        // Basis-Pfad auf UI wechseln
        this.load.setPath('assets/ui/');

        // HUD Elements
        this.load.image('ui_hud_reticle', 'hud/ui_hud_reticle.png');
        this.load.image('ui_bar_frame', 'hud/ui_bar_frame.png');
        this.load.image('ui_bar_fill_health', 'hud/ui_bar_fill_health.png');
        this.load.image('ui_bar_fill_shield', 'hud/ui_bar_fill_shield.png');
        this.load.image('ui_radar_circle', 'hud/ui_radar_circle.png');

        // Icons
        this.load.image('ui_icon_credits', 'icons/ui_icon_credits.png');
        this.load.image('ui_icon_cargo', 'icons/ui_icon_cargo.png');
        this.load.image('ui_icon_energy', 'icons/ui_icon_energy.png');
        this.load.image('ui_icon_map_player', 'icons/ui_icon_map_player.png');
        this.load.image('ui_icon_map_enemy', 'icons/ui_icon_map_enemy.png');
        this.load.image('ui_icon_map_station', 'icons/ui_icon_map_station.png');

        // Reset Path (WICHTIG für nachfolgende Loads in anderen Szenen)
        this.load.setPath('');

        // Events
        this.load.on('complete', () => {
            console.log("BootScene: All Assets Loaded (or failed gracefully).");
            // Kurze Verzögerung für Smoothness, dann Start
            this.time.delayedCall(500, () => {
                // Check ob MenuScene registriert ist, um Crash zu vermeiden
                if (this.scene.manager.keys['MenuScene']) {
                    this.scene.start('MenuScene');
                } else {
                    console.warn('BootScene: "MenuScene" not found. Staying in BootScene.');
                }
            });
        });
    }

    createLoadingBar() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics();

        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(width / 2 - 160, height / 2 - 25, 320, 50);

        const loadingText = this.add.text(width / 2, height / 2 - 50, 'LOADING VOID MERCHANT...', {
            font: '20px "Orbitron", monospace',
            fill: '#ffffff'
        }).setOrigin(0.5);

        this.load.on('progress', (value) => {
            progressBar.clear();
            progressBar.fillStyle(0x00d4ff, 1);
            progressBar.fillRect(width / 2 - 150, height / 2 - 15, 300 * value, 30);
        });

        this.load.on('fileprogress', (file) => {
            // Optional: Dateinamen anzeigen, falls gewünscht
            // loadingText.setText('Loading: ' + file.key);
        });

        this.load.on('complete', () => {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
        });
    }

    create() {
        // Fallback Generator wird nur ausgeführt, wenn Texturen fehlen
        this.createFallbacks();

        // Animationen global erstellen (damit sie überall verfügbar sind)
        // Wir prüfen, ob das Spritesheet da ist, sonst Fallback-Animation vermeiden oder Dummy nutzen
        if (this.textures.exists('spr_fx_explosion')) {
            this.anims.create({
                key: 'anim_explosion',
                frames: this.anims.generateFrameNumbers('spr_fx_explosion', { start: 0, end: 15 }), // Annahme: 16 Frames
                frameRate: 24,
                hideOnComplete: true
            });
        }
    }

    createFallbacks() {
        // Generiert nur Texturen, die vom Loader NICHT gefunden wurden (Sicherheitsnetz)
        const checkAndGen = (key, color, w, h) => {
            if (!this.textures.exists(key)) {
                console.warn(`BootScene: Generating fallback texture for: ${key}`);
                const g = this.make.graphics().fillStyle(color).fillRect(0,0,w,h);
                g.generateTexture(key, w, h);
            }
        };

        // Fallbacks für Schiffe
        checkAndGen('spr_ship_terran_fighter', 0x00d4ff, 32, 32);
        checkAndGen('spr_ship_terran_scout', 0x00d4ff, 24, 24); // Neu
        checkAndGen('spr_ship_terran_freighter', 0x00d4ff, 48, 48); // Neu
        checkAndGen('spr_ship_xenon_n', 0xff0000, 32, 32);
        checkAndGen('spr_ship_xenon_m', 0xff0000, 48, 48); // Neu
        checkAndGen('spr_ship_xenon_k', 0x880000, 128, 128); // Neu (Capital)
        checkAndGen('spr_npc_trader', 0xffcc00, 32, 32);

        // Fallbacks für UI Icons
        checkAndGen('ui_icon_credits', 0xffff00, 16, 16);
        checkAndGen('ui_icon_cargo', 0x888888, 16, 16);
        checkAndGen('ui_icon_energy', 0x00ff00, 16, 16);
        checkAndGen('ui_icon_map_player', 0x00ff00, 16, 16);
        checkAndGen('ui_icon_map_enemy', 0xff0000, 16, 16);
        checkAndGen('ui_icon_map_station', 0x0000ff, 16, 16);

        // Fallbacks für HUD
        checkAndGen('ui_hud_reticle', 0xffffff, 32, 32);
        checkAndGen('ui_bar_frame', 0x444444, 300, 30);
        checkAndGen('ui_bar_fill_health', 0xff3333, 140, 20);
        checkAndGen('ui_bar_fill_shield', 0x33aaff, 140, 20);
        checkAndGen('ui_radar_circle', 0x002244, 140, 140);

        // Fallbacks für Environment
        checkAndGen('spr_asteroid_iron', 0x555555, 32, 32);
        checkAndGen('spr_asteroid_ice', 0xaaddff, 32, 32); // Neu
        checkAndGen('spr_gate_jump', 0xff00ff, 64, 64);
        checkAndGen('spr_loot_container', 0xffd700, 24, 24);
        
        // Fallbacks für Stations
        checkAndGen('spr_station_hub_terran', 0xaaaaaa, 128, 128);
        checkAndGen('spr_station_solar_array', 0xdddd00, 64, 64);
        checkAndGen('spr_station_dock_arm', 0x444444, 32, 96);

        // Fallbacks für Projectiles
        checkAndGen('spr_proj_laser_red', 0xff0000, 16, 4);
        checkAndGen('spr_proj_plasma_green', 0x00ff00, 16, 8);
    }
}
