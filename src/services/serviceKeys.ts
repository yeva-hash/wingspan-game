/** Service Locator keys (symbols to avoid clashes with string keys). */
export const Services = {
  BirdCatalog: Symbol("BirdCatalog"),
  FoodCatalog: Symbol("FoodCatalog"),
  PlayerResources: Symbol("PlayerResources"),
} as const;
