// views/FoodTokenView.ts
import * as PIXI from 'pixi.js';
import { Food } from '../models/Food';

export class FoodTokenView extends PIXI.Container {
  private bg: PIXI.Graphics;
  private selectedCountText: PIXI.Text;

  private quantityText: PIXI.Text;

  constructor(food: Food) {
    super();

    this.bg = new PIXI.Graphics()
      .circle(0, 0, 30)
      .fill(0xe8a838);

    this.quantityText = new PIXI.Text({ 
      text: `${food.quantity}`, 
      style: { fontSize: 16, fill: 0xffffff } 
    });
    this.quantityText.anchor.set(0.5);

    this.addChild(this.bg, this.quantityText);

    this.selectedCountText = new PIXI.Text({ 
      text: "", 
      style: { fontSize: 16, fill: 0xffffff } 
    });
    this.selectedCountText.anchor.set(0.5);
    this.selectedCountText.position.set(0, 0);
    this.addChild(this.selectedCountText);
  }

  setHighlighted(highlighted: boolean): void {
    this.alpha = highlighted ? 1 : 0.5;
  }
}