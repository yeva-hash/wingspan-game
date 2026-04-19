// views/FoodTokenView.ts
import * as PIXI from 'pixi.js';
import { Food } from '../../models/Food';
import { FoodTokenView } from './FoodTokenView';

export class QuantifiedFoodTokenView extends FoodTokenView {
  private quantityText: PIXI.Text;

  get quantity(): number {
    return this._quantity;
  }

  set quantity(quantity: number) {
    this._quantity = quantity;
    this.quantityText.text = `${this._quantity}`;
  }

  constructor(bg: PIXI.Sprite, private _quantity: number) {
    super(bg);

    this.quantityText = new PIXI.Text({ 
      text: `${""}`, 
      style: { fontSize: 16, fill: 0xffffff } 
    });
    this.quantityText.anchor.set(0.5);

    this.addChild(this.quantityText);
  }
}