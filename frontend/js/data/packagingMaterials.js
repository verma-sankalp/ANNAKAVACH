/**
 * Annakavach — Packaging Materials Engineering Database
 * Standardized polymer, laminate, co-extrusion, bio-based, and rigid barrier specifications
 * with empirical ASTM/ISO test values, ranges, and circularity indices.
 *
 * Test Standards Reference:
 * - OTR: ASTM D3985 (23°C, 0% RH, 1 atm O2, cc/m²·day·atm)
 * - WVTR: ASTM F1249 (38°C, 90% RH, g/m²·day)
 * - Seal Initiation Temp (SIT): ASTM F88 / ASTM F2029 (°C)
 * - Tensile & Puncture: ASTM D882 / ASTM D1709 (N / MPa)
 * - Compostability: DIN EN 13432 / ASTM D6400
 * - Recyclability Classification: EU Packaging and Packaging Waste Regulation (PPWR 2030) / APR Guidelines
 */

const PACKAGING_MATERIALS = [
  // =========================================================================
  // 1. HIGH-BARRIER CO-EXTRUSIONS & LAMINATES (Flexible Meat, Fish, Cheese)
  // =========================================================================
  {
    id: "pa-evoh-pe-coex",
    name: "9-Layer PA / EVOH / PE High-Barrier Film",
    shortName: "PA/EVOH/PE Co-ex Barrier",
    type: "Co-extrusion",
    layers: "PA // Tie // EVOH // Tie // PE // LLDPE Sealant (Co-extruded)",
    layerCount: 9,
    totalThicknessMicrons: 70,
    thicknessRange: "60 - 85 µm",
    density: 0.98, // g/cm³

    // Barrier Properties
    otr: 1.2,
    otrRange: "0.8 - 2.0 cc/m²·day·atm",
    otrStandard: "ASTM D3985 (23°C, 0% RH)",
    wvtr: 1.8,
    wvtrRange: "1.2 - 2.5 g/m²·day",
    wvtrStandard: "ASTM F1249 (38°C, 90% RH)",
    co2Permeability: "4.5 cc/m²·day·atm",

    // Mechanical & Thermal
    tensileStrengthMD: 65, // MPa
    tensileStrengthTD: 58,
    punctureResistance: "38 N (Extreme puncture resistance)",
    punctureStandard: "ASTM D1709",
    sealInitiationTemp: 115, // °C
    sealTempRange: "110 - 135 °C",
    sealStrength: "32 N/15mm (Hermetic heat seal)",

    // Visual & Surface
    clarity: "High Gloss / Transparent (Haze < 4.5%)",
    uvBarrier: "Moderate (Blocks 60% UV-A)",
    antiFog: "Optional internal additive available",

    // Sustainability & Commercial
    recyclabilityClass: "Class B (Recyclable in advanced polyolefin streams if EVOH < 5% wt)",
    euPPWRCompliant: true,
    plasticTaxApplicable: true,
    carbonFootprintKgCO2e: 3.1, // kg CO2e / kg resin (Cradle-to-gate LCA)
    costPerSqM: 0.42, // USD/m² estimated
    costRangePerSqM: "$0.38 - $0.48 / m²",
    commercialBatchMin: "10,000 m²",

    // Target Food Applications
    recommendedCategories: ["Meat & Poultry", "Seafood", "Dairy", "Ready-to-Eat (RTE)"],
    primaryUseCases: [
      "Fresh chilled beef/lamb retail MAP trays (lidding film)",
      "Smoked salmon & processed fish vacuum pouches",
      "Block cheese ripening and consumer barrier bags"
    ],
    technicalNotes: "EVOH core provides gas barrier while dual PA layers impart puncture resistance against sharp bone points.",
    dataSource: "Plastics Packaging Technology Handbook / Kuraray EVAL Technical Data"
  },
  {
    id: "pet-alu-pe-triplex",
    name: "PET / Aluminium Foil / PE Ultra-Barrier Triplex Laminate",
    shortName: "PET/Alu/PE Triplex",
    type: "Adhesive Laminate",
    layers: "12µm PET // Polyurethane Adhesive // 7µm Aluminium Foil // Polyurethane Adhesive // 60µm LLDPE",
    layerCount: 5,
    totalThicknessMicrons: 85,
    thicknessRange: "75 - 110 µm",
    density: 1.15,

    otr: 0.05,
    otrRange: "< 0.1 cc/m²·day·atm (Absolute barrier)",
    otrStandard: "ASTM D3985",
    wvtr: 0.05,
    wvtrRange: "< 0.1 g/m²·day (Impermeable to moisture)",
    wvtrStandard: "ASTM F1249",
    co2Permeability: "< 0.1 cc/m²·day·atm",

    tensileStrengthMD: 85,
    tensileStrengthTD: 80,
    punctureResistance: "24 N (Susceptible to flex-crack pinholing)",
    punctureStandard: "ASTM D1709",
    sealInitiationTemp: 130,
    sealTempRange: "125 - 150 °C",
    sealStrength: "45 N/15mm (Heavy-duty peel-resistant weld seal)",

    clarity: "100% Opaque Metallic (Total Light Barrier)",
    uvBarrier: "100% UV & Visible Light Block (0 - 800 nm)",
    antiFog: "Not applicable (Opaque)",

    recyclabilityClass: "Class D (Non-recyclable multi-material laminate under current mechanical sorting)",
    euPPWRCompliant: false, // Disadvantaged under EU PPWR 2030 design for recycling
    plasticTaxApplicable: true,
    carbonFootprintKgCO2e: 5.4,
    costPerSqM: 0.65,
    costRangePerSqM: "$0.58 - $0.75 / m²",
    commercialBatchMin: "15,000 m²",

    recommendedCategories: ["Dry Foods & Grains", "Snacks & Confectionery", "Beverages & Liquids"],
    primaryUseCases: [
      "Whole roasted coffee bean valve stand-up pouches",
      "Infant formula milk powder hermetic pouches",
      "High-value spice & dehydrated soup packaging"
    ],
    technicalNotes: "Continuous metallic aluminium foil provides zero light transmission and near-zero OTR/WVTR. Requires careful handling to avoid flex-cracking.",
    dataSource: "Alufoil European Aluminium Foil Association / Robertson Food Packaging (3rd Ed)"
  },

  // =========================================================================
  // 2. MONO-MATERIAL RECYCLABLE BARRIERS (EU PPWR 2030 Class A Compliant)
  // =========================================================================
  {
    id: "mono-pe-evoh-barrier",
    name: "Mono-Material High-Barrier Polyethylene (MDO-PE / EVOH / PE)",
    shortName: "Mono-PE High-Barrier (Class A Recyclable)",
    type: "Mono-Material Polyolefin",
    layers: "25µm MDO-PE Print Web // Solvent-free Adhesive // 50µm PE/EVOH/PE Sealant (< 5% EVOH wt)",
    layerCount: 3,
    totalThicknessMicrons: 78,
    thicknessRange: "65 - 90 µm",
    density: 0.94,

    otr: 1.5,
    otrRange: "1.0 - 2.5 cc/m²·day·atm",
    otrStandard: "ASTM D3985",
    wvtr: 2.2,
    wvtrRange: "1.8 - 3.0 g/m²·day",
    wvtrStandard: "ASTM F1249",
    co2Permeability: "5.8 cc/m²·day·atm",

    tensileStrengthMD: 120,
    tensileStrengthTD: 45,
    punctureResistance: "28 N",
    punctureStandard: "ASTM D882 / D1709",
    sealInitiationTemp: 105,
    sealTempRange: "100 - 125 °C",
    sealStrength: "30 N/15mm",

    clarity: "Transparent / High Gloss (Haze < 6.0%)",
    uvBarrier: "Low (UV absorber masterbatch can be added)",
    antiFog: "Compatible with co-ex anti-fog seal layer",

    recyclabilityClass: "Class A (Fully recyclable in PE flexible film stream, >95% PE content)",
    euPPWRCompliant: true,
    plasticTaxApplicable: false, // Exempt or discounted under recycled content mandates
    carbonFootprintKgCO2e: 2.4,
    costPerSqM: 0.52,
    costRangePerSqM: "$0.46 - $0.59 / m²",
    commercialBatchMin: "10,000 m²",

    recommendedCategories: ["Meat & Poultry", "Seafood", "Dairy", "Bakery", "Dry Foods & Grains"],
    primaryUseCases: [
      "Sustainable barrier pouches for grated/block cheeses",
      "MAP pillow packs for crusty bread and bakery goods",
      "Recyclable high-barrier pouches for nuts and dried fruits"
    ],
    technicalNotes: "Machine Direction Oriented (MDO) PE outer layer provides dimensional heat resistance for high-speed pouch-making while maintaining full mono-PE recycling stream compatibility (CEFLEX compliant).",
    dataSource: "CEFLEX Design Guidelines / Borealis & ExxonMobil PE Barrier Datasheets"
  },
  {
    id: "bopp-met-bopp-barrier",
    name: "Metallized BOPP / BOPP Barrier Laminate (Snack Film)",
    shortName: "BOPP / Met-BOPP Snack Film",
    type: "Mono-PP Compatible Laminate",
    layers: "20µm Clear BOPP (Reverse Printed) // Extrusion Lamination // 20µm Metallized BOPP (Met-BOPP)",
    layerCount: 3,
    totalThicknessMicrons: 42,
    thicknessRange: "35 - 50 µm",
    density: 0.91,

    otr: 15.0,
    otrRange: "10.0 - 25.0 cc/m²·day·atm",
    otrStandard: "ASTM D3985",
    wvtr: 0.8,
    wvtrRange: "0.5 - 1.2 g/m²·day",
    wvtrStandard: "ASTM F1249",
    co2Permeability: "40.0 cc/m²·day·atm",

    tensileStrengthMD: 140,
    tensileStrengthTD: 220,
    punctureResistance: "18 N",
    punctureStandard: "ASTM D882",
    sealInitiationTemp: 110,
    sealTempRange: "105 - 130 °C",
    sealStrength: "18 N/15mm (Crisp peelable fin-seal / lap-seal)",

    clarity: "Brilliant Metallic Mirror Finish",
    uvBarrier: "High (Optical Density 2.2 - 2.8, blocks 99% UV)",
    antiFog: "Not applicable",

    recyclabilityClass: "Class A (Polypropylene stream recyclable in mono-PP sorting lines)",
    euPPWRCompliant: true,
    plasticTaxApplicable: true,
    carbonFootprintKgCO2e: 2.1,
    costPerSqM: 0.26,
    costRangePerSqM: "$0.22 - $0.32 / m²",
    commercialBatchMin: "20,000 m²",

    recommendedCategories: ["Snacks & Confectionery", "Bakery", "Dry Foods & Grains"],
    primaryUseCases: [
      "Crispy potato chips & extruded corn snacks (VFFS bagger)",
      "Butter biscuits, wafers, and snack bars",
      "Instant noodles and dried soup seasoning sachets"
    ],
    technicalNotes: "Vacuum vapor-deposited aluminium nano-layer provides exceptional moisture barrier (WVTR < 1.0 g/m²·day) and light shielding at very low material weight.",
    dataSource: "Jindal Films / Toray Plastics Barrier Films Technical Specs"
  },

  // =========================================================================
  // 3. BREATHABLE & MICRO-PERFORATED FILMS (Fresh Produce & Active Respiration)
  // =========================================================================
  {
    id: "laser-perforated-bopp",
    name: "Laser Micro-Perforated Anti-Fog BOPP Produce Film",
    shortName: "Micro-Perforated Anti-Fog BOPP",
    type: "Tailored Permeability Film",
    layers: "30µm Biaxially Oriented Polypropylene with Co-ex Anti-Fog Skin + Precision CO2 Laser Holes (60-90µm)",
    layerCount: 2,
    totalThicknessMicrons: 30,
    thicknessRange: "25 - 40 µm",
    density: 0.90,

    otr: 2800.0,
    otrRange: "1500 - 6000 cc/m²·day·atm (Tailored via hole count & pitch)",
    otrStandard: "Modified Isostatic Flow / ASTM D3985",
    wvtr: 35.0,
    wvtrRange: "25 - 60 g/m²·day",
    wvtrStandard: "ASTM F1249",
    co2Permeability: "3200.0 cc/m²·day·atm (Balanced 1:1.1 O2/CO2 ratio)",

    tensileStrengthMD: 130,
    tensileStrengthTD: 240,
    punctureResistance: "14 N",
    punctureStandard: "ASTM D882",
    sealInitiationTemp: 115,
    sealTempRange: "110 - 135 °C",
    sealStrength: "15 N/15mm (Clean peel or crimp seal)",

    clarity: "Ultra-Clear with Anti-Fog Surface (Prevents droplet fogging)",
    uvBarrier: "Low (Unblocked visible spectrum)",
    antiFog: "Active chemical anti-fog coating prevents condensation lenses",

    recyclabilityClass: "Class A (Mono-PP collection stream)",
    euPPWRCompliant: true,
    plasticTaxApplicable: true,
    carbonFootprintKgCO2e: 1.9,
    costPerSqM: 0.22,
    costRangePerSqM: "$0.18 - $0.28 / m²",
    commercialBatchMin: "10,000 m²",

    recommendedCategories: ["Fresh Produce"],
    primaryUseCases: [
      "Fresh strawberry & raspberry punnet lidding film",
      "Baby spinach, rocket, and prepared salad pillow bags",
      "Fresh button mushrooms and asparagus flow wraps"
    ],
    technicalNotes: "Precision laser micro-perforations maintain Equilibrium Modified Atmosphere (EMA: 3-5% O2, 8-12% CO2) preventing anaerobic tissue fermentation. Anti-fog additives force water droplets into a continuous clear sheet.",
    dataSource: "PerfoTec Precision Laser Perforation Systems / UC Davis Postharvest Center"
  },

  // =========================================================================
  // 4. BIO-BASED & INDUSTRIAL COMPOSTABLE FILMS (Bio-Polymers)
  // =========================================================================
  {
    id: "natureflex-cellulose-bio",
    name: "NatureFlex™ Regenerated Cellulose High-Barrier Bio-Film",
    shortName: "NatureFlex™ Bio-Cellulose Film",
    type: "Compostable Bio-Polymer",
    layers: "19µm Wood-pulp Cellulose Base // PVdC-free Bio-Barrier Coating // Bio-Polymer Seal Layer",
    layerCount: 3,
    totalThicknessMicrons: 23,
    thicknessRange: "19 - 30 µm",
    density: 1.42,

    otr: 4.5,
    otrRange: "3.0 - 8.0 cc/m²·day·atm",
    otrStandard: "ASTM D3985 (23°C, 0% RH)",
    wvtr: 8.0,
    wvtrRange: "5.0 - 12.0 g/m²·day",
    wvtrStandard: "ASTM F1249",
    co2Permeability: "18.0 cc/m²·day·atm",

    tensileStrengthMD: 105,
    tensileStrengthTD: 60,
    punctureResistance: "12 N",
    punctureStandard: "ASTM D882",
    sealInitiationTemp: 95,
    sealTempRange: "90 - 120 °C",
    sealStrength: "12 N/15mm",

    clarity: "High Transparency & Natural Cellulose Gloss",
    uvBarrier: "Moderate (Blocks 70% UV-B)",
    antiFog: "Natural static-free anti-static performance",

    recyclabilityClass: "Compostable (Certified Home & Industrial Compostable: DIN EN 13432 / TÜV OK Compost Home)",
    euPPWRCompliant: true, // Approved for specific organic waste collection streams
    plasticTaxApplicable: false, // 100% bio-based carbon from FSC-certified wood pulp
    carbonFootprintKgCO2e: 1.8,
    costPerSqM: 0.72,
    costRangePerSqM: "$0.65 - $0.85 / m²",
    commercialBatchMin: "5,000 m²",

    recommendedCategories: ["Bakery", "Snacks & Confectionery", "Dry Foods & Grains"],
    primaryUseCases: [
      "Artisan confectionery, chocolate wraps, and organic cookies",
      "Organic tea bags and herbal infusion wraps",
      "Organic dried fruits and superfood powders"
    ],
    technicalNotes: "Made from renewable FSC wood pulp. Breaks down completely in home compost bins within 8-12 weeks without microplastic residue.",
    dataSource: "Futamura NatureFlex™ Technical Datasheets / DIN CERTCO Certification"
  },
  {
    id: "pla-pbat-compostable",
    name: "PLA / PBAT Blended Compostable Produce Pouch",
    shortName: "PLA / PBAT Compostable Film",
    type: "Compostable Bio-Alloy",
    layers: "35µm Blended Poly-Lactic Acid (Corn starch) + Polybutyrate Adipate Terephthalate (PBAT)",
    layerCount: 1,
    totalThicknessMicrons: 35,
    thicknessRange: "25 - 50 µm",
    density: 1.25,

    otr: 450.0,
    otrRange: "300 - 650 cc/m²·day·atm",
    otrStandard: "ASTM D3985",
    wvtr: 45.0,
    wvtrRange: "35 - 70 g/m²·day (High natural water vapor permeability)",
    wvtrStandard: "ASTM F1249",
    co2Permeability: "1200.0 cc/m²·day·atm",

    tensileStrengthMD: 32,
    tensileStrengthTD: 28,
    punctureResistance: "16 N (Good dart drop elasticity)",
    punctureStandard: "ASTM D1709",
    sealInitiationTemp: 100,
    sealTempRange: "95 - 120 °C",
    sealStrength: "16 N/15mm",

    clarity: "Translucent / Semi-Matte (Haze 25%)",
    uvBarrier: "Moderate",
    antiFog: "High natural breathability prevents droplet pooling",

    recyclabilityClass: "Compostable (Industrial Composting: EN 13432 at 58°C in commercial facilities)",
    euPPWRCompliant: true,
    plasticTaxApplicable: false,
    carbonFootprintKgCO2e: 1.6,
    costPerSqM: 0.38,
    costRangePerSqM: "$0.32 - $0.46 / m²",
    commercialBatchMin: "10,000 m²",

    recommendedCategories: ["Fresh Produce", "Bakery"],
    primaryUseCases: [
      "Organic root vegetable and apple pre-pack bags",
      "Artisan bakery bread bags for short-cycle retail",
      "Organic retail produce carrier and market packaging"
    ],
    technicalNotes: "High intrinsic WVTR prevents condensation inside produce bags, preventing fungal rot naturally. Requires industrial composting facility for complete degradation.",
    dataSource: "NatureWorks Ingeo™ PLA Technical Data / BASF ecovio® Specs"
  },

  // =========================================================================
  // 5. RIGID BARRIER TRAYS & CONTAINERS (Thermoformed MAP & Dual-Ovenable)
  // =========================================================================
  {
    id: "rpet-pe-evoh-rigid-tray",
    name: "rPET / PE / EVOH High-Barrier Rigid MAP Tray (80% PCR Content)",
    shortName: "rPET/PE/EVOH Rigid Tray (80% PCR)",
    type: "Thermoformed Rigid Sheet",
    layers: "350µm Recycled PET (80% Post-Consumer Recycled) // Tie // 15µm EVOH // 35µm PE Sealant",
    layerCount: 5,
    totalThicknessMicrons: 400,
    thicknessRange: "350 - 500 µm",
    density: 1.34,

    otr: 0.8,
    otrRange: "0.5 - 1.5 cc/m²·day·atm",
    otrStandard: "ASTM D3985",
    wvtr: 1.0,
    wvtrRange: "0.6 - 1.5 g/m²·day",
    wvtrStandard: "ASTM F1249",
    co2Permeability: "3.2 cc/m²·day·atm",

    tensileStrengthMD: 55,
    tensileStrengthTD: 52,
    punctureResistance: "120 N (Rigid structural geometry)",
    punctureStandard: "ASTM D1709 / Rigidity Test",
    sealInitiationTemp: 135,
    sealTempRange: "130 - 155 °C (With compatible top lidding film)",
    sealStrength: "35 N/15mm",

    clarity: "High Clarity / Slight Recycled Tint",
    uvBarrier: "High",
    antiFog: "Applied via lidding film",

    recyclabilityClass: "Class A / B (Tray-to-tray rPET recycling streams under emerging EU sorting)",
    euPPWRCompliant: true,
    plasticTaxApplicable: false, // 80% recycled content exceeds UK 30% threshold
    carbonFootprintKgCO2e: 1.7, // Lower footprint due to 80% PCR resin
    costPerSqM: 0.85, // ~$0.08 - $0.12 per finished thermoformed tray
    costRangePerSqM: "$0.75 - $0.98 / m²",
    commercialBatchMin: "25,000 trays",

    recommendedCategories: ["Meat & Poultry", "Seafood", "Ready-to-Eat (RTE)", "Dairy"],
    primaryUseCases: [
      "Fresh minced beef and steak high-O2 MAP retail packaging",
      "Chilled salmon fillets and prawn MAP presentation trays",
      "Fresh stuffed tortellini & chilled ready meals"
    ],
    technicalNotes: "Combines high rigidity, crystal clarity, and 80% post-consumer recycled content with an integrated EVOH gas barrier to maintain vacuum or gas blend without headspace leakage.",
    dataSource: "Faerch Plast Rigid Food Packaging Specs / EFSA Safety Opinion on PCR PET"
  },
  {
    id: "cpet-dual-ovenable-tray",
    name: "CPET Dual-Ovenable High-Heat Rigid Tray (-40°C to +220°C)",
    shortName: "CPET Dual-Ovenable Tray",
    type: "Crystallized PET Rigid Sheet",
    layers: "450µm Nucleated Crystallized Polyethylene Terephthalate (CPET)",
    layerCount: 1,
    totalThicknessMicrons: 450,
    thicknessRange: "400 - 600 µm",
    density: 1.38,

    otr: 2.5,
    otrRange: "1.5 - 4.0 cc/m²·day·atm",
    otrStandard: "ASTM D3985",
    wvtr: 1.8,
    wvtrRange: "1.2 - 2.5 g/m²·day",
    wvtrStandard: "ASTM F1249",
    co2Permeability: "8.5 cc/m²·day·atm",

    tensileStrengthMD: 60,
    tensileStrengthTD: 58,
    punctureResistance: "140 N",
    punctureStandard: "ASTM D1709",
    sealInitiationTemp: 160,
    sealTempRange: "155 - 185 °C",
    sealStrength: "28 N/15mm (Peelable high-temp seal)",

    clarity: "Opaque Black / Dark Grey (or carbon-black-free recyclable pigment)",
    uvBarrier: "100% Light Blocking",
    antiFog: "Applied via lidding",

    recyclabilityClass: "Class A (When produced with NIR-detectable black masterbatch for automated sorting)",
    euPPWRCompliant: true,
    plasticTaxApplicable: true,
    carbonFootprintKgCO2e: 3.4,
    costPerSqM: 1.10,
    costRangePerSqM: "$0.95 - $1.30 / m²",
    commercialBatchMin: "20,000 trays",

    recommendedCategories: ["Ready-to-Eat (RTE)", "Frozen Foods"],
    primaryUseCases: [
      "Chilled and frozen ready meals for microwave and conventional oven reheating",
      "Airline catering meals and institutional cook-chill distribution"
    ],
    technicalNotes: "Partial polymer crystallization enables thermal stability from -40°C deep freeze to +220°C baking without deformation or toxicant migration.",
    dataSource: "Plastics Information Europe / Campden BRI Food Heating Guidelines"
  },

  // =========================================================================
  // 6. INERT RIGID PACKAGING (Glass & Tinplate)
  // =========================================================================
  {
    id: "amber-glass-bottle",
    name: "Type III Amber Glass Container (UV-Blocking)",
    shortName: "Amber Glass Bottle / Jar",
    type: "Inorganic Vitreous Glass",
    layers: "Soda-Lime-Silica Vitreous Container Glass with Iron-Sulphur Amber Tint",
    layerCount: 1,
    totalThicknessMicrons: 2500, // 2.5 mm wall thickness
    thicknessRange: "2.0 - 4.0 mm",
    density: 2.50,

    otr: 0.0,
    otrRange: "0.0 cc/m²·day·atm (Absolute zero permeation)",
    otrStandard: "ASTM D3985",
    wvtr: 0.0,
    wvtrRange: "0.0 g/m²·day (Absolute hermetic barrier)",
    wvtrStandard: "ASTM F1249",
    co2Permeability: "0.0 cc/m²·day·atm",

    tensileStrengthMD: 35,
    tensileStrengthTD: 35,
    punctureResistance: "Rigid (Brittle fracture under sudden mechanical shock)",
    punctureStandard: "ASTM C148",
    sealInitiationTemp: 0, // Mechanical closure
    sealTempRange: "Not applicable (Lug cap / Crown cork seal)",
    sealStrength: "Hermetic with elastomeric compound liner",

    clarity: "Amber Tint (Transmits < 5% light below 500 nm wavelength)",
    uvBarrier: "100% UV-A, UV-B, and UV-C Block (< 450 nm)",
    antiFog: "Not applicable",

    recyclabilityClass: "Class A (Infinitely recyclable circular material in closed-loop cullet glass systems)",
    euPPWRCompliant: true,
    plasticTaxApplicable: false, // 100% Glass
    carbonFootprintKgCO2e: 0.85, // kg CO2e / kg glass (high transport footprint due to weight)
    costPerSqM: 1.45, // Equivalent surface area unit cost
    costRangePerSqM: "$1.20 - $1.80 / m² equiv",
    commercialBatchMin: "10,000 units",

    recommendedCategories: ["Beverages & Liquids", "Snacks & Confectionery", "Dairy"],
    primaryUseCases: [
      "Extra virgin olive oil (EVOO) premium dark bottling",
      "Cold-pressed artisan juices and high-antioxidant tonics",
      "Gourmet jams, honey, and pickled condiments"
    ],
    technicalNotes: "Provides complete chemical inertness with zero flavor scalping or volatile compound absorption. Amber coloration protects photo-sensitive riboflavin and chlorophyll from light-induced oxidation.",
    dataSource: "FEVE European Container Glass Federation / Packaging Technology and Science"
  },
  {
    id: "tinplate-steel-can",
    name: "Electrolytic Tinplate 3-Piece Steel Can with BPA-NI Lacquer",
    shortName: "Tinplate Steel Can (BPA-NI)",
    type: "Coated Metal Container",
    layers: "Low-Carbon Steel Sheet // Electrolytic Tin Coating // BPA-Non-Intent (BPA-NI) Epoxy-Free Barrier Lacquer",
    layerCount: 3,
    totalThicknessMicrons: 180,
    thicknessRange: "150 - 240 µm",
    density: 7.85,

    otr: 0.0,
    otrRange: "0.0 cc/m²·day·atm (Absolute barrier)",
    otrStandard: "ASTM D3985",
    wvtr: 0.0,
    wvtrRange: "0.0 g/m²·day",
    wvtrStandard: "ASTM F1249",
    co2Permeability: "0.0 cc/m²·day·atm",

    tensileStrengthMD: 350,
    tensileStrengthTD: 350,
    punctureResistance: "Extreme (Hermetic double-seamed steel)",
    punctureStandard: "ASTM D882",
    sealInitiationTemp: 0,
    sealTempRange: "Double-seamed mechanical hermetic roll-lock",
    sealStrength: "Hermetic weld",

    clarity: "100% Opaque Metallic",
    uvBarrier: "100% Light Block",
    antiFog: "Not applicable",

    recyclabilityClass: "Class A (Permanently magnetic metal, magnetic separation recyclability > 90%)",
    euPPWRCompliant: true,
    plasticTaxApplicable: false,
    carbonFootprintKgCO2e: 2.2,
    costPerSqM: 1.25,
    costRangePerSqM: "$1.05 - $1.50 / m² equiv",
    commercialBatchMin: "50,000 cans",

    recommendedCategories: ["Beverages & Liquids", "Ready-to-Eat (RTE)", "Dry Foods & Grains"],
    primaryUseCases: [
      "Retorted ambient ready meals and soups",
      "Edible cooking oils and ghee in bulk cans",
      "Roasted coffee beans and whole spices"
    ],
    technicalNotes: "Can withstand thermal retort sterilization (121°C, 15 psi) for indefinite shelf life without refrigeration. Modern BPA-NI lacquer prevents metal ion migration into acidic food matrices.",
    dataSource: "APEAL Association of European Producers of Steel for Packaging / ISO 11949"
  },

  // =========================================================================
  // 7. SPECIALIZED LIQUID & FROZEN FORMATS
  // =========================================================================
  {
    id: "ldpe-lldpe-frozen-film",
    name: "Heavy-Duty Co-ex LLDPE / LDPE Cold-Tough Frozen Film",
    shortName: "Co-ex LLDPE Frozen Pouch",
    type: "Mono-Material Polyolefin",
    layers: "30µm LDPE Outer Web // 20µm Metallocene-LLDPE Core // 30µm EVA-Modified LLDPE Low-Temp Sealant",
    layerCount: 3,
    totalThicknessMicrons: 80,
    thicknessRange: "60 - 95 µm",
    density: 0.92,

    otr: 450.0,
    otrRange: "350 - 550 cc/m²·day·atm",
    otrStandard: "ASTM D3985",
    wvtr: 0.45,
    wvtrRange: "0.35 - 0.65 g/m²·day",
    wvtrStandard: "ASTM F1249",
    co2Permeability: "1800 cc/m²·day·atm",

    tensileStrengthMD: 42,
    tensileStrengthTD: 38,
    punctureResistance: "52 N (High-impact puncture resistance at -25°C)",
    punctureStandard: "ASTM D1709 / ASTM D882",
    sealInitiationTemp: 98,
    sealTempRange: "95 - 120 °C",
    sealStrength: "38 N/15mm (Pinhole-free freeze seal)",

    clarity: "Semi-Gloss Translucent / High Opacity White",
    uvBarrier: "Moderate (Titanium dioxide pigment option)",
    antiFog: "Not applicable",

    recyclabilityClass: "Class A (100% Polyethylene mono-material flexible stream)",
    euPPWRCompliant: true,
    plasticTaxApplicable: false,
    carbonFootprintKgCO2e: 1.85,
    costPerSqM: 0.24,
    costRangePerSqM: "$0.20 - $0.29 / m²",
    commercialBatchMin: "15,000 m²",

    recommendedCategories: ["Frozen Foods"],
    primaryUseCases: [
      "Individually Quick Frozen (IQF) peas, corn, and mixed vegetables",
      "Frozen french fries and potato wedges",
      "Frozen berries and diced tropical fruits"
    ],
    technicalNotes: "Metallocene polyolefin backbone maintains impact ductility and flex-crack resistance down to -40°C, eliminating brittle shattering during automated freezer handling.",
    dataSource: "Dow Packaging & Specialty Plastics / Plastics Europe Eco-Profiles"
  },
  {
    id: "pet-barrier-bottle",
    name: "Multi-Layer Barrier PET Bottle with Scavenger Blend",
    shortName: "Barrier rPET Bottle",
    type: "Rigid Polyester Container",
    layers: "Virgin/rPET Outer Skin // Active O2 Scavenger Core (< 3% wt) // High-Purity rPET Inner Contact Layer",
    layerCount: 3,
    totalThicknessMicrons: 350,
    thicknessRange: "300 - 450 µm (Wall thickness)",
    density: 1.34,

    otr: 0.2,
    otrRange: "0.1 - 0.4 cc/pkg·day",
    otrStandard: "ASTM F1307",
    wvtr: 0.8,
    wvtrRange: "0.6 - 1.1 g/m²·day",
    wvtrStandard: "ASTM F1249",
    co2Permeability: "1.2 cc/pkg·day",

    tensileStrengthMD: 180,
    tensileStrengthTD: 180,
    punctureResistance: "85 N (High impact drop-resistance)",
    punctureStandard: "ASTM D2463",
    sealInitiationTemp: 0,
    sealTempRange: "38mm HDPE Tamper-Evident Screw Closure with Induction Liner",
    sealStrength: "Hermetic closure",

    clarity: "High Clarity Transparent / UV-Amber Tint Available",
    uvBarrier: "High (With integrated UV blocker 380nm cutoff)",
    antiFog: "Not applicable",

    recyclabilityClass: "Class A (Fully compatible with clear PET bottle-to-bottle recycling stream)",
    euPPWRCompliant: true,
    plasticTaxApplicable: false,
    carbonFootprintKgCO2e: 2.3,
    costPerSqM: 0.38,
    costRangePerSqM: "$0.32 - $0.45 / unit equiv",
    commercialBatchMin: "25,000 bottles",

    recommendedCategories: ["Beverages & Liquids"],
    primaryUseCases: [
      "Cold-pressed high-pressure processed (HPP) raw juices",
      "Cold brew coffees and ready-to-drink functional teas",
      "Premium single-estate cold-pressed extra virgin olive oils"
    ],
    technicalNotes: "Active oxygen scavenger in preform core binds dissolved O2 during ambient distribution while remaining fully compatible with commercial rPET flaking and decontamination lines.",
    dataSource: "Plastics Recyclers Europe (PRE) / Petcore Europe Design Guidelines"
  }
];

function getPackagingMaterials() {
  return PACKAGING_MATERIALS;
}

function getMaterialById(id) {
  return PACKAGING_MATERIALS.find(m => m.id === id) || null;
}

function getMaterialsByType(type) {
  if (!type || type === "ALL") return PACKAGING_MATERIALS;
  return PACKAGING_MATERIALS.filter(m => m.type === type);
}

// Global scope exposure
const globalScopeMat = typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : global);
globalScopeMat.PACKAGING_MATERIALS = PACKAGING_MATERIALS;
globalScopeMat.getPackagingMaterials = getPackagingMaterials;
globalScopeMat.getMaterialById = getMaterialById;
globalScopeMat.getMaterialsByType = getMaterialsByType;
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PACKAGING_MATERIALS, getPackagingMaterials, getMaterialById, getMaterialsByType };
}
