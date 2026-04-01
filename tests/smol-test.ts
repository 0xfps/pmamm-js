import { MarketTime, Order } from "../src";
import { getNewReservesDataForXAfterYTrade } from "../src/amm-math/get-new-reserves-for-x";
import { getNewReservesDataForYAfterXTrade } from "../src/amm-math/get-new-reserves-for-y";
import { getReservesFromPrice } from "../src/amm-math/get-reserves-from-price";

const TWO_WEEKS = 1000 * 60 * 60 * 24 * 14
const START_TIME = new Date().getTime()
const END_TIME = new Date().getTime() + TWO_WEEKS

const marketTime: MarketTime = {
    startTime: START_TIME,
    currentTime: START_TIME,
    endTime: END_TIME
}

const reserves = getReservesFromPrice(0.5, marketTime)
console.log({ reserves })

const yOrder: Order = {
    shares: 10000,
    isBuy: true,
    price: 0.5,
    marketTime
}
let afterTrade = getNewReservesDataForXAfterYTrade(yOrder)
console.log({ afterTrade })

const xOrder: Order = {
    shares: 10000,
    isBuy: true,
    price: afterTrade.newPrice,
    marketTime
}

afterTrade = getNewReservesDataForYAfterXTrade(xOrder)
console.log({ afterTrade })

const xSellOrder = {
    shares: 10000,
    isBuy: false,
    price: afterTrade.newPrice,
    marketTime
}

afterTrade = getNewReservesDataForYAfterXTrade(xSellOrder)
console.log({ afterTrade })