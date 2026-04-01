import { FlowManager } from "../flow/FlowManager";
import type { FlowContext } from "../flow/FlowTypes";
import { StartGameFlow } from "../flow/StartGameFlow";
import { HandController } from "../game/controllers/HandController";
import { ActionMenuController } from "../game/controllers/ActionMenuController";
import { PlayerResourceStore } from "../stores/PlayerResourceStore";
import { ActionMenuView } from "../game/views/ActionMenuView";
import { HandView } from "../game/views/HandView";
import { GameApp } from "../app/gameApp";
import { GameStore } from "../stores/GameStore";
import { HandSelectionManager } from "../game/managers/HandSelectionManager";
import birdsJson from "../../data/birds.json";
import foodsJson from "../../data/foods.json";
import type { BirdDefinition, FoodDefinition } from "../game/resourceTypes";

const birds = (birdsJson as { birds: BirdDefinition[] }).birds;
const foods = (foodsJson as { foods: FoodDefinition[] }).foods;

export class GameScene {
  private isRunning = false;
  private flowManager?: FlowManager;

  constructor(private readonly gameApp: GameApp) {}

  public start(): void {
    if (this.isRunning) {
      return;
    }

    const { layoutService } = this.gameApp;

    const gameStore = new GameStore();
    const playerResources = new PlayerResourceStore();
    playerResources.setInitialDeal(
      [birds[0], birds[3], birds[4]],
      [foods[3], foods[4]]
    );
    gameStore.addArea("forest");
    gameStore.addArea("steppe");    
    gameStore.addArea("swamp");

    const handSelectionManager = new HandSelectionManager(playerResources);

    const actionMenuView = new ActionMenuView(layoutService);
    const handView = new HandView(layoutService);

    const handController = new HandController(playerResources, handView, handSelectionManager);
    const actionMenuController = new ActionMenuController(actionMenuView);

    handController.renderAreas(gameStore.getAreas());

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
