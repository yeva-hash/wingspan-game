import type { Container } from "pixi.js";
import { GoalMetricHelper } from "../helpers/GoalMetricHelper";
import { GoalPointHelper } from "../helpers/GoalPointHelper";
import { GoalService } from "../services/GoalService";
import { GoalView } from "../views/GoalView";

export class GoalController {
    constructor(
        private readonly _goalService: GoalService,
        private readonly _metricHelper: GoalMetricHelper,
        private readonly _pointHelper: GoalPointHelper,
        private readonly _view: GoalView,
    ) {}

    get container(): Container {
        return this._view.container;
    }

    renderCurrentGoal(): void {
        const goal = this._goalService.getCurrentGoal();
        const metricValue = goal ? this._metricHelper.calculateMetricValue(goal) : 0;
        const points = goal ? this._pointHelper.calculatePoints(goal, metricValue) : 0;
        this._view.render(goal, metricValue, points);
    }
}
