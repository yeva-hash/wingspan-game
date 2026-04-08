import { BirdDefinition, FoodDefinition } from "../game/types/resourceTypes";
import { BirdsOfferedStore } from "../stores/BirdsOfferedStore";
import { ChooseActionFlow } from "./ChooseActionFlow";
import type { FlowContext, FlowState } from "./FlowTypes";
import birdsJson from "../../data/birds.json";
import foodsJson from "../../data/foods.json";

const birds = (birdsJson as { birds: BirdDefinition[] }).birds;
const foods = (foodsJson as { foods: FoodDefinition[] }).foods;

export class StartGameFlow implements FlowState {
  async run(ctx: FlowContext): Promise<FlowState | null> {
    const offeredBirds = this.getInitialOfferedBirds(ctx);
    ctx.stores.birdsOffered.setOfferedBirds(offeredBirds);
    
    ctx.controllers.birdOffered.render();
    ctx.controllers.hand.renderAreas(ctx.stores.game.getAreas());

    ctx.stores.playerResources.setInitialDeal(
      [birds[0], birds[3], birds[4]],
      [foods[0], foods[1], foods[2], foods[3], foods[4]]
    );

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

