import { Food } from "../game/models/Food";
import type { BirdDefinition, FoodDefinition } from "../game/types/resourceTypes";

/**
 * Store = single source of truth for gameplay data.
 * Mutated by commands.
 */
export class PlayerResourceStore {
  private birds: BirdDefinition[] = [];
  private foodsById = new Map<string, Food>();

  setInitialDeal(birdDefs: BirdDefinition[], foodDefs: FoodDefinition[]): void {
    this.birds = [...birdDefs];

    this.foodsById = new Map<string, Food>();
    for (const def of foodDefs) {
      this.foodsById.set(def.id, new Food(def, 1));
    }
  }

  getBirds(): readonly BirdDefinition[] {
    return this.birds;
  }

  getFoods(): readonly Food[] {
    return [...this.foodsById.values()];
  }

  getFoodById(id: string): Food | undefined {
    return this.foodsById.get(id);
  }

  getBirdById(name: string): BirdDefinition {
    const bird = this.birds.find((b) => b.name === name);
    if(!bird) throw new Error(`Can't find bird with id ${name}`);
    return bird;
  }

  addBird(bird: BirdDefinition): void {
    this.birds.push(bird);
  }
}

