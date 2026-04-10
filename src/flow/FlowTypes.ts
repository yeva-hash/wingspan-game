import { GameApp } from "../app/gameApp";
import { ActionMenuController } from "../game/controllers/ActionMenuController";
import { BirdOfferedController } from "../game/controllers/BirdOfferedController";
import type { HandController } from "../game/controllers/HandController";
import { BirdSupplyService } from "../game/services/BirdSupplyService";
import { ChooseBirdUseCase } from "../game/useCases/ChooseBirdUseCase";
import { PlayerResourceService } from "../game/services/PlayerResourceService";
import { BirdSupplyStore } from "../game/stores/BirdSupplyStore";
import { GameStore } from "../game/stores/GameStore";
import type { PlayerResourceStore } from "../game/stores/PlayerResourceStore";
import { HabitatService } from "../game/services/HabitatService";

export type GameControllers = {
  hand: HandController;
  actionMenu: ActionMenuController;
  birdOffered: BirdOfferedController;
};

export type GameStores = {
  game: GameStore;
  // playerResourcesStore: PlayerResourceStore;
  // birdSupplyStore: BirdSupplyStore;
};

export type FlowContext = {
  gameApp: GameApp;
  stores: GameStores;
  controllers: GameControllers;
  services: GameServices;
  useCases: GameUseCases;
};

export type GameServices = {
  birdSupplyService: BirdSupplyService;
  playerResourceService: PlayerResourceService,
  habitatService: HabitatService;
};

export type GameUseCases = {
  chooseBirdUseCase: ChooseBirdUseCase;
};

export type FlowState = {
  run(ctx: FlowContext): Promise<FlowState | null>;
};

