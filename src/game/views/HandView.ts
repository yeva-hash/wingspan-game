import * as PIXI from "pixi.js";
import { BirdCardView } from "./BirdCardView";
import type { QuantifiedFood } from "../models/QuantifiedFood";
import { LayoutService } from "../../layout/LayoutService";
import { alphaTo } from "../../utils/viewUtils";
import { QuantifiedFoodTokenView } from "./food/QuantifiedFoodTokenView";
import { Area, BirdDefinition, FoodDefinition } from "../types/resourceTypes";
import gsap from "gsap";

enum HandViewState {
  Hidden,
  Visible,
  Minimized,
}

export class HandView {
  onBirdClicked: ((birdId: string) => void) | null = null;
  onConfirmClicked: (() => void) | null = null;
  onAreaClicked: ((areaId: Area) => void) | null = null;

  private readonly _container: PIXI.Container;
  private readonly _birdsContainer: PIXI.Container;
  private readonly _foodsContainer: PIXI.Container;
  private readonly _confirmButton: PIXI.Container;
  private readonly _messageText: PIXI.Text;

  private readonly _birdViewsById = new Map<string, BirdCardView>();
  private readonly _foodViewsById = new Map<string, QuantifiedFoodTokenView>();

  private readonly _areaSelections = new Map<Area, PIXI.Text>();

  private readonly _minimizeButton: PIXI.Text;

  private _state = HandViewState.Hidden;

  constructor(private _layoutService: LayoutService) {
    this._container = this._layoutService.get("hand-field");
    this._birdsContainer = this._layoutService.get("birds-container");
    this._foodsContainer = this._layoutService.get("foods-container");
    this._confirmButton = this._layoutService.get("confirm-button");
    this._messageText = this._layoutService.get("hand-message-text");
    this._minimizeButton = this._layoutService.get("minimize-button");

    this._confirmButton.eventMode = "static";
    this._confirmButton.cursor = "pointer";
    this._confirmButton.on("pointerdown", () => {
      this.onConfirmClicked?.();
    });

    this._minimizeButton.eventMode = "static";
    this._minimizeButton.cursor = "pointer";
    this._minimizeButton.on("pointerdown", () => {
      this.onMinimizeClicked?.();
    });
  }

  private onMinimizeClicked(): void {
    const isVisible = this._state === HandViewState.Visible;
    const YPos = isVisible ? 675 : 0;
    gsap.to(this._container, { y: YPos, duration: 1, ease: "power1.inOut",
       onComplete: () => {
        this._state = isVisible ? HandViewState.Minimized : HandViewState.Visible; 
      }
    });
  }

  async render(birds: readonly BirdDefinition[], foods: readonly QuantifiedFood[]): Promise<void> {
    this.show();
    this.clear();
    await this.renderBirds(birds);
    await this.renderFoods(foods);
    await alphaTo(this._container, 0.75, 1);
    this._state = HandViewState.Visible;
  }

  clear(): void {
    this._birdsContainer.removeChildren();
    this._foodsContainer.removeChildren();
    this._birdViewsById.clear();
    this._foodViewsById.clear();
    this.setMessage("");
    // this._areaSelections.forEach((_, id) => this.setAreaSelected(id, false));
  }

  private async renderBirds(birds: readonly BirdDefinition[]): Promise<void> {
    for (const [index, bird] of birds.entries()) {
      const prefab = await this._layoutService.createPrefab<PIXI.Container>("bird");
      const view = new BirdCardView(prefab, bird);
      view.container.position.set(index * 130, 0);
      view.onClicked = () => this.onBirdClicked?.(bird.id);

      this._birdViewsById.set(bird.id, view);
      this._birdsContainer.addChild(view.container);
    }
  }

  private async renderFoods(foods: readonly QuantifiedFood[]): Promise<void> {
    for (const [index, food] of foods.entries()) {
      if (this._foodViewsById.has(food.id)) {
        const view = this._foodViewsById.get(food.id);
        view!.quantity = food.quantity;
        continue;
      }
      const prefab = await this._layoutService.createPrefab<PIXI.Container>("hand-food");
      const view = new QuantifiedFoodTokenView(prefab, food);
      view.container.position.set(index * 70, 0);

      this._foodViewsById.set(food.id, view);
      this._foodsContainer.addChild(view.container);
    }
  }

  setBirdSelected(instanceId: string, selected: boolean): void {
    this._birdViewsById.get(instanceId)?.setSelected(selected);
  }

  setFoodHighlighted(foodId: string, highlighted: boolean): void {
    this._foodViewsById.get(foodId)?.setSelected(!highlighted);
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

  hide(): void {
    this._container.visible = false;
    this._state = HandViewState.Hidden;
  }

  show(): void {
    this._container.visible = true;
    this._container.alpha = 1;
    this._state = HandViewState.Visible;
  }

  setAreas(areas: readonly Area[]): void {
    areas.forEach((area) => {
      if (this._areaSelections.has(area)) {
        return;
      }

      const text = this._layoutService.get(`${area}-text`) as PIXI.Text;
      text.eventMode = "static";
      text.cursor = "pointer";
      this._areaSelections.set(area, text);
      text.visible = false;
      text.on("pointerdown", () => this.onAreaClicked?.(area));
    });
  }

  setAreaSelected(areaId: Area): void {
    this._areaSelections.forEach((text, area) => {
      text.alpha = area === areaId ? 1 : 0.5;
    });
  }

  enableAreaSelection(allowedAreas: readonly Area[]): void {
    this._areaSelections.forEach((text, areaId) => {
      text.alpha = 1;
      text.visible = allowedAreas.includes(areaId);
      text.interactive = allowedAreas.includes(areaId);
    });
  }
}
