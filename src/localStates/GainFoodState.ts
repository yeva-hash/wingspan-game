import type { LocalState } from "./LocalState";
import type { FlowContext } from "../flow/FlowTypes";
import { ChooseFoodStrategy } from "../game/strategy/selectionStrategy/ChooseFoodStrategy";

export class GainFoodState implements LocalState {
  async run(ctx: FlowContext): Promise<void> {
    const rewardCount = ctx.services.habitatService.getFirstFreeSlot("forest")?.rewardCount ?? 0;
    if (rewardCount <= 0) return;

    ctx.controllers.feeder.setStrategy(new ChooseFoodStrategy(rewardCount));

    const { selectedFoodIndexes } = await ctx.controllers.feeder.selectFood();
    ctx.useCases.gainFoodUseCase.execute(selectedFoodIndexes);

    ctx.controllers.feeder.syncWithStore();
  }
}

