import { FeederSelectionStrategy } from "../../types/selectionTypes";

export class ChooseFoodStrategy implements FeederSelectionStrategy {
    private _selectedFoodIndexes: number[] = [];

    constructor(private readonly _selectedCount: number) {}

    get selectedFoodIndexes(): number[] {
        return this._selectedFoodIndexes;
    }

    selectFood(slotIndex: number): void {
        if (this._selectedFoodIndexes.includes(slotIndex)) return;
        if (this._selectedFoodIndexes.length >= this._selectedCount) {
            this._selectedFoodIndexes.shift();
        }
        this._selectedFoodIndexes.push(slotIndex);
    }

    canConfirm(): boolean {
        return this._selectedFoodIndexes.length === this._selectedCount;
    }

    reset(): void {
        this._selectedFoodIndexes = [];
    }
}
