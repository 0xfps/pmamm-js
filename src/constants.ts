// Staring price of both sides of the market.
export const STARTING_PRICE = 0.5
// This, while not needed for this package, because JS operates
// with floating point numbers, is needed to establish the point
// of the current price of either sides of the market as having
// 6 decimals on the contract interface.
export const PRICE_DECIMALS = 6
// This is tentative, anyone can use any liquidity factor. This,
// just like `PRICE_DECIMALS` establish the fact that we're using
// a 100 point liquidity factor on the contract interface.
export const LIQUIDITY_FACTOR = 100
// JS deals with time in milliseconds, when recreating with Solidity,
// multiply LF with 1,000 too even though time will not need milliseconds.
// Concurrency.
// Solidity computes regarding times will be operated on the normal seconds level.
export const TIME_FACTOR = 1000