import type { PlayerResourceStore } from "../../stores/PlayerResourceStore";
import { createDeferred } from "../../utils/deferred";
import { HandSelectionManager } from "../managers/HandSelectionManager";
import { Bird } from "../models/Bird";
import type { Area } from "../resourceTypes";
import { HandView } from "../views/HandView";

export type PlayBirdSelection = {
  bird: Bird;
  area: Area;
};

export class HandController {
  constructor(
    private readonly store: PlayerResourceStore,
    private readonly view: HandView,
    private readonly selectionManager: HandSelectionManager,
  ) {
    this.view.onBirdClicked = (birdId) => this.handleBirdClick(birdId);
    this.view.onAreaClicked = (area) => this.handleAreaClick(area);
  }

  async render(): Promise<void> {
    await this.view.render(
      this.store.getBirds(),
      this.store.getFoods(),
    );

    this.selectionManager.reset();
    this.syncView();
  }

  renderAreas(areas: readonly Area[]): void {
    this.view.setAreas(areas);
  }

  async waitForConfirmClick(): Promise<PlayBirdSelection> {
    const deferred = createDeferred<PlayBirdSelection>();

    const prev = this.view.onConfirmClicked;
    this.view.onConfirmClicked = () => {
      const bird = this.selectionManager.getSelectedBird();
      const area = this.selectionManager.getSelectedArea();

      if (!bird || !area || !this.selectionManager.canConfirm()) {
        return;
      }

      deferred.resolve({ bird, area });
    };

    try {
      return await deferred.promise;
    } finally {
      this.view.onConfirmClicked = prev;
    }
  }

  private handleBirdClick(birdId: string): void {
    this.selectionManager.selectBird(birdId);
    this.syncView();
  }

  private syncView(): void {
    this.syncBirdSelection();
    this.syncFoodHighlights();
    this.syncAreaSelection();
    this.syncConfirmState();
  }

  private syncBirdSelection(): void {
    const selectedBirdId = this.selectionManager.selectedBirdId;

    for (const bird of this.store.getBirds()) {
      this.view.setBirdSelected(bird.name, bird.name === selectedBirdId);
    }
  }

  private syncFoodHighlights(): void {
    const highlightedFoodIds = new Set(
      this.selectionManager.getHighlightedFoodIds(),
    );

    for (const food of this.store.getFoods()) {
      this.view.setFoodHighlighted(food.id, highlightedFoodIds.has(food.id));
    }
  }

  private handleAreaClick(area: Area): void {
    this.selectionManager.selectArea(area);
    this.view.setAreaSelected(area);
    this.syncConfirmState();
  }

  private syncConfirmState(): void {
    this.view.setConfirmEnabled(this.selectionManager.canConfirm());
    this.view.setMessage(this.selectionManager.getMessage());
  }

  private syncAreaSelection(): void {
    const selectedBird = this.selectionManager.getSelectedBird();
    if (!selectedBird) {
      return;
    }
    this.view.enableAreaSelection(selectedBird.allowedAreas);
  }
}