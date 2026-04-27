import type { Container } from "pixi.js";
import { alphaTo, setButtonInteractive } from "../../utils/viewUtils";

export abstract class BaseInteractiveView {
  onConfirmClicked: (() => void) | null = null;

  protected constructor(protected readonly _confirmButton: Container) {
    this.bindConfirmButton();
  }

  protected bindConfirmButton(): void {
    this._confirmButton.on("pointerdown", () => this.onConfirmClicked?.());
  }

  setConfirmEnabled(enabled: boolean): void {
    setButtonInteractive(this._confirmButton, enabled);
    this._confirmButton.alpha = enabled ? 1 : 0.5;
  }

  async prepareForSelection(): Promise<void> {
    await this.toggleShow(true);
    this.setConfirmEnabled(false);
    this.onPrepareForSelection();
  }

  protected onPrepareForSelection(): void {}

  protected async toggleShow(show: boolean): Promise<void> {
    const to = show ? 1 : 0;
    await Promise.all(this.getShowTargets().map((target) => alphaTo(target, 0.5, to)));
  }

  protected getShowTargets(): Container[] {
    return [this._confirmButton];
  }
}
