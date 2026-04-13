// views/FoodTokenView.ts
import * as PIXI from 'pixi.js';
import { Food } from '../../models/Food';

export class FoodTokenView extends PIXI.Container {
  private bg: PIXI.Graphics;

  private _nameText: PIXI.Text;

  constructor(food: Food) {
    super();

    this.bg = new PIXI.Graphics()
      .circle(0, 0, 30)
      .fill(0xe8a838);

      this.addChild(this.bg)

    this._nameText = new PIXI.Text({ 
      text: `${food.definition.id}`, 
      style: { fontSize: 16, fill: 0x000000 } 
    });
    this._nameText.anchor.set(0.5);

    this.addChild(this._nameText);
  }

  setHighlighted(highlighted: boolean): void {
    this.alpha = highlighted ? 1 : 0.5;
  }
}