import gaussian from "gaussian"

const distribution = gaussian(0, 1)

// CDF, Cumulative Distribution Function.
export function Phi(x: number): number {
    return distribution.cdf(x)
}

// PDF, Probability Density Function.
export function phi(x: number): number {
    return distribution.pdf(x)
}

// PPF or 1/CDF.
export function Phi_inverse(x: number): number {
    return distribution.ppf(x)
}