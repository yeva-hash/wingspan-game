import { LayoutService } from "../../layout/LayoutService";
import { alphaTo, setButtonInteractive } from "../../utils/viewUtils";
import { BirdSupplyService } from "../services/BirdSupplyService";
import { BirdDefinition } from "../types/resourceTypes";
import { BirdCardView } from "./BirdCardView";
import * as PIXI from "pixi.js";

export class BirdOfferView {
    private readonly _cardContainer: PIXI.Container;
    private readonly _randomBirdText: PIXI.Text;
    private readonly _confirmButton: PIXI.Text;
    private _offeredBirds: Map<string, BirdCardView> = new Map();

    onBirdClicked: ((birdId: string) => void) | null = null;
    onConfirmClicked: (() => void) | null = null;

    constructor(private readonly _layoutService: LayoutService) {
        this._cardContainer = this._layoutService.get("bird-offer-card-container");
        this._randomBirdText = this._layoutService.get("random-bird-text");
        this._confirmButton = this._layoutService.get("choose-bird-confirm-button");

        this._randomBirdText.on("pointerdown", () => this.onBirdClicked?.("random"));
        this._confirmButton.on("pointerdown", () => this.onConfirmClicked?.());
    }

    //TODO no need to rerender all birds
    async render(birds: readonly BirdDefinition[]): Promise<void> {
        this._cardContainer.removeChildren();
        this._offeredBirds.clear();
        for (let i = 0; i < BirdSupplyService.initialOfferedBirdCount; i++) {
            const bird = birds[i];
            const view = new BirdCardView(bird); 
            view.position.set(0, i * 200);
            this._offeredBirds.set(bird.name, view);
            this._cardContainer.addChild(view);
        }

        this.setInteractive(false);
    }

    async prepareForSelection(): Promise<void> {
        //TODO hightlight section
        await this.toggleShow(true);
        this.setConfirmEnabled(false);
        this.setInteractive(true);
    }

    setInteractive(interactive: boolean): void {
        for (const [name, bird] of this._offeredBirds.entries()) {
            setButtonInteractive(bird, interactive);
            if (interactive) {
                bird.onClicked = () => this.onBirdClicked?.(name);
            }
        }
        setButtonInteractive(this._randomBirdText, interactive);
    }

    setSelected(name: string, selected: boolean): void {
        this._offeredBirds.get(name)?.setSelected(selected);
    }

    setRandomSelected(selected: boolean): void {
        this._randomBirdText.alpha = selected ? 0.5 : 1;
    }

    setConfirmEnabled(enabled: boolean): void {
        setButtonInteractive(this._confirmButton, enabled);
        this._confirmButton.alpha = enabled ? 1 : 0.5;
    }

    private async toggleShow(show: boolean): Promise<void> {
        const to = show ? 1 : 0;

        await Promise.all([
            alphaTo(this._confirmButton, 0.5, to),
            alphaTo(this._randomBirdText, 0.5, to),
        ]);
    }
}