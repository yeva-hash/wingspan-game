import type { LocalState } from "./LocalState";
import type { FlowContext } from "../flow/FlowTypes";

export class PlayingBirdState implements LocalState {
  async run(ctx: FlowContext): Promise<void> {
    // Step 1: show birds in hand
    await ctx.controllers.hand.render();
    // Step 1: wait for a bird click
    const bird = await ctx.controllers.hand.waitForConfirmClick();
  }
}

