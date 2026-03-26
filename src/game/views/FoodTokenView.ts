// views/FoodTokenView.ts
import * as PIXI from 'pixi.js';
import { Food } from '../models/Food';

export class FoodTokenView extends PIXI.Container {
  private bg: PIXI.Graphics;
  onClicked: (() => void) | null = null;
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
    this.eventMode = 'static';
    this.cursor = 'pointer';
    this.on('pointerdown', () => this.onClicked?.());

    this.selectedCountText = new PIXI.Text({ 
      text: "", 
      style: { fontSize: 16, fill: 0xffffff } 
    });
    this.selectedCountText.anchor.set(0.5);
    this.selectedCountText.position.set(0, 0);
    this.addChild(this.selectedCountText);
  }

  updateQuantity(quantity: number) {
    this.quantityText.text = `${quantity}`;
  }

  setEnabled(enabled: boolean): void {
    this.eventMode = enabled ? "static" : "none";
    this.cursor = enabled ? "pointer" : "default";
    this.alpha = enabled ? 1 : 0.3;
  }

  setSelectedCount(count: number): void {
    this.selectedCountText.text = count > 0 ? `x${count}` : "";
    this.bg.alpha = count > 0 ? 0.5 : 1;
  }

  setSelected(selected: boolean): void {
    this.bg.alpha = selected ? 0.5 : 1;
  }
}