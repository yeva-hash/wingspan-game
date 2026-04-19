import { FoodCatalog } from "../../catalogs/FoodCatalog";
import { FeederService } from "../services/FeederService";
import { PlayerResourceService } from "../services/PlayerResourceService";

export class GainFoodUseCase {
  constructor(
    private readonly feederService: FeederService,
    private readonly playerResourceService: PlayerResourceService,
    private readonly foodCatalog: FoodCatalog,
  ) {}

  execute(selectedFoodIndexes: number[]): void {
    const takenFoodIds = this.feederService.takeFoodsFromSlots(selectedFoodIndexes);

    for (const foodId of takenFoodIds) {
      this.playerResourceService.addFood(this.foodCatalog.getById(foodId));
    }
  }
}
