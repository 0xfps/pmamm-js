import { describe, it, expect } from "@jest/globals"
import { getEffectiveLiquidity } from "../src/amm-math/get-effective-liquidity"
import { marketTime } from "./test-constants"
import { LIQUIDITY_FACTOR } from "../src/constants"

describe("Effective Liquidity Test.", function () {
    it("Liquidity Factor should be 10,000.", function () {
        expect(LIQUIDITY_FACTOR).toBe(10000)
    })

    it("Should return an EL above 0.", function () {
        expect(getEffectiveLiquidity(marketTime)).toBeGreaterThan(0)
    })
})