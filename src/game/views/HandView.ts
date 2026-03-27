import * as PIXI from "pixi.js";
import { BirdCardView } from "./BirdCardView";
import { FoodTokenView } from "./FoodTokenView";
import type { Bird } from "../models/Bird";
import type { Food } from "../models/Food";
import { LayoutService } from "../../layout/LayoutService";
import { alphaTo } from "../../utils/viewUtils";

export class HandView {
  onBirdClicked: ((birdId: string) => void) | null = null;
  onConfirmClicked: (() => void) | null = null;

  private readonly _container: PIXI.Container;
  private readonly _birdsContainer: PIXI.Container;
  private readonly _foodsContainer: PIXI.Container;
  private readonly _confirmButton: PIXI.Container;
  private readonly _messageText: PIXI.Text;

  private readonly _birdViewsById = new Map<string, BirdCardView>();
  private readonly _foodViewsById = new Map<string, FoodTokenView>();

  constructor(layoutService: LayoutService) {
    this._container = layoutService.get("hand-field");
    this._birdsContainer = layoutService.get("birds-container");
    this._foodsContainer = layoutService.get("foods-container");
    this._confirmButton = layoutService.get("confirm-button");
    this._messageText = layoutService.get("hand-message-text");

    this._confirmButton.eventMode = "static";
    this._confirmButton.cursor = "pointer";
    this._confirmButton.on("pointerdown", () => {
      this.onConfirmClicked?.();
    });
  }

  async render(birds: readonly Bird[], foods: readonly Food[]): Promise<void> {
    this.clear();
    this.renderBirds(birds);
    this.renderFoods(foods);
    await alphaTo(this._container, 0.75, 1);
  }

  clear(): void {
    this._birdsContainer.removeChildren();
    this._foodsContainer.removeChildren();
    this._birdViewsById.clear();
    this._foodViewsById.clear();
    this.setMessage("");
  }

  private renderBirds(birds: readonly Bird[]): void {
    birds.forEach((bird, index) => {
      const view = new BirdCardView(bird);
      view.position.set(index * 130, 0);
      view.onClicked = () => this.onBirdClicked?.(bird.instanceId);

      this._birdViewsById.set(bird.instanceId, view);
      this._birdsContainer.addChild(view);
    });
  }

  private renderFoods(foods: readonly Food[]): void {
    foods.forEach((food, index) => {
      const view = new FoodTokenView(food);
      view.position.set(index * 70, 0);

      this._foodViewsById.set(food.id, view);
      this._foodsContainer.addChild(view);
    });
  }

  setBirdSelected(instanceId: string, selected: boolean): void {
    this._birdViewsById.get(instanceId)?.setSelected(selected);
  }

  setFoodHighlighted(foodId: string, highlighted: boolean): void {
    this._foodViewsById.get(foodId)?.setHighlighted(highlighted);
  }

  setConfirmEnabled(enabled: boolean): void {
    this._confirmButton.eventMode = enabled ? "static" : "none";
    this._confirmButton.alpha = enabled ? 1 : 0.5;
    this._confirmButton.cursor = enabled ? "pointer" : "default";
  }

  setMessage(message: string): void {
    this._messageText.text = message;
    this._messageText.visible = message.length > 0;
  }
}