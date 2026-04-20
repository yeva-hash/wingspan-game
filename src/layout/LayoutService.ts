import type { Container, Sprite, Text } from "pixi.js";
import type { LayoutNode } from "./LayoutBuilder";

export type LayoutElement = Container | Sprite | Text;
type PrefabBuilder = <T extends LayoutElement>(name: string) => Promise<T>;

//TODO layout Loader
export class LayoutService {
  private readonly elements = new Map<string, LayoutElement>();
  private readonly prefabNodes = new Map<string, LayoutNode>();
  private _prefabBuilder: PrefabBuilder | null = null;

  set(name: string, element: LayoutElement): void {
    this.elements.set(name, element);
  }

  setPrefabNode(name: string, node: LayoutNode): void {
    this.prefabNodes.set(name, node);
  }

  get<T extends LayoutElement>(name: string): T {
    if (!this.elements.has(name)) {
      throw new Error(`Can't find layout node with name ${name}`);
    }

    return this.elements.get(name) as T;
  }

  getPrefabNode(name: string): LayoutNode {
    const node = this.prefabNodes.get(name);
    if (!node) {
      throw new Error(`Can't find prefab node with name ${name}`);
    }

    return node;
  }

  setPrefabBuilder(builder: PrefabBuilder): void {
    this._prefabBuilder = builder;
  }

  async createPrefab<T extends LayoutElement>(name: string): Promise<T> {
    if (!this._prefabBuilder) {
      throw new Error("Prefab builder is not configured");
    }

    return await this._prefabBuilder<T>(name);
  }
}
