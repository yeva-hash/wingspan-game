import { RoundStore } from "../stores/RoundStore";

export type CompleteActionResult = {
    roundEnded: boolean;
    gameEnded: boolean;
};

export class RoundService {
    public static readonly totalRounds = 4;
    public static readonly firstRoundActions = 6;

    constructor(
        private readonly _store: RoundStore,
        private readonly _totalRounds = RoundService.totalRounds,
        private readonly _firstRoundActions = RoundService.firstRoundActions,
    ) {}

    resetForNewGame(): void {
        this._store.setCurrentRoundIndex(0);
        this._store.setRemainingActions(this.getActionsForRound(0));
    }

    completeAction(): CompleteActionResult {
        const remainingActions = this._store.getRemainingActions();
        if (remainingActions <= 0) {
            return { roundEnded: true, gameEnded: this.isLastRound() };
        }

        const nextRemainingActions = remainingActions - 1;
        this._store.setRemainingActions(nextRemainingActions);

        if (nextRemainingActions > 0) {
            return { roundEnded: false, gameEnded: false };
        }

        if (this.isLastRound()) {
            return { roundEnded: true, gameEnded: true };
        }

        const nextRoundIndex = this._store.getCurrentRoundIndex() + 1;
        this._store.setCurrentRoundIndex(nextRoundIndex);
        this._store.setRemainingActions(this.getActionsForRound(nextRoundIndex));

        return { roundEnded: true, gameEnded: false };
    }

    getCurrentRoundIndex(): number {
        return this._store.getCurrentRoundIndex();
    }

    getCurrentRoundNumber(): number {
        return this.getCurrentRoundIndex() + 1;
    }

    getRemainingActions(): number {
        return this._store.getRemainingActions();
    }

    getTotalRounds(): number {
        return this._totalRounds;
    }

    private getActionsForRound(roundIndex: number): number {
        return Math.max(this._firstRoundActions - roundIndex, 0);
    }

    private isLastRound(): boolean {
        return this._store.getCurrentRoundIndex() >= this._totalRounds - 1;
    }
}
