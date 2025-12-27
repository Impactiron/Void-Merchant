# **📘 PROJECT STATUS: VOID MERCHANT**

## **1\. 📂 Dateibaum & Modul-Struktur**

Der aktuelle Codebestand umfasst folgende implementierte Module:

### **Core (Engine & Logic)**

* js/core/config.js (Phaser Konfiguration & Konstanten)  
* js/core/GameLoop.js (Zentrale Update-Schleife & State Management)  
* js/core/EventsCenter.js (Globaler Event-Bus für Entkopplung)  
* js/core/InputManager.js (Tastatur/Maus Handling)  
* js/core/AudioManager.js (Sound-Verwaltung)  
* js/core/FXManager.js (Visuelle Effekte)  
* js/core/SaveSystem.js (LocalStorage Persistenz)  
* js/core/UniverseSim.js (Hintergrundsimulation / OOS)  
* js/core/SectorManager.js (Verwaltung des aktiven Sektors)  
* js/core/SectorThreatManager.js (Bedrohungs-Logik & Spawns)  
* js/core/ProjectileManager.js (Verwaltung aktiver Schüsse)  
* js/core/PoliticsManager.js (Fraktionsbeziehungen)  
* js/core/MissionManager.js (Quest-Logik)

### **Scenes (Visuelle Ebene)**

* js/scenes/BootScene.js (Asset Loading)  
* js/scenes/MenuScene.js (Hauptmenü)  
* js/scenes/GameScene.js (Aktives Gameplay / Fliegen)  
* js/scenes/MapScene.js (Galaxiekarte / Navigation)  
* js/scenes/UIScene.js (HUD Overlay)  
* js/scenes/BuilderScene.js (Stationsbau/Editor Modus)

### **Entities (Objekte)**

* js/entities/Ship.js (Basisklasse für Schiffe \+ Spielerlogik)  
* js/entities/EnemyShip.js (KI gesteuerte Gegner)  
* js/entities/Station.js (Andockbare Stationen)  
* js/entities/Gate.js (Sprungtore zu anderen Sektoren)  
* js/entities/Asteroid.js (Abbaubare Ressourcen)  
* js/entities/Loot.js (Drop-Items im All)  
* js/entities/TradeAgent.js (Handelslogik-Wrapper)  
* js/entities/WeaponSystem.js (Waffensteuerung)

### **Components (ECS-Lite)**

* js/components/HealthComponent.js (Lebenspunkte & Schaden)  
* js/components/CargoComponent.js (Frachtraum & Waren)  
* js/components/BeamComponent.js (Spezialwaffe: Strahl)

### **Data (Datenbanken)**

* js/data/ShipDB.js, WeaponDB.js, WareDB.js  
* js/data/StationDB.js, SectorDB.js, FactionDB.js, ModuleDB.js

### **UI**

* js/ui/StationMenu.js (Handelsinterface)

## **2\. ✅ Implementierte Funktionen (Feature Set)**

### **A. Core Engine & Architektur**

* **Phaser 3 Integration:** Die Engine läuft stabil mit WebGL.  
* **Event-Driven Architecture:** Kommunikation zwischen UI, Logik und Szenen läuft sauber über das EventsCenter.  
* **Scene Management:** Wechsel zwischen Menü, Spiel, Karte und Builder ist implementiert.

### **B. Gameplay & Steuerung**

* **Flugphysik:** Arcade-Physics mit Trägheit und Rotation (Ship.js).  
* **Sektorsystem:** Laden und Entladen von Sektor-Daten (SectorManager).  
* **Galaxie-Navigation:** Reisen zwischen Sektoren via Gates (Gate.js & MapScene).

### **C. Combat System (Kampf)**

* **Waffen:** Projektilwaffen (ProjectileManager) und Strahlwaffen (BeamComponent \- vermutlich für Kha'ak/Beam-Lasers).  
* **Schadensmodell:** Schiffe und Stationen haben HP (HealthComponent). Zerstörung triggert Loot/Effekte.  
* **Gegner-KI:** Grundlegende EnemyShip-Logik (Verfolgung/Angriff) und Bedrohungsmanagement (SectorThreatManager).

### **D. Wirtschaft & Handel**

* **Waren-System:** Definition von Waren, Preisen und Legalität (WareDB).  
* **Inventar:** Schiffe haben Frachtraum (CargoComponent).  
* **Handel:** Andocken an Stationen und Kaufen/Verkaufen via StationMenu.  
* **Loot:** Zerstörte Schiffe lassen Container fallen, die eingesammelt werden können (Loot.js).

### **E. Simulation (Universe)**

* **Hintergrund-Sim:** UniverseSim existiert, um Wirtschaft/Bewegung außerhalb des sichtbaren Sektors zu simulieren (OOS \- Out of Sector).  
* **Fraktionen:** Ruf-System und Beziehungen (PoliticsManager, FactionDB).

### **F. Persistenz**

* **Speichern/Laden:** Spielzustand (Position, Inventar, Credits) kann via LocalStorage gesichert werden (SaveSystem).

## **3\. 📊 Globale Variablen & State**

Wichtige Schlüsselvariablen (im Speicher zur Laufzeit):

* gameState: Hält den globalen Status (PLAYER, CREDITS, SHIP\_ID).  
* activeSector: Der aktuell geladene Sektor (Phaser Scene Context).  
* universeDate: Zeitstempel der Simulation.

## **4\. 🚧 Nächste logische Schritte (Empfehlung)**

Basierend auf dem Code-Stand fehlen oder sind folgende Teile work-in-progress:

1. **UI Polish:** Das StationMenu und UIScene sind funktional, benötigen aber visuelles Styling (CSS/Canvas Overlay Verfeinerung).  
2. **Mining:** Asteroiden existieren, aber der aktive Abbau-Prozess (Mining-Laser Logik \+ Loot-Generierung aus Asteroiden) muss verifiziert werden.  
3. **Missions-System:** Der MissionManager ist vorhanden, muss aber mit konkreten Missionstypen (Kill, Transport, Patrol) gefüllt werden.  
4. **Builder Scene:** Die BuilderScene.js deutet auf Stationsbau hin. Dies muss mit dem ModuleDB und dem Speichersystem fest verdrahtet werden.

## **5\. 🔑 Aktueller Code-Hash (Session Memory)**

Alle oben gelisteten Dateien sind mir bekannt und im Kontext geladen.  
Status: READY FOR INSTRUCTIONS.
