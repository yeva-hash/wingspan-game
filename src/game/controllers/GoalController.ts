import type { Container } from "pixi.js";
import { GoalPointService } from "../services/GoalPointService";
import { GoalScoringService } from "../services/GoalScoringService";
import { GoalService } from "../services/GoalService";
import { GoalView } from "../views/GoalView";

export class GoalController {
    constructor(
        private readonly _goalService: GoalService,
        private readonly _scoringService: GoalScoringService,
        private readonly _pointService: GoalPointService,
        private readonly _view: GoalView,
    ) {}

    get container(): Container {
        return this._view.container;
    }

    renderCurrentGoal(): void {
        const goal = this._goalService.getCurrentGoal();
        const metricValue = goal ? this._scoringService.calculateMetricValue(goal) : 0;
        const points = goal ? this._pointService.calculatePoints(goal, metricValue) : 0;
        this._view.render(goal, metricValue, points);
    }
}
