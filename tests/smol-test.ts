import { MarketTime, Order } from "../src";
import { getNewReservesDataAfterYTrade } from "../src/amm-math/get-new-reserves-after-y-trade";
import { getNewReservesDataAfterXTrade } from "../src/amm-math/get-new-reserves-after-x-trade";
import { getReservesFromPrice } from "../src/amm-math/get-reserves-from-price";
import { invariant } from "../src/amm-math/invariant";
import { getEffectiveLiquidity } from "../src/amm-math/get-effective-liquidity";

const TWO_WEEKS = 1000 * 60 * 60 * 24 * 14
const START_TIME = new Date().getTime() / 1000
const END_TIME = new Date().getTime() + TWO_WEEKS

const marketTime: MarketTime = {
    startTime: START_TIME,
    currentTime: START_TIME,
    endTime: 1775891254
}

const reserves = getReservesFromPrice(0.5, marketTime)
console.log({ reserves })

const yOrder: Order = {
    shares: 10000,
    isBuy: true,
    price: 0.5,
    marketTime
}
let afterTrade = getNewReservesDataAfterYTrade(yOrder)
console.log({ afterTrade })
console.log(invariant(afterTrade.newXReserve, afterTrade.newYReserve, getEffectiveLiquidity(marketTime)))

const xOrder: Order = {
    shares: 10000,
    isBuy: true,
    price: afterTrade.newPrice,
    marketTime
}

afterTrade = getNewReservesDataAfterXTrade(xOrder)
console.log({ afterTrade })

const xSellOrder = {
    shares: 10000,
    isBuy: false,
    price: afterTrade.newPrice,
    marketTime
}

afterTrade = getNewReservesDataAfterXTrade(xSellOrder)
console.log({ afterTrade })