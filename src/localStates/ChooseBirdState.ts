import type { FlowContext } from "../flow/FlowTypes";
import { ChooseBirdStrategy } from "../game/strategy/selectionStrategy/ChooseBirdStrategy";
import { ReadOnlyStrategy } from "../game/strategy/selectionStrategy/ReadOnlyStrategy";
import { Area } from "../game/types/resourceTypes";
import { CancelableLocalState } from "./CancelableLocalState";

export class ChooseBirdState extends CancelableLocalState {
  protected async runAction(ctx: FlowContext): Promise<void> {
    const { birdOffered, hand } = ctx.controllers;

    //TODO
    const rewardArea: Area = "swamp";
    let rewardCount = ctx.services.habitatService.getRewardCount(rewardArea)
    birdOffered.setStrategy(new ChooseBirdStrategy(rewardCount));

    await birdOffered.prepareViewForSelection();
    const birdOfferChoice = await birdOffered.chooseBirds();
    if (this.isCancelled) return;

    this.disableCancelButton(ctx);
    ctx.useCases.chooseBirdUseCase.execute(birdOfferChoice.selectedBirdIds);

    birdOffered.render();

    // hand.setStrategy(new ReadOnlyStrategy());
    // await hand.render();
  }

  protected override async onCancel(ctx: FlowContext): Promise<void> {
    await ctx.controllers.birdOffered.cancelSelection();
  }
}
