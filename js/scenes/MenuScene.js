// FILE: js/scenes/MenuScene.js
import SaveSystem from '../core/SaveSystem.js';
import { CONFIG } from '../core/config.js';
import AudioManager from '../core/AudioManager.js';

export default class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    create() {
        console.log("MenuScene: Active.");

        // 0. Audio Init
        this.audioManager = new AudioManager(this);
        // Musik spielen (Fade in 2s)
        this.audioManager.playMusic('mus_menu', 2000);

        // 1. Background Visuals (Langsamer Drift)
        this.bg = this.add.tileSprite(0, 0, CONFIG.width, CONFIG.height, 'bg_stars_01')
            .setOrigin(0)
            .setAlpha(0.5);

        // 2. Logic Setup
        this.saveSystem = new SaveSystem();
        const hasSave = this.saveSystem.load() !== null;

        // 3. UI Interaction
        this.domMenu = document.getElementById('main-menu');
        if (this.domMenu) {
            this.domMenu.classList.remove('hidden');

            this.btnContinue = document.getElementById('btn-continue');
            this.btnNewGame = document.getElementById('btn-newgame');
            this.btnClear = document.getElementById('btn-clearsave');

            const playClick = () => this.audioManager.playSfx('sfx_ui_select');

            // State Update
            if (this.btnContinue) {
                this.btnContinue.disabled = !hasSave;
                this.btnContinue.innerText = hasSave ? "CONTINUE GAME" : "NO SAVE DATA";
                
                this.btnContinue.onclick = () => {
                    playClick();
                    if (hasSave) this.startGame();
                };
                // Optional: Hover Sound via JS events (würde komplexer werden, daher hier Fokus auf Click)
            }

            if (this.btnNewGame) {
                this.btnNewGame.onclick = () => {
                    playClick();
                    if (hasSave) {
                        if (confirm("Neues Spiel starten? Der alte Spielstand wird beim nächsten Speichern überschrieben.")) {
                            this.saveSystem.clear(); // Clean slate for logic
                            this.startGame();
                        }
                    } else {
                        this.startGame();
                    }
                };
            }

            if (this.btnClear) {
                this.btnClear.onclick = () => {
                    playClick();
                    if (confirm("Wirklich alle Speicherdaten löschen?")) {
                        this.saveSystem.clear();
                        if (this.btnContinue) {
                            this.btnContinue.disabled = true;
                            this.btnContinue.innerText = "NO SAVE DATA";
                        }
                    }
                };
            }
        } else {
            console.error("MenuScene: DOM Element 'main-menu' nicht in index.html gefunden!");
        }
    }

    update(time, delta) {
        // Langsamer Drift nach rechts unten für Atmosphäre
        if (this.bg) {
            this.bg.tilePositionX += 0.2;
            this.bg.tilePositionY += 0.1;
        }
    }

    startGame() {
        console.log("MenuScene: Starting Game...");
        
        // Musik ausfaden
        if (this.audioManager && this.audioManager.currentMusic) {
            this.tweens.add({
                targets: this.audioManager.currentMusic,
                volume: 0,
                duration: 500
            });
        }

        // UI Ausblenden
        if (this.domMenu) this.domMenu.classList.add('hidden');

        // Listener bereinigen (Safety, um Memory Leaks zu vermeiden)
        if (this.btnContinue) this.btnContinue.onclick = null;
        if (this.btnNewGame) this.btnNewGame.onclick = null;
        if (this.btnClear) this.btnClear.onclick = null;

        // Start GameScene
        this.scene.start('GameScene');
    }
}


