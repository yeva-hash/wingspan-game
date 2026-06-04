import type { FlowContext, FlowState } from "./FlowTypes";
import type { ActionId } from "../game/controllers/ActionMenuController";
import { PlayingBirdState } from "../localStates/PlayingBirdState";
import { GainFoodState } from "../localStates/GainFoodState";
import { GainEggsState } from "../localStates/GainEggsState";
import { ChooseBirdState } from "../localStates/ChooseBirdState";

export class ChooseActionFlow implements FlowState {
  async run(ctx: FlowContext): Promise<FlowState | null> {
    if (ctx.services.feederService.isEmpty()) {
      await ctx.controllers.feeder.syncWithStore();
    }

    const action: ActionId = await ctx.controllers.actionMenu.chooseAction();
    let actionCompleted = false;

    switch (action) {
      case "playBird":
        actionCompleted = await new PlayingBirdState().run(ctx);
        break;
      case "gainFood":
        actionCompleted = await new GainFoodState().run(ctx);
        break;
      case "gainEggs":
        actionCompleted = await new GainEggsState().run(ctx);
        break;
      case "chooseBird":
        actionCompleted = await new ChooseBirdState().run(ctx);
        break;
    }

    if (actionCompleted) {
      const result = ctx.services.roundService.completeAction();
      if (result.roundEnded && !result.gameEnded) {
        ctx.services.goalService.setCurrentGoalByRoundIndex(ctx.services.roundService.getCurrentRoundIndex());
      }

      ctx.controllers.round.render();
      ctx.controllers.goal.renderCurrentGoal();

      if (result.gameEnded) {
        return null;
      }
    }

    return new ChooseActionFlow();
  }
}
