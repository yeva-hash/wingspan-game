/** Bird catalog entry (same shape as layout nodes: id, name, type + optional texture for UI). */
export type BirdDefinition = {
  id: string;
  name: string;
  description?: string;
  texture?: string;
  allowedFoods: FoodType[];
  allowedAreas: Area[];
};

export type FoodDefinition = {
  id: FoodType;
  texture?: string;
};

export type FoodType = "seed" | "worm" | "berry" | "fish" | "mouse";

export type Area = "forest" | "steppe" | "swamp";;
