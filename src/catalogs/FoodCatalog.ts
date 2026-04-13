import { FoodDefinition, FoodType } from "../game/types/resourceTypes";

//TODO abstract catalog
export class FoodCatalog {
    private readonly _foodsById = new Map<FoodType, FoodDefinition>();

    constructor(foods: FoodDefinition[]) {
        for (const food of foods) {
            const foodId = food.id;

            if (this._foodsById.has(foodId)) {
                throw new Error(`Duplicate food id: ${foodId}`);
            }

            this._foodsById.set(foodId, food);
        }
    }

    getById(id: FoodType): FoodDefinition {
        const food = this._foodsById.get(id);
        if (!food) {
            throw new Error(`Food not found: ${id}`);
        }
        return food;
    }

    has(id: FoodType): boolean {
        return this._foodsById.has(id);
    }

    getAllIds(): FoodType[] {
        return [...this._foodsById.keys()];
    }

    getAll(): FoodDefinition[] {
        return [...this._foodsById.values()];
    }
}