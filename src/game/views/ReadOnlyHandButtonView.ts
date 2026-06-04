import * as PIXI from "pixi.js";
import { LayoutService } from "../../layout/LayoutService";
import { setButtonInteractive } from "../../utils/viewUtils";

export class ReadOnlyHandButtonView {
    private readonly _button: PIXI.Text;

    onClicked: (() => void) | null = null;

    constructor(private readonly _layoutService: LayoutService) {
        this._button = this._layoutService.get("read-only-hand-button");
        setButtonInteractive(this._button, true);
        this._button.on("pointerdown", () => this.onClicked?.());
    }
}
