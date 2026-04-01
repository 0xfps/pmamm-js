import { LIQUIDITY_FACTOR } from "../constants";
import { MarketTime } from "../types/market-time";

// Returns effective liquidity from liquidity factor.
//
// Leff = L(√(T - t))
// Where T = End time, market closing time and t = current time.
export function getEffectiveLiquidity({ currentTime, endTime }: MarketTime): number {
    return LIQUIDITY_FACTOR * Math.sqrt(endTime - currentTime)
}