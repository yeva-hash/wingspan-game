import { Area } from "../../types/resourceTypes";
import { HandSelectionStrategy } from "../../types/selectionTypes";

export class ReadOnlyStrategy implements HandSelectionStrategy {
    get selectedBirdId(): string | null { return null; }
    get selectedArea(): Area | null { return null; }

    selectBird(_birdId: string): void {}
    selectArea(_area: Area): void {}
    canConfirm(): boolean { return false; }
    getMessage(): string { return ""; }
    reset(): void {}
}