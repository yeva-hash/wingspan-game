import type { LocalState } from "./LocalState";
import type { FlowContext } from "../flow/FlowTypes";
import { PlayBirdStrategy } from "../game/strategy/selectionStrategy/PlayBirdStrategy";

export class PlayingBirdState implements LocalState {
  async run(ctx: FlowContext): Promise<void> {
    ctx.controllers.hand.setStrategy(new PlayBirdStrategy());

    await ctx.controllers.hand.render();
    
    const {birdId, area} = await ctx.controllers.hand.chooseBird();

    // Step 3: choose area
    // const area = await ctx.controllers.actionMenu.chooseArea();
  }
}

