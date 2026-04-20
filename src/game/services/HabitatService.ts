import { HabitatStore } from "../stores/habitat/HabitatStore";
import { HabitatAreaStore } from "../stores/habitat/HabitatAreaStore";
import { HabitatSlotStore } from "../stores/habitat/HabitatSlotStore";
import { BirdId } from "../../catalogs/BirdCatalog";
import { BirdCatalog } from "../../catalogs/BirdCatalog";
import { PlayedBird } from "../models/PlayedBird";
import { Area } from "../types/resourceTypes";

export type BirdPlacementResult = {
    area: Area;
    bird: PlayedBird;
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

    placeBirdInArea(area: Area, birdId: BirdId): BirdPlacementResult {
        const slot = this.getFirstFreeSlot(area);
        if (!slot) {
            //TODO visual feedback
            throw new Error(`No free slots in ${area}`);
        }

        const birdDefinition = this._birdCatalog.getById(birdId);
        const bird = new PlayedBird(birdDefinition);
        this.getArea(area).setBirdInSlot(slot.index, bird);

        return {
            area,
            bird,
            slotIndex: slot.index,
        };
    }
}
