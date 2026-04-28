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
    //   this.syncView();
  }

  renderAreas(areas: readonly Area[]): void {
      this.view.setAreas(areas);
  }

  private syncView(): void {
    const bird = this.getSelectedBird();

    for (const b of this.resources.getBirds()) {
        this.view.setBirdSelected(b.id, b.id === this.strategy.selectedBirdId);
    }

    const highlightedFoodIds = new Set(
        bird ? bird.requiredFoods.filter((foodId) => !!this.resources.getFoodById(foodId)) : []
    );
    for (const food of this.resources.getFoods()) {
        this.view.setFoodHighlighted(food.id, highlightedFoodIds.has(food.id));
    }

    if (bird) {
        this.view.enableAreaSelection(this.rules.getAllowedAreas(bird));
    } else {
        this.view.resetAreaSelection();
    }

    const area = this.strategy.selectedArea;
    this.view.setConfirmEnabled(
        this.strategy.canConfirm() && this.rules.canPlayBirdInArea(bird, area)
    );
    this.view.setMessage(this.rules.getMissingFoodMessage(bird));
  }

  private getSelectedBird(): BirdDefinition | null {
    return this.resources.getBirdById(this.strategy.selectedBirdId ?? "");
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
      this.syncView();
      this.view.setAreaSelected(area);
  }

  //TODO
  hide(): void {
    this.view.hide();
  }
}
