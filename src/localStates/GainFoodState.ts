import type { LocalState } from "./LocalState";
import type { FlowContext } from "../flow/FlowTypes";
import { ChooseFoodStrategy } from "../game/strategy/selectionStrategy/ChooseFoodStrategy";

export class GainFoodState implements LocalState {
  async run(ctx: FlowContext): Promise<void> {
    // const rewardCount = ctx.services.habitatService.getFirstFreeSlot("forest")?.rewardCount ?? 0;
    const rewardCount = 6;
    if (rewardCount <= 0) return;

    const availableFoodCount = ctx.services.feederService.getAvailableFoodCount();

    if (rewardCount > availableFoodCount) {
      const availableSlotIndexes = ctx.services.feederService.getAvailableFoodSlotIndexes();

      if (availableSlotIndexes.length > 0) {
        ctx.useCases.gainFoodUseCase.execute(availableSlotIndexes);
      }

      ctx.controllers.feeder.syncWithStore();

      const remainingRewardCount = rewardCount - availableFoodCount;
      if (remainingRewardCount <= 0) {
        return;
      }

      const { selectedFoodIndexes } = await ctx.controllers.feeder.selectFood(remainingRewardCount);
      ctx.useCases.gainFoodUseCase.execute(selectedFoodIndexes);
      ctx.controllers.feeder.syncWithStore();
      return;
    }

    ctx.controllers.feeder.setStrategy(new ChooseFoodStrategy(rewardCount));

    const { selectedFoodIndexes } = await ctx.controllers.feeder.selectFood();
    ctx.useCases.gainFoodUseCase.execute(selectedFoodIndexes);

    ctx.controllers.feeder.syncWithStore();
  }
}
