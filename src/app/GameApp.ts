import { Application, Assets, Container } from "pixi.js";
import { LayoutBuilder } from "../layout/LayoutBuilder";
import type { LayoutConfig } from "../layout/LayoutBuilder";
import { LayoutService } from "../layout/LayoutService";
import { ResizeService, type ResizeMode } from "./ResizeService";

type GameAppOptions = {
  mountId?: string;
  layout: LayoutConfig;
  designWidth?: number;
  designHeight?: number;
  resizeMode?: ResizeMode;
};

export class GameApp {
  readonly app: Application;
  readonly layoutService: LayoutService;
  readonly gameRoot: Container;
  private readonly layoutBuilder: LayoutBuilder;
  private resizeService?: ResizeService;

  constructor() {
    this.app = new Application();
    this.layoutService = new LayoutService();
    this.layoutBuilder = new LayoutBuilder(this.layoutService);
    this.gameRoot = new Container();
  }

  async init(options: GameAppOptions): Promise<void> {
    const mountId = options.mountId ?? "app";
    const appContainer = document.getElementById(mountId);
    if (!appContainer) {
      throw new Error(`App container #${mountId} not found`);
    }

    await this.app.init({
      background: "#ffffff",
      resizeTo: appContainer,
      autoDensity: true,
      resolution: window.devicePixelRatio || 1,
      antialias: true,
    });

    // (window.top as any).globalThis.__PIXI_APP__ = this.app;

    appContainer.appendChild(this.app.canvas);
    this.app.stage.addChild(this.gameRoot);

    //TODO
    await Assets.init({ manifest: "assets/assets-manifest.json" });
    await Assets.loadBundle("food");
    await Assets.loadBundle("birds");
    await Assets.loadBundle("game");

    await this.layoutBuilder.build(options.layout, this.gameRoot);

    this.resizeService = new ResizeService({
      app: this.app,
      root: this.gameRoot,
      designWidth: options.designWidth ?? 1728,
      designHeight: options.designHeight ?? 1024,
      mode: options.resizeMode,
    });
    this.resizeService.init();
  }

  destroy(): void {
    this.resizeService?.destroy();
    this.app.destroy(true);
  }
}
