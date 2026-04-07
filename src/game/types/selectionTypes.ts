export interface SelectionStrategy {
    selectBird(birdId: string): void;
    canConfirm(): boolean;
    getMessage(): string;
    reset(): void;
}

// export interface ChooseBirdStrategy implements SelectionStrategy {
//     selectBird(birdId: string): void {}
//     canConfirm(): boolean { return false; }
//     getMessage(): string { return ""; }
//     reset(): void {}
// }

// export interface PlayBirdStrategy implements SelectionStrategy {
//     selectBird(birdId: string): void {}
//     canConfirm(): boolean { return false; }
//     getMessage(): string { return ""; }
//     reset(): void {}
// }

// export interface ReadOnlyStrategy implements SelectionStrategy {
//     selectBird(birdId: string): void {}
//     canConfirm(): boolean { return false; }
//     getMessage(): string { return ""; }
//     reset(): void {}
// }