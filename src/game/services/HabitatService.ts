import { HabitatStore } from "../stores/habitat/HabitatStore";
import { HabitatAreaStore } from "../stores/habitat/HabitatAreaStore";
import { HabitatSlotStore } from "../stores/habitat/HabitatSlotStore";
import { BirdId } from "../../catalogs/BirdCatalog";
import { BirdCatalog } from "../../catalogs/BirdCatalog";
import { PlayedBird } from "../models/PlayedBird";
import { Area } from "../types/resourceTypes";

export type BirdPlacementResult = {
    area: Area;
    bird: PlayedBird;
    slotIndex: number;
};

export type HabitatBirdSlotMap = Map<Area, number[]>;

export class HabitatService {
    constructor(private readonly _habitatStore: HabitatStore, private readonly _birdCatalog: BirdCatalog) {}

    getAreas(): HabitatAreaStore[] {
        return this._habitatStore.getAreas();
    }

    getArea(area: Area): HabitatAreaStore {
        return this._habitatStore.getArea(area);
    }

    getSlots(area: Area): HabitatSlotStore[] {
        return this.getArea(area).getSlots();
    }

    getFirstFreeSlot(area: Area): HabitatSlotStore | null {
        return this.getSlots(area).find((slot) => !slot.isOccupied) ?? null;
    }

    getAvailableEggPlacementSlotsByArea(): HabitatBirdSlotMap {
        const availableSlotsByArea: HabitatBirdSlotMap = new Map();

        for (const areaStore of this.getAreas()) {
            const slotIndexes = this.getOccupiedSlotIndexes(areaStore.area).filter((slotIndex) => {
                const bird = this.getSlot(areaStore.area, slotIndex).bird;
                return !!bird?.canPlaceEgg;
            });

            if (slotIndexes.length > 0) {
                availableSlotsByArea.set(areaStore.area, slotIndexes);
            }
        }

        return availableSlotsByArea;
    }

    getEggPaymentSlotsByArea(): HabitatBirdSlotMap {
        const availableSlotsByArea: HabitatBirdSlotMap = new Map();

        for (const areaStore of this.getAreas()) {
            const slotIndexes = this.getOccupiedSlotIndexes(areaStore.area).filter((slotIndex) => {
                const bird = this.getSlot(areaStore.area, slotIndex).bird;
                return !!bird?.canRemoveEgg;
            });

            if (slotIndexes.length > 0) {
                availableSlotsByArea.set(areaStore.area, slotIndexes);
            }
        }

        return availableSlotsByArea;
    }

    getBirdPlayEggCost(area: Area): number {
        const slot = this.getFirstFreeSlot(area);
        return slot ? slot.index - 1 : 0;
    }

    getTotalEggCount(): number {
        return this.getAreas().reduce((sum, areaStore) => {
            return sum + areaStore.getSlots().reduce((areaSum, slot) => {
                return areaSum + (slot.bird?.eggCount ?? 0);
            }, 0);
        }, 0);
    }

    getRewardCount(area: Area): number {
        return this.getFirstFreeSlot(area)?.rewardCount ?? 0;
    }

    getSlot(area: Area, slotIndex: number): HabitatSlotStore {
        return this.getArea(area).getSlot(slotIndex);
    }

    placeBirdInAreaSlot(area: Area, birdId: BirdId): BirdPlacementResult {
        const slot = this.getFirstFreeSlot(area);
        if (!slot) {
            //TODO visual feedback
            throw new Error(`No free slots in ${area}`);
        }

        const birdDefinition = this._birdCatalog.getById(birdId);
        const bird = new PlayedBird(birdDefinition);
        this.getArea(area).setBirdInSlot(slot.index, bird);

        return {
            area,
            bird,
            slotIndex: slot.index,
        };
    }

    placeEgg(area: Area, slotIndex: number): PlayedBird {
        const bird = this.getSlot(area, slotIndex).bird;
        if (!bird) {
            throw new Error(`No bird found in ${area} slot ${slotIndex}`);
        }

        bird.placeEgg();
        return bird;
    }

    removeEgg(area: Area, slotIndex: number): PlayedBird {
        const bird = this.getSlot(area, slotIndex).bird;
        if (!bird) {
            throw new Error(`No bird found in ${area} slot ${slotIndex}`);
        }

        bird.removeEgg();
        return bird;
    }

    
    private getOccupiedSlotIndexes(area: Area): number[] {
        return this.getSlots(area)
            .filter((slot) => slot.isOccupied)
            .map((slot) => slot.index);
    }
}
