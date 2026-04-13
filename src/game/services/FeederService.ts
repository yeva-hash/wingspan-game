import { FoodCatalog } from "../../catalogs/FoodCatalog";
import { FeederStore } from "../stores/FeederStore";
import { FoodDefinition } from "../types/resourceTypes";

export class FeederService {
    private static readonly maxFoodCount = 5;

    constructor(
        private readonly _catalog: FoodCatalog,
        private readonly _store: FeederStore
    ) {}

    resetForNewGame(): void {
        this._store.setFoodIds(this._catalog.getAllIds());
    }

    getRandomFoodDefs(count: number = FeederService.maxFoodCount): FoodDefinition[] {
        const foodDefs = this._store.getFoodIds();
        const result: FoodDefinition[] = [];
        for (let i = 0; i < count; i++) {
            const index = Math.floor(Math.random() * foodDefs.length);
            result.push(this._catalog.getById(foodDefs[index]));
        }

        return result;
    }

}