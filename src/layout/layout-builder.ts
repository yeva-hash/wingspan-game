import { Assets, Container, Sprite, Text, Texture } from "pixi.js";
import type { LayoutService } from "./layout-service";

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
  children?: LayoutNode[];
};

export type LayoutConfig = {
  stage: LayoutNode;
};

export class LayoutBuilder {
  constructor(private readonly layoutService: LayoutService) {}

  async build(config: LayoutConfig, parent: Container): Promise<Container> {
    const stageNode = await this.buildNode(config.stage);
    if (!(stageNode instanceof Container)) {
      throw new Error("Root stage node must be a container");
    }

    parent.addChild(stageNode);
    return stageNode;
  }

  private async buildNode(node: LayoutNode): Promise<Container | Sprite | Text> {
    let displayObject: Container | Sprite | Text;

    switch (node.type) {
      case "container":
        displayObject = new Container();
        break;
      case "sprite": {
        const texture = node.texture ? await Assets.load(node.texture) : Texture.WHITE;
        displayObject = new Sprite(texture);
        break;
      }
      case "text":
        displayObject = new Text({
          text: node.text ?? "",
          style: {
            fontSize: node.fontSize ?? 24,
            fill: node.color ?? "#ffffff",
          },
        });
        break;
      default:
        throw new Error(`Unsupported layout node type: ${(node as { type: string }).type}`);
    }

    this.applyTransform(displayObject, node);

    if (node.name) {
      displayObject.label = node.name;
      this.layoutService.set(node.name, displayObject);
    }

    if (node.children?.length) {
      if (!(displayObject instanceof Container)) {
        throw new Error(`Node "${node.name ?? node.type}" cannot have children`);
      }

      for (const child of node.children) {
        const childObject = await this.buildNode(child);
        displayObject.addChild(childObject);
      }
    }

    return displayObject;
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
