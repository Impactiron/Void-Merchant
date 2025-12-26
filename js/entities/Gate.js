// FILE: js/entities/Gate.js

/**
 * 📘 PROJECT: VOID MERCHANT
 * MODULE: GATE ENTITY
 * * Sprungtore verbinden Sektoren.
 * * Interaction: Overlap triggert Sektor-Wechsel.
 */

export default class Gate extends Phaser.Physics.Arcade.Sprite {
    /**
     * @param {Phaser.Scene} scene
     * @param {number} x
     * @param {number} y
     * @param {string} id - Lokale ID des Tors (z.B. 'gate_north')
     * @param {string} targetSector - Ziel-Sektor ID (z.B. 'sec_hatikvahs_choice')
     * @param {string} targetGateId - ID des Tors im Ziel-Sektor (für Spawn-Pos)
     */
    constructor(scene, x, y, id, targetSector, targetGateId) {
        super(scene, x, y, 'spr_gate_jump');

        this.scene = scene;
        this.id = id;
        this.targetSector = targetSector;
        this.targetGateId = targetGateId;

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this, true); // Static body

        // --- VISUALS ---
        this.setDisplaySize(192, 192); // Größer als Schiffe
        this.setDepth(15); // Unter Schiffen, über Background (CONSTANTS.DEPTH.GATES)

        // Physics Body (Circular for Hitbox)
        this.body.setCircle(64, 32, 32);

        // --- LABEL (CRASH FIX) ---
        // Safety Check: Falls targetSector undefined ist, nutzen wir 'UNKNOWN'
        const safeName = (targetSector || 'UNKNOWN').toUpperCase().replace('SEC_', '');
        
        this.label = this.scene.add.text(x, y - 120, `TO: ${safeName}`, {
            font: '16px "Segoe UI", monospace',
            fill: '#ffff00',
            backgroundColor: '#00000088',
            padding: { x: 4, y: 2 }
        }).setOrigin(0.5);
    }

    /**
     * Cleanup beim Sektor-Wechsel
     */
    destroy() {
        if (this.label) this.label.destroy();
        super.destroy();
    }
}


