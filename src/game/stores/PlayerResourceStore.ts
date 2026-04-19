import { Food } from "../models/Food";
import type { FoodDefinition } from "../types/resourceTypes";
import type { BirdId } from "../../catalogs/BirdCatalog";

/**
 * Store = single source of truth for gameplay data.
 * Mutated by commands.
 */
export class PlayerResourceStore {
  private _birdIds: BirdId[] = [];
  private _foodsById = new Map<string, Food>();

  setInitialDeal(birdIds: BirdId[], foodDefs: FoodDefinition[]): void {
    this._birdIds = [...birdIds];

    this._foodsById = new Map<string, Food>();
    for (const def of foodDefs) {
      this._foodsById.set(def.id, new Food(def, 1));
    }
  }

  getBirdIds(): readonly BirdId[] {
    return this._birdIds;
  }

  getFoods(): readonly Food[] {
    return [...this._foodsById.values()];
  }

  getFoodById(id: string): Food | undefined {
    return this._foodsById.get(id);
  }

  hasBird(birdId: BirdId): boolean {
    return this._birdIds.includes(birdId);
  }

  addBirdById(birdId: BirdId): void {
    this._birdIds.push(birdId);
  }

  removeBirdById(birdId: BirdId): void {
    this._birdIds = this._birdIds.filter((id) => id !== birdId);
  }

  removeFoodByIds(foodIds: string[]): void {
    this._foodsById = new Map<string, Food>(
      [...this._foodsById.entries()].filter(([id]) => !foodIds.includes(id))
    );
  }

  addFood(definition: FoodDefinition): void {
    const existing = this._foodsById.get(definition.id);
    if (existing) {
      existing.add(1);
      return;
    }

    this._foodsById.set(definition.id, new Food(definition, 1));
  }
}