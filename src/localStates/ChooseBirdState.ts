import type { LocalState } from "./LocalState";
import type { FlowContext } from "../flow/FlowTypes";
import { ChooseBirdStrategy } from "../game/strategy/selectionStrategy/ChooseBirdStrategy";
import { ReadOnlyStrategy } from "../game/strategy/selectionStrategy/ReadOnlyStrategy";

export class ChooseBirdState implements LocalState {
  async run(ctx: FlowContext): Promise<void> {
    const { birdOffered, hand } = ctx.controllers;

    birdOffered.setStrategy(new ChooseBirdStrategy(2));

    await birdOffered.prepareView();
    const birdOfferChoice = await birdOffered.chooseBirds();

    ctx.useCases.chooseBirdUseCase.execute(birdOfferChoice.selectedBirdIds);

    hand.setStrategy(new ReadOnlyStrategy());
    await hand.render();
  }
}
