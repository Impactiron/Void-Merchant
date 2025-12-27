import { RecipeDB } from '../data/RecipeDB.js';
import { EventsCenter } from './EventsCenter.js';

/**
 * CraftingManager
 * Verwaltet den Crafting-Prozess: Prüfung, Ressourcen-Abzug, Mod-Installation.
 */
export class CraftingManager {
    constructor(scene) {
        this.scene = scene;
    }

    /**
     * Versucht ein Item herzustellen und auf dem Schiff zu installieren.
     * @param {Ship} ship - Das Spielerschiff (muss CargoComponent haben)
     * @param {string} recipeKey - ID des Rezepts aus der RecipeDB
     * @returns {boolean} - Erfolg true/false
     */
    craftItem(ship, recipeKey) {
        const recipe = RecipeDB[recipeKey];

        if (!recipe) {
            console.error(`CraftingManager: Rezept ${recipeKey} nicht gefunden.`);
            return false;
        }

        if (!ship.cargo) {
            console.error('CraftingManager: Schiff hat kein Frachtsystem.');
            return false;
        }

        // 1. Prüfung: Sind alle Materialien vorhanden?
        for (const req of recipe.requirements) {
            const currentAmount = ship.cargo.getAmount(req.id);
            if (currentAmount < req.count) {
                EventsCenter.emit('ui_message', `Fehlende Ressourcen für ${recipe.name}.`);
                return false;
            }
        }

        // 2. Transaktion: Materialien entfernen
        for (const req of recipe.requirements) {
            ship.cargo.removeWare(req.id, req.count);
        }

        // 3. Installation: Effekt anwenden
        const resultMessage = recipe.effect(ship);

        // 4. Persistenz: Mod speichern
        if (!ship.installedMods) {
            ship.installedMods = [];
        }
        ship.installedMods.push(recipeKey);

        // 5. Feedback
        EventsCenter.emit('mod_installed', { 
            ship: ship, 
            recipe: recipe, 
            message: resultMessage 
        });

        EventsCenter.emit('ui_message', `${recipe.name} installiert! ${resultMessage}`);
        
        console.log(`Crafting erfolgreich: ${recipeKey} auf Schiff installiert.`);
        return true;
    }
}
