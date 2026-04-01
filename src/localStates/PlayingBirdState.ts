import type { LocalState } from "./LocalState";
import type { FlowContext } from "../flow/FlowTypes";

export class PlayingBirdState implements LocalState {
  async run(ctx: FlowContext): Promise<void> {
    // Step 1: show birds in hand
    await ctx.controllers.hand.render();
    // Step 2: wait for a bird click
    const {bird, area} = await ctx.controllers.hand.waitForConfirmClick();

    //show bird details while choosing area

    // Step 3: choose area
    // const area = await ctx.controllers.actionMenu.chooseArea();
  }
}

