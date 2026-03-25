import type { FlowContext, FlowState } from "./FlowTypes";

export class FlowManager {
  private isRunning = false;

  constructor(private current: FlowState) {}

  async start(ctx: FlowContext): Promise<void> {
    if (this.isRunning) return;
    this.isRunning = true;

    try {
      while (this.current) {
        const next = await this.current.run(ctx);
        if (!next) break;
        this.current = next;
      }
    } finally {
      this.isRunning = false;
    }
  }
}

