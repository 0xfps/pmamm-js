import { AfterTrade } from "../types/after-trade"
import { Order } from "../types/order"
import { bisect } from "../utils/bisect"
import { getNewPriceCostAverageCost } from "../utils/get-new-price-data"
import { getEffectiveLiquidity } from "./get-effective-liquidity"
import { getMinAndMaxYReservesForNewXReserve } from "./get-min-and-max-xy-reserves"
import { getReservesFromPrice } from "./get-reserves-from-price"
import { invariant } from "./invariant"

export function getNewReservesDataAfterXTrade(order: Order): AfterTrade {
    const { shares, isBuy, price, marketTime } = order
    const { x: xReserve, y: yReserve } = getReservesFromPrice(price, marketTime)

    if (shares <= 0) throw new Error("Can't buy 0.")
    if (isBuy && shares >= xReserve) throw new Error("Insufficient X Liquidity.")

    const leff = getEffectiveLiquidity(marketTime)
    const newXReserve = isBuy ? xReserve - shares : xReserve + shares

    function evaluateY(y: number) {
        return invariant(newXReserve, y, leff) < 0
    }

    const currentYReserve = yReserve
    const { min, max } = getMinAndMaxYReservesForNewXReserve(
        currentYReserve,
        newXReserve,
        marketTime
    )
    const newYReserve = bisect(evaluateY, min, max)

    if (!isBuy && newYReserve <= 0) throw new Error("Y Liquidity Depleted.")

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