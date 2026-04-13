import { BirdId } from "../../catalogs/BirdCatalog";

export class BirdSupplyStore {
    private _deckBirdIds: BirdId[] = [];
    private _offeredBirdIds: BirdId[] = [];

    getDeckBirdIds(): readonly BirdId[] {
        return this._deckBirdIds;
    }

    getOfferedBirdIds(): readonly BirdId[] {
        return this._offeredBirdIds;
    }

    setDeckBirdIds(birdIds: BirdId[]): void {
        this._deckBirdIds = [...birdIds].sort(() => Math.random() - 0.5);
    }

    setOfferedBirdIds(birdIds: BirdId[]): void {
        this._offeredBirdIds = [...birdIds];
    }

    clear(): void {
        this._deckBirdIds = [];
        this._offeredBirdIds = [];
    }
}