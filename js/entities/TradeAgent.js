// FILE: js/entities/TradeAgent.js

/**
 * 📘 PROJECT: VOID MERCHANT
 * MODULE: TRADE AGENT ENTITY
 * * Repräsentiert einen Händler in der Hintergrund-Simulation (OOS).
 * * Refactored from UniverseSim.js
 */

export default class TradeAgent {
    constructor(id, faction, homeSectorId) {
        this.id = id;
        this.faction = faction;
        this.currentSectorId = homeSectorId;
        this.state = 'IDLE'; // IDLE, TRAVEL_TO_BUY, TRAVEL_TO_SELL

        // Ship Stats (Simplified for OOS)
        this.cargoCapacity = 1000; // M-Class Hauler default
        this.speed = 150; // OOS Map Speed

        // Current Job
        this.cargo = {}; // { wareId: amount }
        this.targetStationId = null;
        this.targetSectorId = null;
        this.targetWare = null;
        this.travelTimer = 0;
        this.credits = 50000; // Startkapital des Agenten
    }
}

