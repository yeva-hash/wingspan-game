import type { FlowContext, FlowState } from "./FlowTypes";
import type { ActionId } from "../game/controllers/ActionMenuController";
import { PlayingBirdState } from "../localStates/PlayingBirdState";
import { GainFoodState } from "../localStates/GainFoodState";
import { GainEggsState } from "../localStates/GainEggsState";
import { ChooseBirdState } from "../localStates/ChooseBirdState";

export class ChooseActionFlow implements FlowState {
  async run(ctx: FlowContext): Promise<FlowState | null> {
    const action: ActionId = await ctx.controllers.actionMenu.chooseAction();

    switch (action) {
      case "playBird":
        await new PlayingBirdState().run(ctx);
        break;
      case "gainFood":
        await new GainFoodState().run(ctx);
        break;
      case "gainEggs":
        await new GainEggsState().run(ctx);
        break;
      case "chooseBird":
        await new ChooseBirdState().run(ctx);
        break;
    }

    return null;
  }
}

