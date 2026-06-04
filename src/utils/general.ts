import { Ticker } from "pixi.js";

export function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function executeDelayedQueue(
    queue: Array<() => Promise<void>>,
    delay = 500,
): Promise<void> {
    const running: Promise<void>[] = [];

    for (let i = 0; i < queue.length; i++) {
        const start = async (): Promise<void> => {
            await waitTime(i * delay);
            await queue[i]();
        };

        running.push(start());
    }

    await Promise.all(running);
}

export function waitTime(dur: number = 2000): Promise<void> {
    return new Promise<void>((resolve) => {
        setTimeout(resolve, dur);
    });
}