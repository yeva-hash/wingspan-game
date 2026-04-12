import { Area } from "../../types/resourceTypes";
import { HabitatAreaStore } from "./HabitatAreaStore";

export enum EHabitatResourceType {
    forest = "food",
    steppe = "eggs",
    swamp = "birds",
}

export class HabitatStore {
    private readonly _areas: Map<Area, HabitatAreaStore>;

    constructor() {
        //TODO
        this._areas = new Map([
            ["forest", new HabitatAreaStore("forest", EHabitatResourceType.forest)],
            ["steppe", new HabitatAreaStore("steppe", EHabitatResourceType.steppe)],
            ["swamp", new HabitatAreaStore("swamp", EHabitatResourceType.swamp)],
        ]);
    }

    getArea(area: Area): HabitatAreaStore {
        const habitatArea = this._areas.get(area);
        if (!habitatArea) {
            throw new Error(`Habitat area ${area} not found`);
        }

        return habitatArea;
    }

    getAreas(): HabitatAreaStore[] {
        return Array.from(this._areas.values());
    }
}

