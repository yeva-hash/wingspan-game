import { BirdId } from "../../catalogs/BirdCatalog";
import { BirdSupplyService } from "../services/BirdSupplyService";
import { PlayerResourceService } from "../services/PlayerResourceService";

export class ChooseBirdUseCase {
  constructor(
    private readonly birdSupplyService: BirdSupplyService,
    private readonly playerResourceService: PlayerResourceService,
  ) {}

  execute(selectedIds: BirdId[]): void {
    for (const selectedId of selectedIds) {
      const birdId =
        selectedId === "random"
          ? this.birdSupplyService.takeRandomDeckBird()
          : this.birdSupplyService.takeOfferedBirdById(selectedId);

      this.playerResourceService.addBirdById(birdId);
    }

    this.birdSupplyService.refillOffer();
  }
}