import { MarketTime } from "./market-time"

export type Order = {
    shares: number,
    isBuy: boolean,
    price: number,
    marketTime: MarketTime
}