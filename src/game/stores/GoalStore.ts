import type { GoalId } from "../../catalogs/GoalCatalog";

export class GoalStore {
    private _selectedGoalIds: GoalId[] = [];
    private _currentGoalIndex = 0;

    getSelectedGoalIds(): readonly GoalId[] {
        return this._selectedGoalIds;
    }

    setSelectedGoalIds(goalIds: GoalId[]): void {
        this._selectedGoalIds = [...goalIds];
        this._currentGoalIndex = 0;
    }

    getCurrentGoalIndex(): number {
        return this._currentGoalIndex;
    }

    setCurrentGoalIndex(index: number): void {
        if (index < 0 || index >= this._selectedGoalIds.length) {
            throw new Error(`Goal index out of range: ${index}`);
        }

        this._currentGoalIndex = index;
    }

    getCurrentGoalId(): GoalId | null {
        return this._selectedGoalIds[this._currentGoalIndex] ?? null;
    }

    clear(): void {
        this._selectedGoalIds = [];
        this._currentGoalIndex = 0;
    }
}
