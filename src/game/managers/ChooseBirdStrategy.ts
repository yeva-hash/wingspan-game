import { SelectionStrategy } from "../types/selectionTypes";

export class ChooseBirdStrategy implements SelectionStrategy {
    private _selectedBirdIds: string[] = [];

    constructor(private readonly _selectedCount: number) {}

    get selectedBirdIds(): string[] {
        return this._selectedBirdIds;
    }

    selectBird(birdId: string): void {
        if (this._selectedBirdIds.includes(birdId)) return;
        if (this._selectedBirdIds.length >= this._selectedCount) {
            this._selectedBirdIds.shift();
        }
        this._selectedBirdIds.push(birdId);
    }

    canConfirm(): boolean {
        return this._selectedBirdIds.length === this._selectedCount;
    }

    getMessage(): string { return ""; }

    reset(): void {
        this._selectedBirdIds = [];
    }
}