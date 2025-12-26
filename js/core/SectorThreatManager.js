/**
 * SectorThreatManager.js
 * Verwaltet die Bedrohungsstufen (Hive Aggression) basierend auf Ressourcenabbau.
 * Spawnt Kha'ak-Einheiten, wenn der Threshold überschritten wird.
 */
export default class SectorThreatManager {
    /**
     * @param {Phaser.Scene} scene - Referenz auf die GameScene
     */
    constructor(scene) {
        this.scene = scene;

        // Speichert Bedrohung pro Sektor: { 'sec_id': 0.0 }
        this.threatLevels = {};
        
        // Konfiguration
        this.THRESHOLD_SPAWN = 500; // Ab hier spawnen Kha'ak
        this.THREAT_DECAY_PER_SEC = 2.0; // Beruhigung pro Sekunde
        this.MINING_MULTIPLIER = 0.5; // Aggro pro abgebauter Ressource
        this.SPAWN_COOLDOWN = 60000; // Min. 60s zwischen Wellen pro Sektor

        // Tracking für Cooldowns { 'sec_id': timestamp }
        this.lastSpawnTimes = {};

        this.setupListeners();
        
        console.log("⚠️ SectorThreatManager initialized.");
    }

    setupListeners() {
        // Lauscht auf das globale Mining-Event
        if (this.scene.events) {
            this.scene.events.on('mining-complete', this.handleMiningActivity, this);
        }
    }

    /**
     * Wird aufgerufen, wenn Ressourcen abgebaut wurden.
     * @param {Object} data - { sector: string, amount: number }
     */
    handleMiningActivity(data) {
        if (!data || !data.sector) return;

        const sectorId = data.sector;
        const amount = data.amount || 0;
        
        if (!this.threatLevels[sectorId]) {
            this.threatLevels[sectorId] = 0;
        }

        // Bedrohung erhöhen
        const threatIncrease = amount * this.MINING_MULTIPLIER;
        this.threatLevels[sectorId] += threatIncrease;

        // Debug Log (nur alle 100 Schritte um Spam zu vermeiden)
        if (Math.random() < 0.1) {
            console.log(`⚠️ Threat Level [${sectorId}]: ${this.threatLevels[sectorId].toFixed(1)}`);
        }

        // Check auf Spawn
        this.checkThreatLevel(sectorId);
    }

    checkThreatLevel(sectorId) {
        const currentThreat = this.threatLevels[sectorId];

        if (currentThreat >= this.THRESHOLD_SPAWN) {
            this.trySpawnHiveResponse(sectorId);
        }
    }

    trySpawnHiveResponse(sectorId) {
        const now = this.scene.time.now;
        const lastSpawn = this.lastSpawnTimes[sectorId] || 0;

        if (now - lastSpawn > this.SPAWN_COOLDOWN) {
            console.warn(`🚨 KHA'AK HIVE RESPONSE TRIGGERED IN ${sectorId}!`);
            
            this.spawnKhaakGroup(sectorId);

            // Reset
            this.lastSpawnTimes[sectorId] = now;
            // Bedrohung nicht komplett nullen, aber unter Threshold senken
            this.threatLevels[sectorId] = Math.max(0, this.threatLevels[sectorId] - 300);
        }
    }

    spawnKhaakGroup(sectorId) {
        // Wir spawnen nur, wenn der Spieler im Sektor ist (da GameScene nur lokal simuliert)
        if (sectorId !== this.scene.currentSectorId) return;

        const player = this.scene.player; 
        if (!player) return;

        // Position: Random Circle um den Spieler (800-1200px Distanz)
        const spawnDistance = Phaser.Math.Between(800, 1200);
        const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
        const spawnX = player.x + Math.cos(angle) * spawnDistance;
        const spawnY = player.y + Math.sin(angle) * spawnDistance;

        // Visual Effect für Spawn (Warp-In)
        if (this.scene.fxManager) {
            // Placeholder Effekt: Kleine Explosion oder Flash
            // this.scene.fxManager.playWarpIn(spawnX, spawnY); 
        }

        // Spawn Request an SectorManager oder direkt Event emitten
        // Da SectorManager.spawnEnemy evtl. noch nicht existiert, nutzen wir Events als Fallback
        if (this.scene.sectorManager && typeof this.scene.sectorManager.spawnEnemy === 'function') {
            // 3 Scouts spawnen
            for(let i=0; i<3; i++) {
                const offsetX = Phaser.Math.FloatBetween(-50, 50);
                const offsetY = Phaser.Math.FloatBetween(-50, 50);
                // 'xen_s_fighter_n' ist aktuell der Platzhalter für Feinde in ShipDB/SectorManager
                // Später: 'khk_s_fighter_queen_guard'
                this.scene.sectorManager.spawnEnemy('khk_s_fighter_queen_guard', spawnX + offsetX, spawnY + offsetY);
            }
        } else {
            console.log("Event 'spawn-khaak' emitted.");
            this.scene.events.emit('spawn-enemy', {
                id: 'khk_s_fighter_queen_guard',
                x: spawnX,
                y: spawnY,
                count: 3
            });
        }
    }

    update(time, delta) {
        // Natural Decay
        const decayAmount = (this.THREAT_DECAY_PER_SEC * delta) / 1000;

        for (const sectorId in this.threatLevels) {
            if (this.threatLevels[sectorId] > 0) {
                this.threatLevels[sectorId] -= decayAmount;
                if (this.threatLevels[sectorId] < 0) this.threatLevels[sectorId] = 0;
            }
        }
    }
}

