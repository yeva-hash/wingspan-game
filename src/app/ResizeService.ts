import type { Application, Container } from "pixi.js";

export type ResizeMode = "fit" | "cover";

type ResizeServiceOptions = {
  app: Application;
  root: Container;
  designWidth: number;
  designHeight: number;
  mode?: ResizeMode;
};

export class ResizeService {
  private readonly app: Application;
  private readonly root: Container;
  private readonly designWidth: number;
  private readonly designHeight: number;
  private readonly mode: ResizeMode;

  constructor(options: ResizeServiceOptions) {
    this.app = options.app;
    this.root = options.root;
    this.designWidth = options.designWidth;
    this.designHeight = options.designHeight;
    this.mode = options.mode ?? "fit";
  }

  init(): void {
    this.resize();
    this.app.renderer.on("resize", this.resize);
  }

  destroy(): void {
    this.app.renderer.off("resize", this.resize);
  }

  private readonly resize = (): void => {
    const { width, height } = this.app.screen;
    const scaleX = width / this.designWidth;
    const scaleY = height / this.designHeight;
    const scale = this.mode === "cover"
      ? Math.max(scaleX, scaleY)
      : Math.min(scaleX, scaleY);

    this.root.scale.set(scale);
    this.root.position.set(
      (width - this.designWidth * scale) / 2,
      (height - this.designHeight * scale) / 2,
    );
  };
}
