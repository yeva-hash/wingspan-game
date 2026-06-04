# Wingspan Lite Prototype

Wingspan Lite Prototype is a small browser-based prototype inspired by the
existing board game Wingspan. It is built with TypeScript, Vite, and PixiJS.

The project is not a complete implementation of Wingspan. It focuses on a
simplified playable core: showing the board, choosing actions, playing bird
cards, gaining food, placing eggs, and drawing birds from a public offer.

This is a fan-made educational project and is not an official digital version
of Wingspan.

## Current Scope

The current version is closer to a gameplay prototype than to a finished game.
It has several connected systems, but many rules are simplified and some parts
are still placeholder-quality.

The prototype currently includes:

- a PixiJS-rendered board UI;
- a JSON-based layout loaded from `layout.json`;
- bird and food data loaded from JSON files;
- an initial public bird offer;
- a hardcoded starting hand and starting food supply;
- an action menu;
- a repeating action flow with rounds and remaining action counters;
- playing a bird from the hand into a habitat;
- food cost validation and spending when playing birds;
- gaining food from the feeder;
- placing eggs on birds that are already on the board;
- choosing birds from the public offer and refilling the offer;
- basic round goal display.

## What Is Simplified

This prototype does not yet represent the full board game. Important
simplifications and missing parts include:

- no full Wingspan rule set;
- no final scoring flow;
- no bird powers or card effects;
- no complete player setup flow;
- starting hand and food are hardcoded in code;
- bird cards use simple prototype visuals;
- some UI feedback and error states are still rough;
- no automated tests yet.

## Tech Stack

- TypeScript
- Vite
- PixiJS
- GSAP
- JSON for game data and layout configuration

## Running the Project

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build the production bundle:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Project Structure

```text
assets/                 Assets and PixiJS manifest
data/                   Bird, food, and goal data
src/app/                Pixi application initialization
src/catalogs/           Data catalogs
src/flow/               High-level game flow
src/game/controllers/   Coordination between logic and views
src/game/services/      Gameplay rules, queries, and validation
src/game/stores/        Game state stores
src/game/useCases/      Multi-step gameplay state changes
src/game/views/         PixiJS views
src/layout/             Interface construction from layout.json
src/localStates/        Individual player action states
src/scene/              Game scene assembly
```

## Main Data Files

- `data/birds.json` - bird definitions, food costs, and available habitats.
- `data/foods.json` - food type definitions.
- `data/goals.json` - round goal definitions.
- `layout.json` - declarative interface layout.
- `assets/assets-manifest.json` - PixiJS asset bundles.

## Architecture

The project is split into several layers:

- stores keep mutable game state;
- services provide gameplay rules, validation, and queries;
- controllers connect player input with gameplay logic;
- views handle PixiJS rendering;
- use cases perform multi-step changes to game state;
- flows and local states manage the sequence of player actions.

This structure keeps rendering, state, and gameplay rules mostly separate while
the prototype grows.

## Roadmap

- Replace hardcoded setup with a real start-game setup flow.
- Add bird powers and more card effects.
- Improve card and board visuals.
- Add final scoring.
- Add stronger UI feedback for invalid actions.
- Add tests around services and use cases.

## Note

Wingspan is an existing board game. This repository is a simplified,
educational prototype inspired by some of its ideas and mechanics. It is not a
full copy, official adaptation, or commercial product.
