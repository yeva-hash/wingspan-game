import type { BirdDefinition, FoodDefinition } from "../types/resourceTypes";
import { BirdCatalog, BirdId } from "../../catalogs/BirdCatalog";
import { PlayerResourceStore } from "../stores/PlayerResourceStore";
import { Food } from "../models/Food";
import { PlayerResourceReader } from "../types/storeReaders";

export class PlayerResourceService implements PlayerResourceReader {
  constructor(
    private readonly _catalog: BirdCatalog,
    private readonly _store: PlayerResourceStore,
  ) {}

  getBirds(): BirdDefinition[] {
    return this._store.getBirdIds().map((id) => this._catalog.getById(id));
  }

  getBirdById(id: BirdId): BirdDefinition | null {
    if (!this._store.hasBird(id)) {
      return null;
    }

    return this._catalog.getById(id);
  }

  getFoods(): readonly Food[] {
    return this._store.getFoods();
  }

  getFoodById(id: string): Food | undefined {
    return this._store.getFoodById(id);
  }

  addBirdById(birdId: BirdId): void {
    this._store.addBirdById(birdId);
  }

  removeBirdById(birdId: BirdId): void {
    this._store.removeBirdById(birdId);
  }

  removeFoodByIds(foodIds: string[]): void {
    this._store.removeFoodByIds(foodIds);
  }

  setInitialDeal(birdIds: BirdId[], foodDefs: FoodDefinition[]): void {
    this._store.setInitialDeal(birdIds, foodDefs);
  }
}