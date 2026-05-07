import { GameApp } from "../app/GameApp";
import { ActionMenuController } from "../game/controllers/ActionMenuController";
import { BirdOfferedController } from "../game/controllers/BirdOfferedController";
import { HabitatController } from "../game/controllers/HabitatController";
import type { HandController } from "../game/controllers/HandController";
import { BirdSupplyService } from "../game/services/BirdSupplyService";
import { ChooseBirdUseCase } from "../game/useCases/ChooseBirdUseCase";
import { PlayerResourceService } from "../game/services/PlayerResourceService";
import { GameStore } from "../game/stores/GameStore";
import { HabitatService } from "../game/services/HabitatService";
import { FeederController } from "../game/controllers/FeederController";
import { FeederService } from "../game/services/FeederService";
import { GainFoodUseCase } from "../game/useCases/GainFoodUseCase";
import { PlayBirdUseCase } from "../game/useCases/PlayBirdUseCase";
import { CancelButtonController } from "../game/controllers/CancelButtonController";
import { DimmerController } from "../game/controllers/DimmerController";

export type GameControllers = {
  hand: HandController;
  actionMenu: ActionMenuController;
  birdOffered: BirdOfferedController;
  habitat: HabitatController;
  feeder: FeederController;
  cancelButton: CancelButtonController;
  dimmer: DimmerController;
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
  feederService: FeederService;
};

export type GameUseCases = {
  chooseBirdUseCase: ChooseBirdUseCase;
  gainFoodUseCase: GainFoodUseCase;
  playBirdUseCase: PlayBirdUseCase;
};

export type FlowState = {
  run(ctx: FlowContext): Promise<FlowState | null>;
};
