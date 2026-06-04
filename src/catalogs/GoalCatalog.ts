import type { GoalDefinition } from "../game/types/goalTypes";

export type GoalId = string;

export class GoalCatalog {
    private readonly _goalsById = new Map<GoalId, GoalDefinition>();

    constructor(goals: GoalDefinition[]) {
        for (const goal of goals) {
            if (this._goalsById.has(goal.id)) {
                throw new Error(`Duplicate goal id: ${goal.id}`);
            }

            this._goalsById.set(goal.id, goal);
        }
    }

    getById(id: GoalId): GoalDefinition {
        const goal = this._goalsById.get(id);
        if (!goal) {
            throw new Error(`Goal not found: ${id}`);
        }

        return goal;
    }

    getAll(): GoalDefinition[] {
        return [...this._goalsById.values()];
    }

    getAllIds(): GoalId[] {
        return [...this._goalsById.keys()];
    }
}
