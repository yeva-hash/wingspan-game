import { GoalCatalog } from "../../catalogs/GoalCatalog";
import type { GoalDefinition } from "../types/goalTypes";
import { GoalStore } from "../stores/GoalStore";

export class GoalService {
    public static readonly goalsPerGame = 4;

    constructor(
        private readonly _catalog: GoalCatalog,
        private readonly _store: GoalStore,
        private readonly _goalsPerGame = GoalService.goalsPerGame,
    ) {}

    resetForNewGame(count: number = this._goalsPerGame): void {
        const goalIds = this.shuffle(this._catalog.getAllIds()).slice(0, count);
        this._store.setSelectedGoalIds(goalIds);
    }


    getCurrentGoal(): GoalDefinition | null {
        const goalId = this._store.getCurrentGoalId();
        return goalId ? this._catalog.getById(goalId) : null;
    }

    setCurrentGoalByRoundIndex(roundIndex: number): void {
        this._store.setCurrentGoalIndex(roundIndex);
    }

    private shuffle<T>(items: readonly T[]): T[] {
        return [...items].sort(() => Math.random() - 0.5);
    }
}
