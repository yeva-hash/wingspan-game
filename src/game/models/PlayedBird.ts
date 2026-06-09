import type { BirdDefinition } from "../types/resourceTypes";

export class PlayedBird {
    constructor(
        private readonly _definition: BirdDefinition,
        private _eggCount = 0,
    ) {}

    get id(): string {
        return this._definition.id;
    }

    get definition(): BirdDefinition {
        return this._definition;
    }

    get eggCount(): number {
        return this._eggCount;
    }

    get maxEggCount(): number {
        return this._definition.maxEggCount;
    }

    get canPlaceEgg(): boolean {
        return this._eggCount < this.maxEggCount;
    }

    get canRemoveEgg(): boolean {
        return this._eggCount > 0;
    }

    placeEgg(count = 1): void {
        if (count <= 0) {
            throw new Error("Egg count to place must be positive");
        }

        if (this._eggCount + count > this.maxEggCount) {
            throw new Error(`Bird ${this.id} cannot hold more eggs`);
        }

        this._eggCount += count;
    }

    removeEgg(count = 1): void {
        if (count <= 0) {
            throw new Error("Egg count to remove must be positive");
        }

        if (this._eggCount - count < 0) {
            throw new Error(`Bird ${this.id} does not have enough eggs`);
        }

        this._eggCount -= count;
    }
}
