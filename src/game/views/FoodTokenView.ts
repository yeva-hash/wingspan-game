// views/FoodTokenView.ts
import * as PIXI from 'pixi.js';
import { Food } from '../models/Food';

export class FoodTokenView extends PIXI.Container {
  private bg: PIXI.Graphics;
  onClicked: (() => void) | null = null;

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
    this.eventMode = 'static';
    this.cursor = 'pointer';
    this.on('pointerdown', () => this.onClicked?.());
  }

  // вызывается контроллером когда quantity изменился
  updateQuantity(quantity: number) {
    this.quantityText.text = `${quantity}`;
  }

  setSelected(selected: boolean) {
    this.bg.alpha = selected ? 0.5 : 1;
  }
}