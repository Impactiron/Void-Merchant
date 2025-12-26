// FILE: js/core/config.js

/**
 * 📘 PROJECT: VOID MERCHANT
 * VOLUME 1: CONFIGURATION
 */

export const CONFIG = {
    // Renderer Configuration
    type: Phaser.WEBGL, // Forced WebGL
    parent: 'game-container',

    // Resolution & Scaling
    width: 1280,
    height: 720,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },

    // Physics Engine
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 0 }, // Space has no gravity
            debug: false // Debug aus für Immersion
        }
    },

    // Performance Settings
    fps: {
        target: 60,
        forceSetTimeOut: true
    }
};

export const CONSTANTS = {
    // Global Layers
    DEPTH: {
        BACKGROUND: 0,
        GATES: 15, // NEU
        STATIONS: 10,
        SHIPS: 20,
        FX: 30,
        UI: 100
    },

    // Universe Ticks
    TICK_RATE: 1000,

    // UI & HUD Settings
    UI: {
        RADAR_RANGE: 2500, // Erfassungsreichweite in Pixeln
        RADAR_RADIUS: 70,   // Radius der Anzeige im HUD
        RADAR_SCALE: 0.03   // (Wird dynamisch berechnet, Placeholder)
    }
};


