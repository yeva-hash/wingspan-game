import * as PIXI from "pixi.js";

export class HabitatSlotView {
    constructor(private readonly _container: PIXI.Container) {}

    setOccupied(isOccupied: boolean): void {
        this._container.alpha = isOccupied ? 0.85 : 1;
        // place bird card view 
    }
}
