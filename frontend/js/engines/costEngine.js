/**
 * Annakavach — Packaging Commercial Cost & Techno-Economics Engine
 * Industrial converting, film substrate, gas flushing, and pouch geometry economics.
 */

class CostEngine {
  constructor() {}

  /**
   * Calculate packaging techno-economic cost model
   * @param {Object} material - Packaging material specification
   * @param {Object} geometry - Pouch dimensions (width, height in mm)
   * @param {number} wholesaleFoodValueUSD - Value of packaged food item
   * @returns {Object} Transparent cost breakdown per unit and per 1,000 units with stated assumptions
   */
  calculate(material, geometry = { widthMm: 150, heightMm: 220, type: "Stand-Up Pouch" }, wholesaleFoodValueUSD = 4.50) {
    // 1. Surface Area Calculation (2 faces + 15% bottom gusset + seal fins + 8% scrap allowance)
    const widthM = geometry.widthMm / 1000;
    const heightM = geometry.heightMm / 1000;
    const faceAreaSqM = widthM * heightM * 2;
    const gussetAreaSqM = faceAreaSqM * 0.15;
    const grossAreaPerPackSqM = (faceAreaSqM + gussetAreaSqM) * 1.08; // 8% industrial converting scrap

    // 2. Raw Substrate Film Cost
    const unitFilmRate = material.costPerSqM || 0.45; // USD/m²
    const substrateCostPerPack = grossAreaPerPackSqM * unitFilmRate;

    // 3. Printing & Converting Operations (2-color flexographic / rotogravure + pouch making)
    const convertingFeePerPack = 0.018; // USD ($18 per 1,000 pouches converting fee)

    // 4. MAP Gas Flush Economics (Food-grade N2/CO2 gas consumption)
    const gasFlushFeePerPack = 0.004; // USD ($4 per 1,000 units)

    // 5. Total Unit Costs
    const totalUnitPackagingCostUSD = substrateCostPerPack + convertingFeePerPack + gasFlushFeePerPack;
    const totalCostPer1000UnitsUSD = totalUnitPackagingCostUSD * 1000;

    // 6. Food Value Protection Ratio (Packaging cost as % of food value)
    const foodValue = Math.max(0.50, parseFloat(wholesaleFoodValueUSD) || 4.50);
    const costAsPercentOfFoodValue = ((totalUnitPackagingCostUSD / foodValue) * 100).toFixed(2);

    return {
      packagingGeometry: {
        dimensions: `${geometry.widthMm} mm × ${geometry.heightMm} mm`,
        pouchType: geometry.type || "3-Side Seal / Stand-Up Barrier Pouch",
        grossAreaSqMPerPack: grossAreaPerPackSqM.toFixed(4),
        totalFilmSqMPer1000: (grossAreaPerPackSqM * 1000).toFixed(1)
      },
      costBreakdownPer1000Units: {
        rawFilmSubstrateUSD: (substrateCostPerPack * 1000).toFixed(2),
        convertingAndPrintingUSD: (convertingFeePerPack * 1000).toFixed(2),
        mapGasFlushUSD: (gasFlushFeePerPack * 1000).toFixed(2),
        totalCostUSD: totalCostPer1000UnitsUSD.toFixed(2)
      },
      costPerSingleUnitUSD: `$${totalUnitPackagingCostUSD.toFixed(3)}`,
      costAsPercentOfFoodValue: `${costAsPercentOfFoodValue}%`,
      costCategoryLabel: totalUnitPackagingCostUSD < 0.04 ? "Low Cost (< $0.04/pack)" : (totalUnitPackagingCostUSD < 0.08 ? "Moderate Cost ($0.04 - $0.08/pack)" : "Premium High-Barrier (> $0.08/pack)"),
      economicAssumptions: {
        batchSize: "Standard commercial production run of 10,000 units",
        convertingScrapRate: "8.0% trim and startup scrap factored into area",
        printingSpec: "2-color surface flexographic print with standard solvent-free adhesive",
        gasFlushBasis: "0.5 L gas consumption per package at food-grade N₂/CO₂ bulk pricing",
        disclaimer: "Estimated manufacturing cost. Actual commercial procurement quotes will vary based on run volume, cylinder setup fees, and supplier freight."
      }
    };
  }
}

// Global scope exposure
const globalScopeCost = typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : global);
globalScopeCost.CostEngine = CostEngine;
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CostEngine };
}
