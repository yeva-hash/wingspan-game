export class BirdSelectionManager {
    private _selectedCount = 0;
    private _selectedBirdIds: string[] = [];

    get selectedCount(): number {
        return this._selectedCount;
    }

    get selectedBirdIds(): string[] {
        return this._selectedBirdIds;
    }

    constructor() {}

    reset(): void {
        this._selectedCount = 0;
        this._selectedBirdIds = [];
    }

    selectBird(birdId: string): void {
        if (this._selectedBirdIds.includes(birdId)) {
            return;
        }
        if (this._selectedBirdIds.length >= this._selectedCount) {
            this._selectedBirdIds.shift();
        }
        this._selectedBirdIds.push(birdId);
    }

    setSelectedCount(count: number): void {
        this._selectedCount = count;
    }
    
    canConfirm(): boolean {
        return this._selectedBirdIds.length === this._selectedCount;
    }
}