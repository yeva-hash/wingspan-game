import layoutJson from "../layout.json";
import { GameApp } from "./app/gameApp";
import type { LayoutConfig } from "./layout/LayoutBuilder";
import { GameScene } from "./scene/GameScene";

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

