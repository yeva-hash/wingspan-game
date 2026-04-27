import layoutJson from "../layout.json";
import stylesJson from "../styles.json";
import { GameApp } from "./app/GameApp";
import type { LayoutConfig } from "./layout/LayoutBuilder";
import { TextStyleCache, type TextStylesConfig } from "./layout/TextStyleCache";
import { GameScene } from "./scene/GameScene";

async function main() {
  TextStyleCache.initialize(stylesJson as TextStylesConfig);

  const gameApp = new GameApp();
  await gameApp.init({
    mountId: "app",
    layout: layoutJson as LayoutConfig,
  });

  const scene = new GameScene(gameApp);
  scene.start();
}

main().catch((err) => {
  console.error(err);
});
