import { HabitatService } from "../services/HabitatService";
import type { GoalDefinition, GoalParams } from "../types/goalTypes";
import type { Area, FoodType } from "../types/resourceTypes";

type MetricHandler = (params: GoalParams) => number;

export class GoalMetricHelper {
    private readonly _metricHandlers: Record<GoalDefinition["metric"], MetricHandler> = {
        playedBirdsInArea: (params) => this.countPlayedBirdsInArea(this.requireArea(params)),
        eggsInArea: (params) => this.countEggsInArea(this.requireArea(params)),
        playedBirdsWithFoodCost: (params) => this.countPlayedBirdsWithFoodCost(this.requireFood(params)),
        playedBirdsWithMinEggCapacity: (params) => this.countPlayedBirdsWithMinEggCapacity(this.requireNumber(params, "minEggCapacity")),
        occupiedHabitatSlots: () => this.countOccupiedHabitatSlots(),
        uniqueFoodCostsOnPlayedBirds: () => this.countUniqueFoodCostsOnPlayedBirds(),
        playedBirdsWithMinAllowedAreas: (params) => this.countPlayedBirdsWithMinAllowedAreas(this.requireNumber(params, "minAllowedAreas")),
    };

    constructor(private readonly _habitatService: HabitatService) {}

    calculateMetricValue(goal: GoalDefinition): number {
        return this._metricHandlers[goal.metric](goal.params);
    }

    private countPlayedBirdsInArea(area: Area): number {
        return this._habitatService.getSlots(area).filter((slot) => slot.isOccupied).length;
    }

    private countEggsInArea(area: Area): number {
        return this._habitatService
            .getSlots(area)
            .reduce((sum, slot) => sum + (slot.bird?.eggCount ?? 0), 0);
    }

    private countPlayedBirdsWithFoodCost(food: FoodType): number {
        return this.getPlayedBirds().filter((bird) => bird.definition.requiredFoods.includes(food)).length;
    }

    private countPlayedBirdsWithMinEggCapacity(minEggCapacity: number): number {
        return this.getPlayedBirds().filter((bird) => bird.maxEggCount >= minEggCapacity).length;
    }

    private countOccupiedHabitatSlots(): number {
        return this.getPlayedBirds().length;
    }

    private countUniqueFoodCostsOnPlayedBirds(): number {
        const foods = new Set<FoodType>();

        for (const bird of this.getPlayedBirds()) {
            for (const food of bird.definition.requiredFoods) {
                foods.add(food);
            }
        }

        return foods.size;
    }

    private countPlayedBirdsWithMinAllowedAreas(minAllowedAreas: number): number {
        return this.getPlayedBirds().filter((bird) => bird.definition.allowedAreas.length >= minAllowedAreas).length;
    }

    private getPlayedBirds() {
        return this._habitatService
            .getAreas()
            .flatMap((area) => area.getSlots())
            .map((slot) => slot.bird)
            .filter((bird) => bird !== null);
    }

    private requireArea(params: GoalParams): Area {
        if (!params.area) {
            throw new Error("Goal metric requires area param");
        }

        return params.area;
    }

    private requireFood(params: GoalParams): FoodType {
        if (!params.food) {
            throw new Error("Goal metric requires food param");
        }

        return params.food;
    }

    private requireNumber(params: GoalParams, paramName: keyof GoalParams): number {
        const value = params[paramName];
        if (typeof value !== "number") {
            throw new Error(`Goal metric requires numeric ${String(paramName)} param`);
        }

        return value;
    }
}
