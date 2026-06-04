import * as PIXI from "pixi.js";
import { LayoutService } from "../../layout/LayoutService";
import type { GoalDefinition } from "../types/goalTypes";

export class GoalView {
    private readonly _container: PIXI.Container;
    private readonly _nameText: PIXI.Text;
    private readonly _scoreText: PIXI.Text;

    constructor(private readonly _layoutService: LayoutService) {
        this._container = this._layoutService.get("goal-container");
        this._nameText = this._layoutService.get("goal-name-text");
        this._scoreText = this._layoutService.get("goal-score-text");
    }

    get container(): PIXI.Container {
        return this._container;
    }

    render(goal: GoalDefinition | null, metricValue = 0, points = 0): void {
        if (!goal) {
            this._container.visible = false;
            return;
        }

        this._container.visible = true;
        this._nameText.text = goal.name;
        this._scoreText.text = `Value: ${metricValue}  VP: ${points}`;
    }
}
