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
  readonly backgroundRoot: Container;
  readonly gameRoot: Container;
  private readonly layoutBuilder: LayoutBuilder;
  private backgroundResizeService?: ResizeService;
  private gameResizeService?: ResizeService;

  constructor() {
    this.app = new Application();
    this.layoutService = new LayoutService();
    this.layoutBuilder = new LayoutBuilder(this.layoutService);
    this.backgroundRoot = new Container();
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


    appContainer.appendChild(this.app.canvas);
    this.app.stage.addChild(this.backgroundRoot);
    this.app.stage.addChild(this.gameRoot);

    //TODO
    await Assets.init({ manifest: "assets/assets-manifest.json" });
    await Assets.loadBundle("food");
    await Assets.loadBundle("birds");
    await Assets.loadBundle("game");

    await this.layoutBuilder.build(options.layout, this.gameRoot);

    const designWidth = options.designWidth ?? 1728;
    const designHeight = options.designHeight ?? 1024;

    this.moveBackgroundToCoverLayer();

    this.backgroundResizeService = new ResizeService({
      app: this.app,
      root: this.backgroundRoot,
      designWidth,
      designHeight,
      mode: "cover",
    });

    this.gameResizeService = new ResizeService({
      app: this.app,
      root: this.gameRoot,
      designWidth,
      designHeight,
      mode: options.resizeMode ?? "fit",
    });

    this.backgroundResizeService.init();
    this.gameResizeService.init();

    (window.top as any).globalThis.__PIXI_APP__ = this.app;
  }

  destroy(): void {
    this.backgroundResizeService?.destroy();
    this.gameResizeService?.destroy();
    this.app.destroy(true);
  }

  private moveBackgroundToCoverLayer(): void {
    const background = this.layoutService.get("background");
    background.parent?.removeChild(background);
    this.backgroundRoot.addChild(background);
  }
}
