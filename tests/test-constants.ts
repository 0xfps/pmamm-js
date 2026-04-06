import { MarketTime } from "../dist"

const TWO_WEEKS = 1000 * 60 * 60 * 24 * 14
const START_TIME = new Date().getTime()
const END_TIME = new Date().getTime() + TWO_WEEKS

export const marketTime: MarketTime = {
    startTime: START_TIME,
    currentTime: START_TIME,
    endTime: END_TIME
}

export function randomInRange(min: number, max: number): number {
    return parseFloat((Math.random() * (max - min) + min).toPrecision(2));
}