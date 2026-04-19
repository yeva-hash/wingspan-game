import { Container, Sprite, Text, TextStyle, Texture } from "pixi.js";
import type { LayoutService } from "./LayoutService";
import { TextureCache } from "../loader/TextureCache";
import { TextStyleCache } from "./TextStyleCache";
export * as PIXI from "pixi.js";

type PointLike = {
  x?: number;
  y?: number;
};

export type LayoutNode = {
  name?: string;
  type: "container" | "sprite" | "text";
  x?: number;
  y?: number;
  rotation?: number;
  alpha?: number;
  scale?: PointLike;
  anchor?: PointLike;
  texture?: string;
  text?: string;
  fontSize?: number;
  color?: string;
  styleName?: string;
  children?: LayoutNode[];
};

export type LayoutConfig = {
  stage: LayoutNode;
  prefabs?: LayoutNode[];
};

export class LayoutBuilder {
  constructor(private readonly layoutService: LayoutService) {}

  async build(config: LayoutConfig, parent: Container): Promise<Container> {
    if (config.prefabs?.length) {
      for (const prefabNode of config.prefabs) {
        if (!prefabNode.name) {
          throw new Error("Prefab node must have a name");
        }

        const prefab = await this.buildNode(prefabNode, false);
        this.layoutService.setPrefab(prefabNode.name, prefab);
      }
    }

    const stageNode = await this.buildNode(config.stage, true);
    if (!(stageNode instanceof Container)) {
      throw new Error("Root stage node must be a container");
    }

    parent.addChild(stageNode);
    return stageNode;
  }

  private async buildNode(node: LayoutNode, registerInLayout: boolean): Promise<Container | Sprite | Text> {
    let displayObject: Container | Sprite | Text;

    switch (node.type) {
      case "container":
        displayObject = new Container();
        break;
      case "sprite": {
        const texture = node.texture
        ? TextureCache.getTexture(node.texture)
        : Texture.WHITE;
        displayObject = new Sprite(texture);
        break;
      }
      case "text":
        displayObject = new Text({
          text: node.text ?? "",
          style: this.getTextStyle(node),
        });
        break;
      default:
        throw new Error(`Unsupported layout node type: ${(node as { type: string }).type}`);
    }

    this.applyTransform(displayObject, node);

    if (registerInLayout && node.name) {
      displayObject.label = node.name;
      this.layoutService.set(node.name, displayObject);
    } else if (node.name) {
      displayObject.label = node.name;
    }

    if (node.children?.length) {
      if (!(displayObject instanceof Container)) {
        throw new Error(`Node "${node.name ?? node.type}" cannot have children`);
      }

      for (const child of node.children) {
        const childObject = await this.buildNode(child, registerInLayout);
        displayObject.addChild(childObject);
      }
    }

    return displayObject;
  }

  private getTextStyle(node: LayoutNode): TextStyle {
    if (node.styleName) {
      return TextStyleCache.getTextStyle(node.styleName);
    }

    return new TextStyle({
      fontSize: node.fontSize ?? 24,
      fill: node.color ?? "#ffffff",
    });
  }

  private applyTransform(displayObject: Container | Sprite | Text, node: LayoutNode): void {
    if (node.x !== undefined) {
      displayObject.x = node.x;
    }
    if (node.y !== undefined) {
      displayObject.y = node.y;
    }
    if (node.rotation !== undefined) {
      displayObject.rotation = node.rotation;
    }
    if (node.alpha !== undefined) {
      displayObject.alpha = node.alpha;
    }
    if (node.scale) {
      displayObject.scale.set(node.scale.x ?? 1, node.scale.y ?? 1);
    }
    if (node.anchor && "anchor" in displayObject) {
      displayObject.anchor.set(node.anchor.x ?? 0, node.anchor.y ?? 0);
    }
  }
}
