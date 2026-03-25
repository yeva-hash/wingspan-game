import type { LocalState } from "./LocalState";
import type { FlowContext } from "../flow/FlowTypes";

export class ChooseBirdState implements LocalState {
  async run(ctx: FlowContext): Promise<void> {
    const bird = await ctx.controllers.hand.waitForBirdClick();
    console.log("[ChooseBirdState] chosen bird =", bird.name, bird.instanceId);
  }
}

