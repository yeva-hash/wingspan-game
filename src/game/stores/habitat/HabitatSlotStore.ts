export class HabitatSlotStore {
    constructor(
        private readonly _index: number,
        private readonly _rewardCount: number,
        private _birdId: string | null = null,
    ) {}

    get index(): number {
        return this._index;
    }

    get rewardCount(): number {
        return this._rewardCount;
    }

    get birdId(): string | null {
        return this._birdId;
    }

    get isOccupied(): boolean {
        return this._birdId !== null;
    }

    setBirdId(birdId: string): void {
        this._birdId = birdId;
    }

    clearBird(): void {
        this._birdId = null;
    }
}
