import { Container, Sprite, Text, Texture } from "pixi.js";
import { LayoutService } from "../../layout/LayoutService";
import { FoodDefinition, FoodType } from "../types/resourceTypes";
import { TextureCache } from "../../loader/TextureCache";
import { alphaTo, setButtonInteractive } from "../../utils/viewUtils";
import { FoodTokenView } from "./food/FoodTokenView";

export class FeederView {
    private readonly _foodTokens: Map<number, FoodTokenView | null> = new Map();
    private readonly _confirmButton: Text;

    onFoodClicked: ((index: number) => void) | null = null;
    onConfirmClicked: (() => void) | null = null;

    constructor(private _layoutService: LayoutService) {
        this._confirmButton = this._layoutService.get("choose-food-confirm-button");
        this._confirmButton.on("pointerdown", () => this.onConfirmClicked?.());
    }

    async prepareForSelection(): Promise<void> {
        //TODO hightlight section
        await this.toggleShow(true);
        this.setConfirmEnabled(false);
        this.setInteractive(true);
    }

    fillFoodSlots(foodDefs: Map<number, FoodDefinition>): void {
        for (const [index, token] of this._foodTokens.entries()) {
            if (!token) continue;
            const parent = this._layoutService.get(`food-slot-${index}`);
            parent.removeChild(token);
            token.destroy({ children: true });
        }
        this._foodTokens.clear();

        foodDefs.forEach((foodDef, index) => {
            const sprite = new Sprite(TextureCache.getTexture(foodDef.texture));
            sprite.anchor.set(0.5);

            const token = new FoodTokenView(sprite);
            this._foodTokens.set(index, token);

            const parent = this._layoutService.get(`food-slot-${index}`);
            parent.addChild(token);
        });

        this.setInteractive(false);
    }

    syncFoodSlots(foodDefs: Map<number, FoodDefinition | null>): void {
        for (const [index, foodDef] of foodDefs.entries()) {
            const token = this._foodTokens.get(index) ?? null;

            if (foodDef === null) {
                if (token) {
                    const parent = this._layoutService.get(`food-slot-${index}`);
                    parent.removeChild(token);
                    token.destroy({ children: true });
                }
                this._foodTokens.set(index, null);
                continue;
            }

            if (token) {
                token.visible = true;
                token.setSelected(false);
                continue;
            }

            const sprite = new Sprite(TextureCache.getTexture(foodDef.texture));
            sprite.anchor.set(0.5);
            const newToken = new FoodTokenView(sprite);
            const parent = this._layoutService.get(`food-slot-${index}`);
            parent.addChild(newToken);
            this._foodTokens.set(index, newToken);
        }
    }

    private setInteractive(interactive: boolean): void {
        for (const [index, foodToken] of this._foodTokens.entries()) {
            if (foodToken === null) continue;
            
            if (interactive) {
                foodToken.onClicked = () => this.onFoodClicked?.(index);
            }

            setButtonInteractive(foodToken, interactive);
        }
    }

    setSelected(index: number, selected: boolean): void {
        this._foodTokens.get(index)?.setSelected(selected);
    }

    //TODO the same code 
    setConfirmEnabled(enabled: boolean): void {
        setButtonInteractive(this._confirmButton, enabled);
        this._confirmButton.alpha = enabled ? 1 : 0.5;
    }

    private async toggleShow(show: boolean): Promise<void> {
        const to = show ? 1 : 0;

        await Promise.all([
            alphaTo(this._confirmButton, 0.5, to),
        ]);
    }
}