import type { Container } from "pixi.js";
import type { LayoutService } from "../../layout/LayoutService";
import { alphaTo } from "../../utils/viewUtils";

type HighlightedTarget = {
  target: Container;
  originalParent: Container;
  originalIndex: number;
};

export class DimmerController {
  private readonly _container: Container;
  private readonly _image: Container;
  private _highlightedTarget: HighlightedTarget | null = null;

  constructor(private readonly _layoutService: LayoutService) {
    this._container = this._layoutService.get("dimmer-container");
    this._image = this._layoutService.get("dimmer-img");
  }

  async highlight(targetName: string): Promise<void> {
    if (this._highlightedTarget) {
      await this.clear();
    }

    const target = this._layoutService.get<Container>(targetName);
    const originalParent = target.parent;
    if (!originalParent) {
      throw new Error(`Dimmer target "${targetName}" has no parent`);
    }

    const originalIndex = originalParent.getChildIndex(target);
    const targetGlobalPosition = target.getGlobalPosition();
    const targetDimmerPosition = this._container.toLocal(targetGlobalPosition);

    originalParent.removeChild(target);
    this._container.addChild(target);
    target.position.copyFrom(targetDimmerPosition);

    this._highlightedTarget = {
      target,
      originalParent,
      originalIndex,
    };

    await alphaTo(this._image, 0.25, 1);
  }

  async clear(): Promise<void> {
    await alphaTo(this._image, 0.25, 0);

    if (!this._highlightedTarget) {
      return;
    }

    const { target, originalParent, originalIndex } = this._highlightedTarget;
    const targetGlobalPosition = target.getGlobalPosition();
    const targetOriginalPosition = originalParent.toLocal(targetGlobalPosition);

    this._container.removeChild(target);
    originalParent.addChildAt(target, originalIndex);
    target.position.copyFrom(targetOriginalPosition);
    this._highlightedTarget = null;
  }
}
