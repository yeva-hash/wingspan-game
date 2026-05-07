import { createDeferred } from "../../utils/deferred";
import type { CancelButtonView } from "../views/CancelButtonView";

export class CancelButtonController {
  constructor(private readonly _view: CancelButtonView) {}

  async show(): Promise<void> {
    await this._view.show();
  }

  async hide(): Promise<void> {
    await this._view.hide();
  }

  async waitForCancel(): Promise<void> {
    const deferred = createDeferred<void>();
    const prev = this._view.onCancelClicked;

    this._view.onCancelClicked = () => {
      this._view.onCancelClicked = prev;
      deferred.resolve();
    };

    return deferred.promise;
  }
}
