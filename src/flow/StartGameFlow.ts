import { Area, BirdDefinition, FoodDefinition } from "../game/types/resourceTypes";
import { ChooseActionFlow } from "./ChooseActionFlow";
import type { FlowContext, FlowState } from "./FlowTypes";
import birdsJson from "../../data/birds.json";
import foodsJson from "../../data/foods.json";

const birds = (birdsJson as { birds: BirdDefinition[] }).birds;
const foods = (foodsJson as { foods: FoodDefinition[] }).foods;

export class StartGameFlow implements FlowState {
  async run(ctx: FlowContext): Promise<FlowState | null> {
    //TODO use case?
    ctx.services.birdSupplyService.resetForNewGame();
    ctx.services.birdSupplyService.initializeOffer();

    ctx.services.feederService.resetForNewGame();
    ctx.services.goalService.resetForNewGame();
    ctx.services.roundService.resetForNewGame();
    
    ctx.controllers.birdOffered.render();
    ctx.controllers.hand.renderAreas(ctx.stores.game.getAreas());
    ctx.controllers.goal.renderCurrentGoal();
    ctx.controllers.round.render();

    //TODO use case?
    ctx.services.playerResourceService.setInitialDeal(
      [birds[0].id, birds[3].id, birds[4].id],
      [foods[0], foods[1], foods[2], foods[3], foods[4], foods[1], foods[2], foods[1], foods[2],foods[1], foods[2],foods[1], foods[2],]
    );

    await ctx.controllers.feeder.render();

    // ctx.controllers.habitat.syncOccupiedSlots();

    return new ChooseActionFlow();
  }
}
