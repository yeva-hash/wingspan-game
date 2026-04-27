import type { BirdDefinition, FoodDefinition } from "../types/resourceTypes";
import { BirdCatalog, BirdId } from "../../catalogs/BirdCatalog";
import { PlayerResourceStore } from "../stores/PlayerResourceStore";
import { QuantifiedFood } from "../models/QuantifiedFood";
import { PlayerResourceReader } from "../types/storeReaders";

//TODO use case can cnahge store directly
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

  getFoods(): readonly QuantifiedFood[] {
    return this._store.getFoods();
  }

  getFoodById(id: string): QuantifiedFood | undefined {
    return this._store.getFoodById(id);
  }

  addBirdById(birdId: BirdId): void {
    this._store.addBirdById(birdId);
  }

  spendBirdForPlay(birdId: BirdId): BirdDefinition {
    const bird = this.getBirdById(birdId);
    if (!bird) {
      throw new Error(`Bird ${birdId} not found in player resources`);
    }

    this._store.removeBirdById(birdId);
    this._store.removeFoodByIds(bird.requiredFoods);

    return bird;
  }

  setInitialDeal(birdIds: BirdId[], foodDefs: FoodDefinition[]): void {
    this._store.setInitialDeal(birdIds, foodDefs);
  }

  addFood(definition: FoodDefinition): void {
    this._store.addFood(definition);
  }
}
