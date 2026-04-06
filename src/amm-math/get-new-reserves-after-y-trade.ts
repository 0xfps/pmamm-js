import { AfterTrade } from "../types/after-trade"
import { Order } from "../types/order"
import { bisect } from "../utils/bisect"
import { getNewPriceCostAverageCost } from "../utils/get-new-price-data"
import { getEffectiveLiquidity } from "./get-effective-liquidity"
import { getMinAndMaxXReservesForNewYReserve } from "./get-min-and-max-xy-reserves"
import { getReservesFromPrice } from "./get-reserves-from-price"
import { invariant } from "./invariant"

export function getNewReservesDataAfterYTrade(order: Order): AfterTrade {
    const { shares, isBuy, price, marketTime } = order
    const { x: xReserve, y: yReserve } = getReservesFromPrice(price, marketTime)

    if (shares <= 0) throw new Error("Can't buy 0.")
    if (isBuy && shares >= yReserve) throw new Error("Insufficient Y Liquidity.")

    const leff = getEffectiveLiquidity(marketTime)
    const newYReserve = isBuy ? yReserve - shares : yReserve + shares

    function evaluateX(x: number) {
        return invariant(x, newYReserve, leff) < 0
    }

    const currentXReserve = xReserve
    const { min, max } = getMinAndMaxXReservesForNewYReserve(
        currentXReserve,
        newYReserve,
        marketTime
    )
    const newXReserve = bisect(evaluateX, min, max)

    if (!isBuy && newXReserve <= 0) throw new Error("X Liquidity Depleted.")

    const newReserves = { x: newXReserve, y: newYReserve }
    const { newPrice, cost, averageCost } = getNewPriceCostAverageCost(
        newReserves,
        marketTime,
        price,
        shares
    )

    const afterTrade = {
        oldXReserve: xReserve,
        oldYReserve: yReserve,
        oldPrice: price,
        newXReserve,
        newYReserve,
        newPrice,
        cost,
        averageCost
    }

    return afterTrade
}