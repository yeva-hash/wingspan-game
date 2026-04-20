import * as PIXI from "pixi.js";
import { BirdDefinition } from "../types/resourceTypes";
import { TextureCache } from "../../loader/TextureCache";

export class BirdCardView {
  readonly container: PIXI.Container;
  onClicked: ((birdView: BirdCardView) => void) | null = null;

  constructor(container: PIXI.Container, bird: BirdDefinition) {
    this.container = container;

    const bg = this.container.getChildByLabel("bird-front-side", true) as PIXI.Sprite | null;
    const birdImage = this.container.getChildByLabel("bird-image", true) as PIXI.Sprite | null;
    const nameText = this.container.getChildByLabel("bird-name", true) as PIXI.Text | null;

    if (!bg || !birdImage || !nameText) {
      throw new Error("BirdCardView: prefab is missing required children");
    }

    birdImage.texture = TextureCache.getTexture(bird.texture);
    nameText.text = bird.name;

    this.container.eventMode = "static";
    this.container.cursor = "pointer";
    this.container.on("pointerdown", () => this.onClicked?.(this));
  }

  setSelected(selected: boolean): void {
    const bg = this.container.getChildByLabel("bird-front-side", true) as PIXI.Sprite | null;
    if (!bg) {
      throw new Error("BirdCardView: prefab is missing bird-front-side");
    }

    bg.alpha = selected ? 0.5 : 1;
  }
}
