import { Bird } from "../game/models/Bird";
import { Food } from "../game/models/Food";
import type { BirdDefinition, FoodDefinition } from "../game/types/resourceTypes";

/**
 * Store = single source of truth for gameplay data.
 * Mutated by commands.
 */
export class PlayerResourceStore {
  private birds: Bird[] = [];
  private foodsById = new Map<string, Food>();

  setInitialDeal(birdDefs: BirdDefinition[], foodDefs: FoodDefinition[]): void {
    this.birds = birdDefs.map((def) => new Bird(def));

    this.foodsById = new Map<string, Food>();
    for (const def of foodDefs) {
      this.foodsById.set(def.id, new Food(def, 1));
    }
  }

  getBirds(): readonly Bird[] {
    return this.birds;
  }

  getFoods(): readonly Food[] {
    return [...this.foodsById.values()];
  }

  getFoodById(id: string): Food | undefined {
    return this.foodsById.get(id);
  }

  getBirdById(id: string): Bird {
    const bird = this.birds.find((b) => b.instanceId === id);
    if(!bird) throw new Error(`Can't find bird with id ${id}`);
    return bird;
  }

  addBird(bird: Bird): void {
    this.birds.push(bird);
  }
}

