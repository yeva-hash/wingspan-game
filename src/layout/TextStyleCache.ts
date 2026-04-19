import { TextStyle, type TextStyleOptions } from "pixi.js";

export type TextStylesConfig = Record<string, TextStyleOptions>;

export class TextStyleCache {
  private static _styles: TextStylesConfig = {};

  static initialize(styles: TextStylesConfig): void {
    this._styles = styles;
  }

  static getTextStyle(name: string): TextStyle {
    const style = this._styles[name];
    if (!style) {
      throw new Error(`Text style not found: "${name}"`);
    }

    return new TextStyle(this.normalizeStyle(style));
  }

  static hasTextStyle(name: string): boolean {
    return name in this._styles;
  }

  private static normalizeStyle(style: TextStyleOptions): TextStyleOptions {
    const normalizedStyle: TextStyleOptions = { ...style };
    const gradientStyle = normalizedStyle as TextStyleOptions & {
      fillGradientStops?: number[];
    };

    if (Array.isArray(normalizedStyle.fill)) {
      const fillColors = normalizedStyle.fill;

      gradientStyle.fillGradientStops ??= this.createGradientStops(fillColors.length);
    }

    return normalizedStyle;
  }

  private static createGradientStops(colorCount: number): number[] {
    if (colorCount <= 1) {
      return [0];
    }

    return Array.from({ length: colorCount }, (_, index) => index / (colorCount - 1));
  }
}
