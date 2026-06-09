import type { Area, BirdDefinition } from "../types/resourceTypes";
import { HabitatService } from "./HabitatService";
import { PlayerResourceReader } from "../types/storeReaders";

export class BirdPlayRuleService {
  constructor(
    private readonly _resources: PlayerResourceReader,
    private readonly _habitatService: HabitatService,
  ) {}

  canPayBirdCost(bird: BirdDefinition | null): boolean {
    if (!bird) {
      return false;
    }

    return bird.requiredFoods.every((foodId) => {
      return !!this._resources.getFoodById(foodId);
    });
  }

  getMissingFoodIds(bird: BirdDefinition | null): string[] {
    if (!bird) {
      return [];
    }

    return bird.requiredFoods.filter((foodId) => {
      return !this._resources.getFoodById(foodId);
    });
  }

  getMissingFoodMessage(bird: BirdDefinition | null): string {
    if (!bird) {
      return "";
    }

    const missingFoodIds = this.getMissingFoodIds(bird);

    if (missingFoodIds.length === 0) {
      return "";
    }

    return `Not enough food: ${missingFoodIds.join(", ")}`;
  }

  canPayAreaEggCost(area: Area | null): boolean {
    if (!area) {
      return false;
    }

    return this._habitatService.getTotalEggCount() >= this._habitatService.getBirdPlayEggCost(area);
  }

  getMissingEggMessage(area: Area | null): string {
    if (!area) {
      return "";
    }

    const eggCost = this._habitatService.getBirdPlayEggCost(area);
    const missingEggs = eggCost - this._habitatService.getTotalEggCount();

    if (missingEggs <= 0) {
      return "";
    }

    return `Not enough eggs: ${missingEggs}`;
  }

  getAllowedAreas(bird: BirdDefinition | null): readonly Area[] {
    if (!bird) {
      return [];
    }

    return bird.allowedAreas;
  }

  canPlayBirdInArea(bird: BirdDefinition | null, area: Area | null): boolean {
    if (!bird || !area) {
      return false;
    }

    return bird.allowedAreas.includes(area) && this.canPayBirdCost(bird) && this.canPayAreaEggCost(area);
  }
}
