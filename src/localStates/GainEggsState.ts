import type { FlowContext } from "../flow/FlowTypes";
import { Area } from "../game/types/resourceTypes";
import { CancelableLocalState } from "./CancelableLocalState";

export class GainEggsState extends CancelableLocalState {
  protected async runAction(ctx: FlowContext): Promise<void> {
      const rewardArea: Area = "steppe";
      let rewardCount = ctx.services.habitatService.getRewardCount(rewardArea);

      try {
          while (rewardCount > 0) {
              const availableSlotsByArea = ctx.services.habitatService.getAvailableEggPlacementSlotsByArea();
              if (availableSlotsByArea.size === 0) {
                  break;
              }

              const highlightTargets = ctx.controllers.habitat.getBirdCardContainers(availableSlotsByArea);
              await ctx.controllers.dimmer.highlight(highlightTargets);

              const selectedSlot = await ctx.controllers.habitat.chooseBirdForEggPlacement(availableSlotsByArea);
              if (this.isCancelled) return;

              ctx.services.habitatService.placeEgg(selectedSlot.area, selectedSlot.slotIndex);
              ctx.controllers.habitat.updateEggProgress(selectedSlot.area, selectedSlot.slotIndex);

              rewardCount -= 1;
          }
      } finally {
        ctx.controllers.habitat.clearEggPlacementSelection();
        await ctx.controllers.dimmer.clear();
      }
  }

  protected override async onCancel(ctx: FlowContext): Promise<void> {
    ctx.controllers.habitat.clearEggPlacementSelection();
    await ctx.controllers.dimmer.clear();
  }
}
