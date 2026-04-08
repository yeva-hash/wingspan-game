import { Bird } from "../game/models/Bird";
import { Area } from "../types/resourceTypes";

export class GameStore {
    constructor(private readonly _areas: Area[] = []) {}

    getAreas(): readonly Area[] {
        return this._areas;
    }
}