import { Assets, Texture } from "pixi.js";

export async function preloadAssets(bundleName: string): Promise<void> {
    await Assets.loadBundle(bundleName);
}

export class TextureCache {
    static getTexture(alias: string): Texture {
        const texture = Assets.get<Texture>(alias);
        if (!texture) {
            throw new Error(`Texture not preloaded: "${alias}". Call AssetLoader.loadBundle() first.`);
        }
        return texture;
    }
}
