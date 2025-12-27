project_memory.md
# Projekt Status: Void Merchant

## Dateibaum
- js/core/config.js (Geändert)
- js/core/SpriteHelper.js (NEU)
- js/entities/Ship.js (Geändert)
- js/entities/EnemyShip.js (Geändert)
- js/entities/Asteroid.js (Geändert)
- ... (andere Dateien unverändert)

## Globale Variablen & State
- `GAME_CONFIG.SPRITE_SIZE`: 32px Standard
- Helper `enforceSpriteSize` zentralisiert nun alle Scaling-Logik.

## Letzte Änderung
- Globales Auto-Scaling System implementiert. Assets werden nun visuell auf definierte Pixelwerte gezwungen (S=32, M=64, etc.), unabhängig von der Texturauflösung. Physics-Bodies werden entsprechend angepasst.

## Nächster Schritt
- Loot-System prüfen: Nutzen die Loot-Items (`js/entities/Loot.js`) auch schon den neuen Scaler?
- UI Integration: Radar-System an neue Skalierungen anpassen, falls nötig.

## Aktueller Code-Hash
- js/core/config.js
- js/core/SpriteHelper.js
- js/entities/Ship.js
- js/entities/EnemyShip.js
- js/entities/Asteroid.js
