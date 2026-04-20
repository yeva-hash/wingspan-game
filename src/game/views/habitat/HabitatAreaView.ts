import { LayoutService } from "../../../layout/LayoutService";
import { Area, BirdDefinition } from "../../types/resourceTypes";
import { HabitatSlotView } from "./HabitatSlotView";

export class HabitatAreaView {
    private readonly _slots: Map<number, HabitatSlotView>;

    constructor(
        private readonly _area: Area,
        private readonly _layoutService: LayoutService,
    ) {
        this._slots = new Map([
            [1, new HabitatSlotView(this._layoutService.get(`${this._area}-slot-1-container`), this._layoutService)],
            [2, new HabitatSlotView(this._layoutService.get(`${this._area}-slot-2-container`), this._layoutService)],
            [3, new HabitatSlotView(this._layoutService.get(`${this._area}-slot-3-container`), this._layoutService)],
        ]);
    }

    getSlotView(index: number): HabitatSlotView {
        const slot = this._slots.get(index);
        if (!slot) {
            throw new Error(`Slot view ${index} not found for ${this._area}`);
        }

        return slot;
    }

    placeBirdCard(slotIndex: number, def: BirdDefinition): void {
        this.getSlotView(slotIndex).placeBirdCard(def);
    }
}
