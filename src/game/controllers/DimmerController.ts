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
  private _highlightedTargets: HighlightedTarget[] = [];

  constructor(private readonly _layoutService: LayoutService) {
    this._container = this._layoutService.get("dimmer-container");
    this._image = this._layoutService.get("dimmer-img");
  }

  async highlight(targets: Container | Container[]): Promise<void> {
    if (this._highlightedTargets.length > 0) {
      await this.clear();
    }

    const normalizedTargets = Array.isArray(targets) ? targets : [targets];

    for (const target of normalizedTargets) {
      const originalParent = target.parent;
      if (!originalParent) {
        throw new Error("Dimmer target has no parent");
      }

      const originalIndex = originalParent.getChildIndex(target);
      const targetGlobalPosition = target.getGlobalPosition();
      const targetDimmerPosition = this._container.toLocal(targetGlobalPosition);

      originalParent.removeChild(target);
      this._container.addChild(target);
      target.position.copyFrom(targetDimmerPosition);

      this._highlightedTargets.push({
        target,
        originalParent,
        originalIndex,
      });
    }

    await alphaTo(this._image, 0.25, 1);
  }

  async clear(): Promise<void> {
    await alphaTo(this._image, 0.25, 0);

    if (this._highlightedTargets.length === 0) {
      return;
    }

    const targetsToRestore = [...this._highlightedTargets].sort((a, b) => a.originalIndex - b.originalIndex);

    for (const { target, originalParent, originalIndex } of targetsToRestore) {
      const targetGlobalPosition = target.getGlobalPosition();
      const targetOriginalPosition = originalParent.toLocal(targetGlobalPosition);

      this._container.removeChild(target);
      originalParent.addChildAt(target, Math.min(originalIndex, originalParent.children.length));
      target.position.copyFrom(targetOriginalPosition);
    }

    this._highlightedTargets = [];
  }
}
