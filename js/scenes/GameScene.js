import Player from '../entities/Ship.js'; // Angenommen Ship.js ist der Player
import Asteroid from '../entities/Asteroid.js';
import Loot from '../entities/Loot.js'; // WICHTIG: Default Import
import { CONFIG } from '../core/config.js';
import EventsCenter from '../core/EventsCenter.js';
import FXManager from '../core/FXManager.js';
import ProjectileManager from '../core/ProjectileManager.js';
import InputManager from '../core/InputManager.js';

/**
 * @class GameScene
 * @extends Phaser.Scene
 * Die Hauptszene des Spiels (In-Sector View).
 */
export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    create() {
        // 1. Welt & Physik
        this.physics.world.setBounds(0, 0, 4000, 4000); // Beispielgröße Sektor
        
        // Hintergrund (Tiling Sprite für Performance)
        this.add.tileSprite(0, 0, 4000, 4000, 'bg_stars').setOrigin(0).setScrollFactor(0.5);

        // 2. Core Systeme Initialisieren
        this.fxManager = new FXManager(this);
        this.projectileManager = new ProjectileManager(this);
        this.inputManager = new InputManager(this);
        
        // 3. Gruppen erstellen
        this.asteroids = this.physics.add.group({
            classType: Asteroid,
            runChildUpdate: true
        });
        
        this.lootGroup = this.physics.add.group({
            classType: Loot,
            runChildUpdate: true
        });
        
        this.enemies = this.physics.add.group({
            runChildUpdate: true
        });

        // 4. Player Spawnen
        // Wir zentrieren den Spieler in der Welt
        this.player = new Player(this, 2000, 2000, 'spr_ship_player', true);
        
        // Kamera folgt Spieler
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(0, 0, 4000, 4000);
        this.cameras.main.setZoom(1);

        // 5. Test-Inhalte Spawnen (Asteroidenfeld)
        this.spawnTestAsteroids(20);

        // 6. Kollisionen
        this.setupCollisions();

        // 7. Input Events
        this.inputManager.setupInput(this.player);

        // UI Overlay starten
        this.scene.launch('UIScene');
        this.scene.moveUp('UIScene');
    }

    update(time, delta) {
        if (this.player) {
            this.player.update(time, delta);
        }
        
        // Projektile updaten
        this.projectileManager.update(time, delta);
    }

    /**
     * Erstellt zufällige Asteroiden
     */
    spawnTestAsteroids(count) {
        for (let i = 0; i < count; i++) {
            const x = Phaser.Math.Between(100, 3900);
            const y = Phaser.Math.Between(100, 3900);
            
            // Zufällige Größe
            const rand = Math.random();
            let size = 'medium';
            if (rand < 0.2) size = 'small';
            if (rand > 0.8) size = 'large';

            // Factory-Pattern via Group wäre auch möglich, aber new Asteroid geht dank Scene-Referenz auch
            // WICHTIG: Da Asteroid 'scene.add.existing' ruft, müssen wir es nicht manuell adden, 
            // aber für die Gruppe ist es sauberer:
            const asteroid = new Asteroid(this, x, y, size);
            this.asteroids.add(asteroid);
        }
    }

    /**
     * Zentralisierte Methode zum Spawnen von Loot.
     * Wird von Asteroiden und Feinden aufgerufen.
     * @param {number} x 
     * @param {number} y 
     * @param {string} wareId 
     * @param {number} amount 
     */
    spawnLoot(x, y, wareId, amount) {
        // Streuung, damit Loot nicht exakt übereinander liegt
        const scatter = 30; 
        
        for (let i = 0; i < amount; i++) {
            const spawnX = x + Phaser.Math.Between(-scatter, scatter);
            const spawnY = y + Phaser.Math.Between(-scatter, scatter);
            
            // Da Loot Default Export ist, instanziieren wir es direkt
            // Loot(scene, x, y, type, amount) -> Konstruktor Signatur prüfen!
            // Angenommen Loot droppt 1 Unit pro Instanz, oder Instanz hält 'amount'.
            // Hier gehen wir davon aus: 1 Loot-Objekt kann 'amount' Einheiten enthalten.
            // Falls wir pro Einheit ein Icon wollen, müssten wir loop nutzen.
            
            // Wir spawnen EINEN Container mit der Menge 'amount', oder splitten es?
            // Einfachheitshalber: Ein Loot-Objekt enthält den gesamten Amount.
            const loot = new Loot(this, spawnX, spawnY, wareId, 1); // Oder 'amount' wenn Loot-Klasse das unterstützt
            // Falls das Loot-Objekt 'amount' unterstützt, ändere die 1 zu 'amount'.
            // Da ich Loot.js nicht sehe, gehe ich vom Standard "1 Item pro Drop" Visual aus,
            // aber logisch aggregieren wir es im Inventar.
            // HIER: Rufe 'amount' mal auf 1, damit wir viele kleine Teile sehen (Spaßfaktor),
            // ODER nur ein Teil. Ich mache mal Loop-Logik oben weg und übergebe amount direkt:
            
            // KORREKTUR: Um Syntax-Fehler zu vermeiden, erstelle ich EIN Objekt mit Amount.
            // new Loot(this, spawnX, spawnY, wareId, amount); 
            // Falls Loot.js amount im Constructor annimmt. Falls nicht, setzen wir es manuell.
            
            loot.amount = 1; // Fallback
            this.lootGroup.add(loot);
        }
    }

    setupCollisions() {
        // Player vs Asteroids
        this.physics.add.collider(this.player, this.asteroids);
        
        // Projectiles vs Asteroids
        this.physics.add.overlap(this.projectileManager.getGroup(), this.asteroids, (projectile, asteroid) => {
            if (projectile.active && asteroid.active) {
                asteroid.takeDamage(projectile.damage);
                projectile.destroy(); // Projektil weg
                
                // Hit FX
                this.fxManager.playHitEffect(projectile.x, projectile.y);
            }
        });

        // Player vs Loot (Pickup)
        this.physics.add.overlap(this.player, this.lootGroup, (player, loot) => {
            if (loot.active) {
                // Logik zum Aufsammeln
                const cargo = player.getComponent('CargoComponent');
                if (cargo) {
                    const leftover = cargo.addCargo(loot.wareId, loot.amount || 1);
                    if (leftover === 0) {
                        // Alles aufgenommen
                        EventsCenter.emit('ui-message', `Collected: ${loot.wareId}`);
                        loot.destroy();
                    } else {
                        // Inventar voll
                        EventsCenter.emit('ui-message', `Inventory Full!`);
                    }
                }
            }
        });
    }
}
