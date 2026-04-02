import { getEffectiveLiquidity } from "./amm-math/get-effective-liquidity";
import { getNewReservesDataAfterYTrade } from "./amm-math/get-new-reserves-after-x-trade";
import { getNewReservesDataAfterXTrade } from "./amm-math/get-new-reserves-after-y-trade";
import { getPriceFromReseves } from "./amm-math/get-price-from-reserves";
import { getReservesFromPrice } from "./amm-math/get-reserves-from-price";
import { AfterTrade } from "./types/after-trade";
import { Limits } from "./types/limits";
import { MarketTime } from "./types/market-time";
import { Order } from "./types/order";
import { Reserves } from "./types/ reserves";
import { LIQUIDITY_FACTOR, PRICE_DECIMALS, STARTING_PRICE, TIME_FACTOR } from "./constants";

export {
    AfterTrade,
    Limits,
    MarketTime,
    Order,
    Reserves
}

const pmAmm = {
    LIQUIDITY_FACTOR,
    PRICE_DECIMALS,
    STARTING_PRICE,
    TIME_FACTOR,
    getEffectiveLiquidity,
    getNewReservesDataAfterYTrade,
    getNewReservesDataAfterXTrade,
    getPriceFromReseves,
    getReservesFromPrice,
}

export default pmAmm