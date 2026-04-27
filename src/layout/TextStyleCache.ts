import { TextStyle, type TextStyleOptions } from "pixi.js";

type JsonTextStyleOptions = Omit<TextStyleOptions, "fill"> & {
  fill?: TextStyleOptions["fill"] | string[];
};

export type TextStylesConfig = Record<string, JsonTextStyleOptions>;

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

  private static normalizeStyle(style: JsonTextStyleOptions): TextStyleOptions {
    const { fill, ...rest } = style;
    const normalizedStyle: TextStyleOptions = { ...rest };
    const gradientStyle = normalizedStyle as TextStyleOptions & {
      fillGradientStops?: number[];
    };

    if (Array.isArray(fill)) {
      const fillColors = fill.map((color) =>
        typeof color === "string" && color.startsWith("#")
          ? Number.parseInt(color.slice(1), 16)
          : (color as number)
      );
      normalizedStyle.fill = fillColors;

      gradientStyle.fillGradientStops ??= this.createGradientStops(fillColors.length);
    } else if (fill !== undefined) {
      normalizedStyle.fill = fill;
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
