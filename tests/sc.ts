import { MarketTime, Order } from "../src";
import { getEffectiveLiquidity } from "../src/amm-math/get-effective-liquidity";
import { getNewReservesDataAfterXTrade } from "../src/amm-math/get-new-reserves-after-x-trade";
import { getReservesFromPrice } from "../src/amm-math/get-reserves-from-price";

const START_TIME = new Date().getTime() / 1000
const END_TIME = 1775891254

const marketTime: MarketTime = {
    startTime: START_TIME,
    currentTime: START_TIME,
    endTime: END_TIME
}

console.log(getEffectiveLiquidity(marketTime))

const reserves = getReservesFromPrice(0.5, marketTime)
console.log({ reserves })

const xOrder: Order = {
    shares: 10000,
    isBuy: true,
    price: 0.5,
    marketTime
}

let afterTrade = getNewReservesDataAfterXTrade(xOrder)
console.log({ afterTrade })