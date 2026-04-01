import { Reserves } from "../types/ reserves"
import { MarketTime } from "../types/market-time"
import { phi, Phi_inverse } from "./gaussian"
import { getEffectiveLiquidity } from "./get-effective-liquidity"

export function getReservesFromPrice(price: number, marketTime: MarketTime): Reserves {
    const effectiveL = getEffectiveLiquidity(marketTime)
    const z = Phi_inverse(price)
    const diff = (z) * effectiveL

    const y = (diff * price) + (effectiveL * phi(z))
    const x = y - diff

    return { x, y }
}