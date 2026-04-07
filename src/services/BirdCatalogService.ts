import birdsJson from "../../data/birds.json";
import type { BirdDefinition } from "../game/types/resourceTypes";

type BirdsFile = {
  birds: BirdDefinition[];
};

export class BirdCatalogService {
  private readonly birds: BirdDefinition[];

  constructor(data?: BirdsFile) {
    const file = data ?? (birdsJson as BirdsFile);
    this.birds = file.birds;
  }

  getAll(): readonly BirdDefinition[] {
    return this.birds;
  }

  getById(id: string): BirdDefinition | undefined {
    return this.birds.find((b) => b.id === id);
  }

  /** Random birds without duplicates (for a starting hand of 5). */
  pickRandomUnique(count: number): BirdDefinition[] {
    const shuffled = this.shuffle([...this.birds]);
    const n = Math.min(count, shuffled.length);
    return shuffled.slice(0, n);
  }

  private shuffle<T>(items: T[]): T[] {
    const arr = [...items];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
}
