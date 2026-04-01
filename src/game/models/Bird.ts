import type { BirdDefinition } from "../resourceTypes";

/**
 * A bird instance in the current session (hand / board).
 * Multiple Bird objects may share the same species (definition.id) but have different instanceId.
 */
export class Bird {
  readonly instanceId: string;
  readonly definition: BirdDefinition;

  get allowedFoods() {
    return this.definition.allowedFoods;
  }

  get allowedAreas() {
    return this.definition.allowedAreas;
  }

  constructor(definition: BirdDefinition, instanceId?: string) {
    this.definition = definition;
    this.instanceId = definition.name;
  }

  /** Species id from catalog (sparrow, tit, …). */
  get speciesId(): string {
    return this.definition.id;
  }

  get name(): string {
    return this.definition.name;
  }
}
