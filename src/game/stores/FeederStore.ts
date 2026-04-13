import { Food } from "../models/Food";
import { FoodType } from "../types/resourceTypes";

export class FeederStore {
    private _foodsIds: Map<number, FoodType>;

    constructor() {
        this._foodsIds = new Map<number, FoodType>();
    }


    setFoodIds(foodIds: FoodType[]): void {
        this._foodsIds = new Map<number, FoodType>(
            foodIds.map((foodId, index) => [index, foodId])
        );
    }

    setFoodIdAt(index: number, foodId: FoodType): void {
        this._foodsIds.set(index, foodId);
    }

    getFoodIdAt(index: number): FoodType | null {
        return this._foodsIds.get(index) ?? null;
    }

    getFoodIds(): readonly FoodType[] {
        return [...this._foodsIds.values()];
    }
}