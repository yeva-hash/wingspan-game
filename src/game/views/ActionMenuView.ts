import { Text } from "pixi.js";
import { createDeferred } from "../../utils/deferred";
import type { LayoutService } from "../../layout/layout-service";
import type { ActionId } from "../controllers/ActionMenuController";

type ActionTextMap = Record<ActionId, Text>;

export class ActionMenuView {
  private readonly _items: ActionTextMap;

  constructor(layoutService: LayoutService) {
    this._items = {
      playBird: layoutService.get<Text>("play-bird-text"),
      gainFood: layoutService.get<Text>("gain-food-text"),
      gainEggs: layoutService.get<Text>("gain-eggs-text"),
      chooseBird: layoutService.get<Text>("choose-bird-text"),
    };
  }

  async waitForAction(): Promise<ActionId> {
    const deferred = createDeferred<ActionId>();
    const disposers: Array<() => void> = [];

    for (const [action, text] of Object.entries(this._items) as [ActionId, Text][]) {
      text.eventMode = "static";
      text.cursor = "pointer";

      const handler = () => {
        this.setInteractive(false);
        this.removeHandlers(disposers);
        deferred.resolve(action);
      };

      text.on("pointerdown", handler);
      disposers.push(() => text.off("pointerdown", handler));
    }

    return deferred.promise;
  }

  setInteractive(value: boolean): void {
    for (const text of Object.values(this._items)) {
      text.eventMode = value ? "static" : "none";
      text.cursor = value ? "pointer" : "default";
    }
  }

  private removeHandlers(disposers: Array<() => void>): void {
    for (const dispose of disposers) {
      dispose();
    }
  }
}