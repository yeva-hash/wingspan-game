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
import foodsJson from "../../data/foods.json";
import { BirdOfferView } from "../game/views/BirdOfferView";
import { BirdOfferedController } from "../game/controllers/BirdOfferedController";
import { Area, BirdDefinition, FoodDefinition } from "../game/types/resourceTypes";
import { BirdSupplyStore } from "../game/stores/BirdSupplyStore";
import { BirdCatalog } from "../catalogs/BirdCatalog";
import { ChooseBirdUseCase } from "../game/useCases/ChooseBirdUseCase";
import { BirdSupplyService } from "../game/services/BirdSupplyService";
import { PlayerResourceService } from "../game/services/PlayerResourceService";
import { BirdPlayRuleService } from "../game/services/BirdPlayRuleService";
import { HabitatService } from "../game/services/HabitatService";
import { HabitatStore } from "../game/stores/habitat/HabitatStore";
import { HabitatController } from "../game/controllers/HabitatController";
import { HabitatAreaView } from "../game/views/habitat/HabitatAreaView";
import { FeederStore } from "../game/stores/FeederStore";
import { FoodCatalog } from "../catalogs/FoodCatalog";
import { FeederService } from "../game/services/FeederService";
import { FeederController } from "../game/controllers/FeederController";
import { FeederView } from "../game/views/FeederView";

const allBirdsFromJson = (birdsJson as { birds: BirdDefinition[] }).birds;
const allFoodsFromJson = (foodsJson as { foods: FoodDefinition[] }).foods;

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
    const foodCatalog = new FoodCatalog(allFoodsFromJson);

    const gameStore = new GameStore(["forest", "steppe", "swamp"]);
    const playerResourcesStore = new PlayerResourceStore();
    const birdSupplyStore = new BirdSupplyStore();
    const habitatStore = new HabitatStore();
    const feederStore = new FeederStore();

    const playerResourceService = new PlayerResourceService(birdCatalog, playerResourcesStore);
    const birdSupplyService = new BirdSupplyService(birdCatalog, birdSupplyStore);
    const birdPlayRuleService = new BirdPlayRuleService(playerResourceService);
    const habitatService = new HabitatService(habitatStore, birdCatalog);
    const feederService = new FeederService(foodCatalog, feederStore);
    
    const chooseBirdUseCase = new ChooseBirdUseCase(birdSupplyService, playerResourceService);
    // const habitatUseCase = new HabitatUseCase(gameStore,habitatService);

    const actionMenuView = new ActionMenuView(layoutService);
    const handView = new HandView(layoutService);
    const birdOfferView = new BirdOfferView(layoutService);
    //TODO
    const habitatAreaViews = new Map<Area, HabitatAreaView>([
      ["forest", new HabitatAreaView("forest", layoutService)],
      ["steppe", new HabitatAreaView("steppe", layoutService)],
      ["swamp", new HabitatAreaView("swamp", layoutService)],
    ]);
    const feederView = new FeederView(layoutService);

    const habitatController = new HabitatController(habitatService, habitatAreaViews);
    const handController = new HandController(playerResourceService, birdPlayRuleService, handView);
    const actionMenuController = new ActionMenuController(actionMenuView);
    const birdOfferedController = new BirdOfferedController(birdOfferView, birdSupplyService);
    const feederController = new FeederController(feederService, feederView);

    return {
      gameApp: this.gameApp,
      stores: { game: gameStore },
      controllers: {
        hand: handController,
        actionMenu: actionMenuController,
        birdOffered: birdOfferedController,
        habitat: habitatController,
        feeder: feederController,
      },
      services: {
        birdSupplyService,
        playerResourceService,
        habitatService,
        feederService
      },
      useCases: {
        chooseBirdUseCase,
      },
    };
  }

}

// Store - хранят данные 
// Services - читают данные из Store и содержат бизнес логику(без мутаций)
// Controllers - берут данные и Services и управляют View
// UseCases - изменяют данные в Store и (посылают события на View(?))
// View - отображают данные и сообщают о событиях
