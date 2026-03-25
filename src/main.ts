import layoutJson from "../layout.json";
import { GameApp } from "./app/game-app";
import type { LayoutConfig } from "./layout/layout-builder";
import { GameScene } from "./scene/game-scene";

async function main() {
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

