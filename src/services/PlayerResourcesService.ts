import { Bird } from "../game/models/Bird";
import { Food } from "../game/models/Food";
import type { BirdCatalogService } from "./BirdCatalogService";
import type { FoodCatalogService } from "./FoodCatalogService";

/** Player inventory after the initial deal and during play. */
export class PlayerResourcesService {
  private birds: Bird[] = [];
  private readonly foodsById = new Map<string, Food>();

  /**
   * Start of session: 5 random bird species + 1 of each of the 5 food types.
   */
  grantInitialDeal(birdCatalog: BirdCatalogService, foodCatalog: FoodCatalogService): void {
    const definitions = birdCatalog.pickRandomUnique(5);
    this.birds = definitions.map((def) => new Bird(def));

    this.foodsById.clear();
    for (const def of foodCatalog.getAll()) {
      this.foodsById.set(def.id, new Food(def, 1));
    }
  }

  getBirds(): readonly Bird[] {
    return this.birds;
  }

  /** All food slots (one Food instance per catalog type). */
  getFoods(): readonly Food[] {
    return [...this.foodsById.values()];
  }

  getFoodById(foodId: string): Food | undefined {
    return this.foodsById.get(foodId);
  }

  removeBird(instanceId: string) {
    this.birds.filter((bird) => bird.instanceId === instanceId);
  }
}
