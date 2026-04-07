import foodsJson from "../../data/foods.json";
import type { FoodDefinition } from "../game/types/resourceTypes";

type FoodsFile = {
  foods: FoodDefinition[];
};

export class FoodCatalogService {
  private readonly foods: FoodDefinition[];

  constructor(data?: FoodsFile) {
    const file = data ?? (foodsJson as FoodsFile);
    this.foods = file.foods;
  }

  getAll(): readonly FoodDefinition[] {
    return this.foods;
  }

  getById(id: string): FoodDefinition | undefined {
    return this.foods.find((f) => f.id === id);
  }
}
