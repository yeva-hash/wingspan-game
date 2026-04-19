# Claude Code Project Memory

See @README.md for the full project overview and @package.json for the available npm scripts.

## Project Summary

- This repository is a TypeScript + Vite + PixiJS board-game prototype centered on bird cards, habitats, food tokens, and turn actions.
- The current implementation is a gameplay foundation, not a finished game.
- The strongest existing flow is playing a bird from the hand into a habitat.
- Bird selection from the public offer is partially implemented.
- `GainFoodState` and `GainEggsState` are not finished.

## Run Commands

- Install dependencies: `npm install`
- Start dev server: `npm run dev`
- Build production bundle: `npm run build`
- Preview production build: `npm run preview`

## Core Architecture

- `src/main.ts`
  Bootstraps the app, loads `layout.json`, creates `GameApp`, and starts `GameScene`.

- `src/app/GameApp.ts`
  Initializes the Pixi application, mounts the canvas, loads asset bundles, and builds the scene from JSON layout data.

- `src/scene/GameScene.ts`
  Composes the runtime graph:
  stores -> services -> views -> controllers -> flows/use cases.

- `src/flow/`
  High-level session flow.
  `StartGameFlow` prepares the initial state.
  `ChooseActionFlow` waits for one action and delegates to a local state.

- `src/localStates/`
  Focused user interaction sequences.
  `PlayingBirdState` is the most complete one.
  `ChooseBirdState` works with the bird offer.
  `GainFoodState` and `GainEggsState` are placeholders/incomplete.

- `src/game/stores/`
  Mutable gameplay state.
  Treat stores as the source of truth.

- `src/game/services/`
  Rule and query layer over stores.
  Keep validation and gameplay logic here when possible.

- `src/game/controllers/`
  Connect services and views.
  Controllers handle interaction orchestration, not low-level data storage.

- `src/game/views/`
  Pixi display and interaction code.
  Most views depend on `LayoutService` names defined in `layout.json`.

- `src/game/useCases/`
  Multi-step state mutations.
  `ChooseBirdUseCase` is the clearest example of the intended pattern.

## Layout System

- The board UI is declared in `layout.json`.
- `LayoutBuilder` converts JSON nodes into Pixi `Container`, `Sprite`, and `Text` objects.
- `LayoutService` stores named layout nodes for later lookup.
- If you rename layout node IDs in `layout.json`, update every matching `layoutService.get(...)` call.
- Prefer extending the JSON layout and existing view bindings instead of hardcoding positions in unrelated files.

## Data Files

- `data/birds.json`
  Bird definitions, allowed habitats, and required foods.

- `data/foods.json`
  Food definitions and textures.

- `assets/assets-manifest.json`
  Pixi asset bundles.

## Gameplay Rules Already Encoded

- Bird cost validation lives in `BirdPlayRuleService`.
- Bird placement availability lives in `HabitatService`.
- Bird deck + public offer behavior lives in `BirdSupplyService`.
- The initial hand is currently hardcoded in `StartGameFlow`.
- Habitat reward counts are currently reused to determine action strength.
  Forest drives food-gain count.
  Swamp drives choose-bird count.

## Important File Relationships

- `layout.json` <-> `src/layout/LayoutBuilder.ts` <-> `src/layout/LayoutService.ts`
- `data/birds.json` <-> `src/catalogs/BirdCatalog.ts`
- `data/foods.json` <-> `src/catalogs/FoodCatalog.ts`
- `src/game/stores/*` <-> `src/game/services/*`
- `src/game/services/*` <-> `src/game/controllers/*`
- `src/game/controllers/*` <-> `src/game/views/*`
- `src/flow/*` and `src/localStates/*` coordinate user-visible game progression

## Current Implementation Status

- Completed enough to inspect and extend:
  app bootstrap, asset loading, layout construction, action menu, bird offer rendering, hand rendering, bird placement, habitat slot placement, feeder population.

- Not complete:
  repeated turn loop, food selection resolution, egg gain resolution, broader game progression, tests, production-ready card visuals.

## Editing Guidance

- Preserve the layered architecture.
  Prefer putting mutations in use cases or clearly scoped services instead of burying them in views.

- Keep `layout.json` and view lookup names in sync.
  Many UI elements are found by string key.

- Avoid editing `dist/` or `node_modules/`.
  Source of truth is under `src/`, `data/`, `assets/`, and `layout.json`.

- When adding new gameplay actions:
  update the local state first,
  add or extend service logic,
  then wire controller/view behavior.

- When adding new UI:
  prefer defining a named node in `layout.json` and retrieving it through `LayoutService`.

- `UIController.ts` looks unused/experimental.
  Confirm before investing in it as an active pattern.

## Known Gaps And Cautions

- `ChooseActionFlow` currently returns `null` after one action, so the main flow does not continue into a full turn loop yet.
- Several files contain `TODO` markers and prototype shortcuts.
- Some rendering code is still placeholder-quality and favors simple shapes/text over final art.
- The feeder has rendering support and randomization, but the full player interaction loop is not complete.

## Good Next Tasks For Claude Code

- Finish `GainFoodState` by wiring feeder selection and reward resolution end to end.
- Implement `GainEggsState`.
- Turn `ChooseActionFlow` into a repeatable action loop or round loop.
- Move more multi-step mutations into dedicated use cases.
- Add lightweight tests around services and use cases.
