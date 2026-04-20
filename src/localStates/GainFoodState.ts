import type { LocalState } from "./LocalState";
import type { FlowContext } from "../flow/FlowTypes";
import { ChooseFoodStrategy } from "../game/strategy/selectionStrategy/ChooseFoodStrategy";
import { Area } from "../game/types/resourceTypes";

export class GainFoodState implements LocalState {
  async run(ctx: FlowContext): Promise<void> {
    const rewardArea: Area = "forest";
    let rewardCount = ctx.services.habitatService.getRewardCount(rewardArea)

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
