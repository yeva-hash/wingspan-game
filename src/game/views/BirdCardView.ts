import * as PIXI from "pixi.js";
import { Area, BirdDefinition, FoodType } from "../types/resourceTypes";
import { TextureCache } from "../../loader/TextureCache";

export class BirdCardView {
  private static readonly foodIconYOffset = 30;
  private static readonly areaIconYOffset = 45;
  private static readonly iconScale = 0.5;

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
    const foodsContainer = this.container.getChildByLabel("bird-foods-container", true) as PIXI.Container | null;
    const areasContainer = this.container.getChildByLabel("bird-areas-container", true) as PIXI.Container | null;

    if (!bg || !birdImage || !nameText || !eggText || !foodsContainer || !areasContainer) {
      throw new Error("BirdCardView: prefab is missing required children");
    }

    birdImage.texture = TextureCache.getTexture(bird.texture);
    nameText.text = bird.name;
    eggText.text = `${bird.maxEggCount}`;
    this._eggText = eggText;
    this.renderFoodIcons(foodsContainer, bird.requiredFoods);
    this.renderAreaIcons(areasContainer, bird.allowedAreas);

    this.container.eventMode = "static";
    this.container.cursor = "pointer";
    this.container.on("pointerdown", () => this.onClicked?.(this));
  }

  setSelected(selected: boolean): void {
    // const bg = this.container.getChildByLabel("bird-front-side", true) as PIXI.Sprite | null;
    // if (!bg) {
    //   throw new Error("BirdCardView: prefab is missing bird-front-side");
    // }

    this.container.alpha = selected ? 0.5 : 1;
  }

  setEggProgress(eggCount: number, maxEggCount: number = this._maxEggCount): void {
    this._eggText.text = `${eggCount}/${maxEggCount}`;
  }

  private renderFoodIcons(container: PIXI.Container, requiredFoods: readonly FoodType[]): void {
    this.renderIcons(container, requiredFoods, BirdCardView.foodIconYOffset);
  }

  private renderAreaIcons(container: PIXI.Container, allowedAreas: readonly Area[]): void {
    const textureAliases = allowedAreas.map((area) => `${area}-icon`);
    this.renderIcons(container, textureAliases, BirdCardView.areaIconYOffset);
  }

  private renderIcons(
    container: PIXI.Container,
    textureAliases: readonly string[],
    yOffset: number,
  ): void {
    container.removeChildren();

    textureAliases.forEach((textureAlias, index) => {
      const icon = new PIXI.Sprite(TextureCache.getTexture(textureAlias));
      icon.anchor.set(0.5);
      icon.y = index * yOffset;
      icon.scale.set(BirdCardView.iconScale);
      container.addChild(icon);
    });
  }
}
