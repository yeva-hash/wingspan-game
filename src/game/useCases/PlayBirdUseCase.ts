import { BirdId } from "../../catalogs/BirdCatalog";
import { BirdPlacementResult, HabitatService } from "../services/HabitatService";
import { PlayerResourceService } from "../services/PlayerResourceService";
import { Area } from "../types/resourceTypes";

export class PlayBirdUseCase {
  constructor(
    private readonly habitatService: HabitatService,
    private readonly playerResourceService: PlayerResourceService,
  ) {}

  execute(area: Area, birdId: BirdId): BirdPlacementResult {
    const result = this.habitatService.placeBirdInAreaSlot(area, birdId);
    this.playerResourceService.spendBirdForPlay(birdId);

    return result;
  }
}
