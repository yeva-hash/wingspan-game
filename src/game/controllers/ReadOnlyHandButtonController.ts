import { HandController } from "./HandController";
import { ReadOnlyHandButtonView } from "../views/ReadOnlyHandButtonView";

export class ReadOnlyHandButtonController {
    private _isOpening = false;

    constructor(
        private readonly _view: ReadOnlyHandButtonView,
        private readonly _handController: HandController,
    ) {
        this._view.onClicked = () => void this.openHand();
    }

    private async openHand(): Promise<void> {
        if (this._isOpening) {
            return;
        }

        this._isOpening = true;

        try {
            await this._handController.showReadOnly();
        } finally {
            this._isOpening = false;
        }
    }
}
