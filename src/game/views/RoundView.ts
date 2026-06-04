import * as PIXI from "pixi.js";
import { LayoutService } from "../../layout/LayoutService";

export class RoundView {
    private readonly _roundText: PIXI.Text;
    private readonly _actionsText: PIXI.Text;

    constructor(private readonly _layoutService: LayoutService) {
        this._roundText = this._layoutService.get("round-text");
        this._actionsText = this._layoutService.get("actions-count-text");
    }

    render(roundNumber: number, totalRounds: number, remainingActions: number): void {
        this._roundText.text = `Round: ${roundNumber}/${totalRounds}`;
        this._actionsText.text = `Actions: ${remainingActions}`;
    }
}
