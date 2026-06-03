import * as PIXI from "pixi.js";
import { PlayedBird } from "../../models/PlayedBird";
import { BirdCardView } from "../BirdCardView";
import { LayoutService } from "../../../layout/LayoutService";
import gsap from "gsap";

export class HabitatSlotView {
    private static readonly birdCardPosition = new PIXI.Point(2, 6);
    private static readonly birdCardDropOffsetY = -80;
    private static readonly birdCardStartScale = 1.5;

    private _birdCardView?: BirdCardView;
    private _isBirdInteractive = false;
    onBirdClicked: (() => void) | null = null;

    constructor(
        private readonly _container: PIXI.Container,
        private readonly _layoutService: LayoutService
    ) {}

    async placeBirdCard(bird: PlayedBird): Promise<void> {
        //TODO
        if (this._birdCardView) return;

        const prefab = await this._layoutService.createPrefab<PIXI.Container>("bird");
        this._birdCardView = new BirdCardView(prefab, bird.definition);
        this._birdCardView.setEggProgress(bird.eggCount, bird.maxEggCount);
        this._container.addChild(this._birdCardView.container);
        this._birdCardView.container.position.copyFrom(HabitatSlotView.birdCardPosition);

        await this.dropInBirdCard(this._birdCardView.container);
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

    getBirdCardContainer(): PIXI.Container | null {
        return this._birdCardView?.container ?? null;
    }

    updateEggProgress(bird: PlayedBird): void {
        this._birdCardView?.setEggProgress(bird.eggCount, bird.maxEggCount);
    }

    private async dropInBirdCard(container: PIXI.Container): Promise<void> {
        gsap.killTweensOf(container);
        gsap.killTweensOf(container.scale);

        await Promise.all([
            new Promise<void>((resolve) => {
                gsap.fromTo(
                    container,
                    {
                        alpha: 0,
                        y: HabitatSlotView.birdCardPosition.y + HabitatSlotView.birdCardDropOffsetY,
                    },
                    {
                        alpha: 1,
                        y: HabitatSlotView.birdCardPosition.y,
                        duration: 0.45,
                        ease: "power2.out",
                        onComplete: () => resolve(),
                    },
                );
            }),
            new Promise<void>((resolve) => {
                gsap.fromTo(
                    container.scale,
                    {
                        x: HabitatSlotView.birdCardStartScale,
                        y: HabitatSlotView.birdCardStartScale,
                    },
                    {
                        x: 1,
                        y: 1,
                        duration: 0.45,
                        ease: "back.out(1.4)",
                        onComplete: () => resolve(),
                    },
                );
            }),
        ]);
    }
}
