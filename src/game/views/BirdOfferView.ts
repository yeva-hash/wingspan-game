import { LayoutService } from "../../layout/LayoutService";
import { setButtonInteractive } from "../../utils/viewUtils";
import { BirdSupplyService } from "../services/BirdSupplyService";
import { BirdDefinition } from "../types/resourceTypes";
import { BirdCardView } from "./BirdCardView";
import { BaseInteractiveView } from "./BaseInteractiveView";
import * as PIXI from "pixi.js";

export class BirdOfferView extends BaseInteractiveView {
    private readonly _cardContainer: PIXI.Container;
    private readonly _randomBirdText: PIXI.Text;
    private _offeredBirds: Map<string, BirdCardView> = new Map();

    onBirdClicked: ((birdId: string) => void) | null = null;

    constructor(private readonly _layoutService: LayoutService) {
        super(_layoutService.get("choose-bird-confirm-button"));
        this._cardContainer = this._layoutService.get("bird-offer-card-container");
        this._randomBirdText = this._layoutService.get("random-bird-text");

        this._randomBirdText.on("pointerdown", () => this.onBirdClicked?.("random"));
    }

    //TODO no need to rerender all birds
    async render(birds: readonly BirdDefinition[]): Promise<void> {
        this._cardContainer.removeChildren();
        this._offeredBirds.clear();
        for (let i = 0; i < BirdSupplyService.initialOfferedBirdCount; i++) {
            const bird = birds[i];
            const prefab = await this._layoutService.createPrefab<PIXI.Container>("bird");
            const view = new BirdCardView(prefab, bird); 
            view.container.position.set(0, i * 200);
            this._offeredBirds.set(bird.id, view);
            this._cardContainer.addChild(view.container);
        }

        this.setInteractive(false);
    }

    protected onPrepareForSelection(): void {
        //TODO hightlight section
        this.setInteractive(true);
    }

    private setInteractive(interactive: boolean): void {
        for (const [birdId, bird] of this._offeredBirds.entries()) {
            setButtonInteractive(bird.container, interactive);
            if (interactive) {
                bird.onClicked = () => this.onBirdClicked?.(birdId);
            }
        }
        setButtonInteractive(this._randomBirdText, interactive);
    }

    setSelected(birdId: string, selected: boolean): void {
        this._offeredBirds.get(birdId)?.setSelected(selected);
    }

    setRandomSelected(selected: boolean): void {
        this._randomBirdText.alpha = selected ? 0.5 : 1;
    }

    protected override getShowTargets(): PIXI.Container[] {
        return [this._confirmButton, this._randomBirdText];
    }
}
