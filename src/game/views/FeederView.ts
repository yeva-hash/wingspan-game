import { Container, Point, Sprite, Ticker } from "pixi.js";
import { LayoutService } from "../../layout/LayoutService";
import { FoodDefinition } from "../types/resourceTypes";
import { TextureCache } from "../../loader/TextureCache";
import { setButtonInteractive } from "../../utils/viewUtils";
import { FoodTokenView } from "./food/FoodTokenView";
import { BaseInteractiveView } from "./BaseInteractiveView";
import { executeDelayedQueue } from "../../utils/general";
import gsap from "gsap";

export class FeederView extends BaseInteractiveView {
    private static readonly foodDropDelay = 120;
    private static readonly foodDropDuration = 0.45;
    private static readonly foodDropStartGlobalY = -80;

    private readonly _foodTokens: Map<number, FoodTokenView | null> = new Map();
    private readonly _container: Container;

    onFoodClicked: ((index: number) => void) | null = null;

    constructor(private _layoutService: LayoutService) {
        super(_layoutService.get("choose-food-confirm-button"));
        this._container = _layoutService.get("feeder-container");
    }

    get container(): Container {
        return this._container;
    }

    protected onPrepareForSelection(): void {
        this.setInteractive(true);
    }

    protected override onCancelSelection(): void {
        this.setInteractive(false);

        for (const foodToken of this._foodTokens.values()) {
            foodToken?.setSelected(false);
        }
    }

    async fillFoodSlots(foodDefs: Map<number, FoodDefinition>): Promise<void> {
        for (const [index, token] of this._foodTokens.entries()) {
            if (!token) continue;
            const parent = this._layoutService.get(`food-slot-${index}`);
            parent.removeChild(token);
            token.destroy({ children: true });
        }
        this._foodTokens.clear();

        const queue: Array<() => Promise<void>> = [];

        foodDefs.forEach((foodDef, index) => {
            const sprite = new Sprite(TextureCache.getTexture(foodDef.texture));
            sprite.anchor.set(0.5);

            const token = new FoodTokenView(sprite);
            this._foodTokens.set(index, token);

            const parent = this._layoutService.get(`food-slot-${index}`);
            parent.addChild(token);

            const globalSlotPosition = parent.getGlobalPosition();
            const startPosition = parent.toLocal(new Point(globalSlotPosition.x, FeederView.foodDropStartGlobalY));
            token.position.set(startPosition.x, startPosition.y);

            queue.push(() => this.dropFoodToken(token));
        });

        await executeDelayedQueue(queue, FeederView.foodDropDelay);
        this.setInteractive(false);
    }

    private async dropFoodToken(token: FoodTokenView): Promise<void> {
        await new Promise<void>((resolve) => {
            gsap.to(token, {
                x: 0,
                y: 0,
                duration: FeederView.foodDropDuration,
                ease: "bounce.out",
                onComplete: () => resolve(),
            });
        });
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
}
