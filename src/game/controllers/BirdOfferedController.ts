import { random } from "gsap";
import { BirdsOfferedStore } from "../../stores/BirdsOfferedStore";
import { GameStore } from "../../stores/GameStore";
import { Bird } from "../models/Bird";
import { BirdDefinition } from "../resourceTypes";
import { BirdOfferView } from "../views/BirdOfferView";
import { randomInt } from "../../utils/general";
import { createDeferred } from "../../utils/deferred";
import { BirdSelectionManager } from "../managers/BirdSelectionManager";

export class BirdOfferedController {
    constructor(private view: BirdOfferView, private readonly store: BirdsOfferedStore, private readonly selectionManager: BirdSelectionManager) {
        this.view.onBirdClicked = (birdId) => this.handleBirdClick(birdId);
    }
    async render(): Promise<void> {
        this.selectionManager.reset();

        const birds = this.store.getOfferedBirds();
        await this.view.render(birds);
    }

    // private getBirdOffers(): BirdDefinition[] {
    //     const availableBirds = this.store.getAvailableBirds();
    //     // if (availableBirds.length === 0) {
    //     //     throw new Error("No birds available");
    //     // }
    //     // //TODO
    //     // for(let i = 0; i < BirdsOfferedStore.initialBirdsOfferedCount; i++) {
    //     //     const bird = this.store.getRandomAvailableBird();
    //     //     this.store.addOfferedBird(bird);
    //     // }

    //     // return [...this.store.getOfferedBirds()];
    // }

    async prepareView(selectedCount: number): Promise<void> {
        //hightlight section
        this.selectionManager.setSelectedCount(selectedCount);
        await this.view.prepareForSelection();
    }

    async waitForConfirmClick(): Promise<BirdDefinition[]> {
        const deferred = createDeferred<BirdDefinition[]>();
        const prev = this.view.onConfirmClicked;

        this.view.onConfirmClicked = () => {
            const { selectedBirdIds } = this.selectionManager;
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
        this.selectionManager.selectBird(birdId);

        this.syncView();
    }

    private syncView(): void {
        this.syncBirdSelection();
        this.syncConfirmState();
    }
    
    private syncBirdSelection(): void {
        const isRandomSelected = this.selectionManager.selectedBirdIds.includes("random");
        this.view.setRandomSelected(isRandomSelected);

        for (const bird of this.store.getOfferedBirds()) {
            this.view.setSelected(bird.name, this.selectionManager.selectedBirdIds.includes(bird.name));
        }
    }

    private syncConfirmState(): void {
        this.view.setConfirmEnabled(this.selectionManager.canConfirm());
      }
}