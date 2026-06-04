import type { Area, FoodType } from "./resourceTypes";

export type GoalMetric =
    | "playedBirdsInArea"
    | "eggsInArea"
    | "playedBirdsWithFoodCost"
    | "playedBirdsWithMinEggCapacity"
    | "occupiedHabitatSlots"
    | "uniqueFoodCostsOnPlayedBirds"
    | "playedBirdsWithMinAllowedAreas";

export type GoalParams = {
    area?: Area;
    food?: FoodType;
    minEggCapacity?: number;
    minAllowedAreas?: number;
};

export type GoalScoringRule =
    | {
        type: "perUnit";
        pointsPerUnit: number;
        maxPoints?: number;
    }
    | {
        type: "threshold";
        threshold: number;
        points: number;
    };

export type GoalDefinition = {
    id: string;
    name: string;
    description: string;
    imageKey: string;
    metric: GoalMetric;
    params: GoalParams;
    scoring: GoalScoringRule;
};

export type GoalsJson = {
    roundGoalCount: number;
    goals: GoalDefinition[];
};
