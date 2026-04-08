import { BirdCatalog, BirdId } from "../../catalogs/BirdCatalog";
import { BirdSupplyStore } from "../stores/BirdSupplyStore";
import { randomInt } from "../../utils/general";
import { BirdSupplyReader } from "../types/storeReaders";

export class BirdSupplyService implements BirdSupplyReader {
    public static readonly initialOfferedBirdCount = 3;

    constructor(
        private readonly _catalog: BirdCatalog,
        private readonly _store: BirdSupplyStore,
    ) {}

    resetForNewGame(): void {
        this._store.setDeckBirdIds(this._catalog.getAllIds());
        this._store.setOfferedBirdIds([]);
    }

    initializeOffer(count: number = BirdSupplyService.initialOfferedBirdCount): void {
        const deck = [...this._store.getDeckBirdIds()];
        const offered: BirdId[] = [];

        for (let i = 0; i < count; i++) {
            const birdId = deck.shift();
            if (!birdId) {
                break;
            }
            offered.push(birdId);
        }

        this._store.setDeckBirdIds(deck);
        this._store.setOfferedBirdIds(offered);
    }

    takeOfferedBirdById(birdId: BirdId): BirdId {
        const offered = [...this._store.getOfferedBirdIds()];
        const index = offered.indexOf(birdId);

        if (index === -1) {
            throw new Error(`Bird not found in offered birds: ${birdId}`);
        }

        const [takenBirdId] = offered.splice(index, 1);
        this._store.setOfferedBirdIds(offered);

        return takenBirdId;
    }

    takeRandomDeckBird(): BirdId {
        const deck = [...this._store.getDeckBirdIds()];

        if (deck.length === 0) {
            throw new Error("No birds left in deck");
        }

        const index = randomInt(0, deck.length - 1);
        const [birdId] = deck.splice(index, 1);

        this._store.setDeckBirdIds(deck);

        return birdId;
    }

    refillOffer(targetCount: number = BirdSupplyService.initialOfferedBirdCount): void {
        const deck = [...this._store.getDeckBirdIds()];
        const offered = [...this._store.getOfferedBirdIds()];

        while (offered.length < targetCount) {
            const birdId = deck.shift();
            if (!birdId) {
                break;
            }
            offered.push(birdId);
        }

        this._store.setDeckBirdIds(deck);
        this._store.setOfferedBirdIds(offered);
    }

    getOfferedBirdIds(): readonly BirdId[] {
        return this._store.getOfferedBirdIds();
    }

    getDeckBirdIds(): readonly BirdId[] {
        return this._store.getDeckBirdIds();
    }

    getDeckCount(): number {
        return this._store.getDeckBirdIds().length;
    }

    getOfferedBirds() {
        return this._store
            .getOfferedBirdIds()
            .map((id) => this._catalog.getById(id));
    }

    getBirdById(id: BirdId) {
        return this._catalog.getById(id);
    }
}