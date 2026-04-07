import { BirdDefinition } from "../game/types/resourceTypes";
import { BirdsOfferedStore } from "../stores/BirdsOfferedStore";
import { ChooseActionFlow } from "./ChooseActionFlow";
import type { FlowContext, FlowState } from "./FlowTypes";

export class StartGameFlow implements FlowState {
  async run(ctx: FlowContext): Promise<FlowState | null> {
    const offeredBirds = this.getInitialOfferedBirds(ctx);
    ctx.stores.birdsOffered.setOfferedBirds(offeredBirds);
    
    ctx.controllers.birdOffered.render();
    ctx.controllers.hand.renderAreas(ctx.stores.game.getAreas());

    return new ChooseActionFlow();
  }

  private getInitialOfferedBirds(ctx: FlowContext): BirdDefinition[] {
    const count = BirdsOfferedStore.initialBirdsOfferedCount;
    const store = ctx.stores.birdsOffered;

    return Array.from({ length: count }, () => {
        const bird = store.getRandomAvailableBird();
        store.removeFromAvailable(bird);
        return bird;
    });
  }
}

