import type { Area, BirdDefinition } from "../types/resourceTypes";
import { PlayerResourceReader } from "../types/storeReaders";

export class BirdPlayRuleService {
  constructor(
    private readonly _resources: PlayerResourceReader,
  ) {}

  canPayBirdCost(bird: BirdDefinition | null): boolean {
    if (!bird) {
      return false;
    }

    return bird.allowedFoods.every((foodId) => {
      return !!this._resources.getFoodById(foodId);
    });
  }

  getMissingFoodIds(bird: BirdDefinition | null): string[] {
    if (!bird) {
      return [];
    }

    return bird.allowedFoods.filter((foodId) => {
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

    return bird.allowedAreas.includes(area) && this.canPayBirdCost(bird);
  }
}