// controllers/UIController.ts
import * as PIXI from 'pixi.js';

export class UIController {
  readonly container: PIXI.Container;
  private confirmButton: PIXI.Container;
  private confirmText!: PIXI.Text;

  onConfirm: (() => void) | null = null;

  constructor() {
    this.container = new PIXI.Container();
    this.confirmButton = this.createConfirmButton();
    this.container.addChild(this.confirmButton);
  }

  private createConfirmButton(): PIXI.Container {
    const btn = new PIXI.Container();

    const bg = new PIXI.Graphics()
      .roundRect(0, 0, 160, 48, 8)
      .fill(0x4a7c59);

    this.confirmText = new PIXI.Text({
      text: 'Підтвердити',
      style: { fontSize: 16, fill: 0xffffff }
    });
    this.confirmText.position.set(16, 12);

    btn.addChild(bg, this.confirmText);
    btn.eventMode = 'static';
    btn.cursor = 'pointer';
    btn.on('pointerdown', () => this.onConfirm?.());

    return btn;
  }

  setConfirmLabel(text: string) {
    this.confirmText.text = text;
  }

  showConfirm() { this.confirmButton.visible = true; }
  hideConfirm() { this.confirmButton.visible = false; }
}