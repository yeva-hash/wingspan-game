import * as PIXI from "pixi.js";
import { BirdDefinition } from "../types/resourceTypes";

export class BirdCardView extends PIXI.Container {
  private bg: PIXI.Graphics;
  onClicked: ((birdView: BirdCardView) => void) | null = null;

  constructor(bird: BirdDefinition) {
    super();

    this.bg = new PIXI.Graphics()
      .roundRect(0, 0, 120, 180, 8)
      .fill(0x4a7c59);

    const name = new PIXI.Text({
      text: bird.name,
      style: { fontSize: 14, fill: 0xffffff },
    });

    name.position.set(8, 8);

    this.addChild(this.bg, name);
    this.eventMode = "static";
    this.cursor = "pointer";
    this.on("pointerdown", () => this.onClicked?.(this));
  }

  setSelected(selected: boolean): void {
    this.bg.alpha = selected ? 0.5 : 1;
  }
}