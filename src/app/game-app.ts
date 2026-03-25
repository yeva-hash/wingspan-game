import { Application } from "pixi.js";
import { LayoutBuilder } from "../layout/layout-builder";
import type { LayoutConfig } from "../layout/layout-builder";
import { LayoutService } from "../layout/layout-service";

type GameAppOptions = {
  mountId?: string;
  layout: LayoutConfig;
};

export class GameApp {
  readonly app: Application;
  readonly layoutService: LayoutService;
  private readonly layoutBuilder: LayoutBuilder;

  constructor() {
    this.app = new Application();
    this.layoutService = new LayoutService();
    this.layoutBuilder = new LayoutBuilder(this.layoutService);
  }

  async init(options: GameAppOptions): Promise<void> {
    const mountId = options.mountId ?? "app";
    const appContainer = document.getElementById(mountId);
    if (!appContainer) {
      throw new Error(`App container #${mountId} not found`);
    }

    await this.app.init({
      background: "#ffffff",
      resizeTo: window,
      antialias: true,
    });

    appContainer.appendChild(this.app.canvas);
    await this.layoutBuilder.build(options.layout, this.app.stage);
  }
}
