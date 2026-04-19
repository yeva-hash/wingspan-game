import * as PIXI from "pixi.js";
import { BirdDefinition } from "../types/resourceTypes";
import { TextureCache } from "../../loader/TextureCache";

export class BirdCardView extends PIXI.Container {
  private bg: PIXI.Sprite;
  onClicked: ((birdView: BirdCardView) => void) | null = null;

  constructor(bird: BirdDefinition) {
    super();

    this.bg = new PIXI.Sprite(TextureCache.getTexture("bird-front-side"));
    this.bg.anchor.set(0.5);

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