import { getPriceFromReseves } from "../amm-math/get-price-from-reserves";
import { PRICE_DECIMALS } from "../constants";
import { Reserves } from "../types/ reserves";
import { AfterTrade } from "../types/after-trade";
import { MarketTime } from "../types/market-time";

export function getNewPriceCostAverageCost(
    newReserves: Reserves,
    marketTime: MarketTime,
    oldPrice: number,
    shares: number
): Omit<AfterTrade, "oldXReserve" | "oldYReserve" | "oldPrice" | "newXReserve" | "newYReserve"> {
    const newPrice = getPriceFromReseves(newReserves, marketTime)
    const cost = parseFloat((((oldPrice + newPrice) / 2) * shares).toFixed(PRICE_DECIMALS))
    const averageCost = parseFloat((cost / shares).toFixed(PRICE_DECIMALS))

    const afterTrade = {
        newPrice,
        cost,
        averageCost
    }

    return afterTrade
}