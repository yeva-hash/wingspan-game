import { Container, Sprite, Text } from "pixi.js";
import type { LayoutElement } from "./LayoutService";

type ElementCloner<T extends LayoutElement> = (element: T) => T;

const CLONERS = new Map<Function, ElementCloner<any>>([
  [Text, (element: Text) => new Text({ text: element.text, style: element.style.clone() })],
  [Sprite, (element: Sprite) => new Sprite(element.texture)],
  [Container, () => new Container()],
]);

export function cloneLayoutElement(element: LayoutElement): LayoutElement {
  const clonedElement = createShallowClone(element);

  copyBaseProps(element, clonedElement);
  copyAnchor(element, clonedElement);
  cloneChildren(element, clonedElement);

  return clonedElement;
}

function createShallowClone(element: LayoutElement): LayoutElement {
  const cloner = CLONERS.get(element.constructor);

  if (cloner) {
    return cloner(element);
  }

  return new Container();
}

function cloneChildren(source: LayoutElement, target: LayoutElement): void {
  if (!(source instanceof Container) || !(target instanceof Container)) {
    return;
  }

  for (const child of source.children) {
    target.addChild(cloneLayoutElement(child as LayoutElement));
  }
}

function copyAnchor(source: LayoutElement, target: LayoutElement): void {
  if ("anchor" in source && "anchor" in target) {
    target.anchor.set(source.anchor.x, source.anchor.y);
  }
}

function copyBaseProps(source: LayoutElement, target: LayoutElement): void {
  target.label = source.label;
  target.position.set(source.x, source.y);
  target.scale.set(source.scale.x, source.scale.y);
  target.pivot.set(source.pivot.x, source.pivot.y);
  target.skew.set(source.skew.x, source.skew.y);
  target.rotation = source.rotation;
  target.alpha = source.alpha;
  target.visible = source.visible;
  target.eventMode = source.eventMode;
  target.cursor = source.cursor;
}
