import { phi, Phi } from "./gaussian";

// For a given x, y and Leff, this invariant must be equal or infinitesimally
// close to 0.
// Refer to https://www.paradigm.xyz/2024/11/pm-amm#90ef7fa55727.
export function invariant(x: number, y: number, Leff: number): number {
    const z = (y - x) / Leff

    return ((y - x) * Phi(z)) + (Leff * phi(z)) - y
}