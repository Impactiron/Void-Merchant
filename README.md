# Void-Merchant
STATUS: Version 0.7.1 (Hive Integration & Beam Weapons)

## Projekt Status: Void Merchant

## Dateibaum
/root
	index.html
		/css
			/style.css
		/js
			/core
				SectorThreatManager.js (Hive Logic)
				config.js
				GameLoop.js 
				InputManager.js
				EventsCenter.js
				AudioManager.js
				UniverseSim.js
				MissionManager.js
				FXManager.js
				ProjectileManager.js
				SaveSystem.js
				SectorManager.js
				PoliticsManager.js
			- /scenes
				GameScene.js
				BootScene.js
				MenuScene.js
				UIScene.js
				MapScene.js
				BuilderScene.js
			- /entities
				Ship.js
				EnemyShip.js
				Station.js
				Asteroid.js
				Loot.js
				Gate.js
				TradeAgent.js
				WeaponSystem.js
js/components/BeamComponent.js (Beam Visuals)
js/data/WeaponDB.js (Kha'ak Beam Integration)
js/ui/StationMenu.js
js/components/HealthComponent.js
js/components/CargoComponent.js
js/data/ShipDB.js
js/data/WareDB.js
js/data/SectorDB.js
js/data/ModuleDB.js
js/data/FactionDB.js 

## Globale Variablen & State
- threatLevels: Map im SectorThreatManager.
- Event mining-complete: Triggert Bedrohungsanstieg.

## Letzte Änderung
- Implementierung der Hive-Mind-Logik und des Beam-Waffensystems.
- Beam Weapons: Implementiert (Visuals + Instant Hit Logic).
- Ship Entity: Update für Beam-Support.
- WeaponSystem: Hybrid-Support (Projektile & Beams).
- Threat System: Mining triggert Kha'ak Spawns.

## Aktueller Code-Hash
- js/core/SectorThreatManager.js
- js/components/BeamComponent.js
- js/data/WeaponDB.js
- js/scenes/GameScene.js

## Aktueller Code-Hash
- js/components/HealthComponent.js
- js/components/CargoComponent.js
- js/entities/Ship.js
- js/scenes/UIScene.js
- js/scenes/GameScene.js
