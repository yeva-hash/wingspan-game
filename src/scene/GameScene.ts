import { FlowManager } from "../flow/FlowManager";
import type { FlowContext } from "../flow/FlowTypes";
import { StartGameFlow } from "../flow/StartGameFlow";
import { HandController } from "../game/controllers/HandController";
import { ActionMenuController } from "../game/controllers/ActionMenuController";
import { PlayerResourceStore } from "../game/stores/PlayerResourceStore";
import { ActionMenuView } from "../game/views/ActionMenuView";
import { HandView } from "../game/views/HandView";
import { GameApp } from "../app/gameApp";
import { GameStore } from "../game/stores/GameStore";
import birdsJson from "../../data/birds.json";
import { BirdOfferView } from "../game/views/BirdOfferView";
import { BirdOfferedController } from "../game/controllers/BirdOfferedController";
import { Area, BirdDefinition } from "../game/types/resourceTypes";
import { BirdSupplyStore } from "../game/stores/BirdSupplyStore";
import { BirdCatalog } from "../catalogs/BirdCatalog";
import { ChooseBirdUseCase } from "../game/useCases/ChooseBirdUseCase";
import { BirdSupplyService } from "../game/services/BirdSupplyService";
import { PlayerResourceService } from "../game/services/PlayerResourceService";
import { BirdPlayRuleService } from "../game/services/BirdPlayRuleService";
import { HabitatService } from "../game/services/HabitatService";
import { EHabitatResourceType, HabitatStore } from "../game/stores/habitat/HabitatStore";

const allBirdsFromJson = (birdsJson as { birds: BirdDefinition[] }).birds;

export class GameScene {
  private isRunning = false;
  private flowManager?: FlowManager;

  constructor(private readonly gameApp: GameApp) {}

  public start(): void {
    if (this.isRunning) {
      return;
    }

    const ctx = this.initialize();

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

  private initialize(): FlowContext {
    const { layoutService } = this.gameApp;

    const birdCatalog = new BirdCatalog(allBirdsFromJson);

    const gameStore = new GameStore(["forest", "steppe", "swamp"]);
    const playerResourcesStore = new PlayerResourceStore();
    const birdSupplyStore = new BirdSupplyStore();
    const habitatStores = this.initializeHabitat();

    const playerResourceService = new PlayerResourceService(birdCatalog, playerResourcesStore);
    const birdSupplyService = new BirdSupplyService(birdCatalog, birdSupplyStore);
    const birdPlayRuleService = new BirdPlayRuleService(playerResourceService);
    const habitatService = new HabitatService(habitatStores);
    
    const chooseBirdUseCase = new ChooseBirdUseCase(birdSupplyService, playerResourceService);
    // const habitatUseCase = new HabitatUseCase(gameStore,habitatService);

    const actionMenuView = new ActionMenuView(layoutService);
    const handView = new HandView(layoutService);
    const birdOfferView = new BirdOfferView(layoutService);

    const handController = new HandController(playerResourceService, birdPlayRuleService, handView);
    const actionMenuController = new ActionMenuController(actionMenuView);
    const birdOfferedController = new BirdOfferedController(birdOfferView, birdSupplyService);

    return {
      gameApp: this.gameApp,
      stores: { game: gameStore },
      controllers: {
        hand: handController,
        actionMenu: actionMenuController,
        birdOffered: birdOfferedController,
      },
      services: {
        birdSupplyService,
        playerResourceService,
        habitatService
      },
      useCases: {
        chooseBirdUseCase,
        //TODO use case?
        // habitatUseCase
      },
    };
  }

  private initializeHabitat(): Map<Area, HabitatStore> {
    const map = new Map<Area, HabitatStore>();
    map.set("forest", new HabitatStore("forest", EHabitatResourceType.Food));
    map.set("steppe", new HabitatStore("steppe", EHabitatResourceType.Eggs)); 
    map.set("swamp", new HabitatStore("swamp", EHabitatResourceType.Birds));
    return map;
  }
}

// Store - хранят данные 
// Services - читают данные из Store и содержат бизнес логику(без мутаций)
// Controllers - берут данные и Services и управляют View
// UseCases - изменяют данные в Store и (посылают события на View(?))
// View - отображают данные и сообщают о событиях
