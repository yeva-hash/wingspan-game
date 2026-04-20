import * as PIXI from "pixi.js";
import { BirdDefinition } from "../../types/resourceTypes";
import { BirdCardView } from "../BirdCardView";
import { alphaTo } from "../../../utils/viewUtils";
import { LayoutService } from "../../../layout/LayoutService";

export class HabitatSlotView {
    private _birdCardView?: BirdCardView;

    constructor(
        private readonly _container: PIXI.Container,
        private readonly _layoutService: LayoutService
    ) {}

    setOccupied(isOccupied: boolean): void {
        this._container.alpha = isOccupied ? 0.85 : 1;
        // place bird card view 
    }

    async placeBirdCard(def: BirdDefinition): Promise<void> {
        //TODO
        if (this._birdCardView) return;

        const prefab = await this._layoutService.createPrefab<PIXI.Container>("bird");
        this._birdCardView = new BirdCardView(prefab, def);
        this._container.addChild(this._birdCardView.container);
        this._birdCardView.container.alpha = 0;
        this._birdCardView.container.position.set(-57, -96);

        await alphaTo(this._birdCardView.container, 0.5, 1);
    }
}
