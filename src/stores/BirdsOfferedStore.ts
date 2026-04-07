import { Bird } from "../game/models/Bird";
import { BirdDefinition } from "../game/resourceTypes";
import { randomInt } from "../utils/general";

export class BirdsOfferedStore {
    public static readonly initialBirdsOfferedCount = 3;
    private readonly _availableBirds: BirdDefinition[] = [];
    private _offeredBirds: BirdDefinition[] = [];
    constructor(birds: BirdDefinition[] = []) {
        this._availableBirds = birds;
    }

    getAvailableBirds(): readonly BirdDefinition[] {
        return this._availableBirds;
    }

    getRandomAvailableBird(): BirdDefinition {
        const random = this._availableBirds[randomInt(0, this._availableBirds.length - 1)];
        // this.removeBird(random);
        return random;
    }

    getOfferedBirds(): readonly BirdDefinition[] {
        return this._offeredBirds;
    }

    getOfferedBirdById(id: string): BirdDefinition | undefined {
        return this._offeredBirds.find((bird) => bird.name === id);
    }

    updateOfferedBird(bird: BirdDefinition): void {
        if (this._offeredBirds.includes(bird)) {
            this._offeredBirds.splice(this._offeredBirds.indexOf(bird), 1);
            return;
        } 
        this._offeredBirds.push(bird);
    }

    removeBird(bird: BirdDefinition): void {
        this._availableBirds.splice(this._availableBirds.indexOf(bird), 1);
    }
}