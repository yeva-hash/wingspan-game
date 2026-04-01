import { Area } from "../game/resourceTypes";

export class GameStore {
    private _areas: Area[] = [];

    getAreas(): readonly Area[] {
        return this._areas;
    }
    
    addArea(area: Area): void {
        this._areas.push(area);
    }
}