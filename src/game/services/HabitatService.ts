import { HabitatStore } from "../stores/habitat/HabitatStore";
import { HabitatAreaStore } from "../stores/habitat/HabitatAreaStore";
import { HabitatSlotStore } from "../stores/habitat/HabitatSlotStore";
import { Area, BirdDefinition } from "../types/resourceTypes";
import { BirdCatalog } from "../../catalogs/BirdCatalog";

export type BirdPlacementResult = {
    area: Area;
    bird: BirdDefinition;
    slotIndex: number;
};

export class HabitatService {
    constructor(private readonly _habitatStore: HabitatStore, private readonly _birdCatalog: BirdCatalog) {}

    getAreas(): HabitatAreaStore[] {
        return this._habitatStore.getAreas();
    }

    getArea(area: Area): HabitatAreaStore {
        return this._habitatStore.getArea(area);
    }

    getSlots(area: Area): HabitatSlotStore[] {
        return this.getArea(area).getSlots();
    }

    getFirstFreeSlot(area: Area): HabitatSlotStore | null {
        return this.getSlots(area).find((slot) => !slot.isOccupied) ?? null;
    }

    // getFirstFreeSlotIndex(area: Area): number | null {
    //     return this.getFirstFreeSlot(area)?.index ?? null;
    // }

    // canPlaceBirdInArea(area: Area): boolean {
    //     return this.getFirstFreeSlot(area) !== null;
    // }

    placeBirdInArea(area: Area, birdId: string): BirdPlacementResult {
        const slot = this.getFirstFreeSlot(area);
        if (!slot) {
            //TODO visual feedback
            throw new Error(`No free slots in ${area}`);
        }

        this.getArea(area).setBirdInSlot(slot.index, birdId);

        const bird = this._birdCatalog.getById(birdId);

        return {
            area,
            bird,
            slotIndex: slot.index,
        };
    }
}
