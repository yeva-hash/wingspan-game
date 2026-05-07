import type { FlowContext } from "../flow/FlowTypes";
import type { LocalState } from "./LocalState";

export abstract class CancelableLocalState implements LocalState {
  protected isCancelled = false;

  async run(ctx: FlowContext): Promise<void> {
    this.isCancelled = false;

    await ctx.controllers.cancelButton.show();

    const actionPromise = this.runAction(ctx);
    const cancelPromise = ctx.controllers.cancelButton.waitForCancel().then(async () => {
      this.isCancelled = true;
      //TODO?
      this.onCancel(ctx);
    });

    try {
      await Promise.race([actionPromise, cancelPromise]);
    } finally {
      await ctx.controllers.cancelButton.hide();
    }
  }

  protected abstract runAction(ctx: FlowContext): Promise<void>;

  protected async onCancel(_ctx: FlowContext): Promise<void> {}
}
