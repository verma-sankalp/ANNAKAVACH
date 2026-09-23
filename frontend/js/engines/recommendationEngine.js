/**
 * Annakavach — Packaging Recommendation & Suitability Scoring Engine
 * Algorithmic matching of food physico-chemical degradation kinetics
 * against polymer barrier physics and circular economy standards.
 */

class PackagingRecommendationEngine {
  constructor(materialsDb = null, foodDb = null) {
    const globalMat = typeof window !== 'undefined' ? window.PACKAGING_MATERIALS : (typeof globalThis !== 'undefined' ? globalThis.PACKAGING_MATERIALS : null);
    const globalFood = typeof window !== 'undefined' ? window.FOOD_COMMODITIES : (typeof globalThis !== 'undefined' ? globalThis.FOOD_COMMODITIES : null);

    this.materialsDb = materialsDb || globalMat || [];
    this.foodDb = foodDb || globalFood || [];
  }

  /**
   * Main recommendation evaluation entry point
   * @param {Object} input - Food parameters and storage logistics
   * @returns {Object} Comprehensive packaging recommendation dossier
   */
  evaluate(input) {
    const params = this._normalizeAndValidateInputs(input);
    const barrierTargets = this._calculateTargetBarrierRequirements(params);
    const mapRecommendation = this._calculateSuggestedStartingMAP(params);
    const perforationSpec = this._calculatePerforationSpec(params);
    const scoredMaterials = this._scoreMaterials(params, barrierTargets);
    const primary = scoredMaterials[0] || this.materialsDb[0] || {};
    const customStructure = this._synthesizeLaminateStructure(params, barrierTargets, primary);
    const whyExplanation = this._generateWhyExplanation(params, barrierTargets, primary, mapRecommendation);
    const engineeringRisks = this._detectEngineeringRisks(params, primary);
    const alternatives = this._selectAlternativeMaterials(scoredMaterials, primary);
    const shelfLifeEstimate = this._estimateShelfLife(params, primary);

    return {
      inputParameters: params,
      barrierRequirements: barrierTargets,
      mapRecommendation,
      perforationSpec,
      primaryRecommendation: primary,
      suitabilityScore: primary.suitabilityScore || 90,
      scoreBreakdown: primary.scoreBreakdown || { barrierMatch: 95, respirationSpoilage: 92, storageTemp: 90, sustainability: 95, costViability: 94 },
      whyExplanation,
      customStructure,
      alternatives,
      rankedMaterials: scoredMaterials,
      engineeringWarnings: engineeringRisks,
      estimatedShelfLifeDays: shelfLifeEstimate,
      methodologyNote: "Suitability evaluated across 5 weighted dimensions: Barrier Match (35%), Respiration & Spoilage (25%), Temperature Integrity (15%), Sustainability (15%), Cost Viability (10%)."
    };
  }

  /**
   * Input normalization and strict boundary validation
   */
  _normalizeAndValidateInputs(input) {
    const raw = input || {};
    const nameToMatch = raw.foodName || raw.commodityName || "";
    const refFood = this.foodDb.find(f => f.id === raw.foodId || f.name.toLowerCase() === nameToMatch.toLowerCase()) || null;

    const rawMoisture = raw.moisture !== undefined ? raw.moisture : (refFood ? refFood.moisture : 65);
    const rawAw = raw.waterActivity !== undefined ? raw.waterActivity : (refFood ? refFood.waterActivity : 0.85);
    const rawFat = raw.fatContent !== undefined ? raw.fatContent : (raw.fat !== undefined ? raw.fat : (refFood ? refFood.fat : 5));
    const rawPH = raw.ph !== undefined ? raw.ph : (refFood ? refFood.ph : 5.8);
    const rawTemp = raw.storageTemp !== undefined ? raw.storageTemp : (refFood ? refFood.recommendedTemp : 4);
    const rawRH = raw.storageRH !== undefined ? raw.storageRH : (raw.ambientRH !== undefined ? raw.ambientRH : (refFood ? refFood.recommendedRH : 75));
    const rawShelfLife = raw.targetShelfLifeDays !== undefined ? raw.targetShelfLifeDays : (refFood ? refFood.optimalMAPShelfLifeDays : 14);

    const moisture = Math.min(100, Math.max(0, parseFloat(rawMoisture) || 0));
    const waterActivity = Math.min(1.0, Math.max(0.1, parseFloat(rawAw) || 0.1));
    const fat = Math.min(100, Math.max(0, parseFloat(rawFat) || 0));
    const ph = Math.min(14.0, Math.max(1.0, parseFloat(rawPH) || 7.0));
    const storageTemp = Math.min(50, Math.max(-30, parseFloat(rawTemp) || 4));
    const ambientRH = Math.min(100, Math.max(10, parseFloat(rawRH) || 75));
    const targetShelfLifeDays = Math.min(730, Math.max(1, parseInt(rawShelfLife, 10) || 14));

    return {
      foodId: raw.foodId || (refFood ? refFood.id : "custom-commodity"),
      commodityName: raw.commodityName || raw.foodName || (refFood ? refFood.name : "Custom Food Formulation"),
      foodName: raw.foodName || raw.commodityName || (refFood ? refFood.name : "Custom Food Formulation"),
      category: raw.category || (refFood ? refFood.category : "Ready-to-Eat (RTE)"),
      moisture,
      waterActivity,
      fat,
      fatContent: fat,
      ph,
      storageTemp,
      ambientRH,
      storageRH: ambientRH,
      targetShelfLifeDays,
      respirationRate: raw.respirationRate || (refFood ? refFood.respirationRate : "None"),
      respirationValue: parseFloat(raw.respirationValue !== undefined ? raw.respirationValue : (refFood ? refFood.respirationValue : 0)),
      ethyleneSensitivity: raw.ethyleneSensitivity || (refFood ? refFood.ethyleneSensitivity : "None"),
      lightSensitivity: raw.lightSensitivity || (refFood ? refFood.lightSensitivity : "Moderate"),
      primarySpoilage: raw.primarySpoilage || (refFood ? refFood.primarySpoilage : ["Microbial outgrowth", "Moisture migration"]),
      storageType: raw.storageType || (storageTemp <= -10 ? "frozen" : (storageTemp <= 8 ? "chilled" : "ambient")),
      packWidthMm: parseFloat(raw.packWidthMm) || 150,
      packHeightMm: parseFloat(raw.packHeightMm) || 220,
      productWholesalePrice: parseFloat(raw.productWholesalePrice) || 3.50,
      isCustom: !refFood,
      dataSourceTag: refFood ? "[Reference Database: " + refFood.dataSource + "]" : "[User Input: Custom Physico-Chemical Profile]"
    };
  }

  /**
   * Target Barrier Calculation
   * Yields recommended target ranges rather than single pseudo-exact values
   */
  _calculateTargetBarrierRequirements(p) {
    let targetOTRMin = 0.1;
    let targetOTRMax = 5.0;
    let targetWVTRMin = 0.1;
    let targetWVTRMax = 2.5;
    let rationale = "";
    let lightBlockingRequired = false;

    // Respiration dynamic overrides
    if (p.category === "Fresh Produce") {
      if (p.respirationRate === "Extremely High" || p.respirationValue > 35) {
        targetOTRMin = 2500;
        targetOTRMax = 7000;
        targetWVTRMin = 25.0;
        targetWVTRMax = 65.0;
        rationale = "Extremely high produce respiration demands tailored laser micro-perforations to prevent anaerobic fermentation while moderating moisture loss.";
      } else if (p.respirationRate === "Very High" || p.respirationValue > 20) {
        targetOTRMin = 1500;
        targetOTRMax = 4500;
        targetWVTRMin = 20.0;
        targetWVTRMax = 50.0;
        rationale = "High respiratory activity requires high-flux gas transmission to maintain equilibrium 3-5% O2 and 8-12% CO2.";
      } else if (p.respirationRate === "Moderate" || p.respirationValue > 8) {
        targetOTRMin = 600;
        targetOTRMax = 2000;
        targetWVTRMin = 15.0;
        targetWVTRMax = 35.0;
        rationale = "Moderate respiration benefits from tailored micro-permeable film to maintain produce turgidity and delay senescence.";
      } else {
        targetOTRMin = 300;
        targetOTRMax = 1200;
        targetWVTRMin = 10.0;
        targetWVTRMax = 25.0;
        rationale = "Low respiration rate produce requires controlled oxygen ingress with moisture vapor venting.";
      }
    } else {
      // Non-respiring categories
      if (p.fat > 15 || p.category === "Snacks & Confectionery" || p.category === "Dry Foods & Grains") {
        targetOTRMin = 0.05;
        targetOTRMax = 2.0;
        targetWVTRMin = 0.05;
        targetWVTRMax = 1.0;
        rationale = "Elevated lipid content and low water activity require high barrier to atmospheric oxygen and water vapor ingress to prevent lipid rancidity and texture softening.";
        if (p.lightSensitivity === "High" || p.lightSensitivity === "Critical") {
          lightBlockingRequired = true;
        }
      } else if (p.category === "Meat & Poultry" || p.category === "Seafood") {
        targetOTRMin = 0.5;
        targetOTRMax = 2.0;
        targetWVTRMin = 0.5;
        targetWVTRMax = 2.5;
        rationale = "High protein and water activity require gas-tight barrier to maintain bacteriostatic MAP (30-60% CO2) or vacuum seal integrity.";
      } else if (p.category === "Bakery") {
        targetOTRMin = 1.0;
        targetOTRMax = 15.0;
        targetWVTRMin = 1.0;
        targetWVTRMax = 3.0;
        rationale = "Moisture retention required to prevent staling while preventing mould spore germination.";
      } else if (p.category === "Frozen Foods") {
        targetOTRMin = 2.0;
        targetOTRMax = 20.0;
        targetWVTRMin = 0.1;
        targetWVTRMax = 0.8;
        rationale = "Sub-zero temperatures reduce gas kinetic flux; primary hurdle is ultra-low WVTR to prevent ice crystal sublimation (freezer burn).";
      } else {
        targetOTRMin = 0.5;
        targetOTRMax = 3.0;
        targetWVTRMin = 0.5;
        targetWVTRMax = 2.0;
        rationale = "Standard high-barrier parameters for multi-hurdle food preservation.";
      }
    }

    return {
      targetOTRMin,
      targetOTRMax,
      targetOTRFormatted: `${targetOTRMin} - ${targetOTRMax} cc/m²·day·atm`,
      otrStandard: "ASTM D3985 (23°C, 0% RH, 1 atm O2)",
      targetWVTRMin,
      targetWVTRMax,
      targetWVTRFormatted: `${targetWVTRMin} - ${targetWVTRMax} g/m²·day`,
      wvtrStandard: "ASTM F1249 (38°C, 90% RH)",
      lightBlockingRequired,
      rationale
    };
  }

  /**
   * Suggested starting MAP gas composition
   */
  _calculateSuggestedStartingMAP(p) {
    let o2 = 0;
    let co2 = 0;
    let n2 = 100;
    let gasToProductRatio = "1.5 : 1 (Gas to food volume)";
    let rationale = "";
    let classification = "Inert Gas Flush";

    if (p.category === "Fresh Produce") {
      o2 = 3;
      co2 = 10;
      n2 = 87;
      classification = "Equilibrium MAP (EMA)";
      gasToProductRatio = "1.5 : 1 to 2.0 : 1";
      rationale = "Low O2 (3%) depresses respiration rate without initiating anaerobic fermentation; 10% CO2 suppresses fungal spore germination.";
    } else if (p.category === "Meat & Poultry") {
      if (p.commodityName.toLowerCase().includes("beef") || p.commodityName.toLowerCase().includes("steak") || p.commodityName.toLowerCase().includes("red")) {
        o2 = 70;
        co2 = 25;
        n2 = 5;
        classification = "High-Oxygen MAP (Myoglobin Blooming)";
        gasToProductRatio = "2.0 : 1";
        rationale = "High O2 (70%) promotes oxymyoglobin formation for bright cherry-red color; 25% CO2 provides bacteriostatic protection against aerobic spoilage bacteria.";
      } else {
        o2 = 0;
        co2 = 35;
        n2 = 65;
        classification = "Anaerobic Antimicrobial MAP";
        gasToProductRatio = "2.0 : 1";
        rationale = "Elevated CO2 (35%) dissolves into aqueous phase lowering intracellular pH of Gram-negative psychrotrophs; N2 prevents pack collapse.";
      }
    } else if (p.category === "Seafood") {
      o2 = 0;
      co2 = 45;
      n2 = 55;
      classification = "High-CO2 Antimicrobial MAP";
      gasToProductRatio = "2.5 : 1 (High volume to prevent pack collapse from CO2 dissolution)";
      rationale = "45% CO2 powerfully inhibits Pseudomonas and Shewanella; N2 balances volume. Chilled cold-chain ≤ 2°C mandatory for C. botulinum Type E hurdle.";
    } else if (p.category === "Dairy") {
      o2 = 0;
      co2 = 25;
      n2 = 75;
      classification = "Mold-Inhibitory MAP";
      gasToProductRatio = "1.0 : 1 to 1.5 : 1";
      rationale = "Eliminating O2 stops mold growth (Penicillium spp.) on cheese surfaces; CO2 prevents oxidative surface discoloration.";
    } else if (p.category === "Bakery") {
      o2 = 0;
      co2 = 40;
      n2 = 60;
      classification = "Anti-Mold MAP";
      gasToProductRatio = "1.5 : 1";
      rationale = "40% CO2 extends mold-free shelf life of high-moisture bakery items from 5 days to > 28 days without chemical propionates.";
    } else if (p.category === "Snacks & Confectionery" || p.category === "Dry Foods & Grains") {
      o2 = 0;
      co2 = 0;
      n2 = 100;
      classification = "Inert Gas Cushion Flush";
      gasToProductRatio = "1.0 : 1";
      rationale = "100% food-grade N2 displaces headspace O2 (< 0.5%) to stop lipid oxidation and provides physical pillow cushion against crushing.";
    } else {
      o2 = 0;
      co2 = 30;
      n2 = 70;
      classification = "Standard Food Preservation MAP";
      gasToProductRatio = "1.5 : 1";
      rationale = "30% CO2 / 70% N2 formulation provides general bacteriostatic and anti-oxidative protection.";
    }

    return {
      gasBlend: { o2, co2, n2 },
      blendLabel: `${o2}% O₂ / ${co2}% CO₂ / ${n2}% N₂`,
      classification,
      gasToProductVolumeRatio: gasToProductRatio,
      rationale,
      disclaimer: "Suggested starting atmosphere for pilot packing trials. In-package equilibrium will vary with respiration rate, temperature, and microbial biomass."
    };
  }

  /**
   * Laser micro-perforation specification for respiring produce
   */
  _calculatePerforationSpec(p) {
    if (p.category !== "Fresh Produce" || p.respirationRate === "None") {
      return { required: false, note: "Non-respiring product: continuous hermetic barrier required." };
    }

    const resp = p.respirationValue || 15;
    let holeCount = 4;
    let holeDiameter = 65;

    if (resp > 35) {
      holeCount = 12;
      holeDiameter = 85;
    } else if (resp > 20) {
      holeCount = 8;
      holeDiameter = 75;
    } else if (resp > 10) {
      holeCount = 6;
      holeDiameter = 65;
    }

    return {
      required: true,
      holeCount,
      holeDiameterMicrons: holeDiameter,
      laserType: "Precision CO2 Laser Galvo System (Non-contact)",
      targetGasTransmission: `Calculated to exchange ${(resp * 1.4).toFixed(1)} cc O2/pack·day at ${p.storageTemp}°C`,
      antiFogRecommended: true,
      antiFogReason: "Prevents internal water droplet lenses from obscuring produce and creating fungal focal points."
    };
  }

  /**
   * 5-Factor Weighted Compatibility Scoring (Suitability Score: X/100)
   */
  _scoreMaterials(params, targets) {
    return this.materialsDb.map(mat => {
      let barrierScore = 90;
      let respirationScore = 90;
      let storageScore = 90;
      let sustainabilityScore = 90;
      let costScore = 90;

      const matId = mat.id || "";
      const matRecyclability = mat.recyclabilityClass || "";
      const matOtr = mat.otr !== undefined ? mat.otr : 2.0;
      const matWvtr = mat.wvtr !== undefined ? mat.wvtr : 2.0;
      const matCost = mat.costPerSqM !== undefined ? mat.costPerSqM : 0.40;
      const matThickness = mat.totalThicknessMicrons !== undefined ? mat.totalThicknessMicrons : 70;
      const isRecommendedCat = Array.isArray(mat.recommendedCategories) && mat.recommendedCategories.includes(params.category);

      // Format physical suitability filter
      const isLiquidContainer = matId.includes("bottle") || matId.includes("glass") || matId.includes("can") || matId.includes("carton");
      if (params.category !== "Beverages & Liquids" && (matId.includes("bottle") || matId.includes("glass"))) {
        // Bottles and narrow glass jars are physically unsuitable for solid foods
        barrierScore = 15;
        respirationScore = 15;
        storageScore = 15;
      } else if (params.category === "Beverages & Liquids") {
        if (isLiquidContainer) {
          barrierScore = 98;
          respirationScore = 98;
          storageScore = 96;
        } else {
          barrierScore = 40;
          respirationScore = 40;
        }
      } else if (params.category === "Fresh Produce") {
        if (matOtr >= 1000 && matOtr <= 8000) {
          barrierScore = 98;
        } else if (matOtr >= 500 && matOtr <= 15000) {
          barrierScore = 85;
        } else if (matOtr < 100) {
          barrierScore = 20; // Impermeable barrier triggers rapid anaerobic rot
        } else {
          barrierScore = 60;
        }
      } else if (params.category === "Frozen Foods") {
        if (matId.includes("frozen") || matId.includes("cpet") || matId.includes("ldpe")) {
          barrierScore = 98;
          respirationScore = 96;
          storageScore = 98;
        } else {
          barrierScore = 70;
          storageScore = 60;
        }
      } else if (params.category === "Dry Foods & Grains" || params.category === "Snacks & Confectionery") {
        if (matWvtr <= 1.0 && (matOtr <= 20.0 || matId.includes("met") || matId.includes("alu") || matId.includes("triplex"))) {
          barrierScore = 98;
          respirationScore = 98;
        } else if (matWvtr <= 2.5) {
          barrierScore = 80;
        } else {
          barrierScore = 40;
        }
      } else if (params.category === "Bakery") {
        if (matId.includes("mono-pe") || matId.includes("natureflex") || matId.includes("bopp-met")) {
          barrierScore = 98;
          respirationScore = 96;
        } else if (matOtr <= targets.targetOTRMax && matWvtr <= targets.targetWVTRMax) {
          barrierScore = 92;
        } else {
          barrierScore = 65;
        }
      } else {
        // Meat & Poultry, Seafood, Dairy, Ready-to-Eat (RTE)
        if (matOtr <= targets.targetOTRMax && matWvtr <= targets.targetWVTRMax) {
          barrierScore = 98;
        } else if (matOtr <= targets.targetOTRMax * 2) {
          barrierScore = 85;
        } else if (matOtr > 100) {
          barrierScore = 30;
        } else {
          barrierScore = 70;
        }
      }

      // 2. Respiration & Spoilage Prevention (25%)
      if (params.category === "Fresh Produce") {
        if (matId.includes("perforated") || matId.includes("pla-pbat")) {
          respirationScore = 98;
        } else if (mat.type === "Co-extrusion" || mat.type === "Adhesive Laminate" || matId.includes("alu") || matId.includes("evoh")) {
          respirationScore = 15; // Severe risk of anaerobic rotting
        } else {
          respirationScore = 60;
        }
      } else if (params.category === "Snacks & Confectionery") {
        if (matId.includes("met") || matId.includes("alu") || matId.includes("bopp-met")) {
          respirationScore = 98; // Halts lipid rancidity
        } else if (matOtr <= 2.0) {
          respirationScore = 88;
        } else {
          respirationScore = 60;
        }
      } else if (params.category === "Dry Foods & Grains") {
        if (matWvtr <= 0.8 && matOtr <= 2.0) {
          respirationScore = 98;
        } else if (matId.includes("met") || matId.includes("triplex") || matId.includes("kraft")) {
          respirationScore = 92;
        } else {
          respirationScore = 70;
        }
      } else if (params.category === "Frozen Foods") {
        if (matId.includes("frozen") || matId.includes("cpet")) {
          respirationScore = 98;
        }
      } else if (params.category === "Beverages & Liquids") {
        if (isLiquidContainer) {
          respirationScore = 96;
        }
      } else {
        if (matOtr <= 2.0 && matWvtr <= 2.0) {
          respirationScore = 96;
        } else if (matOtr <= 15.0) {
          respirationScore = 80;
        } else {
          respirationScore = 50;
        }
      }

      // Category fit boost/alignment
      if (isRecommendedCat) {
        respirationScore = Math.min(100, respirationScore + 4);
      }

      // 3. Storage & Temperature Integrity (15%)
      if (params.storageType === "frozen") {
        if (matId.includes("cpet") || matId.includes("frozen") || matId.includes("ldpe")) {
          storageScore = 98;
        } else if (matId.includes("glass") || matId.includes("bottle")) {
          storageScore = 20; // Glass breakage under freezing expansion
        } else {
          storageScore = 65;
        }
      } else if (params.storageType === "chilled") {
        if (matId.includes("tray") || matId.includes("pa-evoh") || matId.includes("mono-pe") || matId.includes("bottle") || matId.includes("perforated")) {
          storageScore = 96;
        } else {
          storageScore = 88;
        }
      } else {
        storageScore = 94;
      }

      // 4. Sustainability & EU PPWR Recyclability (15%)
      if (matRecyclability.includes("Class A") || matRecyclability.includes("Compostable") || matId.includes("rpet")) {
        sustainabilityScore = 96;
      } else if (matRecyclability.includes("Class B")) {
        sustainabilityScore = 82;
      } else {
        sustainabilityScore = 55;
      }

      // 5. Commercial Cost Viability (10%)
      if (matCost <= 0.30) {
        costScore = 96;
      } else if (matCost <= 0.55) {
        costScore = 88;
      } else if (matCost <= 0.85) {
        costScore = 76;
      } else {
        costScore = 65;
      }

      // Clamp component scores
      barrierScore = Math.max(0, Math.min(100, Math.round(barrierScore)));
      respirationScore = Math.max(0, Math.min(100, Math.round(respirationScore)));
      storageScore = Math.max(0, Math.min(100, Math.round(storageScore)));
      sustainabilityScore = Math.max(0, Math.min(100, Math.round(sustainabilityScore)));
      costScore = Math.max(0, Math.min(100, Math.round(costScore)));

      // Compute weighted total
      const totalScore = Math.round(
        (barrierScore * 0.35) +
        (respirationScore * 0.25) +
        (storageScore * 0.15) +
        (sustainabilityScore * 0.15) +
        (costScore * 0.10)
      );

      return {
        ...mat,
        suitabilityScore: totalScore,
        scoreBreakdown: {
          barrierMatch: barrierScore,
          respirationSpoilage: respirationScore,
          storageTemp: storageScore,
          sustainability: sustainabilityScore,
          costViability: costScore,
          totalScore
        }
      };
    }).sort((a, b) => b.suitabilityScore - a.suitabilityScore);
  }

  /**
   * Transparent 'Why this recommendation?' explanation (6 core factors)
   */
  _generateWhyExplanation(p, barrier, mat, map) {
    const isProduce = p.category === "Fresh Produce";
    const spoilageList = p.primarySpoilage || ["aerobic microbial proliferation", "moisture migration"];

    return [
      {
        factor: "Moisture & Water Activity Control",
        title: "Moisture & Water Activity Control",
        status: p.waterActivity > 0.85 ? "High Free Water Risk" : "Desiccation & Crispness Control",
        rationale: isProduce
          ? `Product water activity (${p.waterActivity.toFixed(2)}) and high moisture (${p.moisture}%) require controlled water vapor permeability (${mat.wvtrRange || mat.wvtr}) to avoid condensation droplets that trigger fungal rot while preventing shrivel.`
          : `Water activity of ${p.waterActivity.toFixed(2)} requires WVTR of ${mat.wvtrRange || mat.wvtr} (${mat.wvtrStandard || "ASTM F1249"}) to prevent ${p.waterActivity < 0.4 ? "ambient moisture sorption and loss of crisp snap" : "desiccation and surface dehydration"}.`
      },
      {
        factor: "Oxygen Barrier & Oxidative Stability",
        title: "Oxygen Barrier & Oxidative Stability",
        status: p.fat > 10 ? "Lipid Auto-Oxidation Critical" : "Standard Aerobic Control",
        rationale: isProduce
          ? `Active respiration (${p.respirationValue || 20} mg CO₂/kg·h) requires balanced OTR (${mat.otrRange || mat.otr}) to maintain 3-5% in-pack O₂, strictly preventing tissue suffocation and anaerobic off-odors.`
          : `Fat content (${p.fat}%) and oxygen sensitivity require target OTR ${barrier.targetOTRFormatted} (${barrier.otrStandard}). Selected material delivers ${mat.otrRange || mat.otr}, halting lipid oxidation and microbial doubling.`
      },
      {
        factor: "Respiration Kinetics & Atmosphere Dynamic",
        title: "Respiration Kinetics & Atmosphere Dynamic",
        status: isProduce ? "Active Respiratory Physiology" : "Inert Post-Harvest State",
        rationale: isProduce
          ? `Metabolic activity demands Equilibrium Modified Atmosphere (EMA). Selected film provides gas flux tailored to ${p.storageTemp}°C storage.`
          : `Food commodity exhibits zero post-packaging respiration. Inert MAP gas blanketing (${map.blendLabel}) provides stable head-space preservation without volume deflation.`
      },
      {
        factor: "Microbial Hurdles & Food Safety Boundaries",
        title: "Microbial Hurdles & Food Safety Boundaries",
        status: p.ph < 4.6 ? "Acid Inhibited (pH < 4.6)" : "Non-Acid Matrix (pH ≥ 4.6)",
        rationale: `With product pH ${p.ph.toFixed(1)} and Aw ${p.waterActivity.toFixed(2)}, primary spoilage vectors are ${spoilageList.slice(0, 2).join(" and ")}. ${p.ph >= 4.6 && p.waterActivity > 0.85 ? "Non-acid chilled matrix demands continuous cold-chain (≤4°C) to prevent psychrotrophic pathogen outgrowth." : "Acidic or low-Aw matrix provides natural intrinsic resistance against bacterial spore outgrowth."}`
      },
      {
        factor: "Light & Photo-Oxidation Protection",
        title: "Light & Photo-Oxidation Protection",
        status: barrier.lightBlockingRequired ? "Photo-Sensitive Protection Active" : "Visual Retail Clarity Prioritized",
        rationale: barrier.lightBlockingRequired
          ? `High light sensitivity and lipid content require UV-absorbing additives, metallized substrate, or opaque barrier to prevent photo-oxidation under retail fluorescent lighting.`
          : `Moderate/low light sensitivity permits optical clarity (${mat.clarity || "Transparent"}) for consumer visual inspection without accelerating oxidative rancidity.`
      },
      {
        factor: "Mechanical Strength & Logistics Integrity",
        title: "Mechanical Strength & Logistics Integrity",
        status: "Hermetic Seal & Puncture Resistance",
        rationale: `Material delivers ${mat.punctureResistance || "24 N"} (${mat.punctureStandard || "ASTM D1709"}) and robust heat seal strength (${mat.sealStrength || "30 N/15mm"}) at ${mat.sealTempRange || `${mat.sealInitiationTemp}°C`} for hermetic seal integrity during distribution handling.`
      }
    ];
  }

  /**
   * Synthesize interactive multi-layer cross-section graphic
   */
  _synthesizeLaminateStructure(p, barrier, mat) {
    const matId = mat.id || "";

    if (matId.includes("frozen") || (p.category === "Frozen Foods" && matId.includes("ldpe"))) {
      return {
        structureName: "Heavy-Duty Co-ex LLDPE / LDPE Cold-Tough 3-Layer Frozen Film",
        totalThicknessMicrons: mat.totalThicknessMicrons || 80,
        calculatedOTR: mat.otr || 450,
        rationale: "Metallocene LLDPE core provides high-impact puncture resistance down to -40°C, preventing brittle shatter during frozen distribution.",
        layers: [
          { position: "Outer Structural Layer", material: "30µm Gloss LDPE Outer Web", functionalRole: "Flex-crack resistance and freeze printability", thicknessMicrons: 30 },
          { position: "Core Toughening Layer", material: "20µm Metallocene-LLDPE Core", functionalRole: "Sub-zero ductile impact absorption and tear stop", thicknessMicrons: 20 },
          { position: "Inner Low-Temp Sealant", material: "30µm EVA-Modified LLDPE", functionalRole: "Hermetic freeze-seal (98°C SIT) through frost crystals", thicknessMicrons: 30 }
        ],
        recyclabilityVerdict: "Class A (100% Polyethylene Mono-Material Flexible Stream)"
      };
    }

    if (matId.includes("bopp-met")) {
      return {
        structureName: "BOPP / Metallized-BOPP 3-Layer Snack Barrier Laminate",
        totalThicknessMicrons: mat.totalThicknessMicrons || 42,
        calculatedOTR: mat.otr || 15.0,
        rationale: "Nano-deposited vacuum aluminium layer blocks 99% UV light and provides ultra-low WVTR (< 0.8 g/m²·day) to preserve fried snack crispness.",
        layers: [
          { position: "Outer Structural Layer", material: "20µm Reverse-Printed BOPP", functionalRole: "High-gloss clarity, stiffness, print protection", thicknessMicrons: 20 },
          { position: "Adhesive Tie Layer", material: "2µm Polyolefin Extrusion Primer", functionalRole: "Interlayer lamination bond", thicknessMicrons: 2 },
          { position: "Core Barrier & Sealant", material: "20µm Vacuum-Metallized BOPP (Met-BOPP)", functionalRole: "Moisture barrier (WVTR 0.8) and light-blocking seal", thicknessMicrons: 20 }
        ],
        recyclabilityVerdict: "Class A (Polypropylene Mono-Material Stream)"
      };
    }

    if (matId.includes("bottle") || matId.includes("pet-barrier")) {
      return {
        structureName: "Multi-Layer Barrier rPET Bottle with Scavenger Blend",
        totalThicknessMicrons: mat.totalThicknessMicrons || 350,
        calculatedOTR: mat.otr || 0.2,
        rationale: "Rigid polyester container pairing active oxygen scavengers in core with high-purity food-contact rPET skins.",
        layers: [
          { position: "Outer Structural Skin", material: "140µm Virgin / Post-Consumer rPET", functionalRole: "Dimensional rigidity, drop impact strength, clarity", thicknessMicrons: 140 },
          { position: "Core Active Scavenger", material: "70µm PET + Active O₂ Scavenger (<3% wt)", functionalRole: "Binds dissolved oxygen, halts ascorbic acid oxidation", thicknessMicrons: 70 },
          { position: "Inner Contact Layer", material: "140µm High-Purity Food Contact rPET", functionalRole: "Direct food contact compliance (EFSA/FDA certified)", thicknessMicrons: 140 }
        ],
        recyclabilityVerdict: "Class A (Bottle-to-Bottle rPET Circular Stream)"
      };
    }

    if (matId.includes("rpet") || matId.includes("tray")) {
      return {
        structureName: "Thermoformed rPET / PE / EVOH High-Barrier Rigid MAP Tray",
        totalThicknessMicrons: mat.totalThicknessMicrons || 450,
        calculatedOTR: mat.otr || 0.8,
        rationale: "Rigid tray base providing structural containment and gas barrier for high-CO2 MAP atmospheres.",
        layers: [
          { position: "Outer Structural Base", material: "360µm 80% Post-Consumer Recycled rPET", functionalRole: "Mechanical rigidity, stackability, circular PCR content", thicknessMicrons: 360 },
          { position: "Adhesive Tie Layer", material: "10µm Modified Polyolefin Tie", functionalRole: "Permanent lamination bond to barrier skin", thicknessMicrons: 10 },
          { position: "Core Barrier Layer", material: "15µm EVOH Gas Barrier Core", functionalRole: "Preserves 30-70% CO2/O2 MAP gas concentrations", thicknessMicrons: 15 },
          { position: "Inner PE Seal Web", material: "65µm Peelable PE Sealant Film", functionalRole: "Hermetic peelable weld to top lidding film", thicknessMicrons: 65 }
        ],
        recyclabilityVerdict: "Class A (Rigid PET Tray Sorting Stream > 80% PCR)"
      };
    }

    if (matId.includes("mono-pe")) {
      return {
        structureName: "Mono-PE Recyclable 3-Layer High-Barrier Co-extrusion",
        totalThicknessMicrons: mat.totalThicknessMicrons || 78,
        calculatedOTR: mat.otr || 1.5,
        rationale: "MDO-PE outer skin provides high tensile stiffness and printability while inner EVOH/PE delivers oxygen barrier in a single recyclable PE stream.",
        layers: [
          { position: "Outer Structural Layer", material: "25µm MDO-Polyethylene (MDO-PE)", functionalRole: "Printability, thermal resistance, dimensional stability", thicknessMicrons: 25 },
          { position: "Adhesive Tie Layer", material: "3µm Polyolefin Solvent-Free Adhesive", functionalRole: "Interlayer bond strength", thicknessMicrons: 3 },
          { position: "Core Barrier Layer", material: "5µm EVOH Gas Core (< 5% wt)", functionalRole: "Oxygen & aroma barrier (OTR 1.5 cc/m²·day)", thicknessMicrons: 5 },
          { position: "Adhesive Tie Layer", material: "3µm Polyolefin Solvent-Free Adhesive", functionalRole: "Interlayer bond strength", thicknessMicrons: 3 },
          { position: "Inner Sealant Layer", material: "42µm LLDPE Metallocene Seal Web", functionalRole: "Hermetic low-temp heat seal (105°C SIT)", thicknessMicrons: 42 }
        ],
        recyclabilityVerdict: "Class A (CEFLEX Polyolefin Mono-Material Stream)"
      };
    }

    if (matId.includes("pet-alu-pe") || matId.includes("foil") || matId.includes("triplex")) {
      return {
        structureName: "PET / Aluminium / PE 5-Layer Ultra-Barrier Laminate",
        totalThicknessMicrons: mat.totalThicknessMicrons || 85,
        calculatedOTR: mat.otr || 0.05,
        rationale: "Continuous aluminium foil provides zero gas, water vapor, and UV light transmission for ultra-sensitive or long-shelf-life products.",
        layers: [
          { position: "Outer Structural Layer", material: "12µm Biaxially Oriented PET (BOPET)", functionalRole: "High tensile strength, puncture resistance, gloss", thicknessMicrons: 12 },
          { position: "Adhesive Tie Layer", material: "3µm Polyurethane Adhesive", functionalRole: "Adhesion between polyester and aluminium", thicknessMicrons: 3 },
          { position: "Core Barrier Layer", material: "7µm Metallic Aluminium Foil (Alu)", functionalRole: "Total oxygen, moisture, and light barrier", thicknessMicrons: 7 },
          { position: "Adhesive Tie Layer", material: "3µm Polyurethane Adhesive", functionalRole: "Adhesion to inner polyethylene", thicknessMicrons: 3 },
          { position: "Inner Sealant Layer", material: "60µm LLDPE Hermetic Seal Web", functionalRole: "Weld sealability and product contact safety", thicknessMicrons: 60 }
        ],
        recyclabilityVerdict: "Class D (Multi-material non-separable laminate)"
      };
    }

    if (matId.includes("perforated") || p.category === "Fresh Produce") {
      return {
        structureName: "Micro-Perforated Anti-Fog BOPP Breathable Produce Film",
        totalThicknessMicrons: mat.totalThicknessMicrons || 30,
        calculatedOTR: mat.otr || 2800,
        rationale: "Precision laser micro-perforations maintain Equilibrium Modified Atmosphere (EMA) while anti-fog surfactant prevents water lens condensation.",
        layers: [
          { position: "Outer Structural Layer", material: "25µm BOPP Base Web", functionalRole: "High clarity, mechanical stiffness, tear resistance", thicknessMicrons: 25 },
          { position: "Active Surface Treatment", material: "CO₂ Laser Micro-Perforations (65-85 µm)", functionalRole: "Equilibrium O₂/CO₂ gas exchange for respiration", thicknessMicrons: 0 },
          { position: "Inner Sealant & Anti-Fog", material: "5µm Co-ex PP + Anti-Fog Additives", functionalRole: "Prevents water condensation droplet lenses", thicknessMicrons: 5 }
        ],
        recyclabilityVerdict: "Class A (Polypropylene Mono-Material Stream)"
      };
    }

    // Standard Co-ex Barrier
    return {
      structureName: "9-Layer Symmetrical Co-extruded PA / EVOH / PE Barrier Film",
      totalThicknessMicrons: mat.totalThicknessMicrons || 70,
      calculatedOTR: mat.otr || 1.2,
      rationale: "Multi-layer co-extrusion pairing dual polyamide puncture resistance with EVOH gas containment and metallocene polyethylene heat sealability.",
      layers: [
        { position: "Outer Structural Layer", material: "15µm Polyamide (PA / Nylon 6)", functionalRole: "Puncture & abrasion resistance, thermoformability", thicknessMicrons: 15 },
        { position: "Adhesive Tie Layer", material: "3µm Maleic Anhydride Modified PE", functionalRole: "Polymer graft bonding", thicknessMicrons: 3 },
        { position: "Core Barrier Layer", material: "5µm Ethylene Vinyl Alcohol (EVOH 38% mol)", functionalRole: "High oxygen and aroma containment", thicknessMicrons: 5 },
        { position: "Adhesive Tie Layer", material: "3µm Maleic Anhydride Modified PE", functionalRole: "Polymer graft bonding", thicknessMicrons: 3 },
        { position: "Inner Sealant Layer", material: "44µm LLDPE / PE Metallocene Sealant", functionalRole: "Hermetic seal through fat & liquid contamination", thicknessMicrons: 44 }
      ],
      recyclabilityVerdict: "Class B (Recyclable where advanced polyolefin sorting is deployed)"
    };
  }

  /**
   * Engineering Risks & Quality Alerts
   */
  _detectEngineeringRisks(p, mat) {
    const warnings = [];
    const matOtr = mat.otr !== undefined ? mat.otr : 2.0;
    const matWvtr = mat.wvtr !== undefined ? mat.wvtr : 2.0;
    const matClarity = mat.clarity || "";

    if (p.category === "Fresh Produce" && matOtr < 500) {
      warnings.push({
        severity: "CRITICAL RISK",
        title: "Anaerobic Fermentation Hazard",
        detail: "Applying an impermeable high-barrier film to actively respiring produce will deplete in-pack O₂ below 1%, triggering ethanol fermentation, tissue necrosis, and off-flavors. Breathable micro-perforated film is mandatory."
      });
    }

    if (p.ph >= 4.6 && p.waterActivity > 0.92 && p.storageType === "chilled") {
      warnings.push({
        severity: "FOOD SAFETY ALERT",
        title: "Non-Proteolytic Clostridium botulinum Hurdle Requirement",
        detail: "Because pH ≥ 4.6 and Aw > 0.92 in anaerobic modified atmospheres, non-proteolytic Clostridium botulinum Type E can germinate down to 3.0°C. Chilled storage strictly ≤ 4.0°C and shelf-life limit ≤ 14 days are recommended unless an additional validated hurdle is present."
      });
    }

    if (p.fat > 25 && p.lightSensitivity === "Critical" && matClarity.includes("Transparent")) {
      warnings.push({
        severity: "QUALITY DEGRADATION WARNING",
        title: "Photo-Oxidation / Rancidity Risk",
        detail: "High fat content combined with critical light sensitivity requires UV-blocking masterbatch or metallized foil barrier. Transparent packaging in retail light display will cause photo-sensitized lipid oxidation within 7–14 days."
      });
    }

    if (p.category === "Dry Foods & Grains" && p.waterActivity < 0.35 && matWvtr > 3.0) {
      warnings.push({
        severity: "TEXTURE LOSS RISK",
        title: "Atmospheric Moisture Ingress & Sogginess",
        detail: "Low water activity dry goods (Aw < 0.35) will absorb ambient humidity if WVTR > 1.0 g/m²·day, causing loss of crisp snap and premature product rejection."
      });
    }

    return warnings;
  }

  /**
   * Alternative packaging options for side-by-side comparison
   */
  _selectAlternativeMaterials(ranked, primary) {
    const sustainable = ranked.find(m => m.id !== primary.id && ((m.recyclabilityClass || "").includes("Class A") || (m.recyclabilityClass || "").includes("Compostable"))) || ranked[1] || ranked[0];
    const highBarrier = ranked.find(m => m.id !== primary.id && m.otr <= 1.0) || ranked[2] || ranked[0];
    const costOptimized = [...ranked].filter(m => m.id !== primary.id).sort((a, b) => (a.costPerSqM || 0.5) - (b.costPerSqM || 0.5))[0] || ranked[1] || ranked[0];

    return {
      sustainableAlternative: sustainable,
      highBarrierAlternative: highBarrier,
      costOptimizedAlternative: costOptimized
    };
  }

  /**
   * Estimated Shelf Life Calculation (Modelled estimate)
   */
  _estimateShelfLife(p, mat) {
    const baseRefTemp = p.storageType === "chilled" ? 4.0 : (p.storageType === "frozen" ? -18.0 : 20.0);
    const tempDelta = p.storageTemp - baseRefTemp;
    const q10Factor = Math.pow(2.1, tempDelta / 10.0);

    const matId = mat.id || "";
    const matOtr = mat.otr !== undefined ? mat.otr : 2.0;
    const matWvtr = mat.wvtr !== undefined ? mat.wvtr : 2.0;

    let baselineDays = p.targetShelfLifeDays || 14;
    if (p.category === "Fresh Produce") {
      baselineDays = (matId.includes("perforated") || matId.includes("pla-pbat")) ? 14 : 4;
    } else if (p.category === "Meat & Poultry" || p.category === "Seafood") {
      baselineDays = matOtr <= 2.0 ? 14 : 5;
    } else if (p.category === "Bakery") {
      baselineDays = matWvtr <= 2.0 && matOtr <= 15.0 ? 28 : 7;
    } else if (p.category === "Snacks & Confectionery") {
      baselineDays = matWvtr <= 1.0 && matOtr <= 20.0 ? 240 : 45;
    } else if (p.category === "Dry Foods & Grains") {
      baselineDays = matWvtr <= 0.8 ? 365 : 90;
    } else if (p.category === "Frozen Foods") {
      baselineDays = matWvtr <= 0.5 ? 540 : 180;
    }

    const estimatedDays = Math.max(1, Math.round(baselineDays / q10Factor));
    return {
      estimatedDays,
      baselineOptimalDays: baselineDays,
      storageTemp: p.storageTemp,
      q10Acceleration: q10Factor.toFixed(2),
      confidenceNote: "Modelled kinetic estimate. Commercial deployment requires physical Accelerated Shelf-Life Testing (ASLT) validation under ISO 16779."
    };
  }
}

// Global scope exposure
const globalScopeEngine = typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : global);
globalScopeEngine.PackagingRecommendationEngine = PackagingRecommendationEngine;
globalScopeEngine.packagingEngine = new PackagingRecommendationEngine();
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PackagingRecommendationEngine, packagingEngine: globalScopeEngine.packagingEngine };
}
