import type { FlowContext } from "../flow/FlowTypes";
import { ChooseFoodStrategy } from "../game/strategy/selectionStrategy/ChooseFoodStrategy";
import { Area } from "../game/types/resourceTypes";
import { CancelableLocalState } from "./CancelableLocalState";

export class GainFoodState extends CancelableLocalState {
  protected async runAction(ctx: FlowContext): Promise<boolean> {
    const rewardArea: Area = "forest";
    let rewardCount = ctx.services.habitatService.getRewardCount(rewardArea)

    if (rewardCount <= 0) return false;

    await ctx.controllers.dimmer.highlight(ctx.controllers.feeder.container);

    try {
      const availableFoodCount = ctx.services.feederService.getAvailableFoodCount();

      if (rewardCount > availableFoodCount) {
        const availableSlotIndexes = ctx.services.feederService.getAvailableFoodSlotIndexes();

        if (availableSlotIndexes.length > 0) {
          ctx.useCases.gainFoodUseCase.execute(availableSlotIndexes);
        }

        ctx.controllers.feeder.syncWithStore();

        const remainingRewardCount = rewardCount - availableFoodCount;
        if (remainingRewardCount <= 0) {
          return availableSlotIndexes.length > 0;
        }

        const { selectedFoodIndexes } = await ctx.controllers.feeder.selectFood(remainingRewardCount);
        if (this.isCancelled) return false;

        this.disableCancelButton(ctx);
        ctx.useCases.gainFoodUseCase.execute(selectedFoodIndexes);
        ctx.controllers.feeder.syncWithStore();
        return true;
      }

      ctx.controllers.feeder.setStrategy(new ChooseFoodStrategy(rewardCount));

      const { selectedFoodIndexes } = await ctx.controllers.feeder.selectFood();
      if (this.isCancelled) return false;

      this.disableCancelButton(ctx);
      ctx.useCases.gainFoodUseCase.execute(selectedFoodIndexes);

      ctx.controllers.feeder.syncWithStore();
      return true;
    } finally {
      await ctx.controllers.dimmer.clear();
    }
  }

  protected override async onCancel(ctx: FlowContext): Promise<void> {
    await ctx.controllers.feeder.cancelSelection();
    await ctx.controllers.dimmer.clear();
  }
}
