import { FoodCatalog } from "../../catalogs/FoodCatalog";
import { FeederStore } from "../stores/FeederStore";
import { FoodDefinition, FoodType } from "../types/resourceTypes";

export class FeederService {
    private static readonly maxFoodCount = 5;

    constructor(
        private readonly _catalog: FoodCatalog,
        private readonly _store: FeederStore
    ) {}

    resetForNewGame(): void {
        // this._store.setFoodIds(this._catalog.getAllIds());
        this._store.reset();
    }

    getRandomFoodDefs(count: number = FeederService.maxFoodCount): Map<number, FoodDefinition> {
        const foodIds = this._catalog.getAllIds();
        const result: Map<number, FoodDefinition> = new Map();

        for (let i = 1; i <= count; i++) {
            const index = Math.floor(Math.random() * foodIds.length);
            const foodId = foodIds[index];

            this._store.setFoodIdAt(i, foodId);
            result.set(i, this._catalog.getById(foodId));
        }

        return result;
    }

    getFoodSlotIndexes(): number[] {
        return [...this._store.getFoodIds().keys()];
    }

    getAvailableFoodSlotIndexes(): number[] {
        return [...this._store.getFoodIds().entries()]
            .filter(([, foodId]) => foodId !== null)
            .map(([slotIndex]) => slotIndex);
    }

    getAvailableFoodCount(): number {
        return this.getAvailableFoodSlotIndexes().length;
    }

    getFoodDefsBySlots(): Map<number, FoodDefinition | null> {
        const result: Map<number, FoodDefinition | null> = new Map();

        for (const [slotIndex, foodId] of this._store.getFoodIds()) {
            result.set(slotIndex, foodId ? this._catalog.getById(foodId) : null);
        }

        return result;
    }

    hasFoodAtSlot(slotIndex: number): boolean {
        return this._store.getFoodIdAt(slotIndex) !== null;
    }

    isEmpty(): boolean {
        const slots = this._store.getFoodIds();
        if (slots.size === 0) return true;

        for (const foodId of slots.values()) {
            if (foodId !== null) return false;
        }

        return true;
    }

    takeFoodsFromSlots(slotIndexes: number[]): FoodType[] {
        const takenFoodIds: FoodType[] = [];

        for (const slotIndex of slotIndexes) {
            const foodId = this._store.getFoodIdAt(slotIndex);
            if (!foodId) continue;

            takenFoodIds.push(foodId);
            this._store.setFoodIdAt(slotIndex, null);
        }

        return takenFoodIds;
    }
}
