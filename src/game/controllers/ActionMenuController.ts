import { ActionMenuView } from "../views/ActionMenuView";

export type ActionId = "playBird" | "gainFood" | "gainEggs" | "chooseBird";

export class ActionMenuController {
  constructor(private readonly view: ActionMenuView) {}

  async chooseAction(): Promise<ActionId> {
    return this.view.waitForAction();
  }
}