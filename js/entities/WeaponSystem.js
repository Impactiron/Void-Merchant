import { WEAPON_DB } from '../data/WeaponDB.js';
import { ProjectileManager } from '../core/ProjectileManager.js'; // Assuming named export if standardized, or default if not changed yet. Keeping safe.
import { EventsCenter } from '../core/EventsCenter.js';

export class WeaponSystem {
    /**
     * @param {Phaser.Scene} scene
     * @param {Phaser.Physics.Arcade.Sprite} ship
     * @param {ProjectileManager} projectileManager
     * @param {Object} beamComponent - Optional (für Kha'ak)
     */
    constructor(scene, ship, projectileManager, beamComponent = null) {
        this.scene = scene;
        this.ship = ship;
        this.projectileManager = projectileManager;
        this.beamComponent = beamComponent;

        // Standard-Werte
        this.mounts = [];
        this.activeWeaponId = 'wpn_impulse_mk1';
        this.weaponData = null;
        this.lastFired = 0;
        this.heat = 0;
        this.maxHeat = 100;
        this.coolingRate = 20; // Heat pro Sekunde
        this.isOverheated = false;

        this.init();
    }

    init() {
        this.loadWeapon(this.activeWeaponId);
        
        // Setup Heat Tick
        this.timer = this.scene.time.addEvent({
            delay: 100,
            callback: this.updateCooling,
            callbackScope: this,
            loop: true
        });
    }

    /**
     * Lädt eine Waffe aus der DB in das System
     * @param {string} weaponId 
     */
    loadWeapon(weaponId) {
        if (!WEAPON_DB[weaponId]) {
            console.warn(`[WeaponSystem] Waffe ID ${weaponId} nicht gefunden. Fallback auf MK1.`);
            weaponId = 'wpn_impulse_mk1';
        }
        
        this.activeWeaponId = weaponId;
        this.weaponData = WEAPON_DB[weaponId];
        // console.log(`[WeaponSystem] Loaded: ${this.weaponData.name}`);
    }

    updateCooling() {
        if (this.heat > 0) {
            // Cooling Rate ist pro Sekunde, wir rufen alle 100ms auf -> /10
            this.heat -= (this.coolingRate / 10);
            if (this.heat < 0) this.heat = 0;

            // Overheat Reset bei < 50%
            if (this.isOverheated && this.heat < 50) {
                this.isOverheated = false;
                EventsCenter.emit('weapon-ready', this.ship);
            }

            // UI Update Event senden (nur wenn nötig, um Performance zu sparen)
            EventsCenter.emit('ui-update-heat', this.heat);
        }
    }

    /**
     * Hauptfeuer-Logik
     * @param {number} time - Aktuelle Phaser Zeit
     */
    fire(time) {
        if (!this.weaponData) return;
        if (this.isOverheated) {
            // Optional: Sound für "Failed" abspielen
            return;
        }

        if (time > this.lastFired + this.weaponData.fireRate) {
            
            // Hitze Check
            if (this.heat + this.weaponData.heatGen > this.maxHeat) {
                this.isOverheated = true;
                EventsCenter.emit('weapon-overheat', this.ship);
                return;
            }

            // Mündungsfeuer Position berechnen (Rotationsabhängig)
            // Einfache Annahme: Vorne am Schiff. 
            // TODO: Hardpoints definieren
            const vec = new Phaser.Math.Vector2();
            vec.setToPolar(this.ship.rotation, this.ship.width * 0.5);
            
            const spawnX = this.ship.x + vec.x;
            const spawnY = this.ship.y + vec.y;

            // Projektil feuern
            if (this.weaponData.type === 'projectile') {
                this.projectileManager.fireBullet(
                    spawnX, 
                    spawnY, 
                    this.ship.rotation, 
                    this.ship, // Owner
                    this.weaponData
                );
            } else if (this.weaponData.type === 'beam' && this.beamComponent) {
                // Beam Logik
                this.beamComponent.fire(this.ship, this.weaponData);
            }

            // Hitze erhöhen
            this.heat += this.weaponData.heatGen;
            this.lastFired = time;

            // Audio triggern
            // EventsCenter.emit('play-sound', this.weaponData.sound);
        }
    }

    destroy() {
        if (this.timer) this.timer.remove();
    }
}
