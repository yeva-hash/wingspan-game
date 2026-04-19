import { Assets, Texture } from "pixi.js";

//TODO
export class TextureCache {
    static getTexture(alias: string): Texture {
        const texture = Assets.get<Texture>(alias);
        if (!texture) {
            throw new Error(`Texture not preloaded: "${alias}". Call AssetLoader.loadBundle() first.`);
        }
        return texture;
    }
}
