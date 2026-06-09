import type { FlowContext } from "../flow/FlowTypes";
import { PlayBirdStrategy } from "../game/strategy/selectionStrategy/PlayBirdStrategy";
import type { Area } from "../game/types/resourceTypes";
import { CancelableLocalState } from "./CancelableLocalState";

export class PlayingBirdState extends CancelableLocalState {
  protected async runAction(ctx: FlowContext): Promise<boolean> {
    ctx.controllers.hand.setStrategy(new PlayBirdStrategy());

    await ctx.controllers.hand.render();
    
    const { birdId, area } = await ctx.controllers.hand.chooseBird();
    if (this.isCancelled) return false;

    this.disableCancelButton(ctx);
    const handHidden = await this.payEggCost(ctx, area);
    if (this.isCancelled) return false;

    const result = ctx.useCases.playBirdUseCase.execute(area, birdId);

    if (!handHidden) {
      await ctx.controllers.hand.hide();
    }
    ctx.controllers.habitat.placeBirdCard(result);
    // ctx.controllers.habitat.syncOccupiedSlots();
    return true;
  }

  protected override async onCancel(ctx: FlowContext): Promise<void> {
    await ctx.controllers.hand.hide();
    ctx.controllers.habitat.clearEggPlacementSelection();
    await ctx.controllers.dimmer.clear();
  }

  private async payEggCost(ctx: FlowContext, area: Area): Promise<boolean> {
    let remainingEggCost = ctx.services.habitatService.getBirdPlayEggCost(area);
    if (remainingEggCost <= 0) {
      return false;
    }

    await ctx.controllers.hand.hide();

    try {
      while (remainingEggCost > 0) {
        const availableSlotsByArea = ctx.services.habitatService.getEggPaymentSlotsByArea();
        if (availableSlotsByArea.size === 0) {
          break;
        }

        const highlightTargets = ctx.controllers.habitat.getBirdCardContainers(availableSlotsByArea);
        await ctx.controllers.dimmer.highlight(highlightTargets);

        const selectedSlot = await ctx.controllers.habitat.chooseBirdForEggPlacement(availableSlotsByArea);
        if (this.isCancelled) return true;

        ctx.services.habitatService.removeEgg(selectedSlot.area, selectedSlot.slotIndex);
        ctx.controllers.habitat.updateEggProgress(selectedSlot.area, selectedSlot.slotIndex);

        remainingEggCost -= 1;
      }
    } finally {
      ctx.controllers.habitat.clearEggPlacementSelection();
      await ctx.controllers.dimmer.clear();
    }

    return true;
  }
}
