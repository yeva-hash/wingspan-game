import { BirdsOfferedStore } from "../../stores/BirdsOfferedStore";
import { createDeferred } from "../../utils/deferred";
import { BirdDefinition } from "../types/resourceTypes";
import { BirdOfferSelectionStrategy } from "../types/selectionTypes";
import { BirdOfferView } from "../views/BirdOfferView";

export class BirdOfferedController {
    constructor(
        private readonly view: BirdOfferView,
        private readonly store: BirdsOfferedStore,
        private strategy: BirdOfferSelectionStrategy,
    ) {
        this.view.onBirdClicked = (birdId) => this.handleBirdClick(birdId);
    }

    setStrategy(strategy: BirdOfferSelectionStrategy): void {
        this.strategy = strategy;
        this.strategy.reset();
        this.syncView();
    }

    async render(): Promise<void> {
        this.strategy.reset();
        const birds = this.store.getOfferedBirds();
        await this.view.render(birds);
    }

    async prepareView(): Promise<void> {
        await this.view.prepareForSelection();
    }

    async waitForConfirmClick(): Promise<BirdDefinition[]> {
        const deferred = createDeferred<BirdDefinition[]>();
        const prev = this.view.onConfirmClicked;

        this.view.onConfirmClicked = () => {
            if (!this.strategy.canConfirm()) return;

            const selectedBirds = this.strategy.selectedBirdIds.map((birdId) => {
                if (birdId === "random") {
                    return this.store.getRandomAvailableBird();
                }
                return this.store.getOfferedBirdById(birdId)!;
            });

            deferred.resolve(selectedBirds);
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

    private syncView(): void {
        this.syncBirdSelection();
        this.syncConfirmState();
    }

    private syncBirdSelection(): void {
        const isRandomSelected = this.strategy.selectedBirdIds.includes("random");
        this.view.setRandomSelected(isRandomSelected);

        for (const bird of this.store.getOfferedBirds()) {
            this.view.setSelected(bird.name, this.strategy.selectedBirdIds.includes(bird.name));
        }
    }

    private syncConfirmState(): void {
        this.view.setConfirmEnabled(this.strategy.canConfirm());
    }
}