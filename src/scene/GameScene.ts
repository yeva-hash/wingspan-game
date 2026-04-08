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
import birdsJson from "../../data/birds.json";
import { BirdOfferView } from "../game/views/BirdOfferView";
import { BirdsOfferedStore } from "../stores/BirdsOfferedStore";
import { BirdOfferedController } from "../game/controllers/BirdOfferedController";
import { BirdDefinition } from "../game/types/resourceTypes";

const birds = (birdsJson as { birds: BirdDefinition[] }).birds;

export class GameScene {
  private isRunning = false;
  private flowManager?: FlowManager;

  constructor(private readonly gameApp: GameApp) {}

  public start(): void {
    if (this.isRunning) {
      return;
    }

    const { layoutService } = this.gameApp;

    const gameStore = new GameStore(["forest", "steppe", "swamp"]);
    const playerResources = new PlayerResourceStore();
    const birdsOfferedStore = new BirdsOfferedStore(birds);

    const actionMenuView = new ActionMenuView(layoutService);
    const handView = new HandView(layoutService);
    const birdOfferView = new BirdOfferView(layoutService);

    const handController = new HandController(playerResources, handView);
    const actionMenuController = new ActionMenuController(actionMenuView);
    const birdOfferedController = new BirdOfferedController(birdOfferView, birdsOfferedStore);

    const ctx: FlowContext = {
      gameApp: this.gameApp,
      stores: {
        game: gameStore,
        playerResources,
        birdsOffered: birdsOfferedStore,
      },
      controllers: {
        hand: handController,
        actionMenu: actionMenuController,
        birdOffered: birdOfferedController,
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
