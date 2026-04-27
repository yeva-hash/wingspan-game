import * as PIXI from 'pixi.js';
import { TextureCache } from '../../../loader/TextureCache';
import type { QuantifiedFood } from '../../models/QuantifiedFood';

export class QuantifiedFoodTokenView {
  readonly container: PIXI.Container;
  private readonly _foodImage: PIXI.Sprite;
  private readonly _quantityText: PIXI.Text;
  private _quantity: number;

  get quantity(): number {
    return this._quantity;
  }

  set quantity(quantity: number) {
    this._quantity = quantity;
    this._quantityText.text = `${this._quantity}`;
  }

  constructor(container: PIXI.Container, food: QuantifiedFood) {
    this.container = container;
    this._quantity = food.quantity;

    const foodImage = this.container.getChildByLabel("hand-food-image", true) as PIXI.Sprite | null;
    const quantityText = this.container.getChildByLabel("hand-food-quantity", true) as PIXI.Text | null;

    if (!foodImage || !quantityText) {
      throw new Error("QuantifiedFoodTokenView: prefab is missing required children");
    }

    this._foodImage = foodImage;
    this._quantityText = quantityText;

    this._foodImage.texture = TextureCache.getTexture(food.definition.texture);
    this.quantity = food.quantity;
  }

  setSelected(selected: boolean): void {
    this._foodImage.alpha = selected ? 0.5 : 1;
  }
}
