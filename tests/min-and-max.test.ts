import { describe, it, expect } from "@jest/globals"
import { getReservesFromPrice } from "../src/amm-math/get-reserves-from-price"
import { marketTime } from "./test-constants"
import { getRandomShares } from "./get-random-shares"
import { getMinAndMaxXReservesForNewYReserve, getMinAndMaxYReservesForNewXReserve } from "../src/amm-math/get-min-and-max-xy-reserves"
import { invariant } from "../src/amm-math/invariant"
import { getEffectiveLiquidity } from "../src/amm-math/get-effective-liquidity"

describe("Min and max tests", function () {
    let initialPrice = 0.5
    const time = marketTime

    const { x, y } = getReservesFromPrice(initialPrice, time)
    let initialXReserve = x, initialYReserve = y

    it("Should return min and max Y for new X Reserve on X purchase.", function () {
        const shares = getRandomShares()
        const newXReserve = initialXReserve + shares
        const { min, max } = getMinAndMaxYReservesForNewXReserve(
            initialYReserve,
            newXReserve,
            marketTime
        )

        expect(min).toBeLessThan(max)
        expect(invariant(newXReserve, min, getEffectiveLiquidity(marketTime))).toBeGreaterThan(0)
        expect(invariant(newXReserve, max, getEffectiveLiquidity(marketTime))).toBeLessThan(0)
    })

    it("Should return min and max Y for new X Reserve on X sale.", function () {
        const shares = getRandomShares()
        const newXReserve = initialXReserve - shares
        const { min, max } = getMinAndMaxYReservesForNewXReserve(
            initialYReserve,
            newXReserve,
            marketTime
        )

        expect(min).toBeLessThan(max)
        expect(invariant(newXReserve, min, getEffectiveLiquidity(marketTime))).toBeGreaterThan(0)
        expect(invariant(newXReserve, max, getEffectiveLiquidity(marketTime))).toBeLessThan(0)
    })

    it("Should return min and max X for new Y Reserve on Y purchase.", function () {
        const shares = getRandomShares()
        const newYReserve = initialYReserve + shares
        const { min, max } = getMinAndMaxXReservesForNewYReserve(
            initialXReserve,
            newYReserve,
            marketTime
        )

        expect(min).toBeLessThan(max)
        expect(invariant(min, newYReserve, getEffectiveLiquidity(marketTime))).toBeGreaterThan(0)
        expect(invariant(max, newYReserve, getEffectiveLiquidity(marketTime))).toBeLessThan(0)
    })

    it("Should return min and max X for new Y Reserve on Y sale.", function () {
        const shares = getRandomShares()
        const newYReserve = initialYReserve - shares
        const { min, max } = getMinAndMaxXReservesForNewYReserve(
            initialXReserve,
            newYReserve,
            marketTime
        )

        expect(min).toBeLessThan(max)
        expect(invariant(min, newYReserve, getEffectiveLiquidity(marketTime))).toBeGreaterThan(0)
        expect(invariant(max, newYReserve, getEffectiveLiquidity(marketTime))).toBeLessThan(0)
    })
})