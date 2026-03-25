import type { LocalState } from "./LocalState";
import type { FlowContext } from "../flow/FlowTypes";

export class GainFoodState implements LocalState {
  async run(ctx: FlowContext): Promise<void> {
    // For now: pick a food token to gain +1
    const food = await ctx.controllers.hand.waitForFoodClick();

    ctx.stores.playerResources.addFood(food.id, 1);
    ctx.controllers.hand.refreshFood(food.id);

    console.log("[GainFoodState] gained +1", food.name);
  }
}

