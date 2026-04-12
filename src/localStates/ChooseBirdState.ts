import type { LocalState } from "./LocalState";
import type { FlowContext } from "../flow/FlowTypes";
import { ChooseBirdStrategy } from "../game/strategy/selectionStrategy/ChooseBirdStrategy";
import { ReadOnlyStrategy } from "../game/strategy/selectionStrategy/ReadOnlyStrategy";

export class ChooseBirdState implements LocalState {
  async run(ctx: FlowContext): Promise<void> {
    const { birdOffered, hand } = ctx.controllers;

    //TODO
    const rewardCount = ctx.services.habitatService.getFirstFreeSlot("swamp")?.rewardCount ?? 0;
    birdOffered.setStrategy(new ChooseBirdStrategy(rewardCount));

    await birdOffered.prepareViewForSelection();
    const birdOfferChoice = await birdOffered.chooseBirds();

    ctx.useCases.chooseBirdUseCase.execute(birdOfferChoice.selectedBirdIds);

    birdOffered.render();

    // hand.setStrategy(new ReadOnlyStrategy());
    // await hand.render();
  }
}
