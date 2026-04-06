import { describe, it, expect } from "@jest/globals"
import { marketTime } from "./test-constants"
import { Order } from "../src"
import { getReservesFromPrice } from "../src/amm-math/get-reserves-from-price"
import { getNewReservesDataAfterXTrade } from "../src/amm-math/get-new-reserves-after-x-trade"
import { getNewReservesDataAfterYTrade } from "../src/amm-math/get-new-reserves-after-y-trade"
import { getRandomShares } from "./get-random-shares"

describe("Get new reserves after trade.", function () {
    let initialPrice = 0.5
    const time = marketTime

    const { x, y } = getReservesFromPrice(initialPrice, time)
    let initialXReserve = x, initialYReserve = y

    let order: Order

    // X.
    it("Should throw error of insufficient liquidity for excess X purchase.", function () {
        let xOrder: Order = {
            shares: initialXReserve + 0.00001,
            isBuy: true,
            price: initialPrice,
            marketTime: time
        }

        order = xOrder
        expect(() => getNewReservesDataAfterXTrade(order)).toThrow("Insufficient X Liquidity.")
    })

    it("Should throw error for 0 X purchase.", function () {
        let xOrder: Order = {
            shares: 0,
            isBuy: true,
            price: initialPrice,
            marketTime: time
        }

        order = xOrder
        expect(() => getNewReservesDataAfterXTrade(order)).toThrow("Can't buy 0.")
    })

    it("Should return after trade of X purchase.", function () {
        let xOrder: Order = {
            shares: getRandomShares(),
            isBuy: true,
            price: initialPrice,
            marketTime: time
        }

        order = xOrder
        const afterTrade = getNewReservesDataAfterXTrade(order)

        expect(afterTrade.newXReserve).toBeLessThan(initialXReserve)
        expect(afterTrade.newYReserve).toBeGreaterThan(initialYReserve)
        expect(afterTrade.newPrice).toBeGreaterThan(afterTrade.oldPrice)
    })

    it("Should return after trade of X sale.", function () {
        let xOrder: Order = {
            shares: getRandomShares(),
            isBuy: false,
            price: initialPrice,
            marketTime: time
        }

        order = xOrder
        const afterTrade = getNewReservesDataAfterXTrade(order)

        expect(afterTrade.newXReserve).toBeGreaterThan(initialXReserve)
        expect(afterTrade.newYReserve).toBeLessThan(initialYReserve)
        expect(afterTrade.newPrice).toBeLessThan(afterTrade.oldPrice)
    })

    it("Should throw after trade of X sale liquidates Y reserves.", function () {
        let xOrder: Order = {
            shares: 5_000_000_000,
            // Insanely large number to deplete Y liquidity.
            // Jokes aside, 2B didn't liquidate Y 💀.
            isBuy: false,
            price: initialPrice,
            marketTime: time
        }

        order = xOrder
        expect(() => getNewReservesDataAfterXTrade(order)).toThrow("Y Liquidity Depleted.")
    })

    // Y.
    it("Should throw error of insufficient liquidity for excess Y purchase.", function () {
        let yOrder: Order = {
            shares: initialYReserve + 0.00001,
            isBuy: true,
            price: initialPrice,
            marketTime: time
        }

        order = yOrder
        expect(() => getNewReservesDataAfterYTrade(order)).toThrow("Insufficient Y Liquidity.")
    })

    it("Should throw error for 0 Y purchase.", function () {
        let yOrder: Order = {
            shares: 0,
            isBuy: true,
            price: initialPrice,
            marketTime: time
        }

        order = yOrder
        expect(() => getNewReservesDataAfterYTrade(order)).toThrow("Can't buy 0.")
    })

    it("Should return after trade of Y purchase.", function () {
        let yOrder: Order = {
            shares: getRandomShares(),
            isBuy: true,
            price: initialPrice,
            marketTime: time
        }

        order = yOrder
        const afterTrade = getNewReservesDataAfterYTrade(order)

        expect(afterTrade.newXReserve).toBeGreaterThan(initialXReserve)
        expect(afterTrade.newYReserve).toBeLessThan(initialYReserve)
        expect(afterTrade.newPrice).toBeLessThan(afterTrade.oldPrice)
    })

    it("Should return after trade of Y sale.", function () {
        let yOrder: Order = {
            shares: getRandomShares(),
            isBuy: false,
            price: initialPrice,
            marketTime: time
        }

        order = yOrder
        const afterTrade = getNewReservesDataAfterYTrade(order)

        expect(afterTrade.newXReserve).toBeLessThan(initialXReserve)
        expect(afterTrade.newYReserve).toBeGreaterThan(initialYReserve)
        expect(afterTrade.newPrice).toBeGreaterThan(afterTrade.oldPrice)
    })

    // Note: X liquidity cannot be depleted.
})