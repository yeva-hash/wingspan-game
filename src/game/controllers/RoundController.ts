import { RoundService } from "../services/RoundService";
import { RoundRenderOptions, RoundView } from "../views/RoundView";

export class RoundController {
    constructor(
        private readonly _service: RoundService,
        private readonly _view: RoundView,
    ) {}

    render(options: RoundRenderOptions = {}): void {
        this._view.render(
            this._service.getCurrentRoundNumber(),
            this._service.getTotalRounds(),
            this._service.getRemainingActions(),
            options,
        );
    }
}
