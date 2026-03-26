import { GameApp } from "../app/gameApp";
import { ActionMenuController } from "../game/controllers/ActionMenuController";
import type { HandController } from "../game/controllers/HandController";
import type { PlayerResourceStore } from "../stores/PlayerResourceStore";

export type GameControllers = {
  hand: HandController;
  actionMenu: ActionMenuController;
};

export type GameStores = {
  playerResources: PlayerResourceStore;
};

export type FlowContext = {
  gameApp: GameApp;
  stores: GameStores;
  controllers: GameControllers;
};

export type FlowState = {
  run(ctx: FlowContext): Promise<FlowState | null>;
};

