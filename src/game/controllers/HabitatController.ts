import { createDeferred } from "../../utils/deferred";
import { BirdPlacementResult, HabitatBirdSlotMap, HabitatService } from "../services/HabitatService";
import { Area } from "../types/resourceTypes";
import { HabitatAreaView } from "../views/habitat/HabitatAreaView";

export class HabitatController {
    constructor(
        private readonly _service: HabitatService,
        private readonly _areaViews: Map<Area, HabitatAreaView>,
    ) {}

    placeBirdCard(result: BirdPlacementResult): void {
        this.getAreaView(result.area).placeBirdCard(result.slotIndex, result.bird);
    }

    async chooseBirdForEggPlacement(availableSlotsByArea: HabitatBirdSlotMap): Promise<{ area: Area; slotIndex: number }> {
        const deferred = createDeferred<{ area: Area; slotIndex: number }>();
        this.clearEggPlacementSelection();

        for (const [area, slotIndexes] of availableSlotsByArea) {
            const areaView = this.getAreaView(area);
            for (const slotIndex of slotIndexes) {
                const slotView = areaView.getSlotView(slotIndex);
                slotView.onBirdClicked = () => {
                    deferred.resolve({ area, slotIndex });
                };

                areaView.setBirdInteractive(slotIndex, true);
            }
        }

        // for (const areaStore of this._service.getAreas()) {
        //     const areaView = this.getAreaView(areaStore.area);
        //     const availableSlotIndexes = new Set(availableSlotsByArea.get(areaStore.area) ?? []);

        //     for (const slotStore of areaStore.getSlots()) {
        //         const slotView = areaView.getSlotView(slotStore.index);
        //         const slotRef = { area: areaStore.area, slotIndex: slotStore.index };
        //         const isAvailable = availableSlotIndexes.has(slotStore.index);

        //         slotView.onBirdClicked = isAvailable ? () => {
        //             this.clearEggPlacementSelection();
        //             deferred.resolve(slotRef);
        //         } : null;

        //         areaView.setBirdInteractive(slotStore.index, isAvailable);
        //     }
        // }

        return deferred.promise;
    }

    updateEggProgress(area: Area, slotIndex: number): void {
        const bird = this._service.getSlot(area, slotIndex).bird;
        if (!bird) {
            throw new Error(`No bird found in ${area} slot ${slotIndex}`);
        }

        this.getAreaView(area).updateEggProgress(slotIndex, bird);
    }

    clearEggPlacementSelection(): void {
        for (const areaStore of this._service.getAreas()) {
            const areaView = this.getAreaView(areaStore.area);

            for (const slotStore of areaStore.getSlots()) {
                const slotView = areaView.getSlotView(slotStore.index);
                slotView.onBirdClicked = null;
                areaView.setBirdInteractive(slotStore.index, false);
            }
        }
    }

    private getAreaView(area: Area): HabitatAreaView {
        const areaView = this._areaViews.get(area);
        if (!areaView) {
            throw new Error(`Area view for ${area} not found`);
        }

        return areaView;
    }
}
