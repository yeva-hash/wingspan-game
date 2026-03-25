import * as PIXI from "pixi.js";
import { BirdCardView } from "./BirdCardView";
import { FoodTokenView } from "./FoodTokenView";
import type { Bird } from "../models/Bird";
import type { Food } from "../models/Food";
import { LayoutService } from "../../layout/layout-service";
import { alphaTo } from "../../utils/viewUtils";

export class HandView {
  private readonly _container: PIXI.Container;

  private readonly _birdsContainer: PIXI.Container;
  private readonly _foodsContainer: PIXI.Container;

  constructor(layoutService: LayoutService) {
    this._container = layoutService.get("hand-field");
    this._birdsContainer = layoutService.get("birds-container");
    this._foodsContainer = layoutService.get("foods-container");
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
  }

  private renderBirds(birds: readonly Bird[]): void {
    birds.forEach((bird, index) => {
      const view = new BirdCardView(bird);
      view.position.set(index * 130, 0);
      this._birdsContainer.addChild(view);
    });
  }

  private renderFoods(foods: readonly Food[]): void {
    foods.forEach((food, index) => {
      const view = new FoodTokenView(food);
      view.position.set(index * 70, 0);
      this._foodsContainer.addChild(view);
    });
  }
}