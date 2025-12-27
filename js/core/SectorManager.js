/**
 * SectorManager.js
 * Verwaltet Sektoren, Tore und Hintergrundsimulation (OOS).
 */

import { SectorDB } from '../data/SectorDB.js';
import { Gate } from '../entities/Gate.js';
import { EventsCenter } from './EventsCenter.js';

export class SectorManager {
    constructor(scene) {
        this.scene = scene;
        this.activeSectorId = null;
        this.gates = null; // Phaser Group
    }

    /**
     * Initialisiert den Sektor (Tore, Hintergrund, Musik).
     * @param {string} sectorId 
     */
    initSector(sectorId) {
        this.activeSectorId = sectorId;
        const sectorData = SectorDB[sectorId];

        if (!sectorData) {
            console.error(`SectorManager: Sektor ${sectorId} nicht gefunden!`);
            return;
        }

        console.log(`SectorManager: Initialisiere Sektor ${sectorId} (${sectorData.name})`);

        // 1. Hintergrund setzen (Tiled Sprite für Parallax wäre ideal, hier einfache Farbe/Bild)
        this.scene.cameras.main.setBackgroundColor(sectorData.bgColor || '#000000');
        
        // Grenzen der Welt setzen
        this.scene.physics.world.setBounds(0, 0, sectorData.width, sectorData.height);

        // 2. Tore erstellen
        this.createGates(sectorData.gates);

        // 3. Musik starten (wenn vorhanden)
        if (sectorData.music) {
            // Audio Manager Call (Platzhalter)
            // this.scene.audioManager.playMusic(sectorData.music);
        }

        // 4. UI Update triggern
        EventsCenter.emit('ui-update-sector', sectorData.name);
    }

    createGates(gatesData) {
        if (this.gates) {
            this.gates.clear(true, true);
        }

        this.gates = this.scene.physics.add.group({
            classType: Gate,
            runChildUpdate: true
        });

        gatesData.forEach(gateDef => {
            const gate = new Gate(this.scene, gateDef.x, gateDef.y, gateDef.toSector, gateDef.id);
            this.gates.add(gate);
        });
    }

    /**
     * Führt den Sprung durch.
     * @param {Ship} player - Das Spieler-Schiff
     * @param {Gate} gate - Das Gate-Objekt
     */
    handleGateJump(player, gate) {
        if (this.scene.isJumping) return;
        
        this.scene.isJumping = true;
        
        // SFX abspielen, falls vorhanden
        if (this.scene.audioManager) {
            this.scene.audioManager.playSfx('sfx_ui_select');
        }

        console.log(`SectorManager: Jumping to ${gate.targetSector}...`);

        // Fade Out Effekt
        this.scene.cameras.main.fade(1000, 0, 0, 0);
        
        // Physik stoppen
        if (player.body) {
            player.body.stop();
        }

        // --- FIX: Extract Data from Components cleanly ---
        // Wir greifen auf die Components (health, cargo) zu, nicht auf das Ship-Objekt direkt.
        // Dies verhindert Circular-Structure Fehler und stellt sicher, dass wir nur reine Daten übergeben.
        const playerData = {
            shipId: player.id, // Die Konfigurations-ID des Schiffs (z.B. 'arg_s_fighter_elite')
            stats: {
                hullCurrent: player.health ? player.health.currentHp : 100,
                shieldCurrent: player.health ? player.health.currentShield : 100,
                hullMax: player.health ? player.health.maxHp : 100,
                shieldMax: player.health ? player.health.maxShield : 100
            },
            cargo: {
                // Shallow Copy der Items, um Referenzen zu brechen
                items: player.cargo ? { ...player.cargo.items } : {}
            },
            weaponId: player.weaponSystem ? player.weaponSystem.activeWeaponId : null
        };

        // Verzögerter Neustart der Szene mit den neuen Daten
        this.scene.time.delayedCall(1000, () => {
            this.scene.scene.restart({
                targetSector: gate.targetSector,
                entryGate: gate.targetGateId, // ID des Tors, an dem wir rauskommen
                playerData: playerData
            });
        });
    }

    getGates() {
        return this.gates;
    }
}
