import type { LocalState } from "./LocalState";
import type { FlowContext } from "../flow/FlowTypes";
import { Bird } from "../game/models/Bird";
import { ChooseBirdStrategy } from "../game/managers/ChooseBirdStrategy";

export class ChooseBirdState implements LocalState {
  async run(ctx: FlowContext): Promise<void> {
    const { birdOffered: birdOfferedController } = ctx.controllers;
    const { birdsOffered: birdsOfferedStore, playerResources } = ctx.stores;
    // Step 1 Highlight birds offered area
    const selectedCount = 2;
    birdOfferedController.setStrategy(new ChooseBirdStrategy(selectedCount));

    await birdOfferedController.prepareView(selectedCount);
    const selectedBirds = await birdOfferedController.waitForConfirmClick();

    for (const bird of selectedBirds) {
        birdsOfferedStore.removeFromAvailable(bird);
        playerResources.addBird(new Bird(bird));
    }
  }
}

