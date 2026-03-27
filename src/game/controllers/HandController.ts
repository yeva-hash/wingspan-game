import type { PlayerResourceStore } from "../../stores/PlayerResourceStore";
import { createDeferred } from "../../utils/deferred";
import { Bird } from "../models/Bird";
import { HandView } from "../views/HandView";

export type PlayBirdSelection = {
  bird: Bird;
};

export class HandController {
  private _selectedBirdId: string | null = null;

  constructor(
    private readonly store: PlayerResourceStore,
    private readonly view: HandView,
  ) {
    this.view.onBirdClicked = (birdId) => this.handleBirdClick(birdId);
  }

  async render(): Promise<void> {
    await this.view.render(
      this.store.getBirds(),
      this.store.getFoods(),
    );

    this.resetSelectionsState();
    this.clearFoodHighlights();
    this.view.setConfirmEnabled(false);
    this.view.setMessage("");
  }

  async waitForConfirmClick(): Promise<PlayBirdSelection> {
    const deferred = createDeferred<PlayBirdSelection>();

    const prev = this.view.onConfirmClicked;
    this.view.onConfirmClicked = () => {
      const bird = this.getSelectedBird();
      if (!bird) return;

      if (!this.canPayBirdCost(bird)) return;

      deferred.resolve({ bird });
    };

    try {
      return await deferred.promise;
    } finally {
      this.view.onConfirmClicked = prev;
    }
  }

  private handleBirdClick(birdId: string): void {
    if (this._selectedBirdId) {
      this.view.setBirdSelected(this._selectedBirdId, false);
    }

    this._selectedBirdId = birdId;
    this.view.setBirdSelected(birdId, true);

    this.updateFoodHighlights();
    this.updateConfirmState();
  }

  private updateFoodHighlights(): void {
    this.clearFoodHighlights();

    const bird = this.getSelectedBird();
    if (!bird) {
      return;
    }

    for (const food of this.store.getFoods()) {
      const isAllowed = bird.allowedFoods.includes(food.id);
      this.view.setFoodHighlighted(food.id, isAllowed);
    }
  }

  private clearFoodHighlights(): void {
    for (const food of this.store.getFoods()) {
      this.view.setFoodHighlighted(food.id, false);
    }
  }

  private updateConfirmState(): void {
    const bird = this.getSelectedBird();

    if (!bird) {
      this.view.setConfirmEnabled(false);
      this.view.setMessage("");
      return;
    }

    const canPay = this.canPayBirdCost(bird);
    this.view.setConfirmEnabled(canPay);

    if (canPay) {
      this.view.setMessage("");
    } else {
      this.view.setMessage(this.getMissingFoodMessage(bird));
    }
  }

  private canPayBirdCost(bird: Bird): boolean {
    return bird.allowedFoods.some((foodId) => {
      const food = this.store.getFoodById(foodId);
      return !!food;
    });
  }

  private getMissingFoodMessage(bird: Bird): string {
    if (bird.allowedFoods.length === 0) {
      return "This bird doesn't need food";
    }

    return `Not enough food: ${bird.allowedFoods.join(", ")}`;
  }

  private getSelectedBird(): Bird | null {
    if (!this._selectedBirdId) return null;
    return this.store.getBirdById(this._selectedBirdId) ?? null;
  }

  private resetSelectionsState(): void {
    this._selectedBirdId = null;
  }
}