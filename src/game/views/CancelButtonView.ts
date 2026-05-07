import type { Container } from "pixi.js";
import type { LayoutService } from "../../layout/LayoutService";
import { alphaTo, setButtonInteractive } from "../../utils/viewUtils";

export class CancelButtonView {
  onCancelClicked: (() => void) | null = null;

  private readonly _button: Container;

  constructor(layoutService: LayoutService) {
    this._button = layoutService.get("cancel-button");
    this._button.alpha = 0;
    this.setInteractive(false);
    this._button.on("pointerdown", () => this.onCancelClicked?.());
  }

  async show(): Promise<void> {
    this.setInteractive(true);
    await alphaTo(this._button, 0.2, 1);
  }

  async hide(): Promise<void> {
    this.onCancelClicked = null;
    this.setInteractive(false);
    await alphaTo(this._button, 0.2, 0);
  }

  private setInteractive(interactive: boolean): void {
    setButtonInteractive(this._button, interactive);
  }
}
