import { PlayerResourceStore } from "../stores/PlayerResourceStore";
import { createDeferred } from "../../utils/deferred";
import { Area, BirdDefinition } from "../types/resourceTypes";
import { HandSelectionStrategy } from "../types/selectionTypes";
import { HandView } from "../views/HandView";
import { PlayerResourceReader } from "../types/storeReaders";
import { BirdPlayRuleService } from "../services/BirdPlayRuleService";
import { BirdId } from "../../catalogs/BirdCatalog";

type PlayBirdChoice = {
    birdId: BirdId;
    area: Area;
  };

export class HandController {
  private strategy!: HandSelectionStrategy;
  constructor(
    private readonly resources: PlayerResourceReader, 
    private readonly rules: BirdPlayRuleService,
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
          this.resources.getBirds(),
        this.resources.getFoods(),
      );
      this.strategy?.reset();
      this.syncView();
  }

  renderAreas(areas: readonly Area[]): void {
      this.view.setAreas(areas);
  }

  async chooseBird(): Promise<PlayBirdChoice> {
      const deferred = createDeferred<PlayBirdChoice>();

      const prev = this.view.onConfirmClicked;
      this.view.onConfirmClicked = () => {
          if (!this.strategy.canConfirm()) return;

          const birdId = this.strategy.selectedBirdId; 
          const area = this.strategy.selectedArea;

          if (!birdId || !area) return;

          deferred.resolve({ birdId, area });
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
      for (const bird of this.resources.getBirds()) {
          this.view.setBirdSelected(bird.name, bird.name === this.strategy.selectedBirdId);
      }
  }

  private syncFoodHighlights(): void {
      const bird = this.resources.getBirdById(this.strategy.selectedBirdId ?? "");
      const highlightedFoodIds = new Set(
          bird ? bird.allowedFoods.filter((foodId) => !!this.resources.getFoodById(foodId)) : []
      );

      for (const food of this.resources.getFoods()) {
          this.view.setFoodHighlighted(food.id, highlightedFoodIds.has(food.id));
      }
  }

  private syncAreaSelection(): void {
      const bird = this.getSelectedBird();
      if (!bird) return;
      this.view.enableAreaSelection(this.rules.getAllowedAreas(bird));
  }

  private syncConfirmState(): void {
    const bird = this.getSelectedBird();
    const area = this.strategy.selectedArea;

    const canConfirm =
        this.strategy.canConfirm() &&
        this.rules.canPlayBirdInArea(bird, area);

    this.view.setConfirmEnabled(canConfirm);
    this.view.setMessage(this.rules.getMissingFoodMessage(bird));
}

  private getSelectedBird(): BirdDefinition | null {
    return this.resources.getBirdById(this.strategy.selectedBirdId ?? "");
  }
}