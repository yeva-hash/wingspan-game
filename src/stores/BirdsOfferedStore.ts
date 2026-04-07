import { BirdDefinition } from "../game/types/resourceTypes";
import { randomInt } from "../utils/general";

export class BirdsOfferedStore {
    public static readonly initialBirdsOfferedCount = 3;
    private readonly _availableBirds: BirdDefinition[] = [];
    private _offeredBirds: BirdDefinition[] = [];

    constructor(birds: BirdDefinition[] = []) {
        this._availableBirds = [...birds];
    }

    getRandomAvailableBird(): BirdDefinition {
        if (this._availableBirds.length === 0) {
            throw new Error("No available birds");
        }
        return this._availableBirds[randomInt(0, this._availableBirds.length - 1)];
    }

    removeFromAvailable(bird: BirdDefinition): void {
        const index = this._availableBirds.indexOf(bird);
        if (index === -1) {
            throw new Error("Bird not found in available");
        }
        this._availableBirds.splice(index, 1);
    }

    getOfferedBirds(): readonly BirdDefinition[] {
        return this._offeredBirds;
    }

    getOfferedBirdById(id: string): BirdDefinition | undefined {
        return this._offeredBirds.find((bird) => bird.name === id);
    }

    setOfferedBirds(birds: BirdDefinition[]): void {
        this._offeredBirds = [...birds];
    }

    replaceOfferedBird(oldBird: BirdDefinition, newBird: BirdDefinition): void {
        const index = this._offeredBirds.indexOf(oldBird);
        if (index === -1) {
            throw new Error("Bird not found in offered");
        }
        this._offeredBirds[index] = newBird;
    }
}