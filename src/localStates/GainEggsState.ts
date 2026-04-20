import type { LocalState } from "./LocalState";
import type { FlowContext } from "../flow/FlowTypes";
import { Area } from "../game/types/resourceTypes";
import { ChooseActionFlow } from "../flow/ChooseActionFlow";

export class GainEggsState implements LocalState {
  async run(ctx: FlowContext): Promise<void> {
      const rewardArea: Area = "steppe";
      let rewardCount = ctx.services.habitatService.getRewardCount(rewardArea);

      while (rewardCount > 0) {
          const availableSlotsByArea = ctx.services.habitatService.getAvailableEggPlacementSlotsByArea();
          if (availableSlotsByArea.size === 0) {
              break;
          }

          const selectedSlot = await ctx.controllers.habitat.chooseBirdForEggPlacement(availableSlotsByArea);

          ctx.services.habitatService.placeEgg(selectedSlot.area, selectedSlot.slotIndex);
          ctx.controllers.habitat.updateEggProgress(selectedSlot.area, selectedSlot.slotIndex);

          rewardCount -= 1;
      }

    ctx.controllers.habitat.clearEggPlacementSelection();
  }
}
