import { Area } from "../../types/resourceTypes";
import { HandSelectionStrategy } from "../../types/selectionTypes";

export class PlayBirdStrategy implements HandSelectionStrategy {
  private _selectedBirdId: string | null = null;
  private _selectedArea: Area | null = null;

  get selectedBirdId(): string | null {
      return this._selectedBirdId;
  }

  get selectedArea(): Area | null {
      return this._selectedArea;
  }

  selectBird(birdId: string): void {
      this._selectedBirdId = birdId;
      this._selectedArea = null;
  }

  selectArea(area: Area): void {
      this._selectedArea = area;
  }

  canConfirm(): boolean {
      return !!this._selectedBirdId && !!this._selectedArea;
  }

  getMessage(): string { return ""; }

  reset(): void {
      this._selectedBirdId = null;
      this._selectedArea = null;
  }
}