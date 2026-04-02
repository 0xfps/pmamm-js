"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  default: () => index_default
});
module.exports = __toCommonJS(index_exports);

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
var import_gaussian = __toESM(require("gaussian"));
var distribution = (0, import_gaussian.default)(0, 1);
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
var import_bisect = __toESM(require("bisect"));
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
  const newXReserve = (0, import_bisect.default)(evaluateX, min, max);
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
var import_bisect2 = __toESM(require("bisect"));
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
  const newYReserve = (0, import_bisect2.default)(evaluateY, min, max);
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
//# sourceMappingURL=index.js.map