import Phaser from 'phaser';

export default class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        console.log("BootScene: System Init...");

        // Ladebalken Visualisierung
        this.createLoadingBar();

        // --- 1. SPRITES (Ships & Stations) ---
        // Basis-Pfad für Sprites setzen
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
        // WICHTIG: Fallback muss breit genug für alle Frames sein (64x16 = 1024px)
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
            console.log("BootScene: All Assets Loaded (or failed). Starting fallbacks check.");
            // Kurze Verzögerung für Smoothness, dann Start
            this.time.delayedCall(100, () => {
                // Check ob MenuScene registriert ist, um Crash zu vermeiden
                if (this.scene.manager.keys['MenuScene']) {
                    this.scene.start('MenuScene');
                } else if (this.scene.manager.keys['GameScene']) {
                    // Fallback Direktstart GameScene (für Debugging)
                    console.log("BootScene: MenuScene missing, jumping to GameScene.");
                    this.scene.start('GameScene');
                } else {
                    console.warn('BootScene: Neither "MenuScene" nor "GameScene" found. Staying in BootScene.');
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
        // Checken wir nun, ob die Textur existiert (durch Load oder Fallback)
        if (this.textures.exists('spr_fx_explosion')) {
            this.anims.create({
                key: 'anim_explosion',
                frames: this.anims.generateFrameNumbers('spr_fx_explosion', { start: 0, end: 15 }), // 16 Frames
                frameRate: 24,
                hideOnComplete: true
            });
        }
    }

    createFallbacks() {
        // Generiert nur Texturen, die vom Loader NICHT gefunden wurden (Sicherheitsnetz)
        const checkAndGen = (key, color, w, h) => {
            if (!this.textures.exists(key)) {
                // console.warn(`Asset missing: ${key}. Generating fallback.`);
                // Graphics Objekt erstellen
                const g = this.make.graphics();
                
                // Füllfarbe
                g.fillStyle(color, 1);
                
                // Rechteck zeichnen (oder Kreis wenn gewünscht, hier einfach Rechtecke)
                g.fillRect(0, 0, w, h);
                
                // Als Rahmen andeuten (optional, für Sichtbarkeit)
                g.lineStyle(2, 0xffffff, 0.5);
                g.strokeRect(0, 0, w, h);

                // Textur generieren
                g.generateTexture(key, w, h);
                
                // Cleanup
                g.destroy();
            }
        };

        // --- SHIPS (Color Coded) ---
        // Terran (Cyan/Blue)
        checkAndGen('spr_ship_terran_scout', 0x00d4ff, 24, 24);    // Klein, schnell
        checkAndGen('spr_ship_terran_fighter', 0x0088ff, 32, 32);  // Mittel
        checkAndGen('spr_ship_terran_freighter', 0x0044aa, 48, 48);// Groß, bullig

        // Xenon (Red/Purple)
        checkAndGen('spr_ship_xenon_n', 0xff5555, 24, 24);         // Scout
        checkAndGen('spr_ship_xenon_m', 0xff0000, 32, 32);         // Fighter
        checkAndGen('spr_ship_xenon_k', 0x990000, 128, 128);       // Destroyer (Riesig!)

        // NPC (Yellow/Orange)
        checkAndGen('spr_npc_trader', 0xffcc00, 40, 32);

        // --- STATIONS (Grey/Industrial) ---
        checkAndGen('spr_station_hub_terran', 0x888888, 128, 128);
        checkAndGen('spr_station_solar_array', 0x336699, 96, 96); // Etwas blau für Solar
        checkAndGen('spr_station_dock_arm', 0x666666, 32, 96);    // Länglich

        // --- ENVIRONMENT ---
        // Background (Dunkelblau/Schwarz)
        checkAndGen('bg_stars_01', 0x050510, 1280, 720); // Fullscreen Fallback

        // Asteroids
        checkAndGen('spr_asteroid_iron', 0x665555, 32, 32); // Braun/Grau
        checkAndGen('spr_asteroid_ice', 0xaaddff, 32, 32);  // Eisblau

        // Gates & Loot
        checkAndGen('spr_gate_jump', 0xaa00aa, 64, 64);     // Lila Tor
        checkAndGen('spr_loot_container', 0xffd700, 16, 16);// Goldene Box

        // --- PROJECTILES (Bright/Neon) ---
        checkAndGen('spr_proj_laser_red', 0xff0000, 16, 4);   // Roter Strich
        checkAndGen('spr_proj_plasma_green', 0x00ff00, 12, 12); // Grüner Blob

        // --- FX SPRITESHEET FALLBACK ---
        // Muss breit sein, damit "generateFrameNumbers" funktioniert (16 Frames à 64px)
        checkAndGen('spr_fx_explosion', 0xff8800, 64 * 16, 64);

        // --- UI & ICONS ---
        // Icons (Standard 16-32px)
        checkAndGen('ui_icon_credits', 0xffff00, 24, 24);
        checkAndGen('ui_icon_cargo', 0xcccccc, 24, 24);
        checkAndGen('ui_icon_energy', 0x00ff00, 24, 24);
        
        // Map Icons
        checkAndGen('ui_icon_map_player', 0x00ff00, 16, 16);
        checkAndGen('ui_icon_map_enemy', 0xff0000, 16, 16);
        checkAndGen('ui_icon_map_station', 0x0000ff, 16, 16);

        // HUD Elements
        checkAndGen('ui_hud_reticle', 0xffffff, 32, 32);
        checkAndGen('ui_bar_frame', 0x444444, 150, 20);
        checkAndGen('ui_bar_fill_health', 0xff3333, 140, 14);
        checkAndGen('ui_bar_fill_shield', 0x33aaff, 140, 14);
        checkAndGen('ui_radar_circle', 0x002244, 140, 140);
        
        console.log("BootScene: Fallback Textures verified/generated.");
    }
}
