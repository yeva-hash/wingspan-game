// import birdsJson from "../../data/birds.json";
// import foodsJson from "../../data/foods.json";
import type { BirdDefinition, FoodDefinition } from "../game/types/resourceTypes";
import type { PlayerResourceStore } from "../stores/PlayerResourceStore";

type BirdsFile = { birds: BirdDefinition[] };
type FoodsFile = { foods: FoodDefinition[] };

export class StartGameCommand {
  constructor(private readonly playerStore: PlayerResourceStore) {}

  execute(): void {
    // const birds = (birdsJson as BirdsFile).birds;
    // const foods = (foodsJson as FoodsFile).foods;

    // const startingBirds = pickRandomUnique(birds, 5);
    // this.playerStore.setInitialDeal(startingBirds, foods);
  }
}

// function pickRandomUnique<T>(items: readonly T[], count: number): T[] {
  // const arr = [...items];
  // for (let i = arr.length - 1; i > 0; i--) {
  //   const j = Math.floor(Math.random() * (i + 1));
  //   [arr[i], arr[j]] = [arr[j], arr[i]];
  // }
  // return arr.slice(0, Math.min(count, arr.length));
// }

