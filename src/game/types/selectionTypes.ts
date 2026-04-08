import { Area } from "./resourceTypes";

export interface BirdOfferSelectionStrategy {
    selectBird(birdId: string): void;
    canConfirm(): boolean;
    reset(): void;
    readonly selectedBirdIds: string[];
}

export interface HandSelectionStrategy {
    selectBird(birdId: string): void;
    selectArea(area: Area): void;
    canConfirm(): boolean;
    getMessage(): string;
    reset(): void;
    readonly selectedBirdId: string | null;
    readonly selectedArea: Area | null;
}