// From https://www.npmjs.com/package/bisect.
// Modified to add line 9.

export function bisect(func: Function, low: number, high: number, tol?: number): number {
    tol = tol || 1e-8
    while (high - low > tol) {
        var avg = (high + low) / 2

        if (avg == high || avg == low) return avg

        if (func(avg)) {
            high = avg
        } else {
            low = avg
        }
    }

    return low
}