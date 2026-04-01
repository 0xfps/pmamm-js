# PM-AMM (Prediction Market Automated Market Maker)
#### `pmamm.js`

This package provides a practical implementation of the prediction market automated market maker introduced by Paradigm, commonly referred to as the [pm-AMM](https://www.paradigm.xyz/2024/11/pm-amm). The pm-AMM is designed specifically for outcome tokens; assets that resolve to fixed payoffs (e.g., $1 or $0), and is derived from a probabilistic model known as Gaussian Score Dynamics. Unlike traditional AMMs such as constant product or LMSR, this design enforces a uniform loss-vs-rebalancing (LVR) profile, meaning liquidity providers incur losses at a rate proportional to pool value regardless of price, while concentrating liquidity around the most informative probability region (near 50%).

Beyond the core invariant, the package covers the full set of mechanics required to work with a pm-AMM in practice. It includes utilities for modeling price dynamics over time, computing price from reserves and inversely deriving reserves from a target price, and simulating trades to determine resulting costs and updated pool states. Users can simulate buying or selling either `YES` or `NO` tokens, with accurate computation of post-trade reserves and average execution cost. Additionally, the package incorporates a port of the reference Python simulator, enabling numerical experimentation and validation, along with a small set of helper utilities to streamline integration and testing workflows.

Note that the `X` token represents the `YES` outcome, while the `Y` token represents the `NO` outcome.

## How To Install

```bash
npm install @0xfps/pmamm-js
```


## Important Types

### `Reserves`
```typescript
type Reserves = {
    x: number,  // $YES.
    y: number   // $NO.
}
```
Shows the number of shares available for the `YES` and `NO` tokens.

### `AfterTrade`
```typescript
type AfterTrade = {
    oldXReserve: number,
    oldYReserve: number,
    oldPrice: number,
    newXReserve: number,
    newYReserve: number,
    newPrice: number
    cost: number,
    averageCost: number,
}
```
Shows the metadata of a the result of the purchase or sale of a certain number of shares.

### `MarketTime`
```typescript
type type MarketTime = {
    startTime: number,
    currentTime: number,
    endTime: number
}
```
Every market runs within a certain time. This shows the time data, the start time of the market, the end time of the market and the current time, ideally, when the trade is to be done.

### `Order`
```typescript
type Order = {
    shares: number,
    isBuy: boolean,
    price: number,
    marketTime: MarketTime
}
```
Contains the details of the purchase or sale of a certain number of shares. It's token agnostic. There are separate functions for the purchase and sale of the `YES` and `NO` tokens.

## Usage

### `getNewReservesDataAfterXTrade`
```typescript
function getNewReservesDataAfterXTrade(order: Order): AfterTrade
```

Returns the market data that would be in place after a successful execution of the purchase or sale of `X` shares (`YES` shares).

### `getNewReservesDataAfterYTrade`
```typescript
function getNewReservesDataAfterYTrade(order: Order): AfterTrade
```

Returns the market data that would be in place after a successful execution of the purchase or sale of the `Y` shares (`NO` shares).

### `getPriceFromReseves`
```typescript
function getPriceFromReseves(reserves: Reserves, marketTime: MarketTime): number
```

Returns the price of the `X` token from the reserves of `X` and `Y` using the market time. To get the price of `Y`, simply do:
```typescript
const yPrice = 1 - getPriceFromReseves(reserves, marketTime)
```

### `getReservesFromPrice`
```typescript
function getReservesFromPrice(price: number, marketTime: MarketTime): Reserves
```

Returns the quantity of `X` and `Y` shares available using the price and the market time.

### `getEffectiveLiquidity`
```typescript
function getEffectiveLiquidity(marketTime: MarketTime): number
```

Returns effective liquidity from liquidity factor. Leff = L(√(T - t)). Where T = End time, market closing time and t = current time.

### `invariant`
```typescript
function invariant(x: number, y: number, Leff: number): number
```

Given a particular number of `X` and `Y` shares and an effective liquidity, `Leff`, this function should return `0` or a number infinitesimally close to `0`. This validates that the `X` and `Y` share amounts are valid reserves for the PM-AMM. It's the `XY = K` of PM-AMMs.