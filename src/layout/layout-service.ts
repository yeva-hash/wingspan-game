import type { Container, Sprite, Text } from "pixi.js";

export type LayoutElement = Container | Sprite | Text;

export class LayoutService {
  private readonly elements = new Map<string, LayoutElement>();

  set(name: string, element: LayoutElement): void {
    this.elements.set(name, element);
  }

  get<T extends LayoutElement>(name: string): T {
    if (!this.has(name)) {
      throw new Error(`Can't find layout node with name ${name}`)
    }
    return this.elements.get(name) as T;
  }

  has(name: string): boolean {
    return this.elements.has(name);
  }

  clear(): void {
    this.elements.clear();
  }
}
