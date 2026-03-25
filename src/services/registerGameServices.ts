import { BirdCatalogService } from "./BirdCatalogService";
import { FoodCatalogService } from "./FoodCatalogService";
import { PlayerResourcesService } from "./PlayerResourcesService";
import type { ServiceLocator } from "./ServiceLocator";
import { Services } from "./serviceKeys";

/** Registers game services on the locator (once at startup). */
export function registerGameServices(locator: ServiceLocator): void {
  locator.register(Services.BirdCatalog, new BirdCatalogService());
  locator.register(Services.FoodCatalog, new FoodCatalogService());
  locator.register(Services.PlayerResources, new PlayerResourcesService());
}
