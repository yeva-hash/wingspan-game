import { BirdsOfferedStore } from "../../stores/BirdsOfferedStore";
import { BirdDefinition } from "../types/resourceTypes";
import { BirdOfferView } from "../views/BirdOfferView";
import { createDeferred } from "../../utils/deferred";
import { SelectionStrategy } from "../types/selectionTypes";
import { ChooseBirdStrategy } from "../strategy/selectionStrategy/ChooseBirdStrategy";

export class BirdOfferedController {
    private _selectionStrategy!: ChooseBirdStrategy;
    constructor(private view: BirdOfferView, private readonly store: BirdsOfferedStore) 
    {
        this.view.onBirdClicked = (birdId) => this.handleBirdClick(birdId);
    }
    
    setStrategy(strategy: SelectionStrategy): void {
        this._selectionStrategy = strategy as ChooseBirdStrategy;
        //this.syncView();
    }

    async render(): Promise<void> {
        this._selectionStrategy.reset();

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
            const { selectedBirdIds } = this._selectionStrategy;
            if (!selectedBirdIds.length) {
                return;
            }

            const selectedBirds = selectedBirdIds.map((birdId) => {
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
        this._selectionStrategy.selectBird(birdId);

        this.syncView();
    }

    private syncView(): void {
        this.syncBirdSelection();
        this.syncConfirmState();
    }
    
    private syncBirdSelection(): void {
        const isRandomSelected = this._selectionStrategy.selectedBirdIds.includes("random");
        this.view.setRandomSelected(isRandomSelected);

        for (const bird of this.store.getOfferedBirds()) {
            this.view.setSelected(bird.name, this._selectionStrategy.selectedBirdIds.includes(bird.name));
        }
    }

    private syncConfirmState(): void {
        this.view.setConfirmEnabled(this._selectionStrategy.canConfirm());
    }
}