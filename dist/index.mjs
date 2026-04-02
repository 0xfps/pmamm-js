// src/constants.ts
var STARTING_PRICE = 0.5;
var PRICE_DECIMALS = 6;
var LIQUIDITY_FACTOR = 100;
var TIME_FACTOR = 1e3;

// src/amm-math/get-effective-liquidity.ts
function getEffectiveLiquidity({ currentTime, endTime }) {
  return LIQUIDITY_FACTOR * Math.sqrt(endTime - currentTime);
}

// src/amm-math/gaussian.ts
import gaussian from "gaussian";
var distribution = gaussian(0, 1);
function Phi(x) {
  return distribution.cdf(x);
}
function phi(x) {
  return distribution.pdf(x);
}
function Phi_inverse(x) {
  return distribution.ppf(x);
}

// src/amm-math/get-price-from-reserves.ts
function getPriceFromReseves({ x, y }, marketTime) {
  const effectiveL = getEffectiveLiquidity(marketTime);
  const z = (y - x) / effectiveL;
  const price = Phi(z);
  return price;
}

// src/utils/get-new-price-data.ts
function getNewPriceCostAverageCost(newReserves, marketTime, oldPrice, shares) {
  const newPrice = getPriceFromReseves(newReserves, marketTime);
  const cost = parseFloat(((oldPrice + newPrice) / 2 * shares).toFixed(PRICE_DECIMALS));
  const averageCost = parseFloat((cost / shares).toFixed(PRICE_DECIMALS));
  const afterTrade = {
    newPrice,
    cost,
    averageCost
  };
  return afterTrade;
}

// src/amm-math/invariant.ts
function invariant(x, y, Leff) {
  const z = (y - x) / Leff;
  return (y - x) * Phi(z) + Leff * phi(z) - y;
}

// src/amm-math/get-min-and-max-xy-reserves.ts
function getMinAndMaxYReservesForNewXReserve(currentYReserve, newXReserve, marketTime) {
  let minYReserve, maxYReserve;
  let minYEvaluation = false, maxYEvaluation = false;
  let margin = 5e3;
  const leff = getEffectiveLiquidity(marketTime);
  while (!maxYEvaluation) {
    maxYEvaluation = invariant(newXReserve, currentYReserve, leff) < 0;
    currentYReserve += margin;
  }
  maxYReserve = currentYReserve;
  while (!minYEvaluation) {
    currentYReserve -= margin;
    minYEvaluation = invariant(newXReserve, currentYReserve, leff) > 0;
  }
  minYReserve = currentYReserve;
  return { min: minYReserve, max: maxYReserve };
}
function getMinAndMaxXReservesForNewYReserve(currentXReserve, newYReserve, marketTime) {
  let minXReserve, maxXReserve;
  let minXEvaluation = false, maxXEvaluation = false;
  let margin = 5e3;
  const leff = getEffectiveLiquidity(marketTime);
  while (!maxXEvaluation) {
    maxXEvaluation = invariant(currentXReserve, newYReserve, leff) < 0;
    currentXReserve += margin;
  }
  maxXReserve = currentXReserve;
  while (!minXEvaluation) {
    currentXReserve -= margin;
    minXEvaluation = invariant(currentXReserve, newYReserve, leff) > 0;
  }
  minXReserve = currentXReserve;
  return { min: minXReserve, max: maxXReserve };
}

// src/amm-math/get-reserves-from-price.ts
function getReservesFromPrice(price, marketTime) {
  const effectiveL = getEffectiveLiquidity(marketTime);
  const z = Phi_inverse(price);
  const diff = z * effectiveL;
  const y = diff * price + effectiveL * phi(z);
  const x = y - diff;
  return { x, y };
}

// src/amm-math/get-new-reserves-after-x-trade.ts
import bisect from "bisect";
function getNewReservesDataAfterYTrade(order) {
  const { shares, isBuy, price, marketTime } = order;
  const { x: xReserve, y: yReserve } = getReservesFromPrice(price, marketTime);
  if (isBuy && shares >= yReserve) throw new Error("Insufficient Y Liquidity.");
  const leff = getEffectiveLiquidity(marketTime);
  const newYReserve = isBuy ? yReserve - shares : yReserve + shares;
  function evaluateX(x) {
    return invariant(x, newYReserve, leff) < 0;
  }
  const currentXReserve = xReserve;
  const { min, max } = getMinAndMaxXReservesForNewYReserve(
    currentXReserve,
    newYReserve,
    marketTime
  );
  const newXReserve = bisect(evaluateX, min, max);
  if (!isBuy && newXReserve <= 0) throw new Error("X Liquidity Depleted.");
  const newReserves = { x: newXReserve, y: newYReserve };
  const { newPrice, cost, averageCost } = getNewPriceCostAverageCost(
    newReserves,
    marketTime,
    price,
    shares
  );
  const afterTrade = {
    oldXReserve: xReserve,
    oldYReserve: yReserve,
    oldPrice: price,
    newXReserve,
    newYReserve,
    newPrice,
    cost,
    averageCost
  };
  return afterTrade;
}

// src/amm-math/get-new-reserves-after-y-trade.ts
import bisect2 from "bisect";
function getNewReservesDataAfterXTrade(order) {
  const { shares, isBuy, price, marketTime } = order;
  const { x: xReserve, y: yReserve } = getReservesFromPrice(price, marketTime);
  if (isBuy && shares >= xReserve) throw new Error("Insufficient X Liquidity.");
  const leff = getEffectiveLiquidity(marketTime);
  const newXReserve = isBuy ? xReserve - shares : xReserve + shares;
  function evaluateY(y) {
    return invariant(newXReserve, y, leff) < 0;
  }
  const currentYReserve = yReserve;
  const { min, max } = getMinAndMaxYReservesForNewXReserve(
    currentYReserve,
    newXReserve,
    marketTime
  );
  const newYReserve = bisect2(evaluateY, min, max);
  if (!isBuy && newYReserve <= 0) throw new Error("Y Liquidity Depleted.");
  const newReserves = { x: newXReserve, y: newYReserve };
  const { newPrice, cost, averageCost } = getNewPriceCostAverageCost(
    newReserves,
    marketTime,
    price,
    shares
  );
  const afterTrade = {
    oldXReserve: xReserve,
    oldYReserve: yReserve,
    oldPrice: price,
    newXReserve,
    newYReserve,
    newPrice,
    cost,
    averageCost
  };
  return afterTrade;
}

// src/index.ts
var pmAmm = {
  LIQUIDITY_FACTOR,
  PRICE_DECIMALS,
  STARTING_PRICE,
  TIME_FACTOR,
  getEffectiveLiquidity,
  getNewReservesDataAfterYTrade,
  getNewReservesDataAfterXTrade,
  getPriceFromReseves,
  getReservesFromPrice
};
var index_default = pmAmm;
export {
  index_default as default
};
//# sourceMappingURL=index.mjs.map