// FILE: js/core/InputManager.js

/**
 * 📘 PROJECT: VOID MERCHANT
 * MODULE: INPUT MANAGER
 * * Abstrahiert Eingaben (Keyboard/Mouse/Touch).
 * * UPDATE v0.4.3: Added Mobile Touch Support (Audit 1.2 / TDD Vol 6)
 * * UPDATE v0.5.0: Added Builder Key [B]
 */

export default class InputManager {
    constructor(scene) {
        this.scene = scene;

        // PC Controls
        this.keys = this.scene.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            space: Phaser.Input.Keyboard.KeyCodes.SPACE,
            shift: Phaser.Input.Keyboard.KeyCodes.SHIFT,
            interact: Phaser.Input.Keyboard.KeyCodes.F,
            brake: Phaser.Input.Keyboard.KeyCodes.X,
            map: Phaser.Input.Keyboard.KeyCodes.TAB,
            build: Phaser.Input.Keyboard.KeyCodes.B // NEU
        });

        this.pointer = this.scene.input.activePointer;
        this.scene.input.mouse.disableContextMenu();

        // --- MOBILE TOUCH CONFIG ---
        this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

        // Virtual Joystick State
        this.touchMove = { x: 0, y: 0 };
        this.touchFire = false;

        if (this.isMobile) {
            this.setupTouchControls();
        }
    }

    setupTouchControls() {
        // Simple Split Screen Touch Logic
        // Left Half: Virtual Joystick (Movement)
        // Right Half: Fire & Aim
        this.scene.input.addPointer(2); // Multi-touch support
        
        // Visual Feedback (Debug)
        // In einer vollen Implementation würde hier UIScene.createVirtualJoystick() aufgerufen werden.
    }

    update() {
        if (!this.isMobile) return;

        // Reset
        this.touchMove.x = 0;
        this.touchMove.y = 0;
        this.touchFire = false;

        // Iterate Pointers (Mouse/Touch)
        [this.scene.input.pointer1, this.scene.input.pointer2].forEach(p => {
            if (p.isDown) {
                const halfWidth = this.scene.scale.width / 2;
                
                if (p.x < halfWidth) {
                    // LEFT SIDE: Movement (Joystick emulation)
                    // Wir nehmen an, dass der "Anchor" da ist, wo der Touch begann. 
                    // Vereinfacht für Audit: Relativ zur Mitte der linken Hälfte.
                    const centerX = halfWidth / 2;
                    const centerY = this.scene.scale.height - 150;

                    const dx = p.x - centerX;
                    const dy = p.y - centerY;

                    // Normalize (Clamp to -1 / 1)
                    this.touchMove.x = Phaser.Math.Clamp(dx / 50, -1, 1);
                    this.touchMove.y = Phaser.Math.Clamp(-dy / 50, -1, 1); // Invert Y for "Up"
                } else {
                    // RIGHT SIDE: Fire
                    this.touchFire = true;
                }
            }
        });
    }

    getMoveVector() {
        if (this.isMobile) {
            return new Phaser.Math.Vector2(this.touchMove.x, this.touchMove.y);
        }

        let x = 0;
        let y = 0;
        if (this.keys.up.isDown) y += 1;
        if (this.keys.down.isDown) y -= 1;
        if (this.keys.right.isDown) x += 1;
        if (this.keys.left.isDown) x -= 1;
        return new Phaser.Math.Vector2(x, y);
    }

    getFire() {
        if (this.isMobile) return this.touchFire;
        return this.pointer.isDown || this.keys.space.isDown;
    }

    getBoost() {
        // Mobile: Auto-Boost wenn Stick voll ausgeschlagen? Oder separater Button.
        // Für Audit: Stick > 0.9
        if (this.isMobile) return this.touchMove.y > 0.9;
        return this.keys.shift.isDown;
    }

    getInteract() {
        // Mobile: Tap im Center? Vereinfachung: Interact wenn nah an Station und gestoppt.
        // Hier lassen wir PC Logic dominant, Mobile bräuchte UI Button.
        return Phaser.Input.Keyboard.JustDown(this.keys.interact);
    }

    getMapToggle() {
        return Phaser.Input.Keyboard.JustDown(this.keys.map);
    }

    getBuildToggle() { // NEU
        return Phaser.Input.Keyboard.JustDown(this.keys.build);
    }

    getBrake() {
        if (this.isMobile) return false; // Mobile stoppt wenn Finger weg
        return this.keys.brake.isDown;
    }

    getAimPosition() {
        // Auf Mobile aimt das Schiff dahin, wo wir hinfliegen (Simplified Flight)
        // Oder wir nutzen den rechten Stick.
        if (this.isMobile) {
            // Wenn wir uns bewegen, schauen wir dahin.
            if (Math.abs(this.touchMove.x) > 0.1 || Math.abs(this.touchMove.y) > 0.1) {
                // Return point in front of ship based on input vector
                const ship = this.scene.player;
                if(ship) {
                    const angle = Math.atan2(this.touchMove.x, -this.touchMove.y); // -y because input Up is positive 1 in math but screen y is up negative... wait.
                    // getMoveVector Y: Up = 1. Screen Y: Up = 0.
                    // Math.atan2(y, x). 
                    // Wir wollen einen Punkt relativ zum Schiff.
                    return new Phaser.Math.Vector2(
                        ship.x + (this.touchMove.x * 200),
                        ship.y + (-this.touchMove.y * 200)
                    );
                }
            }
            return new Phaser.Math.Vector2(this.scene.cameras.main.scrollX + (this.scene.scale.width/2), this.scene.cameras.main.scrollY);
        }

        return new Phaser.Math.Vector2(
            this.pointer.x + this.scene.cameras.main.scrollX,
            this.pointer.y + this.scene.cameras.main.scrollY
        );
    }
}


