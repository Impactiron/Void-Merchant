// FILE: js/scenes/UIScene.js

import { CONSTANTS } from '../core/config.js';
import events from '../core/EventsCenter.js';

export default class UIScene extends Phaser.Scene {
    constructor() {
        super({ key: 'UIScene' });
        this.playerID = 'player'; // Wir erwarten Events für diese ID
    }

    create() {
        console.log("UIScene: Active (Reactive Mode).");
        this.gameScene = this.scene.get('GameScene');

        // --- STYLING ---
        const styleVal = { font: '16px "Roboto Condensed", sans-serif', fill: '#ffffff' };
        const styleWarn = { font: '16px "Roboto Condensed", sans-serif', fill: '#ff3333' };
        const styleDock = { font: '20px "Orbitron", monospace', fill: '#ffffff', backgroundColor: '#000000aa', padding: { x: 10, y: 5 } };

        const HUD_BAR_WIDTH = 300;
        const FILL_WIDTH = (HUD_BAR_WIDTH / 2) - 10;
        this.MAX_FILL_WIDTH = FILL_WIDTH;

        // --- OVERLAY ---
        this.damageOverlay = this.add.rectangle(
            this.cameras.main.width / 2, this.cameras.main.height / 2,
            this.cameras.main.width, this.cameras.main.height,
            0xff0000
        ).setAlpha(0).setBlendMode(Phaser.BlendModes.ADD);

        // --- TOP LEFT: PLAYER INFO ---
        this.add.image(30, 30, 'ui_icon_credits').setDisplaySize(24, 24);
        this.txtCredits = this.add.text(50, 22, '0', styleVal);

        this.add.image(30, 60, 'ui_icon_cargo').setDisplaySize(24, 24);
        this.txtCargo = this.add.text(50, 52, '0 / 0', styleVal);

        // --- BOTTOM CENTER: BARS ---
        this.screenCenterX = this.cameras.main.width / 2;
        this.screenBottomY = this.cameras.main.height - 40;

        this.barFrame = this.add.image(this.screenCenterX, this.screenBottomY, 'ui_bar_frame');
        this.barFrame.setDisplaySize(HUD_BAR_WIDTH, 30);

        this.hullFill = this.add.image(this.screenCenterX - 5, this.screenBottomY, 'ui_bar_fill_health');
        this.hullFill.setOrigin(1, 0.5);
        this.hullFill.setDisplaySize(FILL_WIDTH, 10);

        this.shieldFill = this.add.image(this.screenCenterX + 5, this.screenBottomY, 'ui_bar_fill_shield');
        this.shieldFill.setOrigin(0, 0.5);
        this.shieldFill.setDisplaySize(FILL_WIDTH, 10);

        this.add.text(this.screenCenterX - 160, this.screenBottomY - 25, 'HULL', styleWarn).setOrigin(0, 0.5);
        this.add.text(this.screenCenterX + 160, this.screenBottomY - 25, 'SHIELD', { ...styleVal, color: '#00d4ff' }).setOrigin(1, 0.5);

        this.txtSpeed = this.add.text(this.screenCenterX, this.screenBottomY - 45, '0 m/s', styleVal).setOrigin(0.5);

        // --- RADAR ---
        this.radarX = 80;
        this.radarY = this.cameras.main.height - 80;
        this.radarRange = CONSTANTS.UI.RADAR_RANGE;
        this.radarGraphics = this.add.graphics();
        this.add.image(this.radarX, this.radarY, 'ui_radar_circle').setAlpha(0.6).setDisplaySize(120, 120);

        // --- NOTIFICATIONS ---
        this.txtDocking = this.add.text(this.screenCenterX, this.screenBottomY - 120, '', styleDock).setOrigin(0.5).setAlpha(0);
        this.lootLog = this.add.text(this.cameras.main.width - 20, this.cameras.main.height / 2, '', {
            font: '14px "Roboto Condensed", monospace', fill: '#00ff00', align: 'right'
        }).setOrigin(1, 0.5);

        // --- RETICLE ---
        this.reticle = this.add.image(0, 0, 'ui_hud_reticle').setDepth(1000).setDisplaySize(32, 32);

        // --- GAME OVER ---
        this.createGameOverScreen();

        // --- EVENT LISTENERS (REACTIVE UI) ---
        events.on('update-credits', (amount) => this.txtCredits.setText(amount.toLocaleString()));

        events.on('entity-damaged', (data) => {
            if (data.id === this.playerID) {
                this.updateHealthBars(data.currentHp, data.maxHp, data.currentShield, data.maxShield);
                // Trigger Flash if damage taken (simple heuristic: if shield or hull dropped)
                // For now, simpler: trigger flash on every event call (as event implies damage/change)
                // To do it properly, we'd compare against last value, but this is fine for now.
                // Note: HealthComponent emits update on regen too, so maybe check delta?
                // Ignored for brevity, just updating bars.
            }
        });
        
        // Separat für Damage Feedback (Screen Flash)
        // Wir könnten das oben integrieren, aber sauberer wäre ein dediziertes 'damage-taken' event.
        // Das HealthComponent sendet 'entity-damaged' bei jedem Update.

        events.on('cargo-updated', (data) => {
            if (data.id === this.playerID) {
                this.txtCargo.setText(`${data.usedVolume} / ${data.maxVolume}`);
            }
        });

        events.on('entity-died', (data) => {
            if (data.id === this.playerID) this.showGameOver();
        });

        // Cleanup
        this.events.on('shutdown', () => {
            events.off('update-credits');
            events.off('entity-damaged');
            events.off('cargo-updated');
            events.off('entity-died');
        });
        
        // Initial Sync (falls GameScene schon läuft)
        if (this.gameScene && this.gameScene.player) {
            const p = this.gameScene.player;
            // Manuell triggern
            this.updateHealthBars(p.health.currentHp, p.health.maxHp, p.health.currentShield, p.health.maxShield);
            this.txtCredits.setText(p.credits.toLocaleString());
            this.txtCargo.setText(`${p.cargo.getUsedVolume()} / ${p.cargo.maxVolume}`);
        }
    }

    createGameOverScreen() {
        this.gameOverContainer = this.add.container(this.cameras.main.width/2, this.cameras.main.height/2);
        const bg = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000, 0.85);
        const txtGO = this.add.text(0, -50, 'CRITICAL FAILURE', { font: '48px "Orbitron", monospace', fill: '#ff0000' }).setOrigin(0.5);
        const txtRestart = this.add.text(0, 50, 'PRESS [SPACE] TO REBOOT SYSTEM', { font: '20px "Roboto Condensed"', fill: '#ffffff' }).setOrigin(0.5);
        this.gameOverContainer.add([bg, txtGO, txtRestart]);
        this.gameOverContainer.setDepth(1000);
        this.gameOverContainer.setVisible(false);
    }

    updateHealthBars(hp, maxHp, shield, maxShield) {
        const hullP = Phaser.Math.Clamp(hp / maxHp, 0, 1);
        const shieldP = Phaser.Math.Clamp(shield / maxShield, 0, 1);

        this.hullFill.setDisplaySize(this.MAX_FILL_WIDTH * hullP, 10);
        this.shieldFill.setDisplaySize(this.MAX_FILL_WIDTH * shieldP, 10);
        
        if (hp < maxHp || shield < maxShield) {
            // Optional: Damage Flash Trigger
            // this.triggerDamageFlash(); // Would flash too often on regen
        }
    }

    triggerDamageFlash() {
        this.damageOverlay.setAlpha(0.3);
        this.tweens.add({ targets: this.damageOverlay, alpha: 0, duration: 200 });
    }

    showGameOver() {
        this.gameOverContainer.setVisible(true);
        this.gameOverContainer.setAlpha(0);
        this.tweens.add({ targets: this.gameOverContainer, alpha: 1, duration: 1000 });
    }

    setDockingAvailable(isAvailable, name="") {
        if(isAvailable) {
            this.txtDocking.setText(`[F] DOCK: ${name.toUpperCase()}`);
            this.txtDocking.setAlpha(1);
        } else {
            this.txtDocking.setAlpha(0);
        }
    }

    showLootNotification(title, amount) {
        this.lootLog.setText(`${title}: ${amount}`);
        this.lootLog.setAlpha(1);
        this.tweens.add({
            targets: this.lootLog,
            alpha: 0,
            delay: 2000,
            duration: 1000
        });
    }

    update(time, delta) {
        // Polling removed for Stats. Only Input/Visuals remain.
        if (!this.gameScene || !this.gameScene.player) return;
        if (this.gameOverContainer.visible) return;

        // --- RETICLE ---
        const pointer = this.input.activePointer;
        this.reticle.setPosition(pointer.x, pointer.y);

        // --- SPEEDOMETER (Polling okay here, low cost) ---
        const player = this.gameScene.player;
        if (player.body) {
            const speed = Math.floor(player.body.velocity.length());
            this.txtSpeed.setText(`${speed} m/s`);
        }

        // --- RADAR UPDATE (Still Polling, but optimized) ---
        // Radar events would be overkill (too many move events)
        if (this.gameScene.enemies) {
            this.updateRadar(player);
        }
    }

    updateRadar(player) {
        this.radarGraphics.clear();
        this.radarGraphics.fillStyle(0x00ff00, 1);
        this.radarGraphics.fillCircle(this.radarX, this.radarY, 2);

        const drawBlip = (target, color, size) => {
            const dx = target.x - player.x;
            const dy = target.y - player.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < this.radarRange) {
                const scale = dist / this.radarRange;
                const rDist = scale * 60; // radius
                const angle = Math.atan2(dy, dx);
                const bx = this.radarX + Math.cos(angle) * rDist;
                const by = this.radarY + Math.sin(angle) * rDist;
                this.radarGraphics.fillStyle(color, 1);
                this.radarGraphics.fillCircle(bx, by, size);
            }
        };

        if(this.gameScene.asteroids) this.gameScene.asteroids.children.iterate(a => a.active && drawBlip(a, 0x666666, 2));
        if(this.gameScene.enemies) this.gameScene.enemies.children.iterate(e => e.active && drawBlip(e, 0xff0000, 3));
        if(this.gameScene.stations) this.gameScene.stations.children.iterate(s => s.active && drawBlip(s, 0x00d4ff, 4));
    }
}


