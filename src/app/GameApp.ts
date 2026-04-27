import { Application, Assets } from "pixi.js";
import { LayoutBuilder } from "../layout/LayoutBuilder";
import type { LayoutConfig } from "../layout/LayoutBuilder";
import { LayoutService } from "../layout/LayoutService";

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

    (window.top as any).globalThis.__PIXI_APP__ = this.app;

    appContainer.appendChild(this.app.canvas);

    //TODO
    await Assets.init({ manifest: "assets/assets-manifest.json" });
    await Assets.loadBundle("food");
    await Assets.loadBundle("birds");
    await Assets.loadBundle("game");

    await this.layoutBuilder.build(options.layout, this.app.stage);
  }
}
