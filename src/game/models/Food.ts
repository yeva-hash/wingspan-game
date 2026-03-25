import type { FoodDefinition } from "../resourceTypes";

/**
 * Food in the player's inventory: catalog entry + quantity.
 */
export class Food {
  readonly definition: FoodDefinition;
  private _quantity: number;

  constructor(definition: FoodDefinition, initialQuantity = 0) {
    this.definition = definition;
    this._quantity = initialQuantity;
  }

  get id(): string {
    return this.definition.id;
  }

  get name(): string {
    return this.definition.name;
  }

  get quantity(): number {
    return this._quantity;
  }

  add(amount: number): void {
    if (amount < 0) {
      throw new Error("Food.add: amount must be >= 0");
    }
    this._quantity += amount;
  }

  /** Consume food; returns false if not enough in stock. */
  take(amount: number): boolean {
    if (amount < 0 || amount > this._quantity) {
      return false;
    }
    this._quantity -= amount;
    return true;
  }
}
