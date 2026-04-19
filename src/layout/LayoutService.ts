import type { Container, Sprite, Text } from "pixi.js";
import { cloneLayoutElement } from "./cloneLayoutElement";

export type LayoutElement = Container | Sprite | Text;

//TODO layout Loader
export class LayoutService {
  private readonly elements = new Map<string, LayoutElement>();
  private readonly prefabs = new Map<string, LayoutElement>();

  set(name: string, element: LayoutElement): void {
    this.elements.set(name, element);
  }

  setPrefab(name: string, element: LayoutElement): void {
    this.prefabs.set(name, element);
  }

  get<T extends LayoutElement>(name: string): T {
    if (!this.has(name)) {
      throw new Error(`Can't find layout node with name ${name}`);
    }

    return this.elements.get(name) as T;
  }

  getClonedPrefab<T extends LayoutElement>(name: string): T {
    const prefab = this.prefabs.get(name);
    if (!prefab) {
      throw new Error(`Can't find prefab with name ${name}`);
    }

    return cloneLayoutElement(prefab) as T;
  }

  has(name: string): boolean {
    return this.elements.has(name);
  }

  hasPrefab(name: string): boolean {
    return this.prefabs.has(name);
  }
}
