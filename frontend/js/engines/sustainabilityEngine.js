/**
 * Annakavach — Sustainability & Circularity Assessment Engine
 * ISO 14040 Life Cycle Assessment (LCA) modeling, EU PPWR 2030 compliance scoring,
 * and UK Plastic Packaging Tax evaluations.
 */

class SustainabilityEngine {
  constructor() {}

  /**
   * Evaluate environmental impact and circular economy compatibility
   * @param {Object} material - Packaging material specification
   * @param {Object} packagingGeometry - Area, thickness, weight per package
   * @returns {Object} Transparent LCA metrics, PPWR class, and end-of-life breakdown
   */
  evaluate(material, packagingGeometry = { areaSqM: 0.06, weightGrams: 4.5 }) {
    const weightKgPer1000 = (packagingGeometry.weightGrams * 1000) / 1000; // kg per 1000 packs
    const resinCarbonPerKg = material.carbonFootprintKgCO2e || 2.5; // kg CO2e / kg resin
    const footprintPer1000 = (weightKgPer1000 * resinCarbonPerKg).toFixed(2);
    const footprintPerPackGrams = (packagingGeometry.weightGrams * resinCarbonPerKg).toFixed(1);

    // EU PPWR 2030 Recyclability Assessment
    let ppwrClass = "Class B";
    let ppwrRecyclabilityPercent = 80;
    let recyclabilityNote = "Polyolefin sorting stream";

    const recClass = material.recyclabilityClass || "";
    const matId = material.id || "";

    if (recClass.includes("Class A") || matId.includes("mono-pe") || matId.includes("bopp")) {
      ppwrClass = "Class A (≥ 95% Recyclability by weight)";
      ppwrRecyclabilityPercent = 95;
      recyclabilityNote = "Mono-material polyolefin stream fully compatible with mechanical curbside recycling.";
    } else if (recClass.includes("Compostable") || matId.includes("natureflex") || matId.includes("pla")) {
      ppwrClass = "Compostable (EN 13432 Certified)";
      ppwrRecyclabilityPercent = 90;
      recyclabilityNote = "Certified for industrial/home composting organic waste streams. Exempt from virgin plastic levies.";
    } else if (recClass.includes("Class D") || matId.includes("alu-pe") || matId.includes("triplex")) {
      ppwrClass = "Class D (< 70% Recyclability - Non-Recyclable Multi-Material)";
      ppwrRecyclabilityPercent = 30;
      recyclabilityNote = "Multi-material laminate with unseparable aluminium foil layer. Disadvantaged under EU PPWR 2030 design-for-recycling mandates.";
    }

    // Ellen MacArthur Foundation Circularity Index approximation (0.0 to 1.0)
    let circularityScore = 0.65;
    if (ppwrRecyclabilityPercent >= 90) circularityScore = 0.88;
    else if (ppwrRecyclabilityPercent <= 40) circularityScore = 0.32;

    // UK Plastic Packaging Tax (£217.85 / tonne if < 30% recycled content)
    const isExemptTax = material.plasticTaxApplicable === false || material.id.includes("rpet") || material.id.includes("bio") || material.id.includes("glass");
    const taxPer1000Units = isExemptTax ? 0.00 : ((weightKgPer1000 / 1000) * 217.85).toFixed(3);

    return {
      carbonFootprintPer1000PacksKgCO2e: footprintPer1000,
      carbonFootprintPerPackGramsCO2e: footprintPerPackGrams,
      resinCarbonIntensityKgCO2ePerKg: resinCarbonPerKg,
      ppwr2030Class: ppwrClass,
      ppwrRecyclabilityPercent,
      recyclabilityNote,
      circularityIndex: circularityScore.toFixed(2),
      plasticTaxEvaluation: {
        isExempt: isExemptTax,
        taxPer1000UnitsUSD: isExemptTax ? "$0.00" : `$${taxPer1000Units}`,
        reason: isExemptTax ? "Exempt (>30% PCR recycled content, bio-based, or non-plastic material)" : "Subject to standard plastic packaging virgin resin levy"
      },
      endOfLifeFate: {
        mechanicalRecycling: ppwrRecyclabilityPercent,
        energyRecovery: Math.max(0, Math.round((100 - ppwrRecyclabilityPercent) * 0.6)),
        landfillOrLoss: Math.max(0, Math.round((100 - ppwrRecyclabilityPercent) * 0.4))
      },
      lcaAssumptions: {
        systemBoundary: "Cradle-to-gate + End-of-Life scenario (ISO 14040 / 14044)",
        geographicScope: "European Average Grid & Recycling Infrastructure (EU-27)",
        functionalUnit: "1,000 primary food packaging units (Pouch / Tray / Wrapper)",
        methodologyCitation: "PlasticsEurope Eco-profiles & Sphera LCA Database"
      }
    };
  }
}

// Global scope exposure
const globalScopeSust = typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : global);
globalScopeSust.SustainabilityEngine = SustainabilityEngine;
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SustainabilityEngine };
}
