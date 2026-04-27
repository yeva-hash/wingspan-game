# Claude Code Project Memory

See @package.json for npm scripts and @layout.json for the current board layout contract used by the views.

## Project Summary

- This repository is a TypeScript + Vite + PixiJS prototype of a bird-themed board game.
- The project is still a prototype, but it now has a functioning continuous action loop rather than a single-action demo.
- The main playable actions are:
  play a bird from hand into a habitat,
  take food from the feeder,
  place eggs on already-played birds,
  choose birds from the public offer or from a random deck draw.
- Core gameplay is wired end to end through stores, services, controllers, local states, and use cases.
- Game setup is still partly hardcoded in `StartGameFlow` and there is still no full turn/round economy, scoring, or automated tests.

## Run Commands

- Install dependencies: `npm install`
- Start dev server: `npm run dev`
- Build production bundle: `npm run build`
- Preview production build: `npm run preview`

## Current Architecture

- `src/main.ts`
  Loads `layout.json`, creates `GameApp`, and starts `GameScene`.

- `src/app/GameApp.ts`
  Boots Pixi, mounts the canvas, loads the asset manifest, and exposes `LayoutService`.

- `src/scene/GameScene.ts`
  Builds the full runtime dependency graph for a play session:
  catalogs -> stores -> services -> use cases -> views -> controllers -> flow manager.

- `src/flow/`
  Top-level game flow.
  `StartGameFlow` resets supplies, seeds the feeder and initial player resources, and hands control to `ChooseActionFlow`.
  `ChooseActionFlow` loops forever by returning a new instance of itself after each completed action.
  `FlowManager` runs flow states sequentially until one returns `null`.

- `src/localStates/`
  Per-action interaction sequences.
  `PlayingBirdState`, `GainFoodState`, `GainEggsState`, and `ChooseBirdState` are all active and wired into the action menu.

- `src/game/stores/`
  Mutable source-of-truth state.
  Important stores are:
  `PlayerResourceStore`,
  `BirdSupplyStore`,
  `FeederStore`,
  `HabitatStore`.
  `GameStore` is currently lightweight and only carries the list of active areas.

- `src/game/services/`
  Read/query logic plus focused gameplay rules over stores.
  Notable services:
  `BirdSupplyService` manages deck + public offer,
  `FeederService` manages feeder slots,
  `HabitatService` manages habitat slots, rewards, and egg placement,
  `PlayerResourceService` reads and mutates the player hand/foods,
  `BirdPlayRuleService` validates whether a selected bird can be played.

- `src/game/useCases/`
  Multi-step mutations spanning multiple services.
  `ChooseBirdUseCase`, `GainFoodUseCase`, and `PlayBirdUseCase` are active patterns worth following for new gameplay mutations.

- `src/game/controllers/`
  Orchestrate user interaction between services and Pixi views.
  Controllers commonly use deferred promises plus callback swapping to wait for UI input.

- `src/game/strategy/selectionStrategy/`
  UI selection rules are encapsulated as strategies.
  `PlayBirdStrategy`, `ChooseBirdStrategy`, `ChooseFoodStrategy`, and `ReadOnlyStrategy` control selection/confirm behavior without pushing that logic into views.

- `src/game/views/`
  Pixi rendering and interaction surfaces.
  Most views depend on named nodes from `layout.json` through `LayoutService`.

## Layout And Assets

- `layout.json` is the board/UI contract.
- `src/layout/LayoutBuilder.ts` builds Pixi display objects from the JSON layout.
- `src/layout/LayoutService.ts` stores named nodes for later lookup.
- Most UI wiring depends on exact layout node names. If a node id changes in `layout.json`, update every matching `layoutService.get(...)` usage.
- `assets/assets-manifest.json` controls Pixi asset bundle loading.

## Data Files

- `data/birds.json`
  Bird definitions, allowed habitats, egg limits, and required foods.

- `data/foods.json`
  Food definitions and textures.

## Gameplay That Currently Works

- New game setup resets the bird offer and feeder.
- The initial hand and initial food pool are assigned in `StartGameFlow`.
- The action menu loops continuously after each action.
- Playing a bird:
  the hand UI renders birds and food,
  playable habitats are highlighted via rule checks,
  the chosen bird is removed from the hand,
  required food is spent,
  the bird is placed into the first free slot in the selected habitat.
- Choosing birds:
  reward count comes from the swamp habitat progression,
  birds can be taken from the public offer,
  `"random"` selections are resolved from the deck,
  the public offer is refilled after selection.
- Gaining food:
  reward count comes from the forest habitat progression,
  feeder selection is interactive,
  selected feeder slots are emptied,
  food is added to player resources.
- Gaining eggs:
  reward count comes from the steppe habitat progression,
  only occupied bird slots that can still hold eggs are selectable,
  egg placement updates the bird model and the habitat view.

## Important File Relationships

- `layout.json` <-> `src/layout/LayoutBuilder.ts` <-> `src/layout/LayoutService.ts`
- `data/birds.json` <-> `src/catalogs/BirdCatalog.ts`
- `data/foods.json` <-> `src/catalogs/FoodCatalog.ts`
- `src/game/stores/*` <-> `src/game/services/*`
- `src/game/services/*` <-> `src/game/useCases/*`
- `src/game/services/*` + `src/game/views/*` <-> `src/game/controllers/*`
- `src/flow/*` + `src/localStates/*` coordinate player-visible game progression

## Current Gaps

- `StartGameFlow` still hardcodes the opening birds and food instead of using a dedicated setup use case or real setup rules.
- `GameStore` does not yet represent rounds, turns, players, scoring, or action limits.
- Reward areas are still hardcoded inside local states:
  forest for food,
  steppe for eggs,
  swamp for bird draw.
- Several files still contain TODOs around visual feedback, rendering optimization, and architecture cleanup.
- Views are functional but still prototype-level in visuals and some interaction polish.
- No automated tests are present.

## Editing Guidance

- Preserve the existing layering.
  Keep raw state in stores, read/rule logic in services, multi-step mutations in use cases, orchestration in controllers/local states, and rendering in views.

- Prefer adding gameplay mutations as new or expanded use cases.
  Avoid burying cross-store mutations directly inside views or controllers.

- When changing selection behavior, look in `src/game/strategy/selectionStrategy/` first.
  A new strategy is usually cleaner than adding conditionals throughout a controller.

- Keep `layout.json` and view lookup names synchronized.
  A renamed node can silently break UI initialization.

- Avoid editing `dist/` or `node_modules/`.
  Source of truth is under `src/`, `data/`, `assets/`, and `layout.json`.

- `UIController.ts` still appears unused/experimental.
  Confirm whether it should be revived before building new logic around it.

## Good Next Tasks For Claude Code

- Move initial game setup out of `StartGameFlow` into a dedicated use case.
- Replace hardcoded reward-area assumptions in local states with explicit action/rule configuration.
- Add turn, round, or player progression state to `GameStore` and the top-level flow.
- Add lightweight tests around services and use cases, especially bird play, feeder selection, and egg placement.
- Improve error/edge-case feedback when an action has no valid targets.
