import type { FlowContext } from "../flow/FlowTypes";
import { PlayBirdStrategy } from "../game/strategy/selectionStrategy/PlayBirdStrategy";
import { CancelableLocalState } from "./CancelableLocalState";

export class PlayingBirdState extends CancelableLocalState {
  protected async runAction(ctx: FlowContext): Promise<void> {
    ctx.controllers.hand.setStrategy(new PlayBirdStrategy());

    await ctx.controllers.hand.render();
    
    const { birdId, area } = await ctx.controllers.hand.chooseBird();
    if (this.isCancelled) return;

    const result = ctx.useCases.playBirdUseCase.execute(area, birdId);

    ctx.controllers.hand.hide();
    ctx.controllers.habitat.placeBirdCard(result);
    // ctx.controllers.habitat.syncOccupiedSlots();
  }

  protected override async onCancel(ctx: FlowContext): Promise<void> {
    ctx.controllers.hand.hide();
  }
}
