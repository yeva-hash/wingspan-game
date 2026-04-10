import { Area } from "../../types/resourceTypes";
import { HabitatSlotStore } from "./HabitatSlotStore";

export enum EHabitatResourceType {
    Food = "food",
    Eggs = "eggs",
    Birds = "birds",
}

export class HabitatStore {
    private _slots: Map<number, HabitatSlotStore> = new Map();

    public area(): Area {
        return this._area;
    }

    constructor(private readonly _area: Area, private readonly resourceType: EHabitatResourceType) {}

    setSlot(index: number, slot: HabitatSlotStore): void {
        this._slots.set(index, slot);
    }
}

