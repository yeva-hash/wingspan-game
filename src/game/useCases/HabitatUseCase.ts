// import { HabitatService } from "../services/HabitatService";
// import { GameStore } from "../stores/GameStore";
// import { HabitatSlotStore } from "../stores/habitat/HabitatSlotStore";

// export class HabitatUseCase {
//     constructor(private gameStore: GameStore, private readonly _habitatService: HabitatService) {}

//     initSlots(slotsCount: number, Class: typeof HabitatSlotStore): void {
//         this.gameStore.getAreas().forEach((area) => {
//             this._habitatService.initSlots(area, slotsCount, Class);
//         });
//     }
// }