export class RoundStore {
    private _currentRoundIndex = 0;
    private _remainingActions = 0;

    getCurrentRoundIndex(): number {
        return this._currentRoundIndex;
    }

    setCurrentRoundIndex(roundIndex: number): void {
        if (roundIndex < 0) {
            throw new Error(`Round index cannot be negative: ${roundIndex}`);
        }

        this._currentRoundIndex = roundIndex;
    }

    getRemainingActions(): number {
        return this._remainingActions;
    }

    setRemainingActions(remainingActions: number): void {
        if (remainingActions < 0) {
            throw new Error(`Remaining actions cannot be negative: ${remainingActions}`);
        }

        this._remainingActions = remainingActions;
    }
}
