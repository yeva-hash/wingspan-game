import { FeederService } from "../services/FeederService";
import type { Container } from "pixi.js";
import { createDeferred } from "../../utils/deferred";
import { FeederSelectionStrategy } from "../types/selectionTypes";
import { FeederView } from "../views/FeederView";
import { ChooseFoodStrategy } from "../strategy/selectionStrategy/ChooseFoodStrategy";

export type FoodChoice = {
    selectedFoodIndexes: number[];
};

export class FeederController {
    private strategy!: FeederSelectionStrategy;

    constructor(private readonly _services: FeederService, private readonly _view: FeederView) {}

    get container(): Container {
        return this._view.container;
    }

    setStrategy(strategy: FeederSelectionStrategy): void {
        this.strategy = strategy;
        this.strategy.reset();
        this.syncView();
    }

    render(): void {
        this._view.fillFoodSlots(this._services.getRandomFoodDefs());
        this.syncWithStore();
    }

    async cancelSelection(): Promise<void> {
        await this._view.cancelSelection();
    }

    async selectFood(selectedCount?: number): Promise<FoodChoice> {
        if (selectedCount !== undefined) {
            this.setStrategy(new ChooseFoodStrategy(selectedCount));
        }

        const deferred = createDeferred<FoodChoice>();
        await this._view.prepareForSelection();
        this.syncView();

        const prevFoodClick = this._view.onFoodClicked;
        const prevConfirmClick = this._view.onConfirmClicked;

        this._view.onFoodClicked = (index) => {
            if (!this._services.hasFoodAtSlot(index)) return;
            this.strategy.selectFood(index);
            this.syncView();
        };

        this._view.onConfirmClicked = () => {
            if (!this.strategy.canConfirm()) return;
            deferred.resolve({
                selectedFoodIndexes: [...this.strategy.selectedFoodIndexes],
            });
        };

        try {
            //TODO await?
            const choice = await deferred.promise;
            this._view.completeSelection();
            return choice;
        } finally {
            this._view.onFoodClicked = prevFoodClick;
            this._view.onConfirmClicked = prevConfirmClick;
        }
    }

    syncWithStore(): void {
        if (this._services.isEmpty()) {
            this._view.fillFoodSlots(this._services.getRandomFoodDefs());
            return;
        }

        this._view.syncFoodSlots(this._services.getFoodDefsBySlots());
    }

    private syncView(): void {
        this.syncFoodSelection();
        this.syncConfirmState();
    }

    private syncFoodSelection(): void {
        const selectedIndexes = new Set(this.strategy.selectedFoodIndexes);

        for (const index of this._services.getFoodSlotIndexes()) {
            this._view.setSelected(index, selectedIndexes.has(index));
        }
    }

    private syncConfirmState(): void {
        this._view.setConfirmEnabled(this.strategy.canConfirm());
    }
}
