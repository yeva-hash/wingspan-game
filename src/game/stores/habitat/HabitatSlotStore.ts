import { PlayedBird } from "../../models/PlayedBird";

export class HabitatSlotStore {
    constructor(
        private readonly _index: number,
        private readonly _rewardCount: number,
        private _bird: PlayedBird | null = null,
    ) {}

    get index(): number {
        return this._index;
    }

    get rewardCount(): number {
        return this._rewardCount;
    }

    get bird(): PlayedBird | null {
        return this._bird;
    }

    get birdId(): string | null {
        return this._bird?.id ?? null;
    }

    get isOccupied(): boolean {
        return this._bird !== null;
    }

    setBird(bird: PlayedBird): void {
        this._bird = bird;
    }

    clearBird(): void {
        this._bird = null;
    }
}
