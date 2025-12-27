# Projekt Status: Void Merchant

## Dateibaum
- index.html
- css/style.css
- README.md
- js/
  - core/
    - config.js
    - UniverseSim.js
    - SectorThreatManager.js
    - SectorManager.js
    - SaveSystem.js
    - ProjectileManager.js
    - PoliticsManager.js
    - MissionManager.js
    - InputManager.js
    - GameLoop.js
    - FXManager.js
    - EventsCenter.js
    - AudioManager.js
  - data/
    - WeaponDB.js
    - WareDB.js
    - StationDB.js
    - ShipDB.js
    - SectorDB.js
    - ModuleDB.js
    - FactionDB.js
  - entities/
    - WeaponSystem.js
    - TradeAgent.js
    - Station.js
    - Ship.js
    - Loot.js
    - Gate.js
    - EnemyShip.js
    - Asteroid.js
  - scenes/
    - BootScene.js
    - BuilderScene.js
    - GameScene.js
    - MapScene.js
    - MenuScene.js
    - UIScene.js
  - ui/
    - StationMenu.js

## Globale Variablen & State
- **gameState**: Verwaltet `player`, `sectorManager`, `threatManager`.
- **UniverseSim**: Hintergrundsimulation (OOS).
- **Phaser Scenes**: Aktive Verwaltung von `GameScene` und `UIScene`.

## Letzte Änderung
- `GameScene.js`: Bugfix für `createPlayer` implementiert. Safety-Checks für `transferPlayerData` (stats, cargo) verhindern Absturz beim Sektorwechsel.

## Nächster Schritt
- Testen des Sektorwechsels (Jump Gate), um sicherzustellen, dass Stats korrekt übernommen werden.

## Aktueller Code-Hash
- js/scenes/GameScene.js