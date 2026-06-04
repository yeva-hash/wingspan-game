import type { GoalDefinition } from "../types/goalTypes";

export class GoalPointService {
    calculatePoints(goal: GoalDefinition, metricValue: number): number {
        switch (goal.scoring.type) {
            case "perUnit": {
                const points = metricValue * goal.scoring.pointsPerUnit;
                return goal.scoring.maxPoints !== undefined
                    ? Math.min(points, goal.scoring.maxPoints)
                    : points;
            }
            case "threshold":
                return metricValue >= goal.scoring.threshold ? goal.scoring.points : 0;
            default:
                throw new Error(`Unsupported goal scoring rule: ${(goal.scoring as { type: string }).type}`);
        }
    }
}
