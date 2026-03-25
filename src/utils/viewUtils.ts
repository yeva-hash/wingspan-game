import gsap from "gsap";

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