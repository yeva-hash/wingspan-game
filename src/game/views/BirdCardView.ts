import * as PIXI from "pixi.js";
import { BirdDefinition } from "../types/resourceTypes";
import { TextureCache } from "../../loader/TextureCache";

export class BirdCardView {
  readonly container: PIXI.Container;
  onClicked: ((birdView: BirdCardView) => void) | null = null;
  private readonly _eggText: PIXI.Text;
  private readonly _maxEggCount: number;

  constructor(container: PIXI.Container, bird: BirdDefinition) {
    this.container = container;
    this._maxEggCount = bird.maxEggCount;

    const bg = this.container.getChildByLabel("bird-front-side", true) as PIXI.Sprite | null;
    const birdImage = this.container.getChildByLabel("bird-image", true) as PIXI.Sprite | null;
    const nameText = this.container.getChildByLabel("bird-name", true) as PIXI.Text | null;
    const eggText = this.container.getChildByLabel("egg-text", true) as PIXI.Text | null;

    if (!bg || !birdImage || !nameText || !eggText) {
      throw new Error("BirdCardView: prefab is missing required children");
    }

    birdImage.texture = TextureCache.getTexture(bird.texture);
    nameText.text = bird.name;
    eggText.text = `${bird.maxEggCount}`;
    this._eggText = eggText;

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

  setEggProgress(eggCount: number, maxEggCount: number = this._maxEggCount): void {
    this._eggText.text = `${eggCount}/${maxEggCount}`;
  }
}
