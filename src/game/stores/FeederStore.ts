import { FoodType } from "../types/resourceTypes";

export class FeederStore {
    private _offeredFoodsIds: Map<number, FoodType | null> = new Map();

    constructor() {
        // this._offeredFoodsIds = new Map<number, FoodType>();
    }

    // setFoodIds(foodIds: FoodType[]): void {
    //     this._offeredFoodsIds = new Map<number, FoodType>(
    //         foodIds.map((foodId, index) => [index, foodId])
    //     );
    // }

    setFoodIdAt(index: number, foodId: FoodType | null): void {
        this._offeredFoodsIds.set(index, foodId);
    }

    getFoodIdAt(index: number): FoodType | null {
        return this._offeredFoodsIds.get(index) ?? null;
    }

    getFoodIds(): Map<number, FoodType | null> {
        return this._offeredFoodsIds;
    }
    
    reset(): void {
        this._offeredFoodsIds = new Map<number, FoodType | null>();
    }

    // getFoodIds(): readonly FoodType[] {
    //     return [...this._offeredFoodsIds.values()];
    // }
}
