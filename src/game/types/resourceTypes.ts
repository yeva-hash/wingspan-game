export type BirdDefinition = {
  //TODO use id
  id: string;
  name: string;
  texture: string;
  allowedFoods: FoodType[]; // TODO rename to allowedResources
  allowedAreas: Area[];
};

export type FoodDefinition = {
  id: FoodType;
  texture: string;
};

export type FoodType = "seed" | "worm" | "berry" | "fish" | "mouse";

export type Area = "forest" | "steppe" | "swamp";
