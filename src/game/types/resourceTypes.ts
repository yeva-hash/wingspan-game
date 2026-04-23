export type BirdDefinition = {
  //TODO use id
  id: string;
  name: string;
  texture: string;
  requiredFoods: FoodType[];
  allowedAreas: Area[];
  maxEggCount: number;
};

export type FoodDefinition = {
  id: FoodType;
  texture: string;
};

export type FoodType = "seed" | "worm" | "berry" | "fish" | "mouse";

export type Area = "forest" | "steppe" | "swamp";
