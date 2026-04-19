// views/FoodTokenView.ts
import * as PIXI from 'pixi.js';

export class FoodTokenView extends PIXI.Container {
  onClicked: ((token: FoodTokenView) => void) | null = null;

  constructor(private _bg: PIXI.Sprite) {
    super();
    this.addChild(this._bg);
    this.on("pointerdown", () => this.onClicked?.(this));
  }

  setSelected(selected: boolean): void {
    this._bg.alpha = selected ? 0.5 : 1;
  }
}