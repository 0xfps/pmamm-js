import { Reserves } from "../types/ reserves"
import { MarketTime } from "../types/market-time"
import { Phi } from "./gaussian"
import { getEffectiveLiquidity } from "./get-effective-liquidity"

export function getPriceFromReseves({ x, y }: Reserves, marketTime: MarketTime): number {
    const effectiveL = getEffectiveLiquidity(marketTime)

    const z = (y - x) / effectiveL
    const price = Phi(z)

    return price
}