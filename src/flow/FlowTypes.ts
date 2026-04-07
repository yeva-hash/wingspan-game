import { GameApp } from "../app/gameApp";
import { ActionMenuController } from "../game/controllers/ActionMenuController";
import { BirdOfferedController } from "../game/controllers/BirdOfferedController";
import type { HandController } from "../game/controllers/HandController";
import { BirdsOfferedStore } from "../stores/BirdsOfferedStore";
import { GameStore } from "../stores/GameStore";
import type { PlayerResourceStore } from "../stores/PlayerResourceStore";

export type GameControllers = {
  hand: HandController;
  actionMenu: ActionMenuController;
  birdOffered: BirdOfferedController;
};

export type GameStores = {
  game: GameStore;
  playerResources: PlayerResourceStore;
  birdsOffered: BirdsOfferedStore;
};

export type FlowContext = {
  gameApp: GameApp;
  stores: GameStores;
  controllers: GameControllers;
};

export type FlowState = {
  run(ctx: FlowContext): Promise<FlowState | null>;
};

