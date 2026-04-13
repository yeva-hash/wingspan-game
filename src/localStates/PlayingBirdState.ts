import type { LocalState } from "./LocalState";
import type { FlowContext } from "../flow/FlowTypes";
import { PlayBirdStrategy } from "../game/strategy/selectionStrategy/PlayBirdStrategy";

export class PlayingBirdState implements LocalState {
  async run(ctx: FlowContext): Promise<void> {
    ctx.controllers.hand.setStrategy(new PlayBirdStrategy());

    await ctx.controllers.hand.render();
    
    const { birdId, area } = await ctx.controllers.hand.chooseBird();

    const result = ctx.services.habitatService.placeBirdInArea(area, birdId);

    ctx.controllers.hand.hide();
    ctx.controllers.habitat.placeBirdCard(result);

    //TODO use case?
    ctx.services.playerResourceService.removeBirdById(birdId);
    ctx.services.playerResourceService.removeFoodByIds(result.bird.allowedFoods);
    // ctx.controllers.habitat.syncOccupiedSlots();
  }
}
