import { BirdPlacementResult, HabitatService } from "../services/HabitatService";
import { Area } from "../types/resourceTypes";
import { HabitatAreaView } from "../views/habitat/HabitatAreaView";

export class HabitatController {
    constructor(
        private readonly _service: HabitatService,
        private readonly _areaViews: Map<Area, HabitatAreaView>,
    ) {
        // this.syncOccupiedSlots();
    }

    // syncOccupiedSlots(): void {
    //     this._service.getAreas().forEach((areaStore) => {
    //         const areaView = this.getAreaView(areaStore.area);
    //         areaStore.getSlots().forEach((slotStore) => {
    //             areaView.getSlotView(slotStore.index).setOccupied(slotStore.isOccupied);
    //         });
    //     });
    // }

    placeBirdCard(result: BirdPlacementResult): void {
        this.getAreaView(result.area).placeBirdCard(result.slotIndex, result.bird);
    }

    private getAreaView(area: Area): HabitatAreaView {
        const areaView = this._areaViews.get(area);
        if (!areaView) {
            throw new Error(`Area view for ${area} not found`);
        }

        return areaView;
    }
}
