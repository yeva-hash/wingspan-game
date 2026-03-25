import type { LocalState } from "./LocalState";
import type { FlowContext } from "../flow/FlowTypes";

export class GainEggsState implements LocalState {
  async run(_ctx: FlowContext): Promise<void> {
    // Eggs store isn't implemented yet.
    // This placeholder shows how a local async state fits the flow.
    console.log("[GainEggsState] not implemented yet");
  }
}

