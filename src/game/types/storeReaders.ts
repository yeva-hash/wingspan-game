import { BirdId } from "../../catalogs/BirdCatalog";
import { Food } from "../models/Food";
import { BirdDefinition } from "./resourceTypes";

export interface PlayerResourceReader {
    getBirds(): BirdDefinition[];
    getBirdById(id: BirdId): BirdDefinition | null;
    getFoods(): readonly Food[];
    getFoodById(id: string): Food | undefined;
  }
  
  export interface BirdSupplyReader {
    getOfferedBirdIds(): readonly BirdId[];
    getOfferedBirds(): BirdDefinition[];
    getDeckCount(): number;
  }
  