import { Container, Sprite, Texture } from "pixi.js";
import { LayoutService } from "../../layout/LayoutService";
import { FoodDefinition, FoodType } from "../types/resourceTypes";
import { TextureCache } from "../../loader/TextureCache";

export class FeederView {
    private readonly _container: Container;
    private readonly _foodSlots: Map<number, Container> = new Map();
    constructor(layoutService: LayoutService) {
        this._container = layoutService.get("feeder-food-container");
        //TODO
        for (let i = 1; i <= 5; i++) {
            this._foodSlots.set(i, layoutService.get(`food-slot-${i}`));
        }
    }

    fillFoodSlots(foodDefs: FoodDefinition[]): void {
        this._foodSlots.forEach((foodSlot, index) => {
            const foodDef = foodDefs[index - 1];
            const sprite = new Sprite(TextureCache.getTexture(foodDef.texture));
            sprite.anchor.set(0.5);
            foodSlot.addChild(sprite);
        });
    }
}