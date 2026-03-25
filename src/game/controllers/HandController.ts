// controllers/HandController.ts
import * as PIXI from "pixi.js";
import { BirdCardView } from "../views/BirdCardView";
import { FoodTokenView } from "../views/FoodTokenView";
import type { Bird } from "../models/Bird";
import type { Food } from "../models/Food";
import type { PlayerResourceStore } from "../../stores/PlayerResourceStore";
import { createDeferred } from "../../utils/deferred";
import { HandView } from "../views/HandView";

export class HandController {
  private cardViews = new Map<string, BirdCardView>(); // instanceId → view
  private tokenViews = new Map<string, FoodTokenView>(); // foodId → view

  onBirdClicked: ((bird: Bird) => void) | null = null;
  onFoodClicked: ((food: Food) => void) | null = null;

  constructor(private readonly store: PlayerResourceStore, private readonly view: HandView ) {}

  render(): void {
    this.view.render(
      this.store.getBirds(),
      this.store.getFoods(),
    );
  }

  // private renderBirds(): void {
  //   this.store.getBirds().forEach((bird, index) => {
  //     const view = new BirdCardView(bird);
  //     view.position.set(index * 130, 0);
  //     view.onClicked = () => this.onBirdClicked?.(bird);
  //     this.cardViews.set(bird.instanceId, view);
  //     this.container.addChild(view);
  //   });
  // }

  // private renderFoods(): void {
  //   this.store.getFoods().forEach((food, index) => {
  //     const view = new FoodTokenView(food);
  //     view.position.set(index * 70, 200);
  //     view.onClicked = () => this.onFoodClicked?.(food);
  //     this.tokenViews.set(food.id, view);
  //     this.container.addChild(view);
  //   });
  // }

  // refreshFood(foodId: string): void {
  //   const food = this.store.getFoodById(foodId);
  //   const view = this.tokenViews.get(foodId);
  //   if (food && view) view.updateQuantity(food.quantity);
  // }

  // removeBirdCard(instanceId: string): void {
  //   const view = this.cardViews.get(instanceId);
  //   if (view) {
  //     this.container.removeChild(view);
  //     this.cardViews.delete(instanceId);
  //   }
  // }

  // setBirdSelected(instanceId: string, selected: boolean): void {
  //   const view = this.cardViews.get(instanceId);
  //   view?.setSelected(selected);
  // }

  // setFoodSelected(foodId: string, selected: boolean): void {
  //   const view = this.tokenViews.get(foodId);
  //   view?.setSelected(selected);
  // }

  async waitForBirdClick(): Promise<Bird> {
    const deferred = createDeferred<Bird>();

    const prev = this.onBirdClicked;
    this.onBirdClicked = (bird) => deferred.resolve(bird);

    try {
      return await deferred.promise;
    } finally {
      this.onBirdClicked = prev;
    }
  }

  // async waitForFoodClick(): Promise<Food> {
  //   const deferred = createDeferred<Food>();

  //   const prev = this.onFoodClicked;
  //   this.onFoodClicked = (food) => deferred.resolve(food);

  //   try {
  //     return await deferred.promise;
  //   } finally {
  //     this.onFoodClicked = prev;
  //   }
  // }
}