import { PlayerResourceStore } from "../../stores/PlayerResourceStore";
import { createDeferred } from "../../utils/deferred";
import { Area, BirdDefinition } from "../types/resourceTypes";
import { HandSelectionStrategy } from "../types/selectionTypes";
import { HandView } from "../views/HandView";

export type PlayBirdSelection = {
  bird: BirdDefinition;
  area: Area;
};

export class HandController {
  private strategy!: HandSelectionStrategy;
  constructor(
      private readonly store: PlayerResourceStore,
      private readonly view: HandView,
  ) {
      this.view.onBirdClicked = (birdId) => this.handleBirdClick(birdId);
      this.view.onAreaClicked = (area) => this.handleAreaClick(area);
  }

  setStrategy(strategy: HandSelectionStrategy): void {
      this.strategy = strategy;
      this.strategy.reset();
      this.syncView();
  }

  async render(): Promise<void> {
      await this.view.render(
          this.store.getBirds(),
          this.store.getFoods(),
      );
      this.strategy.reset();
      this.syncView();
  }

  renderAreas(areas: readonly Area[]): void {
      this.view.setAreas(areas);
  }

  async waitForConfirmClick(): Promise<PlayBirdSelection> {
      const deferred = createDeferred<PlayBirdSelection>();

      const prev = this.view.onConfirmClicked;
      this.view.onConfirmClicked = () => {
          if (!this.strategy.canConfirm()) return;

          const bird = this.store.getBirdById(this.strategy.selectedBirdId!);
          const area = this.strategy.selectedArea;

          if (!bird || !area) return;

          deferred.resolve({ bird, area });
      };

      try {
          return await deferred.promise;
      } finally {
          this.view.onConfirmClicked = prev;
      }
  }

  private handleBirdClick(birdId: string): void {
      this.strategy.selectBird(birdId);
      this.syncView();
  }

  private handleAreaClick(area: Area): void {
      this.strategy.selectArea(area);
      this.view.setAreaSelected(area);
      this.syncConfirmState();
  }

  private syncView(): void {
      this.syncBirdSelection();
      this.syncFoodHighlights();
      this.syncAreaSelection();
      this.syncConfirmState();
  }

  private syncBirdSelection(): void {
      for (const bird of this.store.getBirds()) {
          this.view.setBirdSelected(bird.name, bird.name === this.strategy.selectedBirdId);
      }
  }

  private syncFoodHighlights(): void {
      const bird = this.store.getBirdById(this.strategy.selectedBirdId ?? "");
      const highlightedFoodIds = new Set(
          bird ? bird.allowedFoods.filter((foodId) => !!this.store.getFoodById(foodId)) : []
      );

      for (const food of this.store.getFoods()) {
          this.view.setFoodHighlighted(food.id, highlightedFoodIds.has(food.id));
      }
  }

  private syncAreaSelection(): void {
      const bird = this.store.getBirdById(this.strategy.selectedBirdId ?? "");
      if (!bird) return;
      this.view.enableAreaSelection(bird.allowedAreas);
  }

  private syncConfirmState(): void {
      const bird = this.store.getBirdById(this.strategy.selectedBirdId ?? "");
      const canConfirm = this.strategy.canConfirm() && this.canPayBirdCost(bird);
      this.view.setConfirmEnabled(canConfirm);
      this.view.setMessage(this.getMissingFoodMessage(bird));
  }

  private canPayBirdCost(bird: BirdDefinition | null): boolean {
      if (!bird) return false;
      return bird.allowedFoods.every((foodId) => !!this.store.getFoodById(foodId));
  }

  private getMissingFoodMessage(bird: BirdDefinition | null): string {
      if (!bird) return "";
      if (this.canPayBirdCost(bird)) return "";
      return `Not enough food: ${bird.allowedFoods.join(", ")}`;
  }
}