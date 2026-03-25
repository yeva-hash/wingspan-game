import { StartGameCommand } from "../commands/StartGameCommand";
import { ChooseActionFlow } from "./ChooseActionFlow";
import type { FlowContext, FlowState } from "./FlowTypes";

export class StartGameFlow implements FlowState {
  async run(ctx: FlowContext): Promise<FlowState | null> {
    // new StartGameCommand(ctx.stores.playerResources).execute();
    // ctx.controllers.hand.render();
    return new ChooseActionFlow();
  }
}

