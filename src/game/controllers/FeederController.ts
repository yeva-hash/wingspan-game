import { FeederService } from "../services/FeederService";
import { FeederView } from "../views/FeederView";

export class FeederController {
    constructor(private readonly _services: FeederService, private readonly _view: FeederView) {}

    render(): void {
        this._view.fillFoodSlots(this._services.getRandomFoodDefs());
    }
}