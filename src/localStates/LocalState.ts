import type { FlowContext } from "../flow/FlowTypes";

export interface LocalState {
  run(ctx: FlowContext): Promise<boolean>;
}
