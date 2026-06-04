import type { FlowContext } from "../flow/FlowTypes";
import { PlayBirdStrategy } from "../game/strategy/selectionStrategy/PlayBirdStrategy";
import { CancelableLocalState } from "./CancelableLocalState";

export class PlayingBirdState extends CancelableLocalState {
  protected async runAction(ctx: FlowContext): Promise<boolean> {
    ctx.controllers.hand.setStrategy(new PlayBirdStrategy());

    await ctx.controllers.hand.render();
    
    const { birdId, area } = await ctx.controllers.hand.chooseBird();
    if (this.isCancelled) return false;

    this.disableCancelButton(ctx);
    const result = ctx.useCases.playBirdUseCase.execute(area, birdId);

    await ctx.controllers.hand.hide();
    ctx.controllers.habitat.placeBirdCard(result);
    // ctx.controllers.habitat.syncOccupiedSlots();
    return true;
  }

  protected override async onCancel(ctx: FlowContext): Promise<void> {
    await ctx.controllers.hand.hide();
  }
}
