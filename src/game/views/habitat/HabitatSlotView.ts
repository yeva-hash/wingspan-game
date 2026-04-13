import * as PIXI from "pixi.js";
import { BirdDefinition } from "../../types/resourceTypes";
import { BirdCardView } from "../BirdCardView";
import { alphaTo } from "../../../utils/viewUtils";

export class HabitatSlotView {
    private _birdCardView?: PIXI.Container;
    constructor(private readonly _container: PIXI.Container) {}

    setOccupied(isOccupied: boolean): void {
        this._container.alpha = isOccupied ? 0.85 : 1;
        // place bird card view 
    }

    async placeBirdCard(def: BirdDefinition): Promise<void> {
        //TODO
        if (this._birdCardView) return;

        this._birdCardView = new BirdCardView(def);
        this._container.addChild(this._birdCardView);
        this._birdCardView.alpha = 0;
        this._birdCardView.position.set(-57, -96);

        await alphaTo(this._birdCardView, 0.5, 1);
    }
}
