export class HabitatSlotStore {
    private _birdId: string | null = null;
    public get isActive(): boolean {
        return this._birdId !== null;
    }
    getCount(): number {
        return this._count;
    }

    constructor(private readonly _count: number) {}
}