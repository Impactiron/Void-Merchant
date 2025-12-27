# \# Projekt Status: Void Merchant (Init)

# Basis-Architektur

\# Projekt Status: Void Merchant (Core Setup)

\#\# Dateibaum  
\- index.html  
\- css/style.css  
\- js/core/config.js  
\- js/core/GameLoop.js  
\- js/scenes/BootScene.js

\#\# Globale Variablen & State  
\- \`window.voidMerchant\`: Referenz auf die Phaser Game Instanz.

\#\# Letzte Änderung  
\- Basis-Architektur implementiert (Phaser 3.80, ES6 Modules, Config 1280x720).

\#\# Nächster Schritt  
\- Implementierung der \`UniverseSim.js\` (The God Engine) oder \`GameScene.js\` (Player Flight).  
\- \*\*Empfehlung:\*\* Wir sollten zuerst das Schiff steuerbar machen (\`Ship.js\` \+ \`InputManager.js\`), bevor wir die Simulation bauen.

\#\# Aktueller Code-Hash  
\- index.html  
\- css/style.css  
\- js/core/config.js  
\- js/core/GameLoop.js  
\- js/scenes/BootScene.js

# Tab 8

\# Projekt Status: Void Merchant

\#\# Dateibaum  
\- index.html  
\- css/style.css  
\- js/core/config.js  
\- js/core/GameLoop.js

\#\# Globale Variablen & State  
\- \`window.game\`: Phaser Instanz  
\- \`CONFIG\`: Core Game Settings (1280x720, WebGL)

\#\# Letzte Änderung  
\- \[cite\_start\]Initiales Setup der Ordnerstruktur gemäß.  
\- Einbindung von Phaser 3.80 via CDN.  
\- Erstellung des simplen "Blue Screen" Tests.

\#\# Nächster Schritt  
\- Implementierung der echten Szenen-Logik (\`BootScene.js\`, \`MenuScene.js\`).  
\- Oder Start der \`UniverseSim.js\` (The God Engine).

\#\# Aktueller Code-Hash  
\- index.html  
\- css/style.css  
\- js/core/config.js  
\- js/core/GameLoop.js

# Tab 12

\# Projekt Status: Void Merchant (Flight Core)

\#\# Dateibaum  
\- index.html  
\- css/style.css  
\- js/core/config.js  
\- js/core/GameLoop.js  
\- js/core/InputManager.js (NEU)  
\- js/entities/Ship.js (NEU)  
\- js/scenes/BootScene.js (UPDATE)  
\- js/scenes/GameScene.js (NEU)

\#\# Globale Variablen & State  
\- \`window.game\`: Phaser Game Instanz  
\- Scenes: \`BootScene\` \-\> \`GameScene\`  
\- Input: WASD \+ Mouse

\#\# Letzte Änderung  
\- Implementierung der Flugphysik (\`Ship.js\`) basierend auf TDD Vol 4\.  
\- Implementierung des Input-Systems (\`InputManager.js\`).  
\- Erstellung der \`GameScene\` mit Camera-Follow und Infinite-Map Logic.  
\- Fallback-System für fehlende Assets in \`BootScene\`.

\#\# Nächster Schritt  
\- Implementierung des UI-Overlays (\`UIScene.js\`) zur Anzeige von Speed/Coords.  
\- ODER: Einbau von Asteroiden/Hindernissen.

\#\# Aktueller Code-Hash  
\- js/core/InputManager.js  
\- js/entities/Ship.js  
\- js/scenes/GameScene.js  
\- js/scenes/BootScene.js  
\- js/core/GameLoop.js

# Tab 13

\# Projekt Status: Void Merchant (Auto-Scaling)

\#\# Dateibaum  
\- index.html  
\- css/style.css  
\- js/core/config.js  
\- js/core/GameLoop.js  
\- js/core/InputManager.js  
\- js/entities/Ship.js (UPDATE: Auto-Size Logic)  
\- js/scenes/BootScene.js  
\- js/scenes/GameScene.js (UPDATE: Config TargetSize)

\#\# Globale Variablen & State  
\- \`window.game\`: Phaser Game Instanz  
\- Scenes: \`BootScene\` \-\> \`GameScene\`  
\- Input: WASD \+ Mouse  
\- Player: Fixed Size 64x64px

\#\# Letzte Änderung  
\- Implementierung einer Auto-Scaling Logik in \`Ship.js\`.  
\- Das Schiff wird nun immer auf \`targetSize\` (64px) skaliert, egal wie groß das Source-PNG ist.  
\- Anpassung der Hitbox auf 80% der visuellen Größe für besseres Gameplay-Gefühl.

\#\# Nächster Schritt  
\- Implementierung des UI-Overlays (\`UIScene.js\`) zur Anzeige von Speed/Coords.  
\- ODER: Einbau von Asteroiden/Hindernissen.

\#\# Aktueller Code-Hash  
\- js/entities/Ship.js  
\- js/scenes/GameScene.js

# Tab 15

\# Projekt Status: Void Merchant (HUD Implemented)

\#\# Dateibaum  
\- index.html  
\- css/style.css  
\- js/core/config.js  
\- js/core/GameLoop.js (UPDATE)  
\- js/core/InputManager.js  
\- js/entities/Ship.js  
\- js/scenes/BootScene.js  
\- js/scenes/GameScene.js (UPDATE)  
\- js/scenes/UIScene.js (NEU)

\#\# Globale Variablen & State  
\- Scenes: Boot \-\> Game \+ UI (Overlay)  
\- UI: Zeigt Speed, Pos, Hull-Bar, Shield-Bar.

\#\# Letzte Änderung  
\- Implementierung der \`UIScene.js\`.  
\- Verknüpfung im \`GameLoop\` und Start via \`GameScene.js\`.  
\- Dummy-Stats im Player-Objekt für UI-Testing.

\#\# Nächster Schritt  
\- Implementierung der Waffen (Lasers) und Projektil-Management.  
\- Asset-Integration (Grafiken für HUD und Schiff ersetzen).

\#\# Aktueller Code-Hash  
\- js/scenes/UIScene.js  
\- js/scenes/GameScene.js  
\- js/core/GameLoop.js

# Tab 16

\# Projekt Status: Void Merchant (HUD Assets Integrated)

\#\# Dateibaum  
\- index.html  
\- css/style.css  
\- js/core/config.js  
\- js/core/GameLoop.js  
\- js/core/InputManager.js  
\- js/entities/Ship.js  
\- js/scenes/BootScene.js (UPDATE: Assets)  
\- js/scenes/GameScene.js  
\- js/scenes/UIScene.js (UPDATE: Assets)  
\- assets/ui/hud/ui\_bar\_frame.jpg (NEU)  
\- assets/ui/hud/ui\_bar\_fill\_health.jpg (NEU)  
\- assets/ui/hud/ui\_bar\_fill\_shield.jpg (NEU)

\#\# Globale Variablen & State  
\- Scenes: Boot \-\> Game \+ UI  
\- UI: Nutzt nun JPG-Assets mit Crop-Logik für HP/Shields.

\#\# Letzte Änderung  
\- Integration der HUD-Assets in \`BootScene\`.  
\- Umbau der \`UIScene\` von Graphics auf Image/Crop.

\#\# Nächster Schritt  
\- Implementierung der Waffen (Lasers) und Projektil-Management.

\#\# Aktueller Code-Hash  
\- js/scenes/BootScene.js  
\- js/scenes/UIScene.js

# Tab 17

\# Projekt Status: Void Merchant (PNG Assets Fix)

\#\# Dateibaum  
\- index.html  
\- css/style.css  
\- js/core/config.js  
\- js/core/GameLoop.js  
\- js/core/InputManager.js  
\- js/entities/Ship.js  
\- js/scenes/BootScene.js (UPDATE: .png fix)  
\- js/scenes/GameScene.js  
\- js/scenes/UIScene.js  
\- assets/ui/hud/ui\_bar\_frame.png (FIX)  
\- assets/ui/hud/ui\_bar\_fill\_health.png (FIX)  
\- assets/ui/hud/ui\_bar\_fill\_shield.png (FIX)

\#\# Globale Variablen & State  
\- UI: Nutzt nun PNG-Assets (Transparenz-Support).

\#\# Letzte Änderung  
\- Umstellung des Asset-Loaders in \`BootScene.js\` auf \`.png\`.

\#\# Nächster Schritt  
\- Implementierung der Waffen (Lasers) und Projektil-Management.

\#\# Aktueller Code-Hash  
\- js/scenes/BootScene.js

# Tab 20

\# Projekt Status: Void Merchant (Weapons Hot)

\#\# Dateibaum  
\- index.html  
\- css/style.css  
\- js/core/config.js  
\- js/core/GameLoop.js  
\- js/core/InputManager.js  
\- js/core/ProjectileManager.js (NEU)  
\- js/entities/Ship.js (UPDATE)  
\- js/entities/WeaponSystem.js (NEU)  
\- js/scenes/BootScene.js (UPDATE)  
\- js/scenes/GameScene.js (UPDATE)  
\- js/scenes/UIScene.js

\#\# Globale Variablen & State  
\- Scenes: Boot \-\> Game (mit ProjectileManager) \+ UI  
\- Player: Hat nun ein WeaponSystem integriert.  
\- Input: FIRE (Space/Click) ist aktiv.

\#\# Letzte Änderung  
\- Implementierung des \`ProjectileManager\` (Object Pooling).  
\- Implementierung des \`WeaponSystem\` (Cooldowns, Hardpoints).  
\- Integration in \`Ship.js\` und \`GameScene.js\`.  
\- Fallback-Grafik für Laser in \`BootScene.js\`.

\#\# Nächster Schritt  
\- Implementierung von Zielen (Asteroiden/Debries) für Kollisions-Tests.  
\- Treffer-Feedback (Explosionen/Floating Text).

\#\# Aktueller Code-Hash  
\- js/scenes/BootScene.js  
\- js/core/ProjectileManager.js  
\- js/entities/WeaponSystem.js  
\- js/entities/Ship.js  
\- js/scenes/GameScene.js

# Tab 22

\# Projekt Status: Void Merchant (Target Practice)

\#\# Dateibaum  
\- index.html  
\- css/style.css  
\- js/core/config.js  
\- js/core/GameLoop.js  
\- js/core/InputManager.js  
\- js/core/ProjectileManager.js  
\- js/entities/Ship.js  
\- js/entities/Asteroid.js (NEU)  
\- js/entities/WeaponSystem.js  
\- js/scenes/BootScene.js (UPDATE)  
\- js/scenes/GameScene.js (UPDATE)  
\- js/scenes/UIScene.js

\#\# Globale Variablen & State  
\- Scenes: Boot \-\> Game (mit Asteroids) \+ UI  
\- Entities: Player Ship, \~20 Asteroids  
\- Physics: Collision (Ship/Rock), Overlap (Laser/Rock)

\#\# Letzte Änderung  
\- Implementierung der \`Asteroid\` Klasse mit HP und Treffer-Feedback.  
\- Einbau von Spawning-Logik und Kollisionsabfrage in \`GameScene\`.  
\- Asset-Fallback für Asteroiden in \`BootScene\`.

\#\# Nächster Schritt  
\- Implementierung von Explosionen (Partikel-System), wenn ein Asteroid zerstört wird.  
\- Loot-Drops (Resources), die man einsammeln kann (Cargo Logic).

\#\# Aktueller Code-Hash  
\- js/scenes/BootScene.js  
\- js/entities/Asteroid.js  
\- js/scenes/GameScene.js  
\- index.html

# Tab 23

\# Projekt Status: Void Merchant (Bugfix: Collision)

\#\# Dateibaum  
\- index.html  
\- css/style.css  
\- js/core/config.js  
\- js/core/GameLoop.js  
\- js/core/InputManager.js  
\- js/core/ProjectileManager.js  
\- js/entities/Ship.js  
\- js/entities/Asteroid.js (UPDATED: Correct Logic)  
\- js/entities/WeaponSystem.js  
\- js/scenes/BootScene.js  
\- js/scenes/GameScene.js (UPDATED: Robust Handler)  
\- js/scenes/UIScene.js

\#\# Globale Variablen & State  
\- Scenes: Boot \-\> Game (mit Asteroids) \+ UI  
\- Entities: Player Ship, \~20 Asteroids  
\- Physics: Collision (Ship/Rock), Overlap (Laser/Rock) \- FIXED

\#\# Letzte Änderung  
\- Bugfix in \`GameScene.js\`: \`handleLaserHitAsteroid\` prüft nun dynamisch auf die \`takeDamage\` Methode, um "is not a function" Fehler zu verhindern.  
\- \`Asteroid.js\` Validierung.

\#\# Nächster Schritt  
\- Implementierung von Explosionen (Partikel-System), wenn ein Asteroid zerstört wird.  
\- Loot-Drops (Resources), die man einsammeln kann (Cargo Logic).

\#\# Aktueller Code-Hash  
\- js/entities/Asteroid.js  
\- js/scenes/GameScene.js

# Tab 25

\# Projekt Status: Void Merchant (Explosions)

\#\# Dateibaum  
\- index.html  
\- css/style.css  
\- js/core/config.js  
\- js/core/GameLoop.js  
\- js/core/InputManager.js  
\- js/core/ProjectileManager.js  
\- js/core/FXManager.js (NEU)  
\- js/entities/Ship.js  
\- js/entities/Asteroid.js (UPDATE)  
\- js/entities/WeaponSystem.js  
\- js/scenes/BootScene.js (UPDATE)  
\- js/scenes/GameScene.js (UPDATE)  
\- js/scenes/UIScene.js

\#\# Globale Variablen & State  
\- Scenes: Boot \-\> Game (mit Asteroids & FX) \+ UI  
\- FX: \`FXManager\` handhabt Explosionen via Object Pooling.

\#\# Letzte Änderung  
\- Implementierung des \`FXManager.js\` für Partikeleffekte.  
\- Integration der Explosions-Logik beim Zerstören von Asteroiden.  
\- Asset-Fallback für Explosion in \`BootScene\`.

\#\# Nächster Schritt  
\- Loot-Drops (Resources), die man einsammeln kann (Cargo Logic).

\#\# Aktueller Code-Hash  
\- js/scenes/BootScene.js  
\- js/core/FXManager.js  
\- js/scenes/GameScene.js  
\- js/entities/Asteroid.js

# Tab 26

\# Projekt Status: Void Merchant (Auto-Scale FX Fix)

\#\# Dateibaum  
\- index.html  
\- css/style.css  
\- js/core/config.js  
\- js/core/GameLoop.js  
\- js/core/InputManager.js  
\- js/core/ProjectileManager.js  
\- js/core/FXManager.js (FIX: Auto-Scaling)  
\- js/entities/Ship.js  
\- js/entities/Asteroid.js  
\- js/entities/WeaponSystem.js  
\- js/scenes/BootScene.js  
\- js/scenes/GameScene.js  
\- js/scenes/UIScene.js

\#\# Globale Variablen & State  
\- Scenes: Boot \-\> Game (mit Asteroids & FX) \+ UI  
\- FX: \`FXManager\` skaliert nun Assets dynamisch auf TargetSize.

\#\# Letzte Änderung  
\- Bugfix in \`FXManager.js\`: Partikel-Emitter berechnet nun \`scale\` basierend auf \`targetSize / textureWidth\`.

\#\# Nächster Schritt  
\- Loot-Drops (Resources), die man einsammeln kann (Cargo Logic).

\#\# Aktueller Code-Hash  
\- js/core/FXManager.js

# Tab 28

\# Projekt Status: Void Merchant (Loot Implemented)

\#\# Dateibaum  
\- index.html  
\- css/style.css  
\- js/core/config.js  
\- js/core/GameLoop.js  
\- js/core/InputManager.js  
\- js/core/ProjectileManager.js  
\- js/core/FXManager.js  
\- js/entities/Ship.js (UPDATE: Cargo)  
\- js/entities/Asteroid.js (UPDATE: Loot Drop)  
\- js/entities/Loot.js (NEU)  
\- js/scenes/BootScene.js (UPDATE: Assets)  
\- js/scenes/GameScene.js (UPDATE: Loot Group)  
\- js/scenes/UIScene.js (UPDATE: Notification)

\#\# Globale Variablen & State  
\- Scenes: Boot \-\> Game \-\> UI  
\- Loot: Asteroiden droppen nun zufälligen "Ore" Loot beim Zerstören.  
\- Cargo: Spieler sammelt Items ein (Overlap).

\#\# Letzte Änderung  
\- Implementierung der Loot-Logik: \`Asteroid\` \-\> Droppt \`Loot\` \-\> \`Ship\` sammelt ein \-\> \`UI\` zeigt Text.  
\- Integration neuer Assets (inkl. Fallback) für Loot Container.

\#\# Nächster Schritt  
\- Implementierung einer echten Handelsstation (Station Entity), um das gesammelte Erz zu verkaufen.  
\- ODER: Ausbau des HUDs (Sektor-Map Radar).

\#\# Aktueller Code-Hash  
\- js/scenes/BootScene.js  
\- js/entities/Loot.js  
\- js/entities/Ship.js  
\- js/entities/Asteroid.js  
\- js/scenes/GameScene.js  
\- js/scenes/UIScene.js

# Tab 29

\# Projekt Status: Void Merchant (FX Fix)

\#\# Dateibaum  
\- index.html  
\- css/style.css  
\- js/core/config.js  
\- js/core/GameLoop.js  
\- js/core/InputManager.js  
\- js/core/ProjectileManager.js  
\- js/core/FXManager.js (UPDATED: Sprite Pool)  
\- js/entities/Ship.js  
\- js/entities/Asteroid.js  
\- js/entities/Loot.js  
\- js/entities/WeaponSystem.js  
\- js/scenes/BootScene.js  
\- js/scenes/GameScene.js  
\- js/scenes/UIScene.js

\#\# Globale Variablen & State  
\- FXManager: Nutzt nun \`this.scene.add.group\` statt \`particles\`, um echte Animationen abspielen zu können.

\#\# Letzte Änderung  
\- \`FXManager.js\`: Kompletter Rewrite der \`playExplosion\` Methode. Sie holt nun ein Sprite, setzt die Skalierung und feuert \`.play('anim\_explosion')\`.

\#\# Nächster Schritt  
\- Implementierung einer echten Handelsstation (Station Entity), um das gesammelte Erz zu verkaufen.

\#\# Aktueller Code-Hash  
\- js/core/FXManager.js  
\- js/scenes/BootScene.js

# Tab 31

\# Projekt Status: Void Merchant (Station & Docking)

\#\# Dateibaum  
\- index.html  
\- css/style.css  
\- js/core/config.js  
\- js/core/GameLoop.js  
\- js/core/InputManager.js (UPDATE: 'F' Key)  
\- js/core/ProjectileManager.js  
\- js/core/FXManager.js  
\- js/entities/Ship.js  
\- js/entities/Asteroid.js  
\- js/entities/Loot.js  
\- js/entities/Station.js (NEU)  
\- js/entities/WeaponSystem.js  
\- js/scenes/BootScene.js (UPDATE: Station Assets)  
\- js/scenes/GameScene.js (UPDATE: Station Spawn & Docking)  
\- js/scenes/UIScene.js (UPDATE: Docking Hint)

\#\# Globale Variablen & State  
\- Scenes: Boot \-\> Game \-\> UI  
\- Player: Kann nun mit Stationen interagieren (Taste F).  
\- Station: "Alpha Outpost" existiert bei \[2500, 1800\].  
\- Economy: Basic "Sell All" Logic implementiert (10 Cr/Unit).

\#\# Letzte Änderung  
\- Implementierung der \`Station\` Entity.  
\- Erweiterung des \`InputManager\` um Interact-Key.  
\- Basic Docking-Logik in \`GameScene\` (Distanz-Check \+ Verkauf).  
\- UI Feedback für Docking.

\#\# Nächster Schritt  
\- Implementierung eines echten UI-Menüs beim Docken (HTML Overlay oder Scene Switch), um gezielt zu kaufen/verkaufen.  
\- Persistenz der Credits (SaveSystem).

\#\# Aktueller Code-Hash  
\- js/core/InputManager.js  
\- js/entities/Station.js  
\- js/scenes/BootScene.js  
\- js/scenes/GameScene.js  
\- js/scenes/UIScene.js

# Tab 32

\# Projekt Status: Void Merchant (Hotfix: Input Syntax)

\#\# Dateibaum  
\- index.html  
\- css/style.css  
\- js/core/config.js  
\- js/core/GameLoop.js  
\- js/core/InputManager.js (FIXED)  
\- js/core/ProjectileManager.js  
\- js/core/FXManager.js  
\- js/entities/Ship.js  
\- js/entities/Asteroid.js  
\- js/entities/Loot.js  
\- js/entities/Station.js  
\- js/entities/WeaponSystem.js  
\- js/scenes/BootScene.js  
\- js/scenes/GameScene.js  
\- js/scenes/UIScene.js

\#\# Globale Variablen & State  
\- Scenes: Boot \-\> Game \-\> UI  
\- Player: Kann nun mit Stationen interagieren (Taste F).  
\- Station: "Alpha Outpost" existiert bei \[2500, 1800\].

\#\# Letzte Änderung  
\- Syntax-Fehler in \`InputManager.js\` behoben (Bereinigung von Zitier-Artefakten im \`addKeys\` Objekt).

\#\# Nächster Schritt  
\- Ausbau des HUDs (Sektor-Map Radar).

\#\# Aktueller Code-Hash  
\- js/core/InputManager.js

# Tab 33

\# Projekt Status: Void Merchant (Radar & HUD Update)

\#\# Dateibaum  
\- index.html  
\- css/style.css  
\- js/core/config.js (UPDATE: Radar Constants)  
\- js/core/GameLoop.js  
\- js/core/InputManager.js  
\- js/core/ProjectileManager.js  
\- js/core/FXManager.js  
\- js/entities/Ship.js  
\- js/entities/Asteroid.js  
\- js/entities/Loot.js  
\- js/entities/Station.js  
\- js/entities/WeaponSystem.js  
\- js/scenes/BootScene.js  
\- js/scenes/GameScene.js  
\- js/scenes/UIScene.js (UPDATE: Radar Logic)

\#\# Globale Variablen & State  
\- Scenes: Boot \-\> Game \-\> UI  
\- Radar: Active (Range: 2500px), zeigt Asteroiden (Grau), Loot (Gelb), Stationen (Blau).

\#\# Letzte Änderung  
\- Implementierung des HUD Radars in \`UIScene.js\` mittels Graphics-Shapes.  
\- Das Radar scannt in jedem Frame alle aktiven Entitäten der \`GameScene\` und projiziert sie relativ zum Spieler.

\#\# Nächster Schritt  
\- Implementierung Ausbau der Station zum echten Handelsmenü (HTML Overlay).

\#\# Aktueller Code-Hash  
\- js/core/config.js  
\- js/scenes/UIScene.js

# Tab 34

### **📝 Projekt Status: Void Merchant (Trade Update)**

## **Dateibaum**

* index.html (UPDATE: Overlay)  
* css/style.css (UPDATE: UI Styles)  
* js/core/config.js  
* js/core/GameLoop.js  
* js/core/InputManager.js  
* js/core/ProjectileManager.js  
* js/core/FXManager.js  
* js/entities/Ship.js  
* js/entities/Asteroid.js  
* js/entities/Loot.js  
* js/entities/Station.js (UPDATE: Market)  
* js/entities/WeaponSystem.js  
* js/scenes/BootScene.js  
* js/scenes/GameScene.js (UPDATE: Docking Logic)  
* js/scenes/UIScene.js

## **Globale Variablen & State**

* `isDocked`: Bool-Flag in GameScene zur Input-Steuerung.  
* `Station.market`: Objekt mit Buy/Sell Orders und Stock.  
* `Player.credits`: 1000 Start-Credits.

## **Letzte Änderung**

* Implementierung des HTML5 Handelsmenüs (`index.html`, `style.css`).  
* Implementierung der Markt-Logik in `Station.js`.  
* Verknüpfung der Logik in `GameScene.js` (Buy/Sell Handler).

## **Nächster Schritt**

* Implementierung von Schiffsausrüstung (Kauf von Waffen/Schilden im Menü).  
* Speichern des Spielstands (`SaveSystem.js`).

## **Aktueller Code-Hash**

* index.html  
* css/style.css  
* js/entities/Station.js  
* js/scenes/GameScene.js

# Tab 35

\# Projekt Status: Void Merchant (Shipyard & Progression)

\#\# Dateibaum  
\- index.html  
\- css/style.css  
\- js/core/config.js  
\- js/core/GameLoop.js  
\- js/entities/WeaponSystem.js (UPDATE: DB & Logic)  
\- js/entities/Station.js (UPDATE: Shipyard Inventory)  
\- js/scenes/GameScene.js (UPDATE: UI Logic)

\#\# Globale Variablen & State  
\- \`WEAPON\_DB\`: Enthält Stats für Pulse Laser und Mass Driver.  
\- \`Player.stats.credits\`: 5000 (Erhöht für Testzwecke).

\#\# Letzte Änderung  
\- Implementierung der \`WEAPON\_DB\` und \`equip()\` Logik.  
\- Unlock des Shipyard-Tabs im Station Menu.  
\- Kauf-Logik für Waffen implementiert.

\#\# Nächster Schritt  
\- Visuelles Feedback für verschiedene Projektil-Typen verbessern (Sprites).  
\- Speichern des Spielstands (\`SaveSystem.js\`), damit Käufe permanent bleiben.

\#\# Aktueller Code-Hash  
\- js/entities/WeaponSystem.js  
\- js/entities/Station.js  
\- index.html  
\- js/scenes/GameScene.js

# Tab 37

\# Projekt Status: Void Merchant (Save System)

\#\# Dateibaum  
\- index.html  
\- css/style.css  
\- js/core/config.js  
\- js/core/GameLoop.js  
\- js/core/SaveSystem.js (NEU)  
\- js/core/ProjectileManager.js (UPDATE: Visuals)  
\- js/entities/WeaponSystem.js  
\- js/entities/Station.js  
\- js/scenes/GameScene.js (UPDATE: Save/Load)

\#\# Globale Variablen & State  
\- \`localStorage\`: Speichert unter Key \`void\_merchant\_save\_v1\`.  
\- \`GameScene\`: Lädt beim Start automatisch, speichert bei Dock/Trade.

\#\# Letzte Änderung  
\- Implementierung der \`SaveSystem\` Klasse.  
\- Integration der Auto-Save Logik beim Docken und Handeln.  
\- Update der Projektil-Visuals (Nutzen nun \`setTint\` für rote Laser / gelbe Mass Driver).

\#\# Nächster Schritt  
\- Implementierung der Gegner-AI (\`EnemyShip.js\`), damit die Waffen auch Ziele haben.

\#\# Aktueller Code-Hash  
\- js/core/SaveSystem.js  
\- js/core/ProjectileManager.js  
\- js/scenes/GameScene.js  
\- index.html

# Tab 38

\# Projekt Status: Void Merchant (New Controls)

\#\# Dateibaum  
\- index.html  
\- css/style.css  
\- js/core/config.js  
\- js/core/GameLoop.js  
\- js/core/InputManager.js (UPDATE)  
\- js/core/ProjectileManager.js  
\- js/core/FXManager.js  
\- js/core/SaveSystem.js  
\- js/entities/Ship.js (UPDATE)  
\- js/entities/Asteroid.js  
\- js/entities/Loot.js  
\- js/entities/Station.js  
\- js/entities/WeaponSystem.js  
\- js/scenes/BootScene.js  
\- js/scenes/GameScene.js  
\- js/scenes/UIScene.js

\#\# Globale Variablen & State  
\- Input: Mouse Aiming \+ WASD (Thrust/Strafe).

\#\# Letzte Änderung  
\- Umstellung der Steuerung von "Tank Controls" auf "Mouse Aim \+ Strafe".  
\- \`InputManager.js\` liefert nun Vektoren statt Booleans.  
\- \`Ship.js\` berechnet Rotation zur Maus und nutzt Vektor-Addition für Schub/Strafe.

\#\# Nächster Schritt  
\- Implementierung von Gegner-AI (EnemyShip.js).

\#\# Aktueller Code-Hash  
\- js/core/InputManager.js  
\- js/entities/Ship.js

# Tab 39

\# Projekt Status: Void Merchant (Controls Update)

\#\# Dateibaum  
\- index.html  
\- css/style.css  
\- js/core/config.js  
\- js/core/GameLoop.js  
\- js/core/InputManager.js (UPDATE: Brake Key X)  
\- js/core/ProjectileManager.js  
\- js/core/FXManager.js  
\- js/core/SaveSystem.js  
\- js/entities/Ship.js (UPDATE: Less Inertia)  
\- js/entities/Asteroid.js  
\- js/entities/Loot.js  
\- js/entities/Station.js  
\- js/entities/WeaponSystem.js  
\- js/scenes/BootScene.js  
\- js/scenes/GameScene.js  
\- js/scenes/UIScene.js

\#\# Globale Variablen & State  
\- Input: WASD \+ Mouse \+ X (Brake)  
\- Physics: Ship Drag erhöht (0.92 \-\> 0.80) für weniger Drift.

\#\# Letzte Änderung  
\- Implementierung der Brems-Taste \`X\` im \`InputManager\`.  
\- Anpassung der Physik-Parameter in \`Ship.js\` (weniger Trägheit, höhere Grundgeschwindigkeit).

\#\# Nächster Schritt  
\- Implementierung von Gegner-AI (\`EnemyShip.js\`).

\#\# Aktueller Code-Hash  
\- js/core/InputManager.js  
\- js/entities/Ship.js

# Tab 40

\# Projekt Status: Void Merchant (Physics Tweak)

\#\# Dateibaum  
\- index.html  
\- css/style.css  
\- js/core/config.js  
\- js/core/GameLoop.js  
\- js/core/InputManager.js  
\- js/core/ProjectileManager.js  
\- js/core/FXManager.js  
\- js/core/SaveSystem.js  
\- js/entities/Ship.js (UPDATE: Physics Tweak)  
\- js/entities/Asteroid.js  
\- js/entities/Loot.js  
\- js/entities/Station.js  
\- js/entities/WeaponSystem.js  
\- js/scenes/BootScene.js  
\- js/scenes/GameScene.js  
\- js/scenes/UIScene.js

\#\# Globale Variablen & State  
\- Physics: High Drag (0.27) für präzises Stoppen.  
\- Player: Max Speed 235\.

\#\# Letzte Änderung  
\- \`Ship.js\`: Trägheit drastisch reduziert (Damping 0.80 \-\> 0.27) und MaxSpeed auf 235 gesenkt.

\#\# Nächster Schritt  
\- Implementierung von Gegner-AI (\`EnemyShip.js\`).

\#\# Aktueller Code-Hash  
\- js/entities/Ship.js

# Tab 42

\# Projekt Status: Void Merchant (Enemies Joined)

\#\# Dateibaum  
\- index.html  
\- css/style.css  
\- js/core/config.js  
\- js/core/GameLoop.js  
\- js/core/InputManager.js  
\- js/core/ProjectileManager.js  
\- js/core/FXManager.js  
\- js/core/SaveSystem.js  
\- js/entities/Ship.js  
\- js/entities/EnemyShip.js (NEU)  
\- js/entities/Asteroid.js  
\- js/entities/Loot.js  
\- js/entities/Station.js  
\- js/entities/WeaponSystem.js  
\- js/scenes/BootScene.js (UPDATE)  
\- js/scenes/GameScene.js (UPDATE)  
\- js/scenes/UIScene.js

\#\# Globale Variablen & State  
\- \`GameScene.enemies\`: Phaser Group mit Gegnern.  
\- \`EnemyShip\`: State Machine (IDLE \-\> CHASE \-\> ATTACK).

\#\# Letzte Änderung  
\- Implementierung der \`EnemyShip.js\` Klasse (Xenon N).  
\- Integration in \`GameScene\` (Spawn, Collision, Damage).  
\- Fallback-Asset für Xenon-Schiff in \`BootScene\`.

\#\# Nächster Schritt  
\- \*\*Combat Tuning:\*\* Freund-Feind-Erkennung für Laser (Friendly Fire deaktivieren).  
\- \*\*Visuelles Feedback:\*\* HUD-Warnung, wenn Gegner feuern.

\#\# Aktueller Code-Hash  
\- js/scenes/BootScene.js  
\- js/entities/EnemyShip.js  
\- js/scenes/GameScene.js

# Tab 43

\# Projekt Status: Void Merchant (Bugfix: Enemy Collision)

\#\# Dateibaum  
\- js/scenes/GameScene.js (UPDATED: Robust Handler)  
\- js/entities/EnemyShip.js  
\- js/core/ProjectileManager.js  
\- ... (Rest unverändert)

\#\# Globale Variablen & State  
\- Scenes: Boot \-\> Game (mit Enemies) \+ UI  
\- Entities: Player, Station, Asteroids, Loot, Enemies  
\- Physics: Überlappungs-Handler für Enemies nun gegen "is not a function" abgesichert.

\#\# Letzte Änderung  
\- \`GameScene.js\`: \`handleLaserHitEnemy\` prüft nun dynamisch, welches Objekt der Laser und welches der Gegner ist (via \`typeof obj.takeDamage \=== 'function'\`). Dies verhindert den Crash.

\#\# Nächster Schritt  
\- \*\*Combat Tuning:\*\* Freund-Feind-Erkennung für Laser (Friendly Fire deaktivieren).  
\- \*\*Visuelles Feedback:\*\* HUD-Warnung, wenn Gegner feuern.

\#\# Aktueller Code-Hash  
\- js/scenes/GameScene.js

# Tab 44

\# Projekt Status: Void Merchant (Friendly Fire Fixed)

\#\# Dateibaum  
\- index.html  
\- css/style.css  
\- js/core/config.js  
\- js/core/GameLoop.js  
\- js/core/InputManager.js  
\- js/core/ProjectileManager.js (UPDATED: Groups Split)  
\- js/core/FXManager.js  
\- js/core/SaveSystem.js  
\- js/entities/Ship.js (UPDATED: Faction ID)  
\- js/entities/EnemyShip.js (UPDATED: Faction ID)  
\- js/entities/Asteroid.js  
\- js/entities/Loot.js  
\- js/entities/Station.js  
\- js/entities/WeaponSystem.js (UPDATED: Group Selection)  
\- js/scenes/BootScene.js  
\- js/scenes/GameScene.js (UPDATED: Collision Wiring)  
\- js/scenes/UIScene.js

\#\# Globale Variablen & State  
\- Physics Groups: \`playerLasers\` vs \`enemyLasers\`  
\- Faction: 'PLAYER' vs 'XENON'

\#\# Letzte Änderung  
\- Implementierung der \*\*IFF (Freund-Feind-Erkennung)\*\*.  
\- \`ProjectileManager\` verwaltet nun zwei getrennte Gruppen.  
\- \`WeaponSystem\` wählt automatisch die richtige Gruppe basierend auf der Schiffs-Fraktion.  
\- \`GameScene\` Kollisions-Handler wurden aktualisiert, um "Friendly Fire" zu verhindern.

\#\# Nächster Schritt  
\- Implementierung des UI-Feedbacks für Treffer (Roter Rand im HUD).  
\- HUD Indikator "UNDER ATTACK".

\#\# Aktueller Code-Hash  
\- js/entities/Ship.js  
\- js/entities/EnemyShip.js  
\- js/core/ProjectileManager.js  
\- js/entities/WeaponSystem.js  
\- js/scenes/GameScene.js

# Tab 45

\# Projekt Status: Void Merchant (Visual Feedback)

\#\# Dateibaum  
\- index.html  
\- css/style.css  
\- js/core/config.js  
\- js/core/GameLoop.js  
\- js/core/InputManager.js  
\- js/core/ProjectileManager.js  
\- js/core/FXManager.js (UPDATED: Text Pool)  
\- js/core/SaveSystem.js  
\- js/entities/Ship.js  
\- js/entities/EnemyShip.js  
\- js/entities/Asteroid.js  
\- js/entities/Loot.js  
\- js/entities/Station.js  
\- js/entities/WeaponSystem.js  
\- js/scenes/BootScene.js  
\- js/scenes/GameScene.js (UPDATED: Combat Feedback)  
\- js/scenes/UIScene.js (UPDATED: Damage Overlay)

\#\# Globale Variablen & State  
\- \`UIScene.damageOverlay\`: Rotes Flash-Overlay für Treffer.  
\- \`FXManager.textPool\`: Objekt-Pool für aufsteigende Schadenszahlen.

\#\# Letzte Änderung  
\- Implementierung von visuellem Kampf-Feedback.  
\- \`FXManager\` kann nun \`showFloatingText()\` ausführen.  
\- \`UIScene\` hat ein rotes Overlay für \`triggerDamageFlash()\`.  
\- \`GameScene\` ruft diese Effekte bei Kollisionen auf.

\#\# Nächster Schritt  
\- Implementierung eines "Game Over" Screens, wenn HP \<= 0\.  
\- Oder: Loot-Drops für zerstörte Gegnerschiffe.

\#\# Aktueller Code-Hash  
\- js/core/FXManager.js  
\- js/scenes/UIScene.js  
\- js/scenes/GameScene.js

# Tab 46

\# Projekt Status: Void Merchant (Game Over Logic)

\#\# Dateibaum  
\- index.html  
\- css/style.css  
\- js/core/config.js  
\- js/core/GameLoop.js  
\- js/core/InputManager.js  
\- js/core/ProjectileManager.js  
\- js/core/FXManager.js  
\- js/core/SaveSystem.js  
\- js/entities/Ship.js  
\- js/entities/EnemyShip.js  
\- js/entities/Asteroid.js  
\- js/entities/Loot.js  
\- js/entities/Station.js  
\- js/entities/WeaponSystem.js  
\- js/scenes/BootScene.js  
\- js/scenes/GameScene.js (UPDATE: Death Handler)  
\- js/scenes/UIScene.js (UPDATE: Game Over Screen)

\#\# Globale Variablen & State  
\- \`isGameOver\`: Boolean Flag in \`GameScene\`, blockiert Input und Physics-Updates für den Spieler.  
\- UI: Neuer Container \`gameOverContainer\` (Z-Index 1000).

\#\# Letzte Änderung  
\- Implementierung der Death-Condition (\`hullCurrent \<= 0\`).  
\- Implementierung des "Critical Failure" Screens mit Restart-Funktion (Space/Click \-\> Page Reload).  
\- Visuelle Explosion beim Spielertod.

\#\# Nächster Schritt  
\- implementierung eines Start bildschirms mit auswahl neues Spiel, Spielstand laden, aktuellen spielstand löschen

\#\# Aktueller Code-Hash  
\- js/scenes/UIScene.js  
\- js/scenes/GameScene.js

# Tab 48

\# Projekt Status: Void Merchant (Menu System)

\#\# Dateibaum  
\- index.html (UPDATED: Menu Overlay)  
\- css/style.css (UPDATED: Menu Styles)  
\- js/core/config.js  
\- js/core/GameLoop.js (UPDATED: Added MenuScene)  
\- js/scenes/MenuScene.js (NEU)  
\- js/scenes/BootScene.js (UPDATED: Start \-\> Menu)  
\- js/scenes/GameScene.js  
\- ... (Restliche Dateien unverändert)

\#\# Globale Variablen & State  
\- State Flow: \`BootScene\` \-\> \`MenuScene\` \-\> \`GameScene\`  
\- \`SaveSystem\`: Verwaltet nun den Zugriff auf den "Continue"-Button.

\#\# Letzte Änderung  
\- Implementierung des Hauptmenüs (HTML/CSS Overlay).  
\- Implementierung der \`MenuScene.js\` mit Logik für New Game / Continue / Wipe Save.  
\- Boot-Reihenfolge geändert.

\#\# Nächster Schritt  
\- Implementierung von Gegner-Wellen oder Missionen, um dem Spieler Ziele zu geben.  
\- ODER: Ausbau des HUDs (Sektor-Map Radar visuell verbessern).

\#\# Aktueller Code-Hash  
\- index.html  
\- css/style.css  
\- js/scenes/MenuScene.js  
\- js/core/GameLoop.js  
\- js/scenes/BootScene.js

# Tab 49

\# Projekt Status: Void Merchant (Hotfix: Duplicate Scene)

\#\# Dateibaum  
\- index.html (UPDATED)  
\- css/style.css  
\- js/core/config.js  
\- js/core/GameLoop.js (FIXED: Instance Check)  
\- js/scenes/MenuScene.js (FIXED: Correct Key)  
\- js/scenes/GameScene.js  
\- ... (Rest unverändert)

\#\# Globale Variablen & State  
\- \`window.game\`: Phaser Instanz (Wird nun sicher neu erstellt).

\#\# Letzte Änderung  
\- \[cite\_start\]Behebung des "Duplicate key: GameScene" Fehlers durch Härtung der \`GameLoop.js\` und Bereinigung der \`MenuScene.js\`.\[cite: 1286, 3017\]

\#\# Nächster Schritt  
\- Implementierung von Gegner-Wellen oder Missionen.

\#\# Aktueller Code-Hash  
\- js/core/GameLoop.js  
\- js/scenes/MenuScene.js  
\- index.html

# Tab 50

\# Projekt Status: Void Merchant (Phase 1 Final)

\#\# Dateibaum  
\- index.html  
\- css/style.css  
\- js/core/config.js  
\- js/core/GameLoop.js  
\- js/core/InputManager.js  
\- js/core/ProjectileManager.js  
\- js/core/FXManager.js  
\- js/core/SaveSystem.js  
\- js/entities/Ship.js  
\- js/entities/EnemyShip.js  
\- js/entities/Asteroid.js  
\- js/entities/Loot.js  
\- js/entities/Station.js  
\- js/entities/WeaponSystem.js  
\- js/scenes/BootScene.js  
\- js/scenes/MenuScene.js  
\- js/scenes/GameScene.js (UPDATED: Wave Logic)  
\- js/scenes/UIScene.js

\#\# Globale Variablen & State  
\- \`GameScene\`: Handhabt nun dynamische Spawns (Asteroids \< 15, Enemies \< 2).  
\- \`GameState\`: Endlose Herausforderung durch Respawn.

\#\# Letzte Änderung  
\- Implementierung der \`handleSectorPopulation\` Logik in \`GameScene.js\`.  
\- Asteroiden und Gegner spawnen nun nach, wenn sie zerstört werden.  
\- Warnmeldung im HUD ("HOSTILES DETECTED") bei Gegner-Spawn.

\#\# Nächster Schritt  
\- \*\*PHASE 1 ABGESCHLOSSEN.\*\*  
\- Start Phase 2: Implementierung mehrerer Sektoren (Tore/Sprünge) gemäß TDD Volume 9\.  
\- Audio-Integration (Volume 3).

\#\# Aktueller Code-Hash  
\- js/scenes/GameScene.js

# Tab 58

\# Projekt Status: Void Merchant (Sector Logic)

\#\# Dateibaum  
\- index.html  
\- css/style.css  
\- js/core/config.js (UPDATE)  
\- js/core/GameLoop.js  
\- js/core/InputManager.js  
\- js/core/ProjectileManager.js  
\- js/core/FXManager.js  
\- js/core/SaveSystem.js  
\- js/data/SectorDB.js (NEU)  
\- js/entities/Ship.js  
\- js/entities/EnemyShip.js  
\- js/entities/Asteroid.js  
\- js/entities/Loot.js  
\- js/entities/Station.js  
\- js/entities/Gate.js (NEU)  
\- js/entities/WeaponSystem.js  
\- js/scenes/BootScene.js (UPDATE: Assets)  
\- js/scenes/MenuScene.js  
\- js/scenes/GameScene.js (UPDATE: Sector Logic)  
\- js/scenes/UIScene.js

\#\# Globale Variablen & State  
\- \`GameScene.currentSectorId\`: String (z.B. 'sec\_argon\_prime').  
\- \`SECTOR\_DB\`: Enthält Map-Daten.  
\- \`gates\`: Phaser Group für Sprungtore.

\#\# Letzte Änderung  
\- Implementierung der \`SectorDB\` und \`Gate\` Entity.  
\- \`GameScene\` lädt nun Sektoren dynamisch und unterstützt Scene-Restarts mit Datenübertrag (Jump).

\#\# Nächster Schritt  
\- Galaxy Map UI und SaveSystem Erweiterung.

\#\# Aktueller Code-Hash  
\- js/data/SectorDB.js  
\- js/entities/Gate.js  
\- js/scenes/BootScene.js  
\- js/scenes/GameScene.js  
\- js/core/config.js

# Tab 60

\# Projekt Status: Void Merchant (Galaxy Map)

\#\# Dateibaum  
\- index.html  
\- css/style.css  
\- js/core/config.js  
\- js/core/GameLoop.js (UPDATE: MapScene Registered)  
\- js/core/InputManager.js (UPDATE: TAB Key)  
\- js/scenes/MapScene.js (NEU: Galaxy Map UI)  
\- js/scenes/GameScene.js (UPDATE: Map Toggle Logic)  
\- js/data/SectorDB.js (UPDATE: Map Coordinates)  
\- ... (Restliche Entity Files unverändert)

\#\# Globale Variablen & State  
\- \`MapScene\`: UI Overlay Scene.  
\- \`InputManager\`: Added \`TAB\` support.

\#\# Letzte Änderung  
\- Implementierung der Galaxy Map Visualisierung.  
\- Spieler kann nun mit TAB eine Karte öffnen, die Sektoren und Verbindungen anzeigt.  
\- Sektoren haben nun \`mapPosition\` Koordinaten für das Grid-Layout.

\#\# Nächster Schritt  
\- Implementierung des Audiosystems (Volume 3).  
\- \*\*📋 Auftrag für den Grafik-Designer:\*\* Keine neuen Grafiken benötigt, Map nutzt Phaser Graphics (Primitive Shapes).

\#\# Aktueller Code-Hash  
\- js/data/SectorDB.js  
\- js/core/InputManager.js  
\- js/scenes/MapScene.js  
\- js/core/GameLoop.js  
\- js/scenes/GameScene.js

# Tab 62

\# Projekt Status: Void Merchant (Audio Implemented)

\#\# Dateibaum  
\- index.html  
\- css/style.css  
\- js/core/AudioManager.js (NEU)  
\- js/core/FXManager.js (UPDATE: Audio)  
\- js/core/GameLoop.js  
\- js/scenes/BootScene.js (UPDATE: Load Assets)  
\- js/scenes/GameScene.js (UPDATE: Music Init)  
\- js/scenes/MenuScene.js (UPDATE: Menu Music)  
\- js/entities/WeaponSystem.js (UPDATE: Shoot SFX)

\#\# Globale Variablen & State  
\- \`AudioManager\`: Globaler Manager pro Scene, kontrolliert Volume und Crossfades.

\#\# Letzte Änderung  
\- Implementierung der \`AudioManager\` Klasse.  
\- Integration von Musik für Menü und Sektoren.  
\- Integration von SFX für Waffen, Explosionen, UI.

\#\# Nächster Schritt  
\- Erweiterung der UI für eine Galaxy Map Visualisierung (TDD Vol 6).  
\- ODER: Implementierung des "Station Architect" (Building system).

\#\# Aktueller Code-Hash  
\- js/core/AudioManager.js  
\- js/scenes/BootScene.js  
\- js/scenes/MenuScene.js  
\- js/scenes/GameScene.js  
\- js/entities/WeaponSystem.js  
\- js/core/FXManager.js

# Tab 63

\# Projekt Status: Void Merchant (Data Layer Init)

\#\# Dateibaum  
\- index.html (UPDATED: Added DB Scripts)  
\- js/data/WareDB.js (NEU)  
\- js/data/WeaponDB.js (NEU)  
\- js/data/ShipDB.js (NEU)  
\- js/entities/WeaponSystem.js (UPDATED: Import fix)  
\- ... (Rest unverändert)

\#\# Globale Variablen & State  
\- \`WEAPON\_DB\`: Nun zentralisiert in \`js/data/WeaponDB.js\`.  
\- \`WARE\_DB\`: Implementiert Economy Tiers 0-3.  
\- \`SHIP\_DB\`: Enthält Stats für ARG, XEN, TER.

\#\# Letzte Änderung  
\- Implementierung der vollständigen Datenbanken gemäß TDD Volumes 5, 7, 8\.  
\- Umbau des \`WeaponSystem.js\` zur Nutzung der externen DB.

\#\# Nächster Schritt  
\- Refactoring der \`Ship.js\` Klasse, um Stats beim Instanziieren direkt aus der \`SHIP\_DB\` zu laden (statt Hardcoding im Constructor), damit wir verschiedene Schiffstypen (Scouts, Fighter, Xenon) dynamisch spawnen können.  
\- Implementierung der \`UniverseSim.js\` (OOS Logik) unter Nutzung der neuen Daten.

\#\# Aktueller Code-Hash  
\- js/data/WareDB.js  
\- js/data/WeaponDB.js  
\- js/data/ShipDB.js  
\- js/entities/WeaponSystem.js  
\- index.html

# Tab 64

\# Projekt Status: Void Merchant (Data-Driven Ship)

\#\# Dateibaum  
\- index.html  
\- css/style.css  
\- js/core/config.js  
\- js/core/GameLoop.js  
\- js/core/InputManager.js  
\- js/core/ProjectileManager.js  
\- js/core/FXManager.js  
\- js/core/SaveSystem.js  
\- js/core/AudioManager.js  
\- js/data/SectorDB.js  
\- js/data/WareDB.js  
\- js/data/ShipDB.js  
\- js/data/WeaponDB.js  
\- js/entities/Ship.js (UPDATED: Uses ShipDB)  
\- js/entities/EnemyShip.js  
\- js/entities/Asteroid.js  
\- js/entities/Loot.js  
\- js/entities/Station.js  
\- js/entities/Gate.js  
\- js/entities/WeaponSystem.js  
\- js/scenes/BootScene.js  
\- js/scenes/MenuScene.js  
\- js/scenes/GameScene.js (UPDATED: Ship Instantiation)  
\- js/scenes/UIScene.js  
\- js/scenes/MapScene.js

\#\# Globale Variablen & State  
\- \`Ship\`: Erhält nun \`shipId\` im Constructor und lädt Stats dynamisch.  
\- \`GameScene\`: Übergibt \`shipId\` beim Neustart/Jump.

\#\# Letzte Änderung  
\- Refactoring \`Ship.js\` zur Nutzung der \`SHIP\_DB\`.  
\- Update \`GameScene.js\` zur korrekten Initialisierung des Players mit neuer Ship-Logik.

\#\# Nächster Schritt  
\- Implementierung der \`UniverseSim.js\` (The God Engine), um die Hintergrundsimulation (OOS) zu starten.

\#\# Aktueller Code-Hash  
\- js/entities/Ship.js  
\- js/scenes/GameScene.js

# (God Engine Init)

\# Projekt Status: Void Merchant (God Engine Init)

\#\# Dateibaum  
\- index.html (UPDATED)  
\- css/style.css  
\- js/core/config.js  
\- js/core/GameLoop.js (UPDATED: Starts UniverseSim)  
\- js/core/UniverseSim.js (NEU: Background Simulation)  
\- js/core/InputManager.js  
\- ... (Rest unverändert)

\#\# Globale Variablen & State  
\- \`window.game.universe\`: Referenz auf die aktive \`UniverseSim\` Instanz.  
\- Simulation State: Running (1 Tick/sec), ignoriert aktuell noch logisch leere Sektoren.

\#\# Letzte Änderung  
\- Implementierung der \`UniverseSim.js\`.  
\- Integration in den \`GameLoop\` und \`index.html\`.  
\- Die Simulation prüft nun sekündlich, wo der Spieler ist, und bereitet die OOS-Simulation für andere Sektoren vor.

\#\# Nächster Schritt  
\- \*\*Economy-Logik (TDD Vol 2 & 5):\*\* Wir müssen \`UniverseSim\` beibringen, die Stationen in \`SECTOR\_DB\` tatsächlich produzieren zu lassen. Aktuell sind die Stationen in der DB nur "Spawn-Punkte" ohne Inventar. Wir brauchen eine \`StationRegistry\` innerhalb der Simulation.

\#\# Aktueller Code-Hash  
\- js/core/UniverseSim.js  
\- js/core/GameLoop.js  
\- index.html

# (Economy Core)

### **Projekt Status: Void Merchant (Economy Core)**

`project_memory.md`

## **Dateibaum**

* index.html  
* css/style.css  
* js/core/config.js  
* js/core/GameLoop.js  
* js/core/UniverseSim.js (UPDATED: Production Logic)  
* js/core/InputManager.js  
* js/core/ProjectileManager.js  
* js/core/FXManager.js  
* js/core/SaveSystem.js  
* js/core/AudioManager.js  
* js/data/SectorDB.js  
* js/data/WareDB.js  
* js/data/ShipDB.js  
* js/data/WeaponDB.js  
* js/entities/Ship.js  
* js/entities/EnemyShip.js  
* js/entities/Asteroid.js  
* js/entities/Loot.js  
* js/entities/Station.js  
* js/entities/Gate.js  
* js/entities/WeaponSystem.js  
* js/scenes/BootScene.js  
* js/scenes/MenuScene.js  
* js/scenes/GameScene.js  
* js/scenes/UIScene.js  
* js/scenes/MapScene.js

## **Globale Variablen & State**

* `window.game.universe`: Hält nun die `stationRegistry` mit Live-Wirtschaftsdaten.  
* `stationRegistry`: Map\<ID, Data\> (Stock, Production).  
* `UniverseSim`: Läuft im Hintergrund und produziert alle X Sekunden Waren basierend auf `initializeEconomy()`.

## **Letzte Änderung**

* Implementierung der **Economy Core Loop** in `UniverseSim.js`.  
* Die Simulation registriert nun beim Start alle Stationen aus der `SECTOR_DB`.  
* Stationen produzieren nun `energy_cells` oder `refined_metal` basierend auf ihrem Namen (Heuristik).  
* Debug-Logs zeigen alle 10 Sekunden den globalen Energiestand.

## **Nächster Schritt**

* **Bridge In-Game:** Die `GameScene` und vor allem die `Station.js` (UI beim Docken) müssen nun die **echten Daten** aus der `UniverseSim` abrufen, statt lokal generierte Dummy-Daten anzuzeigen.  
* Wir müssen `Station.js` so anpassen, dass sie beim Docken `universe.getStationData(...)` aufruft.

## **Aktueller Code-Hash**

* js/core/UniverseSim.js

# (Economy Bridged & Synth Audio)

\# Projekt Status: Void Merchant (Economy Bridged & Synth Audio)

\#\# Dateibaum  
\- index.html  
\- css/style.css  
\- js/core/config.js  
\- js/core/GameLoop.js  
\- js/core/UniverseSim.js  
\- js/core/AudioManager.js (UPDATED: Synth Fallback)  
\- js/entities/Station.js (UPDATED: Sim Sync)  
\- js/scenes/BootScene.js (UPDATED: Audio Disabled)  
\- js/scenes/GameScene.js (UPDATED: Trigger Sync)  
\- ... (andere Dateien unverändert)

\#\# Globale Variablen & State  
\- \`window.game.universe\`: Simulation läuft.  
\- \`Station.market\`: Wird nun dynamisch aus \`universe.getStationData()\` befüllt.  
\- Audio: Läuft über Web Audio API Oscillators statt Dateien.

\#\# Letzte Änderung  
\- \`AudioManager.js\` nutzt nun Oscillators für "Pew Pew" und "Beep" Sounds, da keine MP3s geladen werden.  
\- \`BootScene.js\` lädt keine Audio-Dateien mehr.  
\- \`Station.js\` synchronisiert sich beim Docken (\`GameScene.openStationMenu\`) mit der Simulation.

\#\# Nächster Schritt  
\- Das Wirtschaftssystem läuft nun im Hintergrund und ist mit dem UI verbunden.  
\- Wir sollten nun visuelles Feedback für die Stationen hinzufügen (z.B. unterschiedliche Sprites je nach Typ) oder Missionen einbauen.  
\- \*\*Empfehlung:\*\* Mission System (Volume 9\) – Generierung von Transportaufträgen.

\#\# Aktueller Code-Hash  
\- js/core/AudioManager.js  
\- js/scenes/BootScene.js  
\- js/entities/Station.js  
\- js/scenes/GameScene.js

# (Mission System)

\# Projekt Status: Void Merchant (Mission System)

\#\# Dateibaum  
\- index.html (UPDATED: Mission UI)  
\- css/style.css  
\- js/core/config.js  
\- js/core/GameLoop.js (UPDATED: Added MissionManager)  
\- js/core/MissionManager.js (NEU)  
\- js/entities/Station.js (UPDATED: Mission Generation)  
\- js/scenes/GameScene.js (UPDATED: UI Handling)  
\- ... (Rest unverändert)

\#\# Globale Variablen & State  
\- \`window.game.missionManager\`: Globaler Manager für aktive Missionen.  
\- \`Station.availableMissions\`: Array mit generierten Aufträgen.

\#\# Letzte Änderung  
\- Implementierung des Mission-Boards (TDD Vol 2, 3.2).  
\- Spieler können nun "Supply"-Missionen an Stationen annehmen.  
\- Automatische Generierung basierend auf Lagerengpässen der Simulation.  
\- "Mission Complete" Check beim Verkauf von Waren implementiert.

\#\# Nächster Schritt  
\- Implementierung des "Station Builder" (Vol 10\) oder Ausbau der Galaxy Map mit Faction-Colors.  
\- Speichern der aktiven Missionen im \`SaveSystem.js\`.

\#\# Aktueller Code-Hash  
\- js/core/MissionManager.js  
\- js/core/GameLoop.js  
\- js/entities/Station.js  
\- index.html  
\- js/scenes/GameScene.js  
\- css/style.css

# (Mission Persistence)

\# Projekt Status: Void Merchant (Mission Persistence)

\#\# Dateibaum  
\- index.html  
\- css/style.css  
\- js/core/config.js  
\- js/core/GameLoop.js  
\- js/core/InputManager.js  
\- js/core/ProjectileManager.js  
\- js/core/FXManager.js  
\- js/core/SaveSystem.js (UPDATE: Missions Slot)  
\- js/core/AudioManager.js  
\- js/core/UniverseSim.js  
\- js/core/MissionManager.js (UPDATE: Import/Export)  
\- js/data/SectorDB.js  
\- js/data/WareDB.js  
\- js/data/WeaponDB.js  
\- js/data/ShipDB.js  
\- js/entities/Ship.js  
\- js/entities/EnemyShip.js  
\- js/entities/Asteroid.js  
\- js/entities/Loot.js  
\- js/entities/Station.js  
\- js/entities/Gate.js  
\- js/entities/WeaponSystem.js  
\- js/scenes/BootScene.js  
\- js/scenes/MenuScene.js  
\- js/scenes/GameScene.js (UPDATE: Load Missions)  
\- js/scenes/UIScene.js  
\- js/scenes/MapScene.js

\#\# Globale Variablen & State  
\- \`window.game.missionManager\`: Hält aktive Missionen auch beim Sektorwechsel.  
\- \`SaveSystem\`: Speichert nun \`missions: \[\]\` Array.

\#\# Letzte Änderung  
\- Implementierung der \*\*Mission Persistence\*\*.  
\- \`GameScene\` lädt nun Missionen aus dem Savegame beim Start.  
\- \`MissionManager\` filtert abgelaufene Missionen beim Speichern und Laden.  
\- \`SaveSystem\` wurde auf Version 0.4.4 aktualisiert.

\#\# Nächster Schritt  
\- \*\*Station Builder (Volume 10)\*\*: Da die Basis nun extrem stabil ist (Handel, Kampf, Missionen, Speichern), können wir den Spieler bauen lassen.  
\- ODER: Verfeinerung der Galaxy Map (Farben, Fraktionsgebiete) für bessere Orientierung.

\#\# Aktueller Code-Hash  
\- js/core/MissionManager.js  
\- js/core/SaveSystem.js  
\- js/scenes/GameScene.js

# (Builder Init)

\# Projekt Status: Void Merchant (Builder Init)

\#\# Dateibaum  
\- index.html (UPDATED)  
\- css/style.css  
\- js/core/config.js  
\- js/core/GameLoop.js (UPDATED: Added BuilderScene)  
\- js/core/InputManager.js (UPDATED: Added Build Key \[B\])  
\- js/core/ProjectileManager.js  
\- js/core/FXManager.js  
\- js/core/SaveSystem.js  
\- js/core/AudioManager.js  
\- js/core/UniverseSim.js  
\- js/core/MissionManager.js  
\- js/data/SectorDB.js  
\- js/data/WareDB.js  
\- js/data/ShipDB.js  
\- js/data/WeaponDB.js  
\- js/data/ModuleDB.js (NEU: Bauteil-Daten)  
\- js/scenes/BuilderScene.js (NEU: Architekt-Modus)  
\- js/scenes/GameScene.js (UPDATED: Build Trigger)  
\- js/scenes/BootScene.js  
\- js/scenes/MenuScene.js  
\- js/scenes/UIScene.js  
\- js/scenes/MapScene.js

\#\# Globale Variablen & State  
\- \`BuilderScene\`: Neue Szene, aktivierbar mit Taste 'B' im freien Raum.  
\- \`MODULE\_DB\`: Enthält Definitionen für Solar Panels, Docks und Konnektoren.

\#\# Letzte Änderung  
\- Implementierung des \*\*Station Builder Frameworks\*\*.  
\- Datenbasis für Module erstellt.  
\- \`BuilderScene\` rendert ein Grid und erlaubt das Platzieren von "Ghost"-Modulen via Maus.  
\- Integration in den Game-Loop.

\#\# Nächster Schritt  
\- Implementierung der \*\*Snapping Logic\*\* (TDD Vol 10, 1.2): Module sollen magnetisch an die Sockets anderer Module andocken.  
\- Berechnung der Baukosten (Credits & Ressourcen abziehen).

\#\# Aktueller Code-Hash  
\- js/data/ModuleDB.js  
\- js/scenes/BuilderScene.js  
\- js/core/InputManager.js  
\- js/core/GameLoop.js  
\- js/scenes/GameScene.js  
\- index.html

# \# Projekt Status: Void Merchant

\# Projekt Status: Void Merchant  
\#\# Dateibaum  
\* index.html  
\* css/style.css  
\* js/core/GameLoop.js  
\* js/core/InputManager.js  
\* js/core/ProjectileManager.js  
\* js/core/FXManager.js  
\* js/core/AudioManager.js  
\* js/core/UniverseSim.js  
\* js/core/MissionManager.js  
\* js/core/SaveSystem.js  
\* js/core/config.js  
\* js/scenes/BootScene.js  
\* js/scenes/MenuScene.js  
\* js/scenes/GameScene.js  
\* js/scenes/UIScene.js  
\* js/scenes/MapScene.js  
\* js/scenes/BuilderScene.js (UPDATED: Snapping Logic)  
\* js/entities/Ship.js  
\* js/entities/EnemyShip.js  
\* js/entities/Station.js  
\* js/entities/Asteroid.js  
\* js/entities/Loot.js  
\* js/entities/Gate.js  
\* js/entities/WeaponSystem.js  
\* js/data/ShipDB.js  
\* js/data/WeaponDB.js  
\* js/data/WareDB.js  
\* js/data/SectorDB.js  
\* js/data/ModuleDB.js

\#\# Globale Variablen & State  
\* \`placedModules\`: Speichert Position und ID der Module im Builder.  
\* \`SNAP\_THRESHOLD\`: Definiert, wie nah die Maus sein muss (30px).

\#\# Letzte Änderung  
\* \*\*BuilderScene:\*\* Snapping-Algorithmus implementiert. Geister-Module "springen" jetzt magnetisch an die Sockets existierender Module, statt nur am Grid zu kleben. Grüner Tint signalisiert erfolgreiches Snappen.

\#\# Nächster Schritt  
\* \*\*Validierung:\*\* Prüfen, ob Module überlappen (Kollisionsabfrage), bevor das Platzieren erlaubt wird.

# \# Projekt Status: Void Merchant (v0

\# Projekt Status: Void Merchant (v0.5.0 Architect)

\#\# Dateibaum  
\- index.html  
\- css/style.css  
\- js/core/GameLoop.js  
\- js/core/InputManager.js  
\- js/core/ProjectileManager.js  
\- js/core/FXManager.js  
\- js/core/AudioManager.js  
\- js/core/UniverseSim.js (Wirtschaftssimulation läuft)  
\- js/core/MissionManager.js (Supply Missionen aktiv)  
\- js/core/SaveSystem.js  
\- js/core/config.js  
\- js/scenes/BootScene.js  
\- js/scenes/MenuScene.js  
\- js/scenes/GameScene.js  
\- js/scenes/UIScene.js  
\- js/scenes/MapScene.js  
\- js/scenes/BuilderScene.js (Stub/Alpha)  
\- js/entities/Ship.js  
\- js/entities/EnemyShip.js  
\- js/entities/Station.js  
\- js/entities/Asteroid.js  
\- js/entities/Loot.js  
\- js/entities/Gate.js  
\- js/entities/WeaponSystem.js  
\- js/data/ShipDB.js  
\- js/data/WeaponDB.js  
\- js/data/WareDB.js  
\- js/data/SectorDB.js  
\- js/data/ModuleDB.js

\#\# Globale Variablen & State  
\- \`window.game\`: Phaser Instanz  
\- \`window.game.universe\`: God Engine Instanz (Tick Rate: 1s)  
\- \`Player\`: Inventar, Credits, Schiffszustand persistent.

\#\# Letzte Änderung  
\- Analyse des Deltas zur Version 1.0 durchgeführt.  
\- Feststellung: Kernsysteme (Flug, Handel, Kampf, Sim-Loop) sind vorhanden.  
\- Fehlend: NPC-Schiffsverkehr (OOS), Stationsbau-Logik (Snapping), Fraktions-KI, Assets.

\#\# Nächster Schritt  
\- \*\*Entscheidung:\*\* Möchtest du zuerst den \*\*Stationsbau (BuilderScene)\*\* fertigstellen (Visualität) oder die \*\*OOS-Handels-KI\*\* (Simulation/Tiefe) implementieren?

# \# Projekt Status: Void Merchant (Agent Logic V1)

\# Projekt Status: Void Merchant (Agent Logic V1)

\#\# Dateibaum  
\- index.html  
\- css/style.css  
\- js/core/config.js  
\- js/core/GameLoop.js  
\- js/core/UniverseSim.js (UPDATED: Trade Agents)  
\- js/core/MissionManager.js  
\- js/core/SaveSystem.js  
\- js/data/SectorDB.js  
\- js/scenes/GameScene.js  
... (Rest unverändert)

\#\# Globale Variablen & State  
\- \`window.game.universe.agents\`: Array der aktiven TradeAgent Objekte.  
\- Agenten transportieren nun \`energy\_cells\` und \`refined\_metal\` zwischen Stationen.

\#\# Letzte Änderung  
\- Implementierung der \`TradeAgent\` Klasse in \`UniverseSim.js\`.  
\- Händler suchen sich Routen, reisen (Timer) und handeln (Stock update).  
\- \`UniverseSim\` spawnt nun 2 Händler pro sicherem Sektor.

\#\# Nächster Schritt  
\- \*\*Visualisierung:\*\* Die \`GameScene.js\` muss nun \`universe.getAgentsInSector()\` abfragen und diese Geister-Schiffe als echte Sprites spawnen, damit der Spieler sie sieht und abschießen/scannen kann.

# NPCs spawnen

\# Projekt Status: Void Merchant

\#\# Dateibaum  
\- index.html  
\- css/style.css  
\- js/core/config.js  
\- js/core/GameLoop.js  
\- js/core/UniverseSim.js  
\- js/scenes/GameScene.js (UPDATED: NPC Visualization)  
\- js/data/SectorDB.js

\#\# Globale Variablen & State  
\- \`window.game.universe\`: Die Instanz der Simulation.  
\- \`GameScene.npcMap\`: Hält die visuellen Repräsentationen (Sprites) der OOS-Agenten.

\#\# Letzte Änderung  
\- \*\*GameScene.js:\*\* Implementierung der \`syncNPCs()\` Methode.  
\- Verbindung zwischen Daten (\`UniverseSim\`) und Visualisierung (\`GameScene\`) hergestellt.  
\- NPCs spawnen nun als gelbe Dreiecke und bewegen sich interpoliert.

\#\# Nächster Schritt  
\- Überprüfung der \`UniverseSim.js\`: Existiert \`getAgentsInSector\` und liefert es korrekte X/Y Koordinaten?  
\- Falls nein: Implementierung/Korrektur in \`UniverseSim.js\`.  
\- Falls ja: Testen der Bewegung (fliegen sie Routen?).

\#\# Aktueller Code-Hash  
\- js/scenes/GameScene.js

# (NPC Asset Integrated)

\# Projekt Status: Void Merchant (NPC Asset Integrated)

\#\# Dateibaum  
\* index.html  
\* css/style.css  
\* js/core/GameLoop.js  
\* js/core/InputManager.js  
\* js/core/ProjectileManager.js  
\* js/core/FXManager.js  
\* js/core/AudioManager.js  
\* js/core/UniverseSim.js  
\* js/core/MissionManager.js  
\* js/core/SaveSystem.js  
\* js/core/config.js  
\* js/scenes/BootScene.js (UPDATED: Added NPC Asset)  
\* js/scenes/MenuScene.js  
\* js/scenes/GameScene.js  
\* js/scenes/UIScene.js  
\* js/scenes/MapScene.js  
\* js/scenes/BuilderScene.js  
\* js/entities/Ship.js  
\* js/entities/EnemyShip.js  
\* js/entities/Station.js  
\* js/entities/Asteroid.js  
\* js/entities/Loot.js  
\* js/entities/Gate.js  
\* js/entities/WeaponSystem.js  
\* js/data/ShipDB.js  
\* js/data/WeaponDB.js  
\* js/data/WareDB.js  
\* js/data/SectorDB.js  
\* js/data/ModuleDB.js

\#\# Globale Variablen & State  
\* \`window.game.universe.agents\`: Händler bewegen sich im Hintergrund.  
\* \`spr\_npc\_trader\`: Key für das Händler-Sprite (jetzt echtes Asset).

\#\# Letzte Änderung  
\* \`BootScene.js\`: Loader für \`spr\_npc\_trader.png\` hinzugefügt.  
\* Protokolle aktualisiert (Snapshot Command support).

\#\# Nächster Schritt  
\* Testen, ob die NPCs in der \`GameScene\` nun mit dem korrekten Sprite gerendert werden (via \`syncNPCs\`).  
\* Falls das Sprite zu groß/klein ist, müssen wir in \`GameScene.js\` (Methode \`spawnNPC\`) ein \`setDisplaySize\` hinzufügen.

\#\# Aktueller Code-Hash  
\* js/scenes/BootScene.js

# \# Projekt Status: Void Merchant (Refactor Init)

\# Projekt Status: Void Merchant (Refactor Init)

\#\# Dateibaum  
\- index.html (UPDATED)  
\- css/style.css  
\- js/core/config.js  
\- js/core/GameLoop.js  
\- js/core/UniverseSim.js (UPDATED: Cleaned up)  
\- js/core/InputManager.js  
\- js/entities/TradeAgent.js (NEU: Extracted Class)  
\- js/ui/StationMenu.js (NEU: Extracted UI Logic)  
\- js/scenes/GameScene.js (UPDATED: Uses StationMenu)  
\- ... (Rest unverändert)

\#\# Globale Variablen & State  
\- \`StationMenu\`: Neue Klasse, handhabt alle DOM-Events für den Handel.  
\- \`TradeAgent\`: Nun als eigenständiges Modul verfügbar.

\#\# Letzte Änderung  
\- Refactoring des \`GameScene\`-Monolithen durchgeführt. UI-Logik ist nun sauber getrennt.  
\- Refactoring der \`UniverseSim\` durchgeführt.

\#\# Nächster Schritt  
\- Überprüfung der Performance.  
\- Fortsetzung mit Builder-Logic oder NPC-Visualisierung.

\#\# Aktueller Code-Hash  
\- js/entities/TradeAgent.js  
\- js/core/UniverseSim.js  
\- js/ui/StationMenu.js  
\- js/scenes/GameScene.js  
\- index.html

# Neue Sektoren & MapScene

\# Projekt Status: Void Merchant

\#\# Dateibaum  
\- index.html  
\- css/style.css  
\- js/  
  \- main.js (evtl. in HTML)  
  \- core/  
    \- config.js  
    \- GameLoop.js  
    \- InputManager.js  
    \- ProjectileManager.js  
    \- FXManager.js  
    \- SaveSystem.js  
    \- AudioManager.js  
    \- MissionManager.js  
    \- UniverseSim.js  
  \- data/  
    \- ShipDB.js  
    \- WeaponDB.js  
    \- WareDB.js  
    \- SectorDB.js (EXPANDED)  
    \- ModuleDB.js  
  \- entities/  
    \- Ship.js  
    \- EnemyShip.js  
    \- Asteroid.js  
    \- Station.js  
    \- Gate.js  
    \- Loot.js  
    \- TradeAgent.js  
    \- WeaponSystem.js  
  \- scenes/  
    \- BootScene.js  
    \- MenuScene.js  
    \- GameScene.js  
    \- UIScene.js  
    \- MapScene.js  
    \- BuilderScene.js  
  \- ui/  
    \- StationMenu.js

\#\# Globale Variablen & State  
\- \`window.game.universe\`: UniverseSim (God Engine)  
\- \`window.game.missionManager\`: Mission Singleton  
\- \`SECTOR\_DB\`: Jetzt 12 Sektoren (Argon, Teladi, Paranid, Terran, Split, Xenon)

\#\# Letzte Änderung  
\- \`SectorDB.js\`: Komplettes Map-Rework. Sektoren von 4 auf 12 erhöht. X4-Topologie (Ring) implementiert.

\#\# Nächster Schritt  
\- \`UniverseSim\`: Prüfen, ob die 24+ Trade Agents (2 pro Sektor) die Performance beeinträchtigen.  
\- \`MapScene\`: Scrollen implementieren, da die Map jetzt größer ist als der Bildschirm.

\#\# Aktueller Code-Hash  
\- SectorDB.js (v11\_X4\_Expansion)

# Refactored Phase 1

\# Projekt Status: Void Merchant  
\#\# Dateibaum  
\- index.html  
\- css/style.css  
\- js/core/config.js  
\- js/core/GameLoop.js  
\- js/core/EventsCenter.js (NEU)  
\- js/core/SectorManager.js (NEU)  
\- js/core/UniverseSim.js  
\- js/core/MissionManager.js  
\- js/core/InputManager.js  
\- js/core/ProjectileManager.js  
\- js/core/FXManager.js  
\- js/core/SaveSystem.js  
\- js/core/AudioManager.js  
\- js/scenes/BootScene.js  
\- js/scenes/MenuScene.js  
\- js/scenes/GameScene.js (Refactored)  
\- js/scenes/UIScene.js (Refactored)  
\- js/scenes/MapScene.js  
\- js/scenes/BuilderScene.js  
\- js/ui/StationMenu.js  
\- js/entities/Ship.js (Refactored)  
\- js/entities/EnemyShip.js  
\- js/entities/Asteroid.js  
\- js/entities/Station.js  
\- js/entities/Gate.js  
\- js/entities/Loot.js  
\- js/entities/TradeAgent.js  
\- js/data/ShipDB.js  
\- js/data/WeaponDB.js  
\- js/data/WareDB.js  
\- js/data/SectorDB.js  
\- js/data/ModuleDB.js

\#\# Globale Variablen & State  
\- \`window.game\`: Phaser Game Instance  
\- \`window.game.universe\`: UniverseSim Instance (Background Eco)  
\- \`window.game.missionManager\`: Global Mission Handler  
\- \`events\`: Global Event Emitter (in EventsCenter.js)

\#\# Letzte Änderung  
\- Architektur-Refactoring: \`SectorManager\` erstellt, Logik aus \`GameScene\` extrahiert.  
\- Event-Driven UI: \`EventsCenter\` implementiert, \`Ship\` Credits updates feuern Events, \`UIScene\` hört darauf.

\#\# Nächster Schritt  
\- Test des Refactorings (Laden verschiedener Sektoren).  
\- Implementation der Builder-Logik (Save/Load von gebauten Stationen).  
\- Erweiterung der UniverseSim (Echte Preise basierend auf Angebot/Nachfrage).

\#\# Aktueller Code-Hash  
\- index.html  
\- js/core/EventsCenter.js  
\- js/core/SectorManager.js  
\- js/scenes/GameScene.js  
\- js/scenes/UIScene.js  
\- js/core/UniverseSim.js  
\- js/entities/Ship.js

# Refactored Phase 2

\# Projekt Status: VOID MERCHANT

\#\# Dateibaum  
/js  
  /components  
    HealthComponent.js  
    CargoComponent.js  
  /core  
    EventsCenter.js  
  /entities  
    Ship.js  
  /scenes  
    UIScene.js  
    GameScene.js

\#\# Letzte Änderung  
\- Refactoring Phase 2: Component Pattern implementiert (Health/Cargo).  
\- UI auf Reactive Events umgestellt.  
\- GameScene Kollisions-Logik angepasst.

\#\# Nächster Schritt  
\- Refactoring EnemyShip.js (sollte auch Components nutzen).  
\- Loot Drop System verfeinern (Drop Rates in Config).

\#\# Aktueller Code-Hash  
\- js/components/HealthComponent.js  
\- js/components/CargoComponent.js  
\- js/entities/Ship.js  
\- js/scenes/UIScene.js  
\- js/scenes/GameScene.js

# Tab 56

\# Projekt Status: Void Merchant

\#\# Dateibaum  
index.html  
css/style.css  
js/core/config.js  
js/core/GameLoop.js         (Updated: Politics Init)  
js/core/InputManager.js  
js/core/EventsCenter.js  
js/core/AudioManager.js  
js/core/UniverseSim.js  
js/core/MissionManager.js  
js/core/FXManager.js  
js/core/ProjectileManager.js  
js/core/SaveSystem.js  
js/core/SectorManager.js  
js/core/PoliticsManager.js  (New: Logic)  
js/scenes/BootScene.js  
js/scenes/MenuScene.js  
js/scenes/GameScene.js  
js/scenes/UIScene.js  
js/scenes/MapScene.js  
js/scenes/BuilderScene.js  
js/entities/Ship.js  
js/entities/EnemyShip.js  
js/entities/Station.js  
js/entities/Asteroid.js  
js/entities/Loot.js  
js/entities/Gate.js  
js/entities/TradeAgent.js  
js/entities/WeaponSystem.js  
js/ui/StationMenu.js  
js/components/HealthComponent.js  
js/components/CargoComponent.js  
js/data/ShipDB.js  
js/data/WeaponDB.js  
js/data/WareDB.js  
js/data/SectorDB.js  
js/data/ModuleDB.js  
js/data/FactionDB.js        (New: Data)

\#\# Globale Variablen & State  
\- window.game.politics: Verwaltet Ruf (-30 bis \+30)  
\- window.game.universe: OOS Economy Sim  
\- Player Reputation: Startet bei 0 (Neutral)

\#\# Letzte Änderung  
\- PoliticsManager implementiert.  
\- FactionDB erstellt (Relations Matrix).  
\- GameLoop initialisiert nun das Politik-System vor der UniverseSim.

\#\# Nächster Schritt  
\- Integration der Politik-Logik in \`Ship.js\` und \`EnemyShip.js\` (Targeting Logic).  
\- Anzeige des Rufs im UI (UIScene).

# STATUS: Version 0

STATUS: Version 0.7.1 (Hive Integration & Beam Weapons)

## **FILE: project\_memory.md**

# **Projekt Status: Void Merchant**

## **Dateibaum**

* js/core/SectorThreatManager.js (Hive Logic)  
* js/components/BeamComponent.js (Beam Visuals)  
* js/data/WeaponDB.js (Kha'ak Beam Integration)  
* js/scenes/GameScene.js (Hive Integration)  
* index.html  
* css/style.css  
* js/core/config.js  
* js/core/GameLoop.js   
* js/core/InputManager.js  
* js/core/EventsCenter.js  
* js/core/AudioManager.js  
* js/core/UniverseSim.js  
* js/core/MissionManager.js  
* js/core/FXManager.js  
* js/core/ProjectileManager.js  
* js/core/SaveSystem.js  
* js/core/SectorManager.js  
* js/core/PoliticsManager.js  
* js/scenes/BootScene.js  
* js/scenes/MenuScene.js  
* js/scenes/UIScene.js  
* js/scenes/MapScene.js  
* js/scenes/BuilderScene.js  
* js/entities/Ship.js  
* js/entities/EnemyShip.js  
* js/entities/Station.js  
* js/entities/Asteroid.js  
* js/entities/Loot.js  
* js/entities/Gate.js  
* js/entities/TradeAgent.js  
* js/entities/WeaponSystem.js  
* js/ui/StationMenu.js  
* js/components/HealthComponent.js  
* js/components/CargoComponent.js  
* js/data/ShipDB.js  
* js/data/WareDB.js  
* js/data/SectorDB.js  
* js/data/ModuleDB.js  
* js/data/FactionDB.js 

## **Globale Variablen & State**

* `threatLevels`: Map im SectorThreatManager.  
* Event `mining-complete`: Triggert Bedrohungsanstieg.

## **Letzte Änderung**

* Implementierung der Hive-Mind-Logik und des Beam-Waffensystems.  
* ✅ **Beam Weapons:** Implementiert (Visuals \+ Instant Hit Logic).  
* ✅ **Ship Entity:** Update für Beam-Support.  
* ✅ **WeaponSystem:** Hybrid-Support (Projektile & Beams).  
* ✅ **Threat System:** Mining triggert Kha'ak Spawns.

## **Aktueller Code-Hash**

* js/core/SectorThreatManager.js  
* js/components/BeamComponent.js  
* js/data/WeaponDB.js  
* js/scenes/GameScene.js

# Struktur

## **Dateibaum**

* js/core/SectorThreatManager.js (Hive Logic)  
* js/components/BeamComponent.js (Beam Visuals)  
* js/data/WeaponDB.js (Kha'ak Beam Integration)  
* js/scenes/GameScene.js (Hive Integration)  
* index.html  
* css/style.css  
* js/core/config.js  
* js/core/GameLoop.js   
* js/core/InputManager.js  
* js/core/EventsCenter.js  
* js/core/AudioManager.js  
* js/core/UniverseSim.js  
* js/core/MissionManager.js  
* js/core/FXManager.js  
* js/core/ProjectileManager.js  
* js/core/SaveSystem.js  
* js/core/SectorManager.js  
* js/core/PoliticsManager.js  
* js/scenes/BootScene.js  
* js/scenes/MenuScene.js  
* js/scenes/UIScene.js  
* js/scenes/MapScene.js  
* js/scenes/BuilderScene.js  
* js/entities/Ship.js  
* js/entities/EnemyShip.js  
* js/entities/Station.js  
* js/entities/Asteroid.js  
* js/entities/Loot.js  
* js/entities/Gate.js  
* js/entities/TradeAgent.js  
* js/entities/WeaponSystem.js  
* js/ui/StationMenu.js  
* js/components/HealthComponent.js  
* js/components/CargoComponent.js  
* js/data/ShipDB.js  
* js/data/WareDB.js
