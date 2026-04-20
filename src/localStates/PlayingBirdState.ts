import type { LocalState } from "./LocalState";
import type { FlowContext } from "../flow/FlowTypes";
import { PlayBirdStrategy } from "../game/strategy/selectionStrategy/PlayBirdStrategy";

export class PlayingBirdState implements LocalState {
  async run(ctx: FlowContext): Promise<void> {
    ctx.controllers.hand.setStrategy(new PlayBirdStrategy());

    await ctx.controllers.hand.render();
    
    const { birdId, area } = await ctx.controllers.hand.chooseBird();

    const result = ctx.useCases.playBirdUseCase.execute(area, birdId);

    ctx.controllers.hand.hide();
    ctx.controllers.habitat.placeBirdCard(result);
    // ctx.controllers.habitat.syncOccupiedSlots();
  }
}
