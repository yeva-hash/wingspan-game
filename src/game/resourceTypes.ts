/** Bird catalog entry (same shape as layout nodes: id, name, type + optional texture for UI). */
export type BirdDefinition = {
  id: string;
  name: string;
  type: "bird";
  description?: string;
  texture?: string;
};

export type FoodDefinition = {
  id: string;
  name: string;
  type: "food";
  description?: string;
  texture?: string;
};
