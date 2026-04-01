import { ActionMenuView } from "../views/ActionMenuView";

export type ActionId = "playBird" | "gainFood" | "gainEggs" | "chooseBird";

export class ActionMenuController {
  constructor(private readonly view: ActionMenuView) {}

  async chooseAction(): Promise<ActionId> {
    return this.view.waitForAction();
  }

  // async chooseArea(): Promise<string> {
  //   return this.view.waitForArea();
  // }

  // async chooseAction() {
  //   const deferred = createDeferred<ActionId>();

    // this._playBirdText.eventMode = "static";
    // this._playBirdText.cursor = "pointer";
    // this._playBirdText.once("pointerdown", () => deferred.resolve("playBird"));
  
    // return deferred.promise;
    // this.clear();

    // const deferred = createDeferred<ActionId>();

    // const actions: { id: ActionId; label: string }[] = [
    //   { id: "playBird", label: "Play bird" },
    //   { id: "gainFood", label: "Gain food" },
    //   { id: "gainEggs", label: "Gain eggs" },
    //   { id: "chooseBird", label: "Choose bird" },
    // ];

    // actions.forEach((a, index) => {
    //   const btn = this.createButton(a.label);
    //   btn.position.set(0, index * 56);
    //   btn.on("pointerdown", () => deferred.resolve(a.id));
    //   this.container.addChild(btn);
    //   this.buttons.push(btn);
    // });

    // const selected = await deferred.promise;
    // this.clear();
    // return selected;
  }

  // private createButton(text: string): PIXI.Container {
    // const btn = new PIXI.Container();

    // const bg = new PIXI.Graphics().roundRect(0, 0, 180, 44, 8).fill(0x1f2937);

    // const label = new PIXI.Text({
    //   text,
    //   style: { fontSize: 14, fill: 0xffffff },
    // });
    // label.position.set(12, 12);

    // btn.addChild(bg, label);
    // btn.eventMode = "static";
    // btn.cursor = "pointer";
    // return btn;
  // }

  // private clear(): void {
  //   for (const b of this.buttons) {
  //     this.container.removeChild(b);
  //     b.destroy({ children: true });
  //   }
  //   this.buttons = [];
  // }
// }
// 
