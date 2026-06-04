import * as PIXI from "pixi.js";
import { LayoutService } from "../../layout/LayoutService";
import { playScalePulse } from "../../utils/viewUtils";

export type RoundRenderOptions = {
    highlightRound?: boolean;
    highlightActions?: boolean;
};

export class RoundView {
    private readonly _roundText: PIXI.Text;
    private readonly _actionsText: PIXI.Text;

    constructor(private readonly _layoutService: LayoutService) {
        this._roundText = this._layoutService.get("round-text");
        this._actionsText = this._layoutService.get("actions-count-text");
        this._roundText.anchor.set(0.5);
        this._actionsText.anchor.set(0.5);
    }

    render(roundNumber: number, totalRounds: number, remainingActions: number, options: RoundRenderOptions = {}): void {
        this._roundText.text = `Round: ${roundNumber}/${totalRounds}`;
        this._actionsText.text = `Actions: ${remainingActions}`;

        if (options.highlightRound) {
            playScalePulse(this._roundText, 1.22);
        }

        if (options.highlightActions) {
            playScalePulse(this._actionsText, 1.18);
        }
    }
}
