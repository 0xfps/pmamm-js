import { describe, it, expect } from "@jest/globals"
import { getReservesFromPrice } from "../src/amm-math/get-reserves-from-price"
import { marketTime, randomInRange } from "./test-constants"
import { getPriceFromReseves } from "../src/amm-math/get-price-from-reserves"

// Prices are checked to precision 2 because they're accurate
// to the .7000000000000001'th decimal place
describe("Get Reserves From Price Test", function () {
    let initialXReserve: number, initialYReserve: number
    let initialPrice = 0.5

    it("Should return equal reserves at $0.5.", function () {
        const reserves = getReservesFromPrice(initialPrice, marketTime)
        initialXReserve = reserves.x
        initialYReserve = reserves.y

        expect(initialXReserve).toBeLessThanOrEqual(initialYReserve)
        expect(
            parseFloat(getPriceFromReseves(reserves, marketTime).toPrecision(2))
        ).toBe(initialPrice)
    })

    it("X Reserve and Y Reserve should move with change in price.", function () {
        initialPrice = randomInRange(0.01, 0.49)
        console.log(`X @ ${initialPrice}, Y @${(1 - initialPrice).toPrecision(2)}`)
        const { x, y } = getReservesFromPrice(initialPrice, marketTime)
        expect(initialXReserve).toBeLessThan(x)
        expect(initialYReserve).toBeGreaterThan(y)
        expect(
            parseFloat(getPriceFromReseves({ x, y }, marketTime).toPrecision(2))
        ).toBe(initialPrice)

        initialPrice = randomInRange(0.51, 0.99)
        console.log(`X @ ${initialPrice}, Y @${(1 - initialPrice).toPrecision(2)}`)
        let newReserves = getReservesFromPrice(initialPrice, marketTime)
        expect(initialXReserve).toBeGreaterThan(newReserves.x)
        expect(initialYReserve).toBeLessThan(newReserves.y)
        expect(
            parseFloat(getPriceFromReseves(newReserves, marketTime).toPrecision(2))
        ).toBe(initialPrice)
    })
})
