// FILE: js/core/GameLoop.js

/**
 * 📘 PROJECT: VOID MERCHANT
 * VOLUME 1: MAIN ENTRY POINT
 * * FIX: Singleton-Check verhindert "Duplicate Scene Key" Fehler bei Hot-Reloading.
 * * UPDATE: Added UniverseSim Initialization.
 * * UPDATE: Added BuilderScene.
 * * UPDATE: Added PoliticsManager (Volume 9).
 */

import { CONFIG } from './config.js';
import BootScene from '../scenes/BootScene.js';
import MenuScene from '../scenes/MenuScene.js';
import GameScene from '../scenes/GameScene.js';
import UIScene from '../scenes/UIScene.js';
import MapScene from '../scenes/MapScene.js';
import BuilderScene from '../scenes/BuilderScene.js';
import UniverseSim from './UniverseSim.js';
import PoliticsManager from './PoliticsManager.js'; // NEU

// --- SAFETY CHECK: DESTROY OLD INSTANCE ---
if (window.game) {
    console.warn("GameLoop: Zerstöre existierende Spiel-Instanz, um Duplikate zu verhindern.");

    if (window.game.universe) {
        window.game.universe.stop();
    }
    // PoliticsManager braucht kein explizites Stop, da er keine Timer hat, wird aber durch GC bereinigt.

    window.game.destroy(true);
    window.game = null;
}

// Merge Config with Scene List
const finalConfig = {
    ...CONFIG,
    // Reihenfolge: Boot -> Menu -> Game. UI/Map/Builder parallel.
    scene: [BootScene, MenuScene, GameScene, UIScene, MapScene, BuilderScene]
};

// Start the Engine
console.log("GameLoop: Starte neue Phaser Instanz...");
window.game = new Phaser.Game(finalConfig);

// --- START GOD ENGINE ---
// Die Simulation läuft unabhängig vom Rendering Loop

// 1. Politics System (Basis für Freund/Feind Erkennung)
window.game.politics = new PoliticsManager();

// 2. Universe Simulation (Wirtschaft & Agenten)
window.game.universe = new UniverseSim();
window.game.universe.start();

// 3. Mission Manager (wird bei Bedarf lazy initialized, siehe GameScene)
window.game.missionManager = null;


