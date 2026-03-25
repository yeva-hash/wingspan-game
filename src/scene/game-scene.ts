import type { GameApp } from "../app/game-app";
import { FlowManager } from "../flow/FlowManager";
import type { FlowContext } from "../flow/FlowTypes";
import { StartGameFlow } from "../flow/StartGameFlow";
import { HandController } from "../game/controllers/HandController";
import { ActionMenuController } from "../game/controllers/ActionMenuController";
import { PlayerResourceStore } from "../stores/PlayerResourceStore";
import { ActionMenuView } from "../game/views/ActionMenuView";
import { HandView } from "../game/views/HandView";

export class GameScene {
  private isRunning = false;
  private flowManager?: FlowManager;

  constructor(private readonly gameApp: GameApp) {}

  public start(): void {
    if (this.isRunning) {
      return;
    }

    const { layoutService } = this.gameApp;

    const playerResources = new PlayerResourceStore();
    playerResources.setInitialDeal(
      [
        { id: "sparrow", name: "Sparrow", type: "bird", description: "..." },
        { id: "tit", name: "Great tit", type: "bird", description: "..." },
        { id: "bullfinch", name: "Bullfinch", type: "bird", description: "..." }
      ],
      [
        { id: "seed", name: "Seed", type: "food" },
        { id: "worm", name: "Worm", type: "food" }
      ]
    );

    const actionMenuView = new ActionMenuView(layoutService);
    const handView = new HandView(layoutService);

    const handController = new HandController(playerResources, handView);
    const actionMenuController = new ActionMenuController(actionMenuView);

    // this.gameApp.app.stage.addChild(handController.container);
    // this.gameApp.app.stage.addChild(actionMenuController.container);

    const ctx: FlowContext = {
      gameApp: this.gameApp,
      stores: {
        playerResources,
      },
      controllers: {
        hand: handController,
        actionMenu: actionMenuController,
      },
    };

    this.flowManager = new FlowManager(new StartGameFlow());
    void this.flowManager.start(ctx);
    this.isRunning = true;
  }

  public destroy(): void {
    if (!this.isRunning) {
      return;
    }

    this.isRunning = false;
  }
}
