import { Limits } from "../types/limits"
import { MarketTime } from "../types/market-time"
import { getEffectiveLiquidity } from "./get-effective-liquidity"
import { invariant } from "./invariant"

// Each of these two functions solve to determine the range of values
// for y and x (yLimit and xLimit) respectively that needs to be approached
// so that the function given at `invariant` will be equal or close to 0.
// The whole point of these functions is that it narrows down two limits
// `min` and `max` for both x and y. `min` is always lesser than `max`, by
// inference, and applying `min` in the invariant yields a positive number 
// close to 0, say +0.04. `max` when applied to the invariant yields a 
// negative number close to 0, say -0.02. By establishing and using these
// limits, it's easier for the Bisection function to find a middle ground
// to pick which number between `min` an `max` yields the closest to 0 (on the
// negative). That is the number we're looking for.
//
// As the limits of either go down, the inviariant positively expands, and it
// negatively expands as the limits go up.
export function getMinAndMaxYReservesForNewXReserve(
    currentYReserve: number,
    newXReserve: number,
    marketTime: MarketTime
): Limits {
    let minYReserve, maxYReserve
    let minYEvaluation = false, maxYEvaluation = false
    let margin = 5000
    const leff = getEffectiveLiquidity(marketTime)

    // Finding the upper limits.
    // We keep adding 10,000 until the invariant
    // results in below 0.
    while (!maxYEvaluation) {
        maxYEvaluation = invariant(newXReserve, currentYReserve, leff) < 0
        currentYReserve += margin
    }

    maxYReserve = currentYReserve

    // Finding the lower limits.
    // We keep adding 10,000 until the invariant
    // results in above 0.
    while (!minYEvaluation) {
        currentYReserve -= margin
        minYEvaluation = invariant(newXReserve, currentYReserve, leff) > 0
    }

    minYReserve = currentYReserve

    return { min: minYReserve, max: maxYReserve }
}

export function getMinAndMaxXReservesForNewYReserve(
    currentXReserve: number,
    newYReserve: number,
    marketTime: MarketTime
): Limits {
    let minXReserve, maxXReserve
    let minXEvaluation = false, maxXEvaluation = false
    let margin = 5000
    const leff = getEffectiveLiquidity(marketTime)

    // Finding the upper limits.
    // We keep adding 10,000 until the invariant
    // results in below 0.
    while (!maxXEvaluation) {
        maxXEvaluation = invariant(currentXReserve, newYReserve, leff) < 0
        currentXReserve += margin
    }

    maxXReserve = currentXReserve

    // Finding the lower limits.
    // We keep adding 10,000 until the invariant
    // results in above 0.
    while (!minXEvaluation) {
        currentXReserve -= margin
        minXEvaluation = invariant(currentXReserve, newYReserve, leff) > 0
    }

    minXReserve = currentXReserve

    return { min: minXReserve, max: maxXReserve }
}