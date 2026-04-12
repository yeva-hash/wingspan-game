import { GameApp } from "../app/gameApp";
import { ActionMenuController } from "../game/controllers/ActionMenuController";
import { BirdOfferedController } from "../game/controllers/BirdOfferedController";
import { HabitatController } from "../game/controllers/HabitatController";
import type { HandController } from "../game/controllers/HandController";
import { BirdSupplyService } from "../game/services/BirdSupplyService";
import { ChooseBirdUseCase } from "../game/useCases/ChooseBirdUseCase";
import { PlayerResourceService } from "../game/services/PlayerResourceService";
import { GameStore } from "../game/stores/GameStore";
import { HabitatService } from "../game/services/HabitatService";

export type GameControllers = {
  hand: HandController;
  actionMenu: ActionMenuController;
  birdOffered: BirdOfferedController;
  habitat: HabitatController;
};

export type GameStores = {
  game: GameStore;
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
