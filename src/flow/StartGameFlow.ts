import { Area, BirdDefinition, FoodDefinition } from "../game/types/resourceTypes";
import { ChooseActionFlow } from "./ChooseActionFlow";
import type { FlowContext, FlowState } from "./FlowTypes";
import birdsJson from "../../data/birds.json";
import foodsJson from "../../data/foods.json";
import { BirdSupplyStore } from "../game/stores/BirdSupplyStore";
import { HabitatStore } from "../game/stores/habitat/HabitatStore";
import { HabitatSlotStore } from "../game/stores/habitat/HabitatSlotStore";

const birds = (birdsJson as { birds: BirdDefinition[] }).birds;
const foods = (foodsJson as { foods: FoodDefinition[] }).foods;

export class StartGameFlow implements FlowState {
  async run(ctx: FlowContext): Promise<FlowState | null> {
    //TODO use case?
    ctx.services.birdSupplyService.resetForNewGame();
    ctx.services.birdSupplyService.initializeOffer();
    
    ctx.controllers.birdOffered.render();
    ctx.controllers.hand.renderAreas(ctx.stores.game.getAreas());

    //TODO use case?
    ctx.services.playerResourceService.setInitialDeal(
      [birds[0].name, birds[3].name, birds[4].name],
      [foods[0], foods[1], foods[2], foods[3], foods[4]]
    );

    ctx.services.habitatService.initSlotsForAllAreas(3, HabitatSlotStore);

    // this.initializeHabitat(ctx);

    return new ChooseActionFlow();
  }

  // private initializeHabitat(ctx: FlowContext): void {
  //   const areas = ctx.stores.game.getAreas();
  //   areas.forEach((area) => {
  //     ctx.services.habitatService.initSlots(area, 3, HabitatSlotStore);
  //   });
  // }
}

