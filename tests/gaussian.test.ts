import { describe, it, expect } from "@jest/globals"
import { distribution } from "../src/amm-math/gaussian"

describe("Gaussian Distribution Test.", function () {
    it("Should have a mean of 0 and a variance of 1.", function () {
        expect(distribution.mean).toBe(0)
        expect(distribution.variance).toBe(1)
    })
})