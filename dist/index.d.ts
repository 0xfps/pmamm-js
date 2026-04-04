type MarketTime = {
    startTime: number;
    currentTime: number;
    endTime: number;
};

declare function getEffectiveLiquidity({ currentTime, endTime }: MarketTime): number;

type AfterTrade = {
    oldXReserve: number;
    oldYReserve: number;
    oldPrice: number;
    newXReserve: number;
    newYReserve: number;
    newPrice: number;
    cost: number;
    averageCost: number;
};

type Order = {
    shares: number;
    isBuy: boolean;
    price: number;
    marketTime: MarketTime;
};

declare function getNewReservesDataAfterYTrade(order: Order): AfterTrade;

declare function getNewReservesDataAfterXTrade(order: Order): AfterTrade;

type Reserves = {
    x: number;
    y: number;
};

declare function getPriceFromReseves({ x, y }: Reserves, marketTime: MarketTime): number;

declare function getReservesFromPrice(price: number, marketTime: MarketTime): Reserves;

type Limits = {
    min: number;
    max: number;
};

declare function Phi(x: number): number;
declare function phi(x: number): number;
declare function Phi_inverse(x: number): number;

declare const pmAmm: {
    LIQUIDITY_FACTOR: number;
    PRICE_DECIMALS: number;
    STARTING_PRICE: number;
    TIME_FACTOR: number;
    phi: typeof phi;
    Phi: typeof Phi;
    Phi_inverse: typeof Phi_inverse;
    getEffectiveLiquidity: typeof getEffectiveLiquidity;
    getNewReservesDataAfterYTrade: typeof getNewReservesDataAfterYTrade;
    getNewReservesDataAfterXTrade: typeof getNewReservesDataAfterXTrade;
    getPriceFromReseves: typeof getPriceFromReseves;
    getReservesFromPrice: typeof getReservesFromPrice;
};

export { type AfterTrade, type Limits, type MarketTime, type Order, type Reserves, pmAmm as default };
