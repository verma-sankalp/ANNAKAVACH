/**
 * Annakavach — Arrhenius Shelf-Life Kinetic Decay Simulator
 * Temperature-accelerated food quality degradation modeling
 * comparing Unpackaged Control vs Generic Standard PE vs Annakavach Recommended Barrier.
 *
 * Mathematical Foundations:
 * - Arrhenius Kinetic Rate Law: k(T) = k_ref * Q10^((T - T_ref) / 10)
 * - Quality Index (QI) Decay: QI(t) = 100 * exp(-k * t)
 * - Rejection Boundary Cutoff: QI <= 50%
 */

class ShelfLifeSimulator {
  constructor() {
    this.q10Default = 2.1; // Standard food kinetic Q10 factor (Labuza, 1984)
  }

  /**
   * Run 3-curve shelf-life simulation over time
   * @param {Object} params - Food physical parameters & storage conditions
   * @param {Object} recommendedMat - Selected packaging material
   * @returns {Object} 3 distinct daily curves, cutoff intersections, and model assumptions
   */
  simulate(params, recommendedMat) {
    const isChilled = params.storageType === "chilled";
    const isFrozen = params.storageType === "frozen";
    const baseRefTemp = isChilled ? 4.0 : (isFrozen ? -18.0 : 20.0);
    const actualTemp = parseFloat(params.storageTemp !== undefined ? params.storageTemp : baseRefTemp);

    // Arrhenius temperature acceleration multiplier
    const tempDelta = actualTemp - baseRefTemp;
    const q10Factor = Math.pow(this.q10Default, tempDelta / 10.0);

    // Determine baseline rate constants (k_ref) based on food commodity sensitivity
    let kRefUnpackaged = 0.35;
    let kRefStandardPE = 0.15;
    let kRefRecommended = 0.045;

    if (params.category === "Fresh Produce") {
      const respFactor = Math.max(1, params.respirationValue / 15);
      kRefUnpackaged = 0.40 * respFactor;
      kRefStandardPE = 0.22 * respFactor; // Traps moisture without gas balance
      kRefRecommended = (recommendedMat.id.includes("perforated") || recommendedMat.id.includes("pla-pbat")) ? (0.05 * respFactor) : (0.18 * respFactor);
    } else if (params.category === "Meat & Poultry" || params.category === "Seafood") {
      kRefUnpackaged = 0.45;
      kRefStandardPE = 0.20;
      kRefRecommended = recommendedMat.otr <= 2.0 ? 0.045 : 0.08;
    } else if (params.category === "Bakery") {
      kRefUnpackaged = 0.30;
      kRefStandardPE = 0.12;
      kRefRecommended = 0.025;
    } else if (params.category === "Snacks & Confectionery" || params.category === "Dry Foods & Grains") {
      kRefUnpackaged = 0.08;
      kRefStandardPE = 0.035;
      kRefRecommended = 0.003;
    } else if (params.category === "Frozen Foods") {
      kRefUnpackaged = 0.05;
      kRefStandardPE = 0.015;
      kRefRecommended = 0.002;
    }

    // Apply temperature acceleration
    const kUnpackaged = kRefUnpackaged * q10Factor;
    const kStandardPE = kRefStandardPE * q10Factor;
    const kRecommended = kRefRecommended * q10Factor;

    // Determine simulation timeline span (days)
    let timelineDays = 30;
    if (params.category === "Fresh Produce") timelineDays = 21;
    if (params.category === "Meat & Poultry" || params.category === "Seafood") timelineDays = 25;
    if (params.category === "Bakery") timelineDays = 45;
    if (params.category === "Snacks & Confectionery") timelineDays = 180;
    if (params.category === "Dry Foods & Grains" || params.category === "Frozen Foods") timelineDays = 365;

    // Time points
    const stepSize = Math.max(1, Math.floor(timelineDays / 30));
    const labels = [];
    const unpackagedCurve = [];
    const standardPECurve = [];
    const recommendedCurve = [];

    let daysTo50Unpackaged = null;
    let daysTo50StandardPE = null;
    let daysTo50Recommended = null;

    for (let day = 0; day <= timelineDays; day += stepSize) {
      labels.push(`Day ${day}`);

      // First-order quality retention index: QI(t) = 100 * exp(-k * t)
      const qiUnpackaged = Math.max(0, Math.round(100 * Math.exp(-kUnpackaged * day)));
      const qiStandard = Math.max(0, Math.round(100 * Math.exp(-kStandardPE * day)));
      const qiRecommended = Math.max(0, Math.round(100 * Math.exp(-kRecommended * day)));

      unpackagedCurve.push(qiUnpackaged);
      standardPECurve.push(qiStandard);
      recommendedCurve.push(qiRecommended);

      if (daysTo50Unpackaged === null && qiUnpackaged <= 50) daysTo50Unpackaged = day;
      if (daysTo50StandardPE === null && qiStandard <= 50) daysTo50StandardPE = day;
      if (daysTo50Recommended === null && qiRecommended <= 50) daysTo50Recommended = day;
    }

    // Default fallbacks if curve didn't cross 50% during window
    if (daysTo50Unpackaged === null) daysTo50Unpackaged = Math.round(Math.log(2) / kUnpackaged);
    if (daysTo50StandardPE === null) daysTo50StandardPE = Math.round(Math.log(2) / kStandardPE);
    if (daysTo50Recommended === null) daysTo50Recommended = Math.round(Math.log(2) / kRecommended);

    return {
      timelineDays,
      labels,
      unpackagedCurve,
      standardPECurve,
      recommendedCurve,
      daysTo50Unpackaged: Math.max(1, daysTo50Unpackaged),
      daysTo50StandardPE: Math.max(1, daysTo50StandardPE),
      daysTo50Recommended: Math.max(1, daysTo50Recommended),
      shelfLifeGainMultiplier: (daysTo50Recommended / Math.max(1, daysTo50StandardPE)).toFixed(1),
      modelAssumptions: {
        initialQualityIndex: "100% (Freshly processed/harvested baseline)",
        rejectionThreshold: "50% Quality Index (Commercial spoilage cutoff)",
        kineticModel: "First-order exponential decay: QI(t) = 100 · e^(-k·t)",
        temperatureFactor: `Q₁₀ = ${this.q10Default} (Temperature acceleration factor)`,
        referenceBaselineTemp: `${baseRefTemp}°C`,
        simulationTemp: `${actualTemp}°C (Temp Delta: ${tempDelta > 0 ? "+" : ""}${tempDelta.toFixed(1)}°C)`,
        coldChainAssumption: "Continuous temperature maintenance without abuse spikes",
        initialBioburdenAssumption: "Standard commercial hygiene (< 10³ CFU/g initial microflora)",
        scientificDisclaimer: "Modelled kinetic projection. Commercial deployment requires physical Accelerated Shelf-Life Testing (ASLT) in accordance with ISO 16779."
      }
    };
  }
}

// Global scope exposure
const globalScopeSim = typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : global);
globalScopeSim.ShelfLifeSimulator = ShelfLifeSimulator;
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ShelfLifeSimulator };
}
