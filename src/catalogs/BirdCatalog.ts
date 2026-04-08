import { BirdDefinition } from "../game/types/resourceTypes";

export type BirdId = string;

export class BirdCatalog {
    private readonly _birdsById = new Map<BirdId, BirdDefinition>();

    constructor(birds: BirdDefinition[]) {
        for (const bird of birds) {
            const birdId = bird.name;

            if (this._birdsById.has(birdId)) {
                throw new Error(`Duplicate bird id: ${birdId}`);
            }

            this._birdsById.set(birdId, bird);
        }
    }

    getById(id: BirdId): BirdDefinition {
        const bird = this._birdsById.get(id);
        if (!bird) {
            throw new Error(`Bird not found: ${id}`);
        }
        return bird;
    }

    has(id: BirdId): boolean {
        return this._birdsById.has(id);
    }

    getAllIds(): BirdId[] {
        return [...this._birdsById.keys()];
    }

    getAll(): BirdDefinition[] {
        return [...this._birdsById.values()];
    }
}