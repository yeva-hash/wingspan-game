/** Bird catalog entry (same shape as layout nodes: id, name, type + optional texture for UI). */
export type BirdDefinition = {
  id: string;
  name: string;
  type: "bird";
  description?: string;
  texture?: string;
  allowedFoods: FoodType[];
};

export type FoodDefinition = {
  id: FoodType;
  name: string;
  type: "food";
  description?: string;
  texture?: string;
};

export type FoodType = "seed" | "worm" | "berry";
