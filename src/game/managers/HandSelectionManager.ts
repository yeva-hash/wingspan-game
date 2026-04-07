import type { PlayerResourceStore } from "../../stores/PlayerResourceStore";
import { Bird } from "../models/Bird";
import { Area } from "../types/resourceTypes";

export class HandSelectionManager {
  private _selectedBirdId: string | null = null;
  private _selectedArea: Area | null = null;

  constructor(
    private readonly store: PlayerResourceStore,
  ) {}

  get selectedBirdId(): string | null {
    return this._selectedBirdId;
  }

  reset(): void {
    this._selectedBirdId = null;
  }

  selectBird(birdId: string): void {
    this.clearAreaSelection();
    this._selectedBirdId = birdId;
  }
  
  selectArea(area: Area): void {
    this._selectedArea = area;
  }

  clearAreaSelection(): void {
    this._selectedArea = null;
  }

  getSelectedBird(): Bird | null {
    if (!this._selectedBirdId) {
      return null;
    }

    return this.store.getBirdById(this._selectedBirdId) ?? null;
  }

  getSelectedArea(): Area | null {
    return this._selectedArea;
  }

  getHighlightedFoodIds(): string[] {
    const bird = this.getSelectedBird();
    if (!bird) {
      return [];
    }

    return bird.allowedFoods.filter((foodId) => {
      return !!this.store.getFoodById(foodId);
    });
  }

  canConfirm(): boolean {
    const bird = this.getSelectedBird();
    const area = this.getSelectedArea();

    if (!bird || !area) {
      return false;
    }

    return this.canPayBirdCost(bird);
  }

  getMessage(): string {
    const bird = this.getSelectedBird();
    if (!bird) {
      return "";
    }

    if (this.canPayBirdCost(bird)) {
      return "";
    }

    return this.getMissingFoodMessage(bird);
  }

  private canPayBirdCost(bird: Bird): boolean {
    return bird.allowedFoods.every((foodId) => {
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
}