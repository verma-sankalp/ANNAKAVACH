/**
 * Annakavach — Food Commodities Science Database
 * Empirical physical, chemical, and post-harvest physiological data
 * compiled for shelf-life optimization and packaging barrier matching.
 *
 * Data Sources: USDA FoodData Central, UC Davis Postharvest Technology Center,
 * Robertson Food Packaging Principles & Practice (3rd Ed), ASTM International Standards.
 */

const FOOD_COMMODITIES = [
  // =========================================================================
  // 1. FRESH PRODUCE (Active Post-Harvest Respiration)
  // =========================================================================
  {
    id: "strawberries",
    name: "Fresh Strawberries",
    category: "Fresh Produce",
    moisture: 91.0,
    waterActivity: 0.98,
    fat: 0.3,
    ph: 3.6,
    respirationRate: "Very High",
    respirationValue: 22, // mg CO2 / kg·h at 5°C (UC Davis Postharvest Center)
    ethyleneSensitivity: "Moderate",
    lightSensitivity: "Moderate",
    primarySpoilage: [
      "Botrytis cinerea (Grey mold rot)",
      "Moisture loss / calyx desiccation",
      "Tissue softening (pectin hydrolysis)",
      "Anthocyanin pigment breakdown"
    ],
    recommendedTemp: 2.0, // °C
    recommendedRH: 95, // % RH
    ambientShelfLifeDays: 2,
    chilledShelfLifeDays: 5,
    optimalMAPShelfLifeDays: 14,
    optimalGasBlend: { o2: 3, co2: 12, n2: 85 }, // Suggested starting atmosphere
    gasRatio: "1.5 : 1 (Gas to food volume)",
    targetOTR: "1500 - 3000 cc/m²·day·atm",
    targetWVTR: "25 - 45 g/m²·day",
    storageType: "chilled",
    dataSource: "UC Davis Postharvest Technology / USDA FoodData Central (FDC ID: 167762)",
    specialNotes: "Extremely perishable non-climacteric fruit. Anti-fog micro-perforated film prevents water lens formation while elevated CO2 (10-15%) suppresses fungal mycelial growth without inducing anaerobic off-flavors."
  },
  {
    id: "baby-spinach",
    name: "Baby Spinach & Salad Greens",
    category: "Fresh Produce",
    moisture: 93.5,
    waterActivity: 0.99,
    fat: 0.4,
    ph: 6.2,
    respirationRate: "Very High",
    respirationValue: 35, // mg CO2 / kg·h at 5°C
    ethyleneSensitivity: "High",
    lightSensitivity: "High",
    primarySpoilage: [
      "Leaf yellowing (chlorophyll breakdown)",
      "Bacterial soft rot / sliming (Pseudomonas spp.)",
      "Wilting & turgor pressure loss",
      "Ethanol/acetaldehyde off-odors from anoxia"
    ],
    recommendedTemp: 2.5,
    recommendedRH: 98,
    ambientShelfLifeDays: 1,
    chilledShelfLifeDays: 4,
    optimalMAPShelfLifeDays: 12,
    optimalGasBlend: { o2: 4, co2: 8, n2: 88 },
    gasRatio: "2.0 : 1 (Gas to food volume)",
    targetOTR: "2500 - 4500 cc/m²·day·atm",
    targetWVTR: "30 - 60 g/m²·day",
    storageType: "chilled",
    dataSource: "UC Davis Postharvest Technology / Robertson Food Packaging (3rd Ed)",
    specialNotes: "Demands precise gas permeability. If in-pack O2 drops below 1.5%, tissue triggers anaerobic fermentation; if CO2 exceeds 10%, leaf edge scorching and water-soaking occur."
  },
  {
    id: "button-mushrooms",
    name: "Fresh Button Mushrooms",
    category: "Fresh Produce",
    moisture: 92.0,
    waterActivity: 0.99,
    fat: 0.3,
    ph: 6.5,
    respirationRate: "Extremely High",
    respirationValue: 50, // mg CO2 / kg·h at 5°C
    ethyleneSensitivity: "Low",
    lightSensitivity: "Moderate",
    primarySpoilage: [
      "Cap browning (Polyphenol Oxidase - PPO)",
      "Veil opening and stem elongation",
      "Bacterial blotch (Pseudomonas tolaasii)",
      "Moisture accumulation & cap sliming"
    ],
    recommendedTemp: 2.0,
    recommendedRH: 95,
    ambientShelfLifeDays: 2,
    chilledShelfLifeDays: 4,
    optimalMAPShelfLifeDays: 10,
    optimalGasBlend: { o2: 3, co2: 10, n2: 87 },
    gasRatio: "2.0 : 1 (Gas to food volume)",
    targetOTR: "4000 - 8000 cc/m²·day·atm",
    targetWVTR: "50 - 90 g/m²·day",
    storageType: "chilled",
    dataSource: "USDA FDC ID: 169251 / Postharvest Biology and Technology Journal",
    specialNotes: "Very high metabolic heat and water vapor release. High water condensation inside impermeable film triggers rapid bacterial blotch and blackening. Breathable micro-perforated film is essential."
  },
  {
    id: "apples",
    name: "Crisp Apples (Gala / Fuji)",
    category: "Fresh Produce",
    moisture: 85.5,
    waterActivity: 0.97,
    fat: 0.2,
    ph: 3.8,
    respirationRate: "Low",
    respirationValue: 6, // mg CO2 / kg·h at 5°C
    ethyleneSensitivity: "High",
    lightSensitivity: "Low",
    primarySpoilage: [
      "Dehydration & skin wrinkling",
      "Flesh mealy softening",
      "Ethylene-accelerated senescence",
      "Superficial scald"
    ],
    recommendedTemp: 1.0,
    recommendedRH: 90,
    ambientShelfLifeDays: 14,
    chilledShelfLifeDays: 60,
    optimalMAPShelfLifeDays: 120,
    optimalGasBlend: { o2: 2, co2: 1, n2: 97 },
    gasRatio: "1.0 : 1 (Gas to food volume)",
    targetOTR: "800 - 1500 cc/m²·day·atm",
    targetWVTR: "10 - 25 g/m²·day",
    storageType: "chilled",
    dataSource: "USDA FDC ID: 171688 / Washington State University Postharvest Lab",
    specialNotes: "Climacteric fruit producing continuous ethylene gas. Packaging must provide moderate permeability to prevent internal browning while containing water vapor to retain crunch."
  },
  {
    id: "avocados",
    name: "Ready-to-Eat Avocados (Hass)",
    category: "Fresh Produce",
    moisture: 73.0,
    waterActivity: 0.96,
    fat: 15.0,
    ph: 6.4,
    respirationRate: "High",
    respirationValue: 28,
    ethyleneSensitivity: "Very High",
    lightSensitivity: "Moderate",
    primarySpoilage: [
      "Enzymatic flesh browning (PPO)",
      "Lipid auto-oxidation (rancid flavor)",
      "Vascular strand darkening",
      "Texture breakdown & softening"
    ],
    recommendedTemp: 5.0,
    recommendedRH: 90,
    ambientShelfLifeDays: 3,
    chilledShelfLifeDays: 8,
    optimalMAPShelfLifeDays: 21,
    optimalGasBlend: { o2: 4, co2: 6, n2: 90 },
    gasRatio: "1.5 : 1 (Gas to food volume)",
    targetOTR: "1200 - 2400 cc/m²·day·atm",
    targetWVTR: "15 - 30 g/m²·day",
    storageType: "chilled",
    dataSource: "UC Davis Postharvest Technology / USDA FDC ID: 171705",
    specialNotes: "High lipid content combined with active climacteric respiration. Controlled permeability delays peak respiration and protects mono-unsaturated fatty acids from oxidation."
  },
  {
    id: "fresh-tomatoes",
    name: "Vine Tomatoes",
    category: "Fresh Produce",
    moisture: 94.0,
    waterActivity: 0.99,
    fat: 0.2,
    ph: 4.4,
    respirationRate: "Moderate",
    respirationValue: 12,
    ethyleneSensitivity: "High",
    lightSensitivity: "Low",
    primarySpoilage: [
      "Chilling injury when held below 10°C",
      "Skin cracking & weeping",
      "Botrytis cinerea stem rot",
      "Flavor volatile loss"
    ],
    recommendedTemp: 12.0, // Cool ambient, strictly avoid cold refrigeration
    recommendedRH: 85,
    ambientShelfLifeDays: 7,
    chilledShelfLifeDays: 14,
    optimalMAPShelfLifeDays: 24,
    optimalGasBlend: { o2: 5, co2: 4, n2: 91 },
    gasRatio: "1.2 : 1 (Gas to food volume)",
    targetOTR: "1800 - 3200 cc/m²·day·atm",
    targetWVTR: "20 - 40 g/m²·day",
    storageType: "ambient",
    dataSource: "USDA FDC ID: 170457 / Wageningen Food & Biobased Research",
    specialNotes: "Susceptible to chilling injury below 10°C (causes mealy texture and loss of aroma compounds). Store at cool ambient with macro/micro-vented packaging."
  },

  // =========================================================================
  // 2. MEAT & POULTRY (High Protein, High Lipid, Microbial Vulnerability)
  // =========================================================================
  {
    id: "fresh-beef-steaks",
    name: "Fresh Red Beef Steaks (Ribeye)",
    category: "Meat & Poultry",
    moisture: 72.0,
    waterActivity: 0.99,
    fat: 8.5,
    ph: 5.6,
    respirationRate: "None",
    respirationValue: 0,
    ethyleneSensitivity: "None",
    lightSensitivity: "High",
    primarySpoilage: [
      "Oxymyoglobin oxidation to Metmyoglobin (brown discoloration)",
      "Lipid oxidation & warmed-over flavor",
      "Pseudomonas psychrotrophic bacterial growth",
      "Purge / drip loss"
    ],
    recommendedTemp: 1.0,
    recommendedRH: 85,
    ambientShelfLifeDays: 1,
    chilledShelfLifeDays: 4,
    optimalMAPShelfLifeDays: 16,
    optimalGasBlend: { o2: 70, co2: 30, n2: 0 }, // High-O2 bloom or 0% O2 Vacuum Skin Pack (VSP)
    gasRatio: "2.0 : 1 (Gas to meat volume)",
    targetOTR: "< 5.0 cc/m²·day·atm",
    targetWVTR: "< 3.0 g/m²·day",
    storageType: "chilled",
    dataSource: "American Meat Science Association (AMSA) / Meat Science Journal",
    specialNotes: "Retail display requires either 70-80% O2 MAP (for bright cherry-red oxymyoglobin bloom) or 0% O2 Vacuum Skin Packaging (VSP) for extended purple-state distribution."
  },
  {
    id: "ground-beef-mince",
    name: "Fresh Ground / Minced Beef",
    category: "Meat & Poultry",
    moisture: 68.0,
    waterActivity: 0.98,
    fat: 18.0,
    ph: 5.8,
    respirationRate: "None",
    respirationValue: 0,
    ethyleneSensitivity: "None",
    lightSensitivity: "High",
    primarySpoilage: [
      "Rapid microbial multiplication throughout mince matrix",
      "Lipid auto-oxidation & hexanal rancidity",
      "Metmyoglobin darkening",
      "Lactic acid souring"
    ],
    recommendedTemp: 0.5,
    recommendedRH: 85,
    ambientShelfLifeDays: 0.5,
    chilledShelfLifeDays: 2,
    optimalMAPShelfLifeDays: 8,
    optimalGasBlend: { o2: 65, co2: 35, n2: 0 },
    gasRatio: "2.5 : 1 (Gas to meat volume)",
    targetOTR: "< 3.0 cc/m²·day·atm",
    targetWVTR: "< 2.0 g/m²·day",
    storageType: "chilled",
    dataSource: "USDA FSIS Meat Inspection Guidelines / Meat Science Journal",
    specialNotes: "Grinding incorporates air and spreads surface bacteria throughout the meat. Rigid barrier tray (rPET/PE/EVOH) with high CO2 barrier lidding is mandatory."
  },
  {
    id: "chicken-breast",
    name: "Fresh Chicken Breast Fillets",
    category: "Meat & Poultry",
    moisture: 75.0,
    waterActivity: 0.99,
    fat: 2.5,
    ph: 5.9,
    respirationRate: "None",
    respirationValue: 0,
    ethyleneSensitivity: "None",
    lightSensitivity: "Moderate",
    primarySpoilage: [
      "Brochothrix thermosphacta & Pseudomonas bacterial growth",
      "Sulfury / ester off-odors",
      "Purge fluid leakage",
      "Surface stickiness"
    ],
    recommendedTemp: 0.5,
    recommendedRH: 85,
    ambientShelfLifeDays: 1,
    chilledShelfLifeDays: 4,
    optimalMAPShelfLifeDays: 14,
    optimalGasBlend: { o2: 0, co2: 35, n2: 65 }, // Zero O2 to avoid rancidity; poultry does not need red myoglobin blooming
    gasRatio: "2.0 : 1 (Gas to poultry volume)",
    targetOTR: "< 5.0 cc/m²·day·atm",
    targetWVTR: "< 3.0 g/m²·day",
    storageType: "chilled",
    dataSource: "Poultry Science Journal / USDA FoodData Central (FDC ID: 171077)",
    specialNotes: "Poultry contains low myoglobin, so high oxygen is unnecessary. 35% CO2 with 65% N2 suppresses aerobic spoilage bacteria without package collapse."
  },
  {
    id: "cured-bacon",
    name: "Cured & Smoked Sliced Bacon",
    category: "Meat & Poultry",
    moisture: 45.0,
    waterActivity: 0.91,
    fat: 40.0,
    ph: 6.0,
    respirationRate: "None",
    respirationValue: 0,
    ethyleneSensitivity: "None",
    lightSensitivity: "Critical",
    primarySpoilage: [
      "Light-induced nitrosomyoglobin fading (pigment bleaching)",
      "Lipid auto-oxidation (rancid off-flavors)",
      "Lactic acid bacteria souring"
    ],
    recommendedTemp: 4.0,
    recommendedRH: 75,
    ambientShelfLifeDays: 3,
    chilledShelfLifeDays: 14,
    optimalMAPShelfLifeDays: 60,
    optimalGasBlend: { o2: 0, co2: 30, n2: 70 },
    gasRatio: "1.5 : 1 (Gas to bacon volume)",
    targetOTR: "< 2.0 cc/m²·day·atm",
    targetWVTR: "< 2.0 g/m²·day",
    storageType: "chilled",
    dataSource: "AMSA Cured Meat Guidelines / Journal of Food Science",
    specialNotes: "Cured nitrosomyoglobin pigment is extremely photo-sensitive. Residual O2 + supermarket fluorescent lighting causes rapid bleaching from pink to grey within 48h. Requires EVOH barrier and UV-blocking film."
  },

  // =========================================================================
  // 3. SEAFOOD (High Moisture, Omega-3 PUFA, Rapid Autolysis)
  // =========================================================================
  {
    id: "fresh-salmon-fillet",
    name: "Fresh Atlantic Salmon Fillet",
    category: "Seafood",
    moisture: 68.0,
    waterActivity: 0.99,
    fat: 13.0,
    ph: 6.4,
    respirationRate: "None",
    respirationValue: 0,
    ethyleneSensitivity: "None",
    lightSensitivity: "High",
    primarySpoilage: [
      "Omega-3 Polyunsaturated Fatty Acid (PUFA) auto-oxidation",
      "Photobacterium phosphoreum psychrotrophic growth",
      "Trimethylamine (TMA) fishy amine evolution",
      "Astaxanthin pink color bleaching"
    ],
    recommendedTemp: 0.5,
    recommendedRH: 90,
    ambientShelfLifeDays: 1,
    chilledShelfLifeDays: 4,
    optimalMAPShelfLifeDays: 12,
    optimalGasBlend: { o2: 0, co2: 60, n2: 40 },
    gasRatio: "2.5 : 1 (High headspace prevents pack collapse from CO2 dissolution)",
    targetOTR: "< 2.0 cc/m²·day·atm",
    targetWVTR: "< 2.0 g/m²·day",
    storageType: "chilled",
    dataSource: "FAO Fisheries Technical Paper / Journal of Aquatic Food Product Technology",
    specialNotes: "High CO2 (50-60%) dissolves in salmon tissue moisture, forming carbonic acid which retards Photobacterium phosphoreum. High headspace gas-to-product ratio (2.5:1) prevents package collapse."
  },
  {
    id: "peeled-prawns",
    name: "Peeled Raw Prawns / Shrimp",
    category: "Seafood",
    moisture: 78.0,
    waterActivity: 0.99,
    fat: 1.5,
    ph: 6.8,
    respirationRate: "None",
    respirationValue: 0,
    ethyleneSensitivity: "None",
    lightSensitivity: "Moderate",
    primarySpoilage: [
      "Melanosis (black spot enzymatic formation via PPO)",
      "Total Volatile Basic Nitrogen (TVB-N) release",
      "Texture softening & mushiness",
      "Drip loss"
    ],
    recommendedTemp: 0.5,
    recommendedRH: 90,
    ambientShelfLifeDays: 1,
    chilledShelfLifeDays: 3,
    optimalMAPShelfLifeDays: 10,
    optimalGasBlend: { o2: 0, co2: 50, n2: 50 },
    gasRatio: "2.0 : 1 (Gas to shrimp volume)",
    targetOTR: "< 3.0 cc/m²·day·atm",
    targetWVTR: "< 2.5 g/m²·day",
    storageType: "chilled",
    dataSource: "FAO Seafood Handling Guide / Journal of Food Protection",
    specialNotes: "Polyphenol oxidase catalyses tyrosine oxidation into black melanosis spots on the carapace and tail. Zero oxygen barrier packaging combined with high CO2 prevents blackening."
  },

  // =========================================================================
  // 4. DAIRY (High Fat, Cultured, Moisture Migration)
  // =========================================================================
  {
    id: "aged-cheddar",
    name: "Aged Cheddar Cheese Blocks",
    category: "Dairy",
    moisture: 36.0,
    waterActivity: 0.88,
    fat: 33.0,
    ph: 5.2,
    respirationRate: "Very Low", // Minor post-cure CO2 evolution
    respirationValue: 1,
    ethyleneSensitivity: "None",
    lightSensitivity: "High",
    primarySpoilage: [
      "Aerobic mold proliferation (Penicillium spp.)",
      "Fat oxidation & rind oiling off",
      "Calcium lactate crystal hazing",
      "Moisture desiccation / cracking"
    ],
    recommendedTemp: 4.0,
    recommendedRH: 75,
    ambientShelfLifeDays: 7,
    chilledShelfLifeDays: 45,
    optimalMAPShelfLifeDays: 180,
    optimalGasBlend: { o2: 0, co2: 30, n2: 70 },
    gasRatio: "1.0 : 1 (Gas to cheese volume) or Vacuum Pack",
    targetOTR: "< 15.0 cc/m²·day·atm",
    targetWVTR: "< 4.0 g/m²·day",
    storageType: "chilled",
    dataSource: "International Dairy Federation (IDF) / USDA FDC ID: 173418",
    specialNotes: "Vacuum packaging or N2/CO2 flushing prevents surface mold spore germination. Package must provide moderate gas permeability if active live starter cultures release minor residual CO2."
  },
  {
    id: "fresh-mozzarella",
    name: "Fresh Mozzarella in Brine",
    category: "Dairy",
    moisture: 58.0,
    waterActivity: 0.98,
    fat: 20.0,
    ph: 5.4,
    respirationRate: "None",
    respirationValue: 0,
    ethyleneSensitivity: "None",
    lightSensitivity: "Moderate",
    primarySpoilage: [
      "Yeast & mold surface contamination",
      "Proteolytic softening & bitter peptide evolution",
      "Coliform gas production (blowing)",
      "Brine acidification / cloudiness"
    ],
    recommendedTemp: 3.0,
    recommendedRH: 90,
    ambientShelfLifeDays: 2,
    chilledShelfLifeDays: 10,
    optimalMAPShelfLifeDays: 30,
    optimalGasBlend: { o2: 0, co2: 20, n2: 80 },
    gasRatio: "1.0 : 1 (Gas to liquid/cheese volume)",
    targetOTR: "< 30.0 cc/m²·day·atm",
    targetWVTR: "< 3.0 g/m²·day",
    storageType: "chilled",
    dataSource: "Journal of Dairy Science / USDA FDC ID: 170845",
    specialNotes: "Liquid brine demands puncture-resistant thermoformed barrier cups or barrier stand-up pouches with robust hermetic peelable heat seals."
  },
  {
    id: "salted-butter",
    name: "Sweet Cream Butter",
    category: "Dairy",
    moisture: 16.0,
    waterActivity: 0.75,
    fat: 82.0,
    ph: 6.5,
    respirationRate: "None",
    respirationValue: 0,
    ethyleneSensitivity: "None",
    lightSensitivity: "Critical",
    primarySpoilage: [
      "Photo-oxidation (tallowy off-flavor from UV/visible light)",
      "Volatile foreign odor absorption (taint)",
      "Surface yellowing & desiccation"
    ],
    recommendedTemp: 4.0,
    recommendedRH: 65,
    ambientShelfLifeDays: 10,
    chilledShelfLifeDays: 60,
    optimalMAPShelfLifeDays: 180,
    optimalGasBlend: { o2: 0, co2: 0, n2: 100 },
    gasRatio: "Tight parchment/foil overwrap",
    targetOTR: "< 5.0 cc/m²·day·atm",
    targetWVTR: "< 2.0 g/m²·day",
    storageType: "chilled",
    dataSource: "American Dairy Science Association / USDA FDC ID: 173410",
    specialNotes: "Butterfat rapidly absorbs surrounding ambient odors and is vulnerable to light-induced free radical oxidation. Aluminium foil laminates or metallized parchment provide total light/aroma barrier."
  },

  // =========================================================================
  // 5. BAKERY (Staling Retrogradation vs Mold Germination)
  // =========================================================================
  {
    id: "artisan-bread",
    name: "Artisan Sourdough & Crusty Bread",
    category: "Bakery",
    moisture: 38.0,
    waterActivity: 0.94,
    fat: 1.5,
    ph: 4.8,
    respirationRate: "None",
    respirationValue: 0,
    ethyleneSensitivity: "None",
    lightSensitivity: "Low",
    primarySpoilage: [
      "Starch amylopectin retrogradation (crumb staling)",
      "Mold growth (Aspergillus niger, Penicillium spp.)",
      "Crust moisture equilibration / loss of crispness"
    ],
    recommendedTemp: 20.0, // Ambient room temp (Refrigeration accelerates staling 3x)
    recommendedRH: 60,
    ambientShelfLifeDays: 3,
    chilledShelfLifeDays: 5,
    optimalMAPShelfLifeDays: 28,
    optimalGasBlend: { o2: 0, co2: 60, n2: 40 },
    gasRatio: "1.2 : 1 (Gas to loaf volume)",
    targetOTR: "< 10.0 cc/m²·day·atm",
    targetWVTR: "< 5.0 g/m²·day",
    storageType: "ambient",
    dataSource: "AACC International Cereal Chemistry / Journal of Cereal Science",
    specialNotes: "Never refrigerate bread as starch retrogradation peaks at 4°C. High CO2 (60%) MAP in barrier pouches halts fungal spore germination for 4 weeks at ambient temperature without synthetic preservatives."
  },
  {
    id: "crisp-cookies",
    name: "Butter Shortbread Cookies / Biscuits",
    category: "Bakery",
    moisture: 3.5,
    waterActivity: 0.28,
    fat: 22.0,
    ph: 6.8,
    respirationRate: "None",
    respirationValue: 0,
    ethyleneSensitivity: "None",
    lightSensitivity: "High",
    primarySpoilage: [
      "Moisture sorption causing crispness loss & sogginess (Aw > 0.35)",
      "Butterfat oxidative rancidity",
      "Volatile buttery aroma dissipation"
    ],
    recommendedTemp: 20.0,
    recommendedRH: 50,
    ambientShelfLifeDays: 30,
    chilledShelfLifeDays: 60,
    optimalMAPShelfLifeDays: 270,
    optimalGasBlend: { o2: 0, co2: 0, n2: 100 },
    gasRatio: "1.0 : 1 (Gas to cookie volume)",
    targetOTR: "< 20.0 cc/m²·day·atm",
    targetWVTR: "< 1.0 g/m²·day",
    storageType: "ambient",
    dataSource: "Biscuit & Cracker Manufacturers Association / Food Research International",
    specialNotes: "Low water activity product (aw 0.28). Critical engineering requirement is a high moisture vapor barrier (WVTR < 1.0 g/m²·day) to prevent ambient humidity ingress and loss of crisp snap."
  },
  {
    id: "croissants",
    name: "Butter Pastries & Croissants",
    category: "Bakery",
    moisture: 22.0,
    waterActivity: 0.82,
    fat: 26.0,
    ph: 5.5,
    respirationRate: "None",
    respirationValue: 0,
    ethyleneSensitivity: "None",
    lightSensitivity: "Moderate",
    primarySpoilage: [
      "Crust softening & loss of lamination flakiness",
      "Butterfat oxidation",
      "Mold growth on soft crumb",
      "Mechanical crush damage in distribution"
    ],
    recommendedTemp: 20.0,
    recommendedRH: 55,
    ambientShelfLifeDays: 3,
    chilledShelfLifeDays: 7,
    optimalMAPShelfLifeDays: 25,
    optimalGasBlend: { o2: 0, co2: 40, n2: 60 },
    gasRatio: "1.5 : 1 (Gas cushion prevents crumb crush)",
    targetOTR: "< 15.0 cc/m²·day·atm",
    targetWVTR: "< 3.0 g/m²·day",
    storageType: "ambient",
    dataSource: "Journal of Food Processing and Preservation / USDA FDC ID: 172851",
    specialNotes: "Delicate laminated crumb structure requires positive nitrogen pillow cushioning to prevent mechanical crushing, combined with 40% CO2 to inhibit mold."
  },

  // =========================================================================
  // 6. DRY FOODS & GRAINS (Degassing, Insect Asphyxiation, Aroma Locking)
  // =========================================================================
  {
    id: "roasted-coffee-beans",
    name: "Whole Roasted Coffee Beans",
    category: "Dry Foods & Grains",
    moisture: 2.0,
    waterActivity: 0.22,
    fat: 15.0,
    ph: 5.0,
    respirationRate: "CO2 Degassing", // Intense post-roast CO2 evolution (up to 10 L/kg)
    respirationValue: 8,
    ethyleneSensitivity: "None",
    lightSensitivity: "Critical",
    primarySpoilage: [
      "Volatile aroma compound dissipation",
      "Linoleic lipid oxidation (stale rancidity)",
      "Atmospheric moisture sorption",
      "Pouch ballooning / rupture from internal CO2 gas"
    ],
    recommendedTemp: 20.0,
    recommendedRH: 50,
    ambientShelfLifeDays: 20,
    chilledShelfLifeDays: 90,
    optimalMAPShelfLifeDays: 365,
    optimalGasBlend: { o2: 0, co2: 0, n2: 100 },
    gasRatio: "Positive N2 flush + One-Way Degassing Valve",
    targetOTR: "< 0.5 cc/m²·day·atm",
    targetWVTR: "< 0.5 g/m²·day",
    storageType: "ambient",
    dataSource: "Specialty Coffee Association (SCA) Science Papers / Food Chemistry Journal",
    specialNotes: "Roasted beans evolve 2-10 liters of CO2 per kg over several weeks. Requires an ultra-barrier tri-laminate (PET/Alu/PE or AlOx barrier) fitted with a One-Way Degassing Valve to vent internal CO2 while blocking O2 ingress."
  },
  {
    id: "whole-spices",
    name: "Whole Spices & Ground Black Pepper",
    category: "Dry Foods & Grains",
    moisture: 9.0,
    waterActivity: 0.45,
    fat: 6.0,
    ph: 5.8,
    respirationRate: "None",
    respirationValue: 0,
    ethyleneSensitivity: "None",
    lightSensitivity: "Critical",
    primarySpoilage: [
      "Essential oil / piperine volatile evaporation",
      "UV-induced color fading & carotenoid loss",
      "Moisture absorption leading to clumping & mold",
      "Insect infestation (Tribolium spp.)"
    ],
    recommendedTemp: 20.0,
    recommendedRH: 50,
    ambientShelfLifeDays: 90,
    chilledShelfLifeDays: 180,
    optimalMAPShelfLifeDays: 540,
    optimalGasBlend: { o2: 0, co2: 0, n2: 100 },
    gasRatio: "1.0 : 1 (Gas to spice volume)",
    targetOTR: "< 1.0 cc/m²·day·atm",
    targetWVTR: "< 0.8 g/m²·day",
    storageType: "ambient",
    dataSource: "American Spice Trade Association (ASTA) / Journal of Agricultural and Food Chemistry",
    specialNotes: "Essential terpene oils attack and delaminate low-grade sealants. Requires chemical-resistant EVOH or aluminium foil barrier pouches with total UV blocking."
  },
  {
    id: "white-rice",
    name: "Polished Basmati & White Rice",
    category: "Dry Foods & Grains",
    moisture: 12.5,
    waterActivity: 0.55,
    fat: 0.8,
    ph: 6.5,
    respirationRate: "Negligible",
    respirationValue: 0.1,
    ethyleneSensitivity: "None",
    lightSensitivity: "Low",
    primarySpoilage: [
      "Rice weevil (Sitophilus oryzae) egg hatching",
      "Moisture gain leading to Aspergillus mold",
      "Foreign odor absorption",
      "Grain breakage & chalkiness"
    ],
    recommendedTemp: 22.0,
    recommendedRH: 60,
    ambientShelfLifeDays: 180,
    chilledShelfLifeDays: 365,
    optimalMAPShelfLifeDays: 730,
    optimalGasBlend: { o2: 0, co2: 30, n2: 70 }, // or 100% CO2 for insect disinfestation
    gasRatio: "Vacuum brick pack or 1:1 gas flush",
    targetOTR: "< 40.0 cc/m²·day·atm",
    targetWVTR: "< 3.0 g/m²·day",
    storageType: "ambient",
    dataSource: "International Rice Research Institute (IRRI) / Journal of Stored Products Research",
    specialNotes: "Packaging must resist puncture from sharp grain points. Vacuum packaging or high CO2 flushing asphyxiates insect larvae and eggs, preventing infestations without chemical fumigants."
  },

  // =========================================================================
  // 7. SNACKS & CONFECTIONERY (High Fat, Crispness, Sugar/Fat Bloom)
  // =========================================================================
  {
    id: "potato-chips",
    name: "Crispy Fried Potato Chips / Crisps",
    category: "Snacks & Confectionery",
    moisture: 1.8,
    waterActivity: 0.20,
    fat: 34.0,
    ph: 6.2,
    respirationRate: "None",
    respirationValue: 0,
    ethyleneSensitivity: "None",
    lightSensitivity: "Critical",
    primarySpoilage: [
      "Photo-oxidation of frying oils (hexanal rancidity)",
      "Loss of crispness at Aw > 0.35",
      "Mechanical crushing in transport"
    ],
    recommendedTemp: 20.0,
    recommendedRH: 50,
    ambientShelfLifeDays: 20,
    chilledShelfLifeDays: 60,
    optimalMAPShelfLifeDays: 240,
    optimalGasBlend: { o2: 0, co2: 0, n2: 100 },
    gasRatio: "Positive nitrogen pillow cushion (1.5 : 1 volume)",
    targetOTR: "< 1.5 cc/m²·day·atm",
    targetWVTR: "< 1.0 g/m²·day",
    storageType: "ambient",
    dataSource: "Snack Food Association / Journal of Food Science",
    specialNotes: "High vegetable oil content (34%) makes chips highly susceptible to light-induced rancidity. Requires metallized barrier film (BOPP/Met-BOPP/PE) with positive N2 pillow cushion to prevent transit breakage."
  },
  {
    id: "roasted-almonds",
    name: "Roasted Salted Almonds & Walnuts",
    category: "Snacks & Confectionery",
    moisture: 2.5,
    waterActivity: 0.30,
    fat: 52.0,
    ph: 6.3,
    respirationRate: "None",
    respirationValue: 0,
    ethyleneSensitivity: "None",
    lightSensitivity: "Critical",
    primarySpoilage: [
      "Unsaturated fat auto-oxidation (rancidity)",
      "Texture sogginess from moisture absorption",
      "Bitter off-flavor evolution"
    ],
    recommendedTemp: 18.0,
    recommendedRH: 55,
    ambientShelfLifeDays: 45,
    chilledShelfLifeDays: 120,
    optimalMAPShelfLifeDays: 365,
    optimalGasBlend: { o2: 0, co2: 0, n2: 100 },
    gasRatio: "1.0 : 1 (Gas to nut volume)",
    targetOTR: "< 1.0 cc/m²·day·atm",
    targetWVTR: "< 1.0 g/m²·day",
    storageType: "ambient",
    dataSource: "Almond Board of California / Journal of the Science of Food and Agriculture",
    specialNotes: "Tree nuts contain rich polyunsaturated fatty acids (PUFA). Packaging must keep residual oxygen below 0.5% using N2 flushing or O2 scavengers."
  },
  {
    id: "dark-chocolate",
    name: "Fine Dark Chocolate (70% Cacao)",
    category: "Snacks & Confectionery",
    moisture: 1.2,
    waterActivity: 0.35,
    fat: 42.0,
    ph: 5.6,
    respirationRate: "None",
    respirationValue: 0,
    ethyleneSensitivity: "None",
    lightSensitivity: "Moderate",
    primarySpoilage: [
      "Fat bloom (polymorphic transition to Form VI cocoa butter crystals)",
      "Sugar bloom (moisture condensation dissolving surface sugar)",
      "Foreign odor / warehouse aroma absorption"
    ],
    recommendedTemp: 16.0,
    recommendedRH: 50,
    ambientShelfLifeDays: 180,
    chilledShelfLifeDays: 365,
    optimalMAPShelfLifeDays: 540,
    optimalGasBlend: { o2: 0, co2: 0, n2: 100 },
    gasRatio: "Foil wrap / flow wrap",
    targetOTR: "< 10.0 cc/m²·day·atm",
    targetWVTR: "< 1.5 g/m²·day",
    storageType: "ambient",
    dataSource: "International Confectionery Association / Beckett's Industrial Chocolate",
    specialNotes: "Store between 15-18°C. Moisture barrier is critical to prevent surface sugar dissolution and recrystallization (sugar bloom). Aluminium foil or NatureFlex wraps block external odors."
  },

  // =========================================================================
  // 8. BEVERAGES & LIQUIDS (Flavor Scalping, Vitamin C, Photo-Oxidation)
  // =========================================================================
  {
    id: "cold-pressed-juice",
    name: "Cold-Pressed Raw Orange Juice",
    category: "Beverages & Liquids",
    moisture: 88.0,
    waterActivity: 0.98,
    fat: 0.2,
    ph: 3.5,
    respirationRate: "None",
    respirationValue: 0,
    ethyleneSensitivity: "None",
    lightSensitivity: "Critical",
    primarySpoilage: [
      "Ascorbic acid (Vitamin C) oxidative breakdown",
      "Wild yeast fermentation & CO2 gas blowing",
      "Flavor scalping (d-limonene aroma absorption into standard PE liners)",
      "Enzymatic browning"
    ],
    recommendedTemp: 2.0,
    recommendedRH: 85,
    ambientShelfLifeDays: 1,
    chilledShelfLifeDays: 4,
    optimalMAPShelfLifeDays: 30, // With High Pressure Processing (HPP)
    optimalGasBlend: { o2: 0, co2: 0, n2: 100 },
    gasRatio: "Zero headspace or inert N2 drip",
    targetOTR: "< 2.0 cc/m²·day·atm",
    targetWVTR: "< 1.0 g/m²·day",
    storageType: "chilled",
    dataSource: "Journal of Food Engineering / Citrus Processing Science",
    specialNotes: "Raw citrus juice is vulnerable to flavor scalping (absorption of non-polar d-limonene into standard polyethylenes). Requires PET, EVOH barrier, or glass with UV protection."
  },
  {
    id: "extra-virgin-olive-oil",
    name: "Extra Virgin Olive Oil (EVOO)",
    category: "Beverages & Liquids",
    moisture: 0.1,
    waterActivity: 0.15,
    fat: 99.8,
    ph: 6.8,
    respirationRate: "None",
    respirationValue: 0,
    ethyleneSensitivity: "None",
    lightSensitivity: "Extreme",
    primarySpoilage: [
      "Photo-sensitized oxidation of polyphenols & chlorophyll (rancidity)",
      "Free fatty acid peroxide value elevation",
      "Loss of fruity aroma volatiles"
    ],
    recommendedTemp: 18.0,
    recommendedRH: 50,
    ambientShelfLifeDays: 90,
    chilledShelfLifeDays: 180,
    optimalMAPShelfLifeDays: 540,
    optimalGasBlend: { o2: 0, co2: 0, n2: 100 },
    gasRatio: "Inert nitrogen headspace blanketing",
    targetOTR: "< 0.5 cc/m²·day·atm",
    targetWVTR: "< 1.0 g/m²·day",
    storageType: "ambient",
    dataSource: "International Olive Council (IOC) / Food Chemistry",
    specialNotes: "Chlorophyll acts as a powerful photo-sensitizer that catalyses singlet oxygen formation under supermarket lighting. Demands dark amber glass, tinplate cans, or metallized bag-in-box."
  },

  // =========================================================================
  // 9. READY-TO-EAT (RTE) (Dual Ovenability, Pathogen Safety, Syneresis)
  // =========================================================================
  {
    id: "fresh-pasta",
    name: "Fresh Stuffed Tortellini / Ravioli",
    category: "Ready-to-Eat (RTE)",
    moisture: 30.0,
    waterActivity: 0.92,
    fat: 6.0,
    ph: 5.8,
    respirationRate: "None",
    respirationValue: 0,
    ethyleneSensitivity: "None",
    lightSensitivity: "Moderate",
    primarySpoilage: [
      "Surface mold and yeast germination",
      "Lactic acid souring",
      "Dough darkening / oxidation",
      "Moisture migration from filling to pasta dough"
    ],
    recommendedTemp: 3.0,
    recommendedRH: 85,
    ambientShelfLifeDays: 2,
    chilledShelfLifeDays: 6,
    optimalMAPShelfLifeDays: 45,
    optimalGasBlend: { o2: 0, co2: 50, n2: 50 },
    gasRatio: "1.5 : 1 (Gas to pasta volume)",
    targetOTR: "< 5.0 cc/m²·day·atm",
    targetWVTR: "< 3.0 g/m²·day",
    storageType: "chilled",
    dataSource: "Journal of Food Science and Technology / USDA FDC ID: 173128",
    specialNotes: "50% CO2 suppresses surface mold while 50% N2 prevents packaging collapse. Thermoformed barrier tray with peelable anti-fog lid provides shelf life up to 45 days."
  },
  {
    id: "chilled-ready-meal",
    name: "Cooked Chicken & Rice Ready Meal",
    category: "Ready-to-Eat (RTE)",
    moisture: 65.0,
    waterActivity: 0.97,
    fat: 9.0,
    ph: 6.1,
    respirationRate: "None",
    respirationValue: 0,
    ethyleneSensitivity: "None",
    lightSensitivity: "Moderate",
    primarySpoilage: [
      "Psychrotrophic pathogen outgrowth (Listeria monocytogenes, Clostridium botulinum)",
      "Warmed-over flavor (lipid oxidation)",
      "Sauce syneresis & starch retrogradation"
    ],
    recommendedTemp: 2.0,
    recommendedRH: 85,
    ambientShelfLifeDays: 1,
    chilledShelfLifeDays: 3,
    optimalMAPShelfLifeDays: 18,
    optimalGasBlend: { o2: 0, co2: 40, n2: 60 },
    gasRatio: "1.5 : 1 (Gas to food volume)",
    targetOTR: "< 3.0 cc/m²·day·atm",
    targetWVTR: "< 2.0 g/m²·day",
    storageType: "chilled",
    dataSource: "Chilled Food Association (CFA) Best Practice / Campden BRI",
    specialNotes: "If designed for heat-in-pack convenience, the tray must withstand dual-ovenability (microwave and conventional oven reheat at 180-200°C) using CPET or heat-resistant PP."
  },

  // =========================================================================
  // 10. FROZEN FOODS (Ice Sublimation, Freezer Burn, Cold Crack)
  // =========================================================================
  {
    id: "frozen-green-peas",
    name: "Individually Quick Frozen (IQF) Peas",
    category: "Frozen Foods",
    moisture: 78.0,
    waterActivity: 0.90, // Sub-zero ice equilibrium
    fat: 0.5,
    ph: 6.6,
    respirationRate: "None",
    respirationValue: 0,
    ethyleneSensitivity: "None",
    lightSensitivity: "Moderate",
    primarySpoilage: [
      "Freezer burn (ice crystal sublimation & surface desiccation)",
      "Internal frost/ice accumulation inside bag",
      "Chlorophyll fading & bleaching",
      "Oxidative off-flavors"
    ],
    recommendedTemp: -18.0,
    recommendedRH: 90,
    ambientShelfLifeDays: 0.2,
    chilledShelfLifeDays: 2,
    optimalMAPShelfLifeDays: 540,
    optimalGasBlend: { o2: 0, co2: 0, n2: 100 },
    gasRatio: "1.0 : 1 (Gas to product volume)",
    targetOTR: "< 50.0 cc/m²·day·atm",
    targetWVTR: "< 0.5 g/m²·day", // Critical: prevents ice sublimation
    storageType: "frozen",
    dataSource: "International Institute of Refrigeration (IIR) / USDA FDC ID: 170420",
    specialNotes: "Sub-zero storage requires low-temperature impact ductility (-25°C cold crack resistance) and puncture resistance against sharp frozen food crystals. Metallocene-PE co-extrusion prevents freezer burn."
  }
];

// Helper queries
function getFoodCategories() {
  return [
    "Fresh Produce",
    "Meat & Poultry",
    "Seafood",
    "Dairy",
    "Bakery",
    "Dry Foods & Grains",
    "Snacks & Confectionery",
    "Beverages & Liquids",
    "Ready-to-Eat (RTE)",
    "Frozen Foods"
  ];
}

function getFoodById(id) {
  return FOOD_COMMODITIES.find(f => f.id === id) || null;
}

function getFoodsByCategory(category) {
  if (!category || category === "ALL") return FOOD_COMMODITIES;
  return FOOD_COMMODITIES.filter(f => f.category === category);
}

// Global scope exposure
const globalScopeFood = typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : global);
globalScopeFood.FOOD_COMMODITIES = FOOD_COMMODITIES;
globalScopeFood.getFoodCategories = getFoodCategories;
globalScopeFood.getFoodById = getFoodById;
globalScopeFood.getFoodsByCategory = getFoodsByCategory;
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { FOOD_COMMODITIES, getFoodCategories, getFoodById, getFoodsByCategory };
}
