import * as PIXI from "pixi.js";
import { PlayedBird } from "../../models/PlayedBird";
import { BirdCardView } from "../BirdCardView";
import { alphaTo } from "../../../utils/viewUtils";
import { LayoutService } from "../../../layout/LayoutService";

export class HabitatSlotView {
    private _birdCardView?: BirdCardView;
    private _isBirdInteractive = false;
    onBirdClicked: (() => void) | null = null;

    constructor(
        private readonly _container: PIXI.Container,
        private readonly _layoutService: LayoutService
    ) {}

    setOccupied(isOccupied: boolean): void {
        this._container.alpha = isOccupied ? 0.85 : 1;
        // place bird card view 
    }

    async placeBirdCard(bird: PlayedBird): Promise<void> {
        //TODO
        if (this._birdCardView) return;

        const prefab = await this._layoutService.createPrefab<PIXI.Container>("bird");
        this._birdCardView = new BirdCardView(prefab, bird.definition);
        this._birdCardView.setEggProgress(bird.eggCount, bird.maxEggCount);
        this._container.addChild(this._birdCardView.container);
        this._birdCardView.container.alpha = 0;
        this._birdCardView.container.position.set(0, 0);

        await alphaTo(this._birdCardView.container, 0.5, 1);
    }

    setBirdInteractive(interactive: boolean): void {
        this._isBirdInteractive = interactive;

        if (!this._birdCardView) {
            return;
        }

        this._birdCardView.container.eventMode = interactive ? "static" : "none";
        this._birdCardView.container.cursor = interactive ? "pointer" : "default";
        this._birdCardView.onClicked = interactive ? () => this.onBirdClicked?.() : null;
    }

    updateEggProgress(bird: PlayedBird): void {
        this._birdCardView?.setEggProgress(bird.eggCount, bird.maxEggCount);
    }
}
