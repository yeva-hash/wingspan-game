import type { LocalState } from "./LocalState";
import type { FlowContext } from "../flow/FlowTypes";
import { Bird } from "../game/models/Bird";

export class ChooseBirdState implements LocalState {
  async run(ctx: FlowContext): Promise<void> {
    const { birdOffered } = ctx.controllers;
    const { birdsOffered: birdsOfferedStore, playerResources } = ctx.stores;
    // Step 1 Highlight birds offered area
    const selectedCount = 1;

    await birdOffered.prepareView(selectedCount);
    // Step 2 wait for bird Choosing
    const selectedBirds = await birdOffered.waitForConfirmClick();
    // Step 3 Choose bird

    //TODO command 
    for (const bird of selectedBirds) {
      playerResources.addBird(new Bird(bird));
      
    }
    // change offered bird store 
    // change playerresources store

    // Step 4 add to resource store 
  }
}

