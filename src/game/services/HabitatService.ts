import { HabitatSlotStore } from "../stores/habitat/HabitatSlotStore";
import { HabitatStore } from "../stores/habitat/HabitatStore";
import { Area } from "../types/resourceTypes";

export class HabitatService {
    constructor(private readonly _habitatStores: Map<Area, HabitatStore>) {}

    initSlotsForAllAreas(slotsCount: number, Class: typeof HabitatSlotStore): void {
        this._habitatStores.forEach((store) => {
            for (let i = 1; i <= slotsCount; i++) {
                let count = i;
                if (i === 2) {
                    count = 1;
                }
                store.setSlot(i, new Class(i));
            }
    });
    //     const store = this._habitatStores.get(area);
    //     if(!store) {
    //         throw new Error(`Habitat store for area ${area} not found`);
    //     }

    //     for (let i = 1; i <= slotsCount; i++) {
    //         let count = i;
    //         if (i === 2) {
    //             count = 1;
    //         }
    //         store.setSlot(i, new Class(i));
    //     }
    }
}