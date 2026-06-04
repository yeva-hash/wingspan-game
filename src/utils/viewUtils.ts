import gsap from "gsap";
import { Container, Text } from "pixi.js";

/**
 * Tween the alpha with asyc function, so that it can be used with "await" command
 * @param object {any}
 * @param duration {number} default = 0.1
 * @param targetAlpha {number} default = 0
 */
export async function alphaTo(
    object: any,
    duration: number = 0.1,
    targetAlpha: number = 0,
): Promise<void> {
    await new Promise<void>((resolve) => {
        gsap.to(object, {
            duration,
            alpha: targetAlpha,
            onComplete: () => {
                resolve();
            },
        });
    });
}

export function setButtonInteractive(button: Container | Text, value: boolean): void {
    button.eventMode = value ? "static" : "none";
    button.cursor = value ? "pointer" : "default";
}

export function playScalePulse(
    object: any,
    scaleMultiplier = 1.18,
    duration = 0.28,
): void {
    const baseScaleX = object.scale.x;
    const baseScaleY = object.scale.y;

    gsap.killTweensOf(object.scale);
    object.scale.set(baseScaleX, baseScaleY);

    gsap.timeline()
        .to(object.scale, {
            x: baseScaleX * scaleMultiplier,
            y: baseScaleY * scaleMultiplier,
            duration: duration * 0.42,
            ease: "back.out(2)",
        })
        .to(object.scale, {
            x: baseScaleX,
            y: baseScaleY,
            duration: duration * 0.58,
            ease: "power2.out",
        });
}

export function setContainerPivotToCenter(container: Container, keepPosition = true): void {
    const bounds = container.getLocalBounds();
    const centerX = bounds.x + bounds.width / 2;
    const centerY = bounds.y + bounds.height / 2;
    const diffX = centerX - container.pivot.x;
    const diffY = centerY - container.pivot.y;

    container.pivot.set(centerX, centerY);

    if (keepPosition) {
        container.position.set(
            container.position.x + diffX * container.scale.x,
            container.position.y + diffY * container.scale.y,
        );
    }
}
