import { Area } from "../../types/resourceTypes";
import { PlayedBird } from "../../models/PlayedBird";
import { EHabitatResourceType } from "./HabitatStore";
import { HabitatSlotStore } from "./HabitatSlotStore";

export class HabitatAreaStore {
    private readonly _slots: Map<number, HabitatSlotStore>;

    constructor(
        private readonly _area: Area,
        private readonly _resourceType: EHabitatResourceType,
    ) {
        //TODO
        this._slots = new Map([
            [1, new HabitatSlotStore(1, 1)],
            [2, new HabitatSlotStore(2, 1)],
            [3, new HabitatSlotStore(3, 2)],
        ]);
    }

    get area(): Area {
        return this._area;
    }

    get resourceType(): EHabitatResourceType {
        return this._resourceType;
    }

    getSlots(): HabitatSlotStore[] {
        return Array.from(this._slots.values()).sort((a, b) => a.index - b.index);
    }

    getSlot(index: number): HabitatSlotStore {
        const slot = this._slots.get(index);
        if (!slot) {
            throw new Error(`Slot ${index} not found in ${this._area}`);
        }

        return slot;
    }

    setBirdInSlot(index: number, bird: PlayedBird): void {
        this.getSlot(index).setBird(bird);
    }
}
