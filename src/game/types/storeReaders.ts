import { BirdId } from "../../catalogs/BirdCatalog";
import { QuantifiedFood } from "../models/QuantifiedFood";
import { BirdDefinition } from "./resourceTypes";

export interface PlayerResourceReader {
    getBirds(): BirdDefinition[];
    getBirdById(id: BirdId): BirdDefinition | null;
    getFoods(): readonly QuantifiedFood[];
    getFoodById(id: string): QuantifiedFood | undefined;
  }
  
  export interface BirdSupplyReader {
    getOfferedBirdIds(): readonly BirdId[];
    getOfferedBirds(): BirdDefinition[];
    getDeckCount(): number;
  }
  
