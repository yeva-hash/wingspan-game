import type { PlayerResourceStore } from "../../stores/PlayerResourceStore";
import { createDeferred } from "../../utils/deferred";
import { Bird } from "../models/Bird";
import { HandView } from "../views/HandView";

export type PlayBirdSelection = {
  bird: Bird;
  foodId: string;
};

export class HandController {
  private _selectedBirdId: string | null = null;
  private readonly _selectedFoodCounts = new Map<string, number>();

  constructor(
    private readonly store: PlayerResourceStore,
    private readonly view: HandView,
  ) {
    this.view.onBirdClicked = (birdId) => this.handleBirdClick(birdId);
    this.view.onFoodClicked = (foodId) => this.handleFoodClick(foodId);
  }

  async render(): Promise<void> {
    await this.view.render(
      this.store.getBirds(),
      this.store.getFoods(),
    );

    this.resetSelectionsState();
    this.updateFoodAvailability();
    this.updateConfirmState();
  }

  async waitForConfirmClick(): Promise<PlayBirdSelection> {
    const deferred = createDeferred<PlayBirdSelection>();

    const prev = this.view.onConfirmClicked;
    this.view.onConfirmClicked = () => {
      const bird = this.getSelectedBird();
      const foodId = this.getSelectedFoodId();

      if (!bird || !foodId) return;

      deferred.resolve({ bird, foodId });
    };

    try {
      return await deferred.promise;
    } finally {
      this.view.onConfirmClicked = prev;
    }
  }

  private getSelectedFoodId(): string | null {
    for (const [foodId, count] of this._selectedFoodCounts) {
      if (count > 0) {
        return foodId;
      }
    }

    return null;
  }

  private handleBirdClick(birdId: string): void {
    if (this._selectedBirdId) {
      this.view.setBirdSelected(this._selectedBirdId, false);
    }

    this._selectedBirdId = birdId;
    this.view.setBirdSelected(birdId, true);

    this.resetSelectedFoods();
    this.updateFoodAvailability();
    this.updateConfirmState();
  }

  private resetSelectedFoods(): void {
    for (const [foodId, count] of this._selectedFoodCounts) {
      if (count > 0) {
        this.view.setFoodSelectedCount(foodId, 0);
      }
    }

    this._selectedFoodCounts.clear();
  }

  private updateFoodAvailability(): void {
    const selectedBird = this.getSelectedBird();

    for (const food of this.store.getFoods()) {
      const enabled = !!selectedBird && selectedBird.allowedFoods.includes(food.id);
      this.view.setFoodEnabled(food.id, enabled);
    }
  }

  private handleFoodClick(foodId: string): void {
    const selectedBird = this.getSelectedBird();
    if (!selectedBird) return;

    const food = this.store.getFoodById(foodId);
    if (!food) return;

    if (!selectedBird.allowedFoods.includes(food.id)) return;

    const isSelected = (this._selectedFoodCounts.get(foodId) ?? 0) > 0;

    this.resetSelectedFoods();

    if (!isSelected) {
      this._selectedFoodCounts.set(foodId, 1);
      this.view.setFoodSelectedCount(foodId, 1);
    }

    this.updateConfirmState();
  }

  private updateConfirmState(): void {
    const hasBird = this._selectedBirdId !== null;
    const hasFood = [...this._selectedFoodCounts.values()].some((count) => count > 0);

    this.view.setConfirmEnabled(hasBird && hasFood);
  }

  private getSelectedBird(): Bird | null {
    if (!this._selectedBirdId) return null;

    return this.store.getBirdById(this._selectedBirdId) ?? null;
  }

  private resetSelectionsState(): void {
    this._selectedBirdId = null;
    this._selectedFoodCounts.clear();
  }
}