import { BirdSupplyService } from "../services/BirdSupplyService";
import { createDeferred } from "../../utils/deferred";
import { BirdOfferSelectionStrategy } from "../types/selectionTypes";
import { BirdOfferView } from "../views/BirdOfferView";
import { BirdSupplyReader } from "../types/storeReaders";

export type BirdOfferChoice = {
    selectedBirdIds: string[];
    takeRandomCount: number;
};

export class BirdOfferedController {
    private strategy!: BirdOfferSelectionStrategy;
    constructor(
        private readonly view: BirdOfferView,
        private readonly service: BirdSupplyReader
    ) {
        this.view.onBirdClicked = (birdId) => this.handleBirdClick(birdId);
    }

    setStrategy(strategy: BirdOfferSelectionStrategy): void {
        this.strategy = strategy;
        this.strategy.reset();
        this.syncView();
    }

    async render(): Promise<void> {
        this.strategy?.reset();
        const birds = this.service.getOfferedBirds();
        await this.view.render(birds);
    }

    async prepareViewForSelection(): Promise<void> {
        await this.view.prepareForSelection();
    }

    async cancelSelection(): Promise<void> {
        await this.view.cancelSelection();
    }

    async chooseBirds(): Promise<BirdOfferChoice> {
        const deferred = createDeferred<BirdOfferChoice>();
        const prev = this.view.onConfirmClicked;

        this.view.onConfirmClicked = () => {
            if (!this.strategy.canConfirm()) return;

            const birdOfferChoice = {
                selectedBirdIds: this.strategy.selectedBirdIds,
                takeRandomCount: 1,
            };

            deferred.resolve(birdOfferChoice);
        };

        try {
            const choice = await deferred.promise;
            await this.view.completeSelection();
            return choice;
        } finally {
            this.view.onConfirmClicked = prev;
        }
    }

    private handleBirdClick(birdId: string): void {
        this.strategy.selectBird(birdId);
        this.syncView();
    }

    private syncView(): void {
        this.syncBirdSelection();
        this.syncConfirmState();
    }

    private syncBirdSelection(): void {
        const isRandomSelected = this.strategy.selectedBirdIds.includes("random");
        this.view.setRandomSelected(isRandomSelected);

        for (const bird of this.service.getOfferedBirds()) {
            this.view.setSelected(bird.id, this.strategy.selectedBirdIds.includes(bird.id));
        }
    }

    private syncConfirmState(): void {
        this.view.setConfirmEnabled(this.strategy.canConfirm());
    }
}
