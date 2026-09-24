/**
 * Annakavach — Master Application Controller
 * Handles user interactions, real-time input validation, kinetic simulation rendering,
 * recommendation history caching, three-way theme management (Light / Dark / Auto),
 * global viewport tap ripple animations, dynamic Indian Rupee (₹) pricing,
 * and formal ASTM/ISO technical specification document generation.
 */

// Global theme setter helper accessible across the application lifecycle
window.setTheme = function(pref) {
  try {
    localStorage.setItem("annakavach_theme", pref);
  } catch (err) {
    console.warn("localStorage not available", err);
  }

  // Update button active states
  const btnLight = document.getElementById("themeBtnLight");
  const btnDark = document.getElementById("themeBtnDark");
  const btnAuto = document.getElementById("themeBtnAuto");

  if (btnLight) btnLight.classList.toggle("active", pref === "light");
  if (btnDark) btnDark.classList.toggle("active", pref === "dark");
  if (btnAuto) btnAuto.classList.toggle("active", pref === "auto");

  let resolved = pref;
  if (pref === "auto") {
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    resolved = prefersDark ? "dark" : "light";
  }

  document.documentElement.setAttribute("data-theme", resolved);
  if (document.body) {
    document.body.setAttribute("data-theme", resolved);
  }

  // Dispatch custom event for Chart.js canvas redraw
  window.dispatchEvent(new CustomEvent("annakavach-theme-changed", { detail: { theme: resolved, pref } }));
};

document.addEventListener("DOMContentLoaded", () => {
  // Global Application State (Starts in clean uninitialized state)
  let currentRecommendation = null;
  let shelfLifeChartInstance = null;
  let activePresetId = null;
  let currentThemePreference = localStorage.getItem("annakavach_theme") || "light";
  let recommendationHistory = [];

  try {
    const savedHist = localStorage.getItem("annakavach_history");
    if (savedHist) recommendationHistory = JSON.parse(savedHist);
  } catch (e) {
    recommendationHistory = [];
  }

  // Conversion rate: 1 USD ≈ 83 INR
  const USD_TO_INR = 83;

  // Element Selectors Cache
  const elements = {
    // Theme buttons
    themeBtnLight: document.getElementById("themeBtnLight"),
    themeBtnDark: document.getElementById("themeBtnDark"),
    themeBtnAuto: document.getElementById("themeBtnAuto"),

    // Mode Toggle
    modeBtnEngineer: document.getElementById("modeBtnEngineer"),
    modeBtnFarmer: document.getElementById("modeBtnFarmer"),
    engineerControlsCard: document.getElementById("engineerControlsCard"),
    farmerWizardSection: document.getElementById("farmerWizardSection"),

    // Fast Wizard Inputs
    wizardCommoditySelect: document.getElementById("wizardCommoditySelect"),
    wizardStorageSelect: document.getElementById("wizardStorageSelect"),
    wizardShelfLifeSelect: document.getElementById("wizardShelfLifeSelect"),
    wizardPrioritySelect: document.getElementById("wizardPrioritySelect"),
    btnRunWizard: document.getElementById("btnRunWizard"),

    // Validation & Loading Banners
    validationAlertBox: document.getElementById("validationAlertBox"),
    validationAlertMessage: document.getElementById("validationAlertMessage"),
    analysisLoadingBox: document.getElementById("analysisLoadingBox"),

    // History Ribbon
    historyRibbonWrap: document.getElementById("historyRibbonWrap"),
    historyChipsContainer: document.getElementById("historyChipsContainer"),

    // Presets Ribbon & Filters
    commoditySelectorSection: document.getElementById("commoditySelectorSection"),
    categoryFiltersWrap: document.getElementById("categoryFiltersWrap"),
    presetsScrollGrid: document.getElementById("presetsScrollGrid"),
    commoditySearchInput: document.getElementById("commoditySearchInput"),
    commoditySearchClear: document.getElementById("commoditySearchClear"),
    presetsCountBadge: document.getElementById("presetsCountBadge"),
    btnToggleMoreCommodities: document.getElementById("btnToggleMoreCommodities"),
    toggleMoreText: document.getElementById("toggleMoreText"),
    toggleMoreIcon: document.getElementById("toggleMoreIcon"),
    presetsDisplayCount: document.getElementById("presetsDisplayCount"),

    // Workflow Pipeline & Popover
    workflowPipelineBar: document.getElementById("workflowPipelineBar"),
    pipelineInfoBox: document.getElementById("pipelineInfoBox"),
    pipeInfoBadge: document.getElementById("pipeInfoBadge"),
    pipeInfoTitle: document.getElementById("pipeInfoTitle"),
    pipeInfoDesc: document.getElementById("pipeInfoDesc"),
    pipeInfoInput: document.getElementById("pipeInfoInput"),
    pipeInfoOutput: document.getElementById("pipeInfoOutput"),
    pipeInfoClose: document.getElementById("pipeInfoClose"),

    // Form inputs (Physico-chemical workbench)
    inputCommodityName: document.getElementById("inputCommodityName"),
    tagLineageCommodity: document.getElementById("tagLineageCommodity"),
    inputCategory: document.getElementById("inputCategory"),
    inputMoisture: document.getElementById("inputMoisture"),
    valMoisture: document.getElementById("valMoisture"),
    inputWaterActivity: document.getElementById("inputWaterActivity"),
    valWaterActivity: document.getElementById("valWaterActivity"),
    inputFat: document.getElementById("inputFat"),
    valFat: document.getElementById("valFat"),
    inputPH: document.getElementById("inputPH"),
    valPH: document.getElementById("valPH"),
    inputRespiration: document.getElementById("inputRespiration"),
    inputLightSensitivity: document.getElementById("inputLightSensitivity"),
    inputTemp: document.getElementById("inputTemp"),
    valTemp: document.getElementById("valTemp"),
    inputRH: document.getElementById("inputRH"),
    valRH: document.getElementById("valRH"),
    inputShelfLife: document.getElementById("inputShelfLife"),
    valShelfLife: document.getElementById("valShelfLife"),
    inputPackWidth: document.getElementById("inputPackWidth"),
    inputPackHeight: document.getElementById("inputPackHeight"),
    inputProductWholesalePrice: document.getElementById("inputProductWholesalePrice"),
    btnCalculate: document.getElementById("btnCalculateRecommendation"),
    btnResetDefaults: document.getElementById("btnResetDefaults"),

    // Result Containers (Empty State vs Active Recommendation)
    emptyStateContainer: document.getElementById("emptyStateContainer"),
    activeResultsContainer: document.getElementById("activeResultsContainer"),
    emptyStateSubtitle: document.getElementById("emptyStateSubtitle"),
    emptyStateSelectPresetBtn: document.getElementById("emptyStateSelectPresetBtn"),
    btnResetFromHero: document.getElementById("btnResetFromHero"),

    // Engineering Alerts Container
    engineeringAlertsContainer: document.getElementById("engineeringAlertsContainer"),

    // Primary Recommendation Hero Card
    heroMatchScore: document.getElementById("heroMatchScore"),
    heroMaterialType: document.getElementById("heroMaterialType"),
    heroMaterialName: document.getElementById("heroMaterialName"),
    heroShelfLifeVal: document.getElementById("heroShelfLifeVal"),
    heroLayerFormula: document.getElementById("heroLayerFormula"),
    tileOTR: document.getElementById("tileOTR"),
    tileWVTR: document.getElementById("tileWVTR"),
    tileSeal: document.getElementById("tileSeal"),

    // 5-Factor Score Breakdown
    scoreTotalVal: document.getElementById("scoreTotalVal"),
    progValBarrier: document.getElementById("progValBarrier"),
    progFillBarrier: document.getElementById("progFillBarrier"),
    progValRespiration: document.getElementById("progValRespiration"),
    progFillRespiration: document.getElementById("progFillRespiration"),
    progValStorage: document.getElementById("progValStorage"),
    progFillStorage: document.getElementById("progFillStorage"),
    progValSust: document.getElementById("progValSust"),
    progFillSust: document.getElementById("progFillSust"),
    progValCost: document.getElementById("progValCost"),
    progFillCost: document.getElementById("progFillCost"),

    // Transparent "Why this recommendation?" Explanation
    whyExplanationGrid: document.getElementById("whyExplanationGrid"),

    // MAP Gas Gauge
    mapBadgeType: document.getElementById("mapBadgeType"),
    gasBarO2: document.getElementById("gasBarO2"),
    gasBarCO2: document.getElementById("gasBarCO2"),
    gasBarN2: document.getElementById("gasBarN2"),
    valGasO2: document.getElementById("valGasO2"),
    valGasCO2: document.getElementById("valGasCO2"),
    valGasN2: document.getElementById("valGasN2"),
    valGasRatio: document.getElementById("valGasRatio"),
    mapRationaleText: document.getElementById("mapRationaleText"),
    perforationSpecWrap: document.getElementById("perforationSpecWrap"),
    perforationDetailText: document.getElementById("perforationDetailText"),

    // Tabs & Panes
    detailTabBtns: document.querySelectorAll(".detail-tab-btn"),
    tabPanes: document.querySelectorAll(".tab-pane"),

    // Shelf Life Simulator
    simValUnpackaged: document.getElementById("simValUnpackaged"),
    simValStandard: document.getElementById("simValStandard"),
    simValOptimized: document.getElementById("simValOptimized"),
    simDriverBadge: document.getElementById("simDriverBadge"),
    simAssumptionsGrid: document.getElementById("simAssumptionsGrid"),

    // Laminate Structure Tab
    laminateStructureTitle: document.getElementById("laminateStructureTitle"),
    laminateRationaleText: document.getElementById("laminateRationaleText"),
    laminateStackList: document.getElementById("laminateStackList"),
    laminateTotalThickness: document.getElementById("laminateTotalThickness"),
    laminateEstimatedOTR: document.getElementById("laminateEstimatedOTR"),
    laminateRecyclability: document.getElementById("laminateRecyclability"),

    // Sustainability Tab
    ecoMaterialName: document.getElementById("ecoMaterialName"),
    ecoStreamText: document.getElementById("ecoStreamText"),
    ecoScoreNum: document.getElementById("ecoScoreNum"),
    ecoPPWRText: document.getElementById("ecoPPWRText"),
    ecoTaxText: document.getElementById("ecoTaxText"),
    ecoCarbonText: document.getElementById("ecoCarbonText"),
    ecoEndOfLifeText: document.getElementById("ecoEndOfLifeText"),

    // Cost Tab
    costHealthBadge: document.getElementById("costHealthBadge"),
    costTableBody: document.getElementById("costTableBody"),
    costBatchArea: document.getElementById("costBatchArea"),
    costRatioVal: document.getElementById("costRatioVal"),

    // Passport Tab
    passportQRCanvas: document.getElementById("passportQRCanvas"),
    passportLotBadge: document.getElementById("passportLotBadge"),
    ppValCommodity: document.getElementById("ppValCommodity"),
    ppValMaterial: document.getElementById("ppValMaterial"),
    ppValBarrier: document.getElementById("ppValBarrier"),
    ppValStorage: document.getElementById("ppValStorage"),
    ppValRecycling: document.getElementById("ppValRecycling"),
    btnPrintQRBadge: document.getElementById("btnPrintQRBadge"),

    // Compare Tab
    compareMatrixTable: document.getElementById("compareMatrixTable"),

    // Material Catalog
    materialsCatalogGrid: document.getElementById("materialsCatalogGrid"),
    catalogSearchInput: document.getElementById("catalogSearchInput"),
    catalogTypeFilter: document.getElementById("catalogTypeFilter"),

    // Spec Sheet Export Modal
    specSheetModal: document.getElementById("specSheetModal"),
    btnExportTopSpec: document.getElementById("btnExportTopSpec"),
    btnCloseSpecModal: document.getElementById("btnCloseSpecModal"),
    btnPrintModalDoc: document.getElementById("btnPrintModalDoc"),
    printableSpecContent: document.getElementById("printableSpecContent")
  };

  // Presets & Filter State
  let currentCategoryFilter = "ALL";
  let currentSearchQuery = "";
  let isPresetsExpanded = false;

  const CATEGORY_EMOJIS = {
    "Fresh Produce": "🍓",
    "Meat & Poultry": "🥩",
    "Seafood": "🐟",
    "Dairy": "🧀",
    "Bakery": "🍞",
    "Dry Foods & Grains": "☕",
    "Snacks & Confectionery": "🥔",
    "Beverages & Liquids": "🫒",
    "Ready-to-Eat (RTE)": "🍝",
    "Frozen Foods": "🥦"
  };

  // Precise food-commodity emoji mapping[cite: 34]
  function getFoodEmoji(food) {
    const name = (food.name || "").toLowerCase();
    if (name.includes("spinach") || name.includes("salad") || (name.includes("green") && !name.includes("pea"))) return "🥬";
    if (name.includes("mushroom")) return "🍄";
    if (name.includes("apple")) return "🍎";
    if (name.includes("avocado")) return "🥑";
    if (name.includes("tomato")) return "🍅";
    if (name.includes("strawberr") || name.includes("berr")) return "🍓";
    if (name.includes("steak") || name.includes("beef") || name.includes("mince")) return "🥩";
    if (name.includes("chicken") || name.includes("poultry")) return "🍗";
    if (name.includes("bacon") || name.includes("pork")) return "🥓";
    if (name.includes("salmon") || name.includes("fish")) return "🐟";
    if (name.includes("prawn") || name.includes("shrimp") || name.includes("seafood")) return "🍤";
    if (name.includes("cheddar") || name.includes("cheese") || name.includes("mozzarella")) return "🧀";
    if (name.includes("butter")) return "🧈";
    if (name.includes("bread") || name.includes("sourdough") || name.includes("bakery")) return "🥖";
    if (name.includes("cookie")) return "🍪";
    if (name.includes("croissant")) return "🥐";
    if (name.includes("coffee")) return "☕";
    if (name.includes("spice") || name.includes("herb")) return "🌿";
    if (name.includes("rice") || name.includes("grain")) return "🍚";
    if (name.includes("chip") || name.includes("snack")) return "🍟";
    if (name.includes("almond") || name.includes("nut")) return "🌰";
    if (name.includes("chocolate")) return "🍫";
    if (name.includes("juice")) return "🧃";
    if (name.includes("oil") || name.includes("olive")) return "🫒";
    if (name.includes("pasta") || name.includes("tortellini")) return "🍝";
    if (name.includes("meal") || name.includes("chilled-ready") || name.includes("rte")) return "🍱";
    if (name.includes("pea")) return "🫛";
    return CATEGORY_EMOJIS[food.category] || "📦";
  }

  const PIPELINE_STAGES = {
    "1": {
      badge: "STAGE 01",
      title: "Food Commodity Ingestion & Profile Analysis",
      desc: "Ingests biological food attributes, water activity (aw), pH, fat composition, and metabolic respiration rates from calibrated reference libraries or custom user inputs.",
      input: "Physico-chemical Library (22 Matrices)",
      output: "Physico-Chemical Spoilage Profile"
    },
    "2": {
      badge: "STAGE 02",
      title: "Spoilage Mechanism & Vulnerability Mapping",
      desc: "Evaluates multi-vector degradation pathways including aerobic bacterial growth, mold/yeast proliferation, lipid auto-oxidation, enzymatic browning, and moisture desiccation.",
      input: "aw, pH, Moisture %, Fat %",
      output: "Ranked Degradation Vectors"
    },
    "3": {
      badge: "STAGE 03",
      title: "Storage Logistics & Distribution Boundary Matching",
      desc: "Configures thermal conditions and ambient relative humidity for cold chain (0-4°C), ambient (20-25°C), or frozen (-18°C) supply chains to compute barrier requirements.",
      input: "Storage Class, Temperature & RH",
      output: "Thermal & Humidity Boundary Curves"
    },
    "4": {
      badge: "STAGE 04",
      title: "Barrier Permeation Kinetics Formulation",
      desc: "Calculates precise oxygen transmission rate (OTR) and water vapor transmission rate (WVTR) boundary limits using Arrhenius temperature-acceleration models.",
      input: "Target Shelf Life & Spoilage Kinetic Limits",
      output: "Target OTR (cc/m²·d·atm) & WVTR (g/m²·d)"
    },
    "5": {
      badge: "STAGE 05",
      title: "Polymer Substrate & Multi-Layer Laminate Matching",
      desc: "Ranks high-barrier co-extruded multi-layer laminates, mono-material PE/PP structures, vacuum metalized films, and bio-polymers against target barrier constraints.",
      input: "Packaging Materials Database (12 Resins)",
      output: "Optimal Laminate Structure & SIT"
    },
    "6": {
      badge: "STAGE 06",
      title: "MAP Gas Blend & Dynamic Shelf-Life Simulation",
      desc: "Calculates optimal Modified Atmosphere Packaging (O2/CO2/N2) headspace composition, anti-fog laser micro-perforations, and simulates extended vs unpackaged shelf-life.",
      input: "MAP Gas Equilibrium & ASLT Equations",
      output: "Simulated Shelf-Life (Days) & Gas Gauge"
    },
    "7": {
      badge: "STAGE 07",
      title: "EU PPWR 2030 Circularity & DPP Passport Generation",
      desc: "Scores cradle-to-gate carbon footprint, recyclability compliance under EU PPWR 2030 packaging regulations, Plastic Packaging Tax, and mints Digital Product Passports.",
      input: "LCA Database & Circularity Indices",
      output: "EU PPWR Recyclability Class & DPP QR"
    }
  };

  // =========================================================================
  // 1. Application Initialization & State Management Engine
  // =========================================================================
  function init() {
    window.setTheme(currentThemePreference);

    // Watch system color changes if set to auto
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        const stored = localStorage.getItem("annakavach_theme") || "light";
        if (stored === "auto") window.setTheme("auto");
      });
    }

    // Handle theme change redraws
    const handleThemeChange = () => {
      if (currentRecommendation && currentRecommendation.inputParameters) {
        updateShelfLifeSimulation(currentRecommendation.inputParameters, currentRecommendation.primaryRecommendation);
        updateQRPassport(currentRecommendation);
      }
    };
    window.addEventListener("annakavach-theme-changed", handleThemeChange);

    renderPresetCards("ALL");
    renderHistoryRibbon();
    renderCatalogGrid();
    setupEventListeners();
    initClickAnimations();
    initScrollAnimations();
    setupSmoothAnchorScrolling();

    // Enforce clean uninitialized empty state on startup
    resetToEmptyState();

    if (window.lucide && window.lucide.createIcons) {
      lucide.createIcons();
    }
  }

  // Complete Reset / Return to Initial Clean Empty State
  function resetToEmptyState() {
    currentRecommendation = null;
    activePresetId = null;

    if (shelfLifeChartInstance) {
      shelfLifeChartInstance.destroy();
      shelfLifeChartInstance = null;
    }

    // Clear form inputs
    if (elements.inputCommodityName) elements.inputCommodityName.value = "";
    if (elements.tagLineageCommodity) elements.tagLineageCommodity.textContent = "[Not Selected]";
    if (elements.inputCategory) elements.inputCategory.value = "";

    // Reset sliders to baseline placeholder values
    if (elements.inputMoisture) {
      elements.inputMoisture.value = 50;
      if (elements.valMoisture) elements.valMoisture.textContent = "50%";
    }
    if (elements.inputWaterActivity) {
      elements.inputWaterActivity.value = 0.70;
      if (elements.valWaterActivity) elements.valWaterActivity.textContent = "0.70";
    }
    if (elements.inputFat) {
      elements.inputFat.value = 5.0;
      if (elements.valFat) elements.valFat.textContent = "5.0%";
    }
    if (elements.inputPH) {
      elements.inputPH.value = 6.0;
      if (elements.valPH) elements.valPH.textContent = "6.0";
    }
    if (elements.inputRespiration) elements.inputRespiration.value = "Low";
    if (elements.inputLightSensitivity) elements.inputLightSensitivity.value = "Low";

    // Storage and dimensions
    const chilledRadio = document.querySelector('input[name="storageTypeRadio"][value="chilled"]');
    if (chilledRadio) chilledRadio.checked = true;

    if (elements.inputTemp) {
      elements.inputTemp.value = 4.0;
      if (elements.valTemp) elements.valTemp.textContent = "4.0°C";
    }
    if (elements.inputRH) {
      elements.inputRH.value = 75;
      if (elements.valRH) elements.valRH.textContent = "75%";
    }
    if (elements.inputShelfLife) {
      elements.inputShelfLife.value = 14;
      if (elements.valShelfLife) elements.valShelfLife.textContent = "14 days";
    }
    if (elements.inputPackWidth) elements.inputPackWidth.value = 150;
    if (elements.inputPackHeight) elements.inputPackHeight.value = 220;
    if (elements.inputProductWholesalePrice) elements.inputProductWholesalePrice.value = "3.50";

    // Fast Wizard fields
    if (elements.wizardCommoditySelect) elements.wizardCommoditySelect.value = "";
    if (elements.wizardStorageSelect) elements.wizardStorageSelect.value = "chilled";
    if (elements.wizardShelfLifeSelect) elements.wizardShelfLifeSelect.value = "medium";
    if (elements.wizardPrioritySelect) elements.wizardPrioritySelect.value = "balanced";

    // Clear preset selection highlights
    document.querySelectorAll(".preset-card").forEach(c => {
      c.classList.remove("selected");
      const dot = c.querySelector(".preset-check-dot");
      if (dot) dot.textContent = "";
    });

    // Clear validation banner
    if (elements.validationAlertBox) {
      elements.validationAlertBox.style.display = "none";
    }

    // Toggle DOM state containers: show empty state, hide active recommendation
    if (elements.activeResultsContainer) {
      elements.activeResultsContainer.style.display = "none";
    }
    if (elements.emptyStateContainer) {
      elements.emptyStateContainer.style.display = "flex";
      if (elements.emptyStateSubtitle) {
        elements.emptyStateSubtitle.innerHTML = `Select a food commodity from the reference library above or enter custom physico-chemical attributes on the left, then click <strong>Run Recommendation Model</strong> to calculate optimal barrier packaging.`;
      }
    }
  }

  // Reactive Invalidation: If parameters change after analysis, invalidate current recommendation
  function invalidateCurrentRecommendation(customNotice) {
    if (!currentRecommendation) return;

    currentRecommendation = null;
    if (shelfLifeChartInstance) {
      shelfLifeChartInstance.destroy();
      shelfLifeChartInstance = null;
    }

    if (elements.activeResultsContainer) {
      elements.activeResultsContainer.style.display = "none";
    }
    if (elements.emptyStateContainer) {
      elements.emptyStateContainer.style.display = "flex";
      if (elements.emptyStateSubtitle) {
        elements.emptyStateSubtitle.innerHTML = customNotice || `Input parameters were modified. Click <strong>Run Recommendation Model</strong> to calculate a new recommendation for the updated profile.`;
      }
    }
  }

  // =========================================================================
  // 2. Preset Carousel & Category Filters (Nested Layout Architecture)
  // =========================================================================
  function renderPresetCards() {
    if (!elements.presetsScrollGrid) return;
    elements.presetsScrollGrid.innerHTML = "";

    const commodities = window.FOOD_COMMODITIES || [];
    const query = currentSearchQuery.toLowerCase().trim();

    // Filter by category and search query
    const filtered = commodities.filter(food => {
      const matchCat = currentCategoryFilter === "ALL" || food.category === currentCategoryFilter;
      const matchQuery = !query ||
        food.name.toLowerCase().includes(query) ||
        food.category.toLowerCase().includes(query) ||
        (food.specialNotes && food.specialNotes.toLowerCase().includes(query)) ||
        (food.storageType && food.storageType.toLowerCase().includes(query));
      return matchCat && matchQuery;
    });

    // Update count badge
    if (elements.presetsCountBadge) {
      elements.presetsCountBadge.textContent = `${filtered.length} Commodities`;
    }

    // Determine slice for Show More / Show Fewer toggle
    const shouldSlice = !query && !isPresetsExpanded && filtered.length > 8;
    const displayList = shouldSlice ? filtered.slice(0, 8) : filtered;

    // Update footer display count
    if (elements.presetsDisplayCount) {
      elements.presetsDisplayCount.textContent = `Showing ${displayList.length} of ${filtered.length} Commodities`;
    }

    // Update toggle button text and state
    if (elements.btnToggleMoreCommodities) {
      if (filtered.length <= 8 || query) {
        elements.btnToggleMoreCommodities.style.display = "none";
      } else {
        elements.btnToggleMoreCommodities.style.display = "inline-flex";
        if (elements.toggleMoreText) {
          elements.toggleMoreText.textContent = isPresetsExpanded
            ? `Show Fewer Commodities (8)`
            : `Show All Commodities (${filtered.length})`;
        }
        elements.btnToggleMoreCommodities.classList.toggle("expanded", isPresetsExpanded);
      }
    }

    // Empty Search Result State
    if (displayList.length === 0) {
      elements.presetsScrollGrid.innerHTML = `
        <div class="presets-no-results">
          <strong>No matching food commodities found</strong>
          <span>Try adjusting your search keyword or selecting "All Categories".</span>
        </div>
      `;
      return;
    }

    // Render structured nested cards
    displayList.forEach(food => {
      const isSelected = food.id === activePresetId;
      const card = document.createElement("div");
      card.className = `preset-card ${isSelected ? "selected" : ""}`;
      card.dataset.id = food.id;
      card.setAttribute("role", "button");
      card.setAttribute("tabindex", "0");
      card.setAttribute("title", `Click to load ${food.name} parameters`);

      const emoji = getFoodEmoji(food);

      card.innerHTML = `
        <div class="preset-card-head">
          <div class="preset-head-left">
            <span class="preset-icon" aria-hidden="true">${emoji}</span>
            <span class="preset-name">${food.name}</span>
          </div>
          <span class="preset-check-dot">${isSelected ? "✓" : ""}</span>
        </div>

        <div class="preset-card-metrics">
          <div class="preset-metric-cell">
            <span class="preset-metric-label">Moisture</span>
            <span class="preset-metric-val">${food.moisture}%</span>
          </div>
          <div class="preset-metric-cell">
            <span class="preset-metric-label">a<sub>w</sub></span>
            <span class="preset-metric-val">${food.waterActivity}</span>
          </div>
          <div class="preset-metric-cell">
            <span class="preset-metric-label">pH</span>
            <span class="preset-metric-val">${food.ph}</span>
          </div>
        </div>

        <div class="preset-card-foot">
          <span class="preset-category-tag">${food.category}</span>
          <span class="preset-shelf-badge">MAP: ${food.optimalMAPShelfLifeDays}d</span>
        </div>
      `;

      // Interactive Click Event Handler with Pop Animation
      card.addEventListener("click", (e) => {
        document.querySelectorAll(".preset-card").forEach(c => {
          c.classList.remove("selected");
          const dot = c.querySelector(".preset-check-dot");
          if (dot) dot.textContent = "";
        });

        card.classList.add("selected");
        const dot = card.querySelector(".preset-check-dot");
        if (dot) dot.textContent = "✓";

        activePresetId = food.id;
        loadPreset(food.id);

        // Micro click bounce
        card.classList.remove("click-bounce-anim");
        void card.offsetWidth;
        card.classList.add("click-bounce-anim");
      });

      // Keyboard Accessibility (Enter / Space to select)
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          card.click();
        }
      });

      elements.presetsScrollGrid.appendChild(card);
    });
  }

  // Load a preset commodity into the form without auto-calculating (Decoupled Reference Data)
  function loadPreset(foodId) {
    const food = window.getFoodById(foodId);
    if (!food) return;

    activePresetId = food.id;

    elements.inputCommodityName.value = food.name;
    if (elements.tagLineageCommodity) elements.tagLineageCommodity.textContent = "[Reference Database]";
    elements.inputCategory.value = food.category;
    elements.inputMoisture.value = food.moisture;
    elements.valMoisture.textContent = `${food.moisture}%`;
    elements.inputWaterActivity.value = food.waterActivity;
    elements.valWaterActivity.textContent = `${food.waterActivity}`;
    elements.inputFat.value = food.fat;
    elements.valFat.textContent = `${food.fat}%`;
    elements.inputPH.value = food.ph;
    elements.valPH.textContent = `${food.ph}`;
    elements.inputRespiration.value = food.respirationRate;
    elements.inputLightSensitivity.value = food.lightSensitivity;

    // Set storage type radio
    const radio = document.querySelector(`input[name="storageTypeRadio"][value="${food.storageType}"]`);
    if (radio) radio.checked = true;

    elements.inputTemp.value = food.recommendedTemp;
    elements.valTemp.textContent = `${food.recommendedTemp}°C`;
    elements.inputRH.value = food.recommendedRH;
    elements.valRH.textContent = `${food.recommendedRH}%`;
    elements.inputShelfLife.value = food.optimalMAPShelfLifeDays;
    elements.valShelfLife.textContent = `${food.optimalMAPShelfLifeDays} days`;

    // Clear any previous validation banner
    if (elements.validationAlertBox) {
      elements.validationAlertBox.style.display = "none";
    }

    // Invalidate any existing old recommendation so user explicitly clicks Calculate
    invalidateCurrentRecommendation(`Loaded reference profile for <strong>${food.name}</strong>. Click <strong>Run Recommendation Model</strong> to calculate optimal barrier packaging.`);
  }

  // =========================================================================
  // 3. Recommendation History Manager
  // =========================================================================
  function saveToHistory(commodityName, category, suitabilityScore, shelfLifeDays) {
    const item = {
      name: commodityName,
      category: category,
      score: suitabilityScore,
      shelfLife: shelfLifeDays,
      timestamp: Date.now()
    };

    // Prevent duplicate consecutive entries
    recommendationHistory = recommendationHistory.filter(h => h.name.toLowerCase() !== commodityName.toLowerCase());
    recommendationHistory.unshift(item);
    if (recommendationHistory.length > 6) recommendationHistory.pop();

    try {
      localStorage.setItem("annakavach_history", JSON.stringify(recommendationHistory));
    } catch (e) {}

    renderHistoryRibbon();
  }

  function renderHistoryRibbon() {
    if (!elements.historyRibbonWrap || !elements.historyChipsContainer) return;

    if (recommendationHistory.length === 0) {
      elements.historyRibbonWrap.style.display = "none";
      return;
    }

    elements.historyRibbonWrap.style.display = "flex";
    elements.historyChipsContainer.innerHTML = "";

    recommendationHistory.forEach(item => {
      const chip = document.createElement("button");
      chip.className = "history-chip";
      chip.innerHTML = `
        <strong>${item.name}</strong>
        <span style="font-family: var(--font-mono); color: var(--brand-primary); font-size: 0.7rem;">(${item.score}/100 • ${item.shelfLife}d)</span>
      `;
      chip.addEventListener("click", () => {
        const foundPreset = (window.FOOD_COMMODITIES || []).find(f => f.name.toLowerCase() === item.name.toLowerCase());
        if (foundPreset) {
          loadPreset(foundPreset.id);
        } else {
          elements.inputCommodityName.value = item.name;
          elements.inputCategory.value = item.category;
          if (elements.tagLineageCommodity) elements.tagLineageCommodity.textContent = "[History Item]";
        }
        executeEvaluation();
      });
      elements.historyChipsContainer.appendChild(chip);
    });
  }

  // =========================================================================
  // 4. Live Input Validation
  // =========================================================================
  function validateInputs() {
    const errors = [];
    const name = elements.inputCommodityName.value.trim();
    const category = elements.inputCategory.value;
    const ph = parseFloat(elements.inputPH.value);
    const aw = parseFloat(elements.inputWaterActivity.value);
    const moisture = parseFloat(elements.inputMoisture.value);
    const temp = parseFloat(elements.inputTemp.value);
    const rh = parseFloat(elements.inputRH.value);
    const shelfLife = parseInt(elements.inputShelfLife.value);

    if (!name) errors.push("Please enter a food commodity name or select a preset from the reference library");
    if (!category) errors.push("Please select a food commodity category");
    if (isNaN(ph) || ph < 1.0 || ph > 14.0) errors.push("Acidity (pH) must be between 1.0 and 14.0");
    if (isNaN(aw) || aw < 0.10 || aw > 1.00) errors.push("Water activity (aw) must be between 0.10 and 1.00");
    if (isNaN(moisture) || moisture < 0 || moisture > 100) errors.push("Moisture content must be between 0% and 100%");
    if (isNaN(temp) || temp < -30 || temp > 50) errors.push("Storage temperature must be between -30°C and 50°C");
    if (isNaN(rh) || rh < 10 || rh > 100) errors.push("Relative humidity must be between 10% and 100%");
    if (isNaN(shelfLife) || shelfLife < 1 || shelfLife > 730) errors.push("Target shelf life must be between 1 and 730 days");

    if (errors.length > 0) {
      if (elements.validationAlertBox) {
        elements.validationAlertBox.style.display = "flex";
        elements.validationAlertMessage.textContent = errors.join(" • ");
      }
      return false;
    } else {
      if (elements.validationAlertBox) {
        elements.validationAlertBox.style.display = "none";
      }
      return true;
    }
  }

  // =========================================================================
  // 5. Main Recommendation Pipeline Execution
  // =========================================================================
  function executeEvaluation() {
    if (!validateInputs()) {
      const workbenchCard = document.getElementById("engineerControlsCard");
      if (workbenchCard) {
        smoothScrollTo(workbenchCard.offsetTop - 80);
      }
      return;
    }

    if (elements.btnCalculate) {
      elements.btnCalculate.classList.remove("btn-calc-pulse");
      void elements.btnCalculate.offsetWidth;
      elements.btnCalculate.classList.add("btn-calc-pulse");
    }

    // Brief smooth loading indicator
    if (elements.analysisLoadingBox) {
      elements.analysisLoadingBox.style.display = "flex";
    }

    const selectedStorageRadio = document.querySelector('input[name="storageTypeRadio"]:checked');
    const storageTypeVal = selectedStorageRadio ? selectedStorageRadio.value : "chilled";

    // Respiration rate numerical value derivation
    let respVal = 0;
    const respRate = elements.inputRespiration.value;
    if (respRate === "Extremely High") respVal = 55;
    else if (respRate === "Very High") respVal = 30;
    else if (respRate === "High") respVal = 20;
    else if (respRate === "Moderate") respVal = 12;
    else if (respRate === "Low") respVal = 5;

    const inputData = {
      commodityName: elements.inputCommodityName.value.trim() || "Food Commodity",
      category: elements.inputCategory.value,
      moisture: parseFloat(elements.inputMoisture.value),
      waterActivity: parseFloat(elements.inputWaterActivity.value),
      fatContent: parseFloat(elements.inputFat.value),
      ph: parseFloat(elements.inputPH.value),
      respirationRate: respRate,
      respirationValue: respVal,
      lightSensitivity: elements.inputLightSensitivity.value,
      targetShelfLifeDays: parseInt(elements.inputShelfLife.value),
      storageTemp: parseFloat(elements.inputTemp.value),
      storageRH: parseFloat(elements.inputRH.value),
      storageType: storageTypeVal,
      packWidthMm: parseFloat(elements.inputPackWidth.value) || 150,
      packHeightMm: parseFloat(elements.inputPackHeight.value) || 220,
      productWholesalePrice: parseFloat(elements.inputProductWholesalePrice.value) || 3.50
    };

    // Execute Annakavach Barrier & Material Recommendation Engine
    currentRecommendation = window.packagingEngine.evaluate(inputData);

    // Switch DOM containers: Hide empty state, Reveal active recommendation
    if (elements.emptyStateContainer) {
      elements.emptyStateContainer.style.display = "none";
    }
    if (elements.activeResultsContainer) {
      elements.activeResultsContainer.style.display = "block";
    }

    // Update all UI sections
    updateHeroRecommendation(currentRecommendation);
    updateEngineeringAlerts(currentRecommendation.engineeringWarnings);
    updateMAPGasGauge(currentRecommendation.mapRecommendation, currentRecommendation.perforationSpec);
    updateCustomLaminateStack(currentRecommendation.customStructure);
    updateShelfLifeSimulation(inputData, currentRecommendation.primaryRecommendation);
    updateSustainabilityScorecard(currentRecommendation.primaryRecommendation);
    updateCostEconomics(currentRecommendation.primaryRecommendation, inputData);
    updateQRPassport(currentRecommendation);
    updateComparisonMatrix(currentRecommendation);

    // Save to history ribbon
    saveToHistory(
      inputData.commodityName,
      inputData.category,
      currentRecommendation.suitabilityScore,
      currentRecommendation.estimatedShelfLifeDays.estimatedDays || currentRecommendation.estimatedShelfLifeDays
    );

    // Hide loader
    if (elements.analysisLoadingBox) {
      setTimeout(() => {
        elements.analysisLoadingBox.style.display = "none";
      }, 180);
    }

    if (window.lucide && window.lucide.createIcons) {
      lucide.createIcons();
    }
  }

  // =========================================================================
  // 6. Section Updaters
  // =========================================================================

  // Hero Card + 5-Part Score Breakdown + 6-Factor Explanation
  function updateHeroRecommendation(rec) {
    const mat = rec.primaryRecommendation;
    if (!mat) return;

    elements.heroMatchScore.textContent = `Packaging Suitability Score: ${rec.suitabilityScore}/100`;
    elements.heroMaterialType.textContent = mat.type;
    elements.heroMaterialName.textContent = mat.name;

    const shelfDays = rec.estimatedShelfLifeDays.estimatedDays || rec.estimatedShelfLifeDays;
    elements.heroShelfLifeVal.textContent = `${shelfDays} Days`;
    elements.heroLayerFormula.textContent = `Structure: ${mat.layers}`;

    // Barrier Tiles with Complete ASTM Units
    elements.tileOTR.textContent = `${mat.otrRange || mat.otr}`;
    elements.tileWVTR.textContent = `${mat.wvtrRange || mat.wvtr}`;
    elements.tileSeal.textContent = `${mat.sealTempRange || `${mat.sealInitiationTemp}°C`}`;

    // Trigger visual pop animation on tiles and hero card
    const heroCard = document.getElementById("primaryRecommendationCard");
    if (heroCard) {
      heroCard.classList.remove("rec-flash-highlight");
      void heroCard.offsetWidth; // Force reflow to re-trigger CSS animation
      heroCard.classList.add("rec-flash-highlight");
    }

    [elements.tileOTR, elements.tileWVTR, elements.tileSeal, elements.heroShelfLifeVal].forEach(el => {
      if (el) {
        el.classList.remove("spec-tile-pop");
        void el.offsetWidth;
        el.classList.add("spec-tile-pop");
      }
    });

    // 5-Part Weighted Score Progress Bars
    const sc = rec.scoreBreakdown || { barrierMatch: 95, respirationSpoilage: 92, storageTemp: 90, sustainability: 95, costViability: 94 };
    elements.scoreTotalVal.textContent = `${rec.suitabilityScore} / 100`;

    elements.progValBarrier.textContent = `${sc.barrierMatch}%`;
    elements.progFillBarrier.style.width = `${sc.barrierMatch}%`;

    elements.progValRespiration.textContent = `${sc.respirationSpoilage}%`;
    elements.progFillRespiration.style.width = `${sc.respirationSpoilage}%`;

    elements.progValStorage.textContent = `${sc.storageTemp}%`;
    elements.progFillStorage.style.width = `${sc.storageTemp}%`;

    elements.progValSust.textContent = `${sc.sustainability}%`;
    elements.progFillSust.style.width = `${sc.sustainability}%`;

    elements.progValCost.textContent = `${sc.costViability}%`;
    elements.progFillCost.style.width = `${sc.costViability}%`;

    // 6-Factor "Why this recommendation?" Explanation Cards
    if (elements.whyExplanationGrid && rec.whyExplanation) {
      elements.whyExplanationGrid.innerHTML = "";
      rec.whyExplanation.forEach(f => {
        const card = document.createElement("div");
        card.className = "why-card";
        card.innerHTML = `
          <div class="why-card-header">
            <span class="why-card-title">${f.factor}</span>
            <span class="why-card-status">${f.status}</span>
          </div>
          <div class="why-card-desc">${f.rationale}</div>
        `;
        elements.whyExplanationGrid.appendChild(card);
      });
    }
  }

  // Engineering Alerts
  function updateEngineeringAlerts(warnings) {
    if (!elements.engineeringAlertsContainer) return;
    elements.engineeringAlertsContainer.innerHTML = "";
    if (!warnings || warnings.length === 0) return;

    warnings.forEach(w => {
      const alert = document.createElement("div");
      alert.className = `alert-box ${w.severity}`;
      alert.innerHTML = `
        <i data-lucide="alert-triangle" style="width: 18px; height: 18px; flex-shrink: 0; margin-top: 2px;"></i>
        <div>
          <div class="alert-title">${w.title}</div>
          <div class="alert-detail">${w.detail}</div>
        </div>
      `;
      elements.engineeringAlertsContainer.appendChild(alert);
    });
  }

  // MAP Gas Gauge & Micro-perforation Spec
  function updateMAPGasGauge(mapRec, perfSpec) {
    if (!mapRec) return;

    const b = mapRec.gasBlend;
    elements.mapBadgeType.textContent = mapRec.classification;
    elements.gasBarO2.style.width = `${Math.max(b.o2, 4)}%`;
    elements.gasBarO2.textContent = `${b.o2}% O2`;
    elements.valGasO2.textContent = `${b.o2}%`;

    elements.gasBarCO2.style.width = `${Math.max(b.co2, 4)}%`;
    elements.gasBarCO2.textContent = `${b.co2}% CO2`;
    elements.valGasCO2.textContent = `${b.co2}%`;

    elements.gasBarN2.style.width = `${Math.max(b.n2, 4)}%`;
    elements.gasBarN2.textContent = `${b.n2}% N2`;
    elements.valGasN2.textContent = `${b.n2}%`;

    if (elements.valGasRatio) {
      elements.valGasRatio.textContent = `Headspace Ratio: ${mapRec.gasToProductVolumeRatio || "1.5 : 1"}`;
    }

    elements.mapRationaleText.textContent = mapRec.rationale;

    if (perfSpec && perfSpec.required) {
      elements.perforationSpecWrap.style.display = "block";
      elements.perforationDetailText.textContent = `${perfSpec.holeCount} laser micro-holes (${perfSpec.holeDiameterMicrons}µm diameter) • ${perfSpec.targetGasTransmission}`;
    } else {
      elements.perforationSpecWrap.style.display = "none";
    }
  }

  // Exploded Multi-Layer Film Cross-Section
  function updateCustomLaminateStack(structure) {
    if (!structure) return;

    elements.laminateStructureTitle.textContent = structure.structureName;
    elements.laminateRationaleText.textContent = structure.rationale;
    elements.laminateTotalThickness.textContent = `${structure.totalThicknessMicrons} µm`;
    elements.laminateEstimatedOTR.textContent = `${structure.calculatedOTR} cc/m²·day·atm`;
    elements.laminateRecyclability.textContent = structure.recyclabilityVerdict;

    elements.laminateStackList.innerHTML = "";
    structure.layers.forEach((layer, idx) => {
      const row = document.createElement("div");
      row.className = "laminate-layer-card";
      row.innerHTML = `
        <div class="layer-position-col">
          <div class="layer-indicator-dot" style="background: ${getLayerColor(layer.position)};"></div>
          <span>Layer ${idx + 1}: ${layer.position}</span>
        </div>
        <div class="layer-material-col">
          <span class="layer-material-name">${layer.material}</span>
          <span class="layer-function-text">${layer.functionalRole}</span>
        </div>
        <div class="layer-thickness-col">${layer.thicknessMicrons} µm</div>
      `;
      elements.laminateStackList.appendChild(row);
    });
  }

  function getLayerColor(position) {
    if (position.includes("Outer")) return "#0284C7";
    if (position.includes("Core") || position.includes("Barrier")) return "#E11D48";
    if (position.includes("Tie")) return "#D97706";
    return "#059669";
  }

  // Shelf-Life Kinetic Simulator (3 Comparison Curves)
  function updateShelfLifeSimulation(inputData, material) {
    const simData = window.shelfLifeSimulator.simulate(inputData, material);
    if (!simData) return;

    elements.simValUnpackaged.textContent = `${simData.summary.unpackagedShelfLifeDays} Days`;
    elements.simValStandard.textContent = `${simData.summary.standardPolyethyleneDays} Days`;
    elements.simValOptimized.textContent = `${simData.summary.annakavachOptimizedDays} Days (${simData.summary.shelfLifeExtensionMultiplier}x Extension)`;
    elements.simDriverBadge.textContent = simData.summary.primarySpoilageDriver;

    // Render Assumptions in Panel
    if (elements.simAssumptionsGrid) {
      elements.simAssumptionsGrid.innerHTML = `
        <div>• Storage Temperature Basis: continuous ${inputData.storageTemp}°C</div>
        <div>• Arrhenius Kinetic Factor: Q₁₀ = 2.1 (ΔT = ${(inputData.storageTemp - (inputData.storageType === 'chilled' ? 4 : (inputData.storageType === 'frozen' ? -18 : 20))).toFixed(1)}°C)</div>
        <div>• Quality Acceptance Cutoff: 50% Quality Retention Index</div>
        <div>• Validation Standard: Kinetic projection requires physical ASLT testing</div>
      `;
    }

    // Chart.js Multi-Curve Rendering
    const ctx = document.getElementById("shelfLifeChart");
    if (!ctx) return;

    if (shelfLifeChartInstance) {
      shelfLifeChartInstance.destroy();
    }

    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    const textColor = isDark ? "#A3ACA6" : "#5A625D";
    const gridColor = isDark ? "#19221D" : "#EAE7DF";

    shelfLifeChartInstance = new Chart(ctx, {
      type: "line",
      data: {
        labels: simData.timelineDays.map(d => `Day ${d}`),
        datasets: [
          {
            label: "Annakavach Recommended Barrier Packaging",
            data: simData.optimizedCurve,
            borderColor: isDark ? "#34D399" : "#1D4333",
            backgroundColor: isDark ? "rgba(52, 211, 153, 0.08)" : "rgba(29, 67, 51, 0.06)",
            borderWidth: 2.5,
            fill: true,
            tension: 0.3,
            pointRadius: 1.5
          },
          {
            label: "Generic Monolayer PE Film",
            data: simData.standardCurve,
            borderColor: "#0284C7",
            borderDash: [5, 5],
            borderWidth: 1.8,
            fill: false,
            tension: 0.3,
            pointRadius: 0
          },
          {
            label: "Unpackaged / Ambient Control",
            data: simData.unpackagedCurve,
            borderColor: "#E11D48",
            borderDash: [3, 3],
            borderWidth: 1.8,
            fill: false,
            tension: 0.3,
            pointRadius: 0
          },
          {
            label: "Quality Rejection Cutoff (50%)",
            data: simData.timelineDays.map(() => 50),
            borderColor: isDark ? "#717E77" : "#9CA3AF",
            borderDash: [2, 4],
            borderWidth: 1.2,
            fill: false,
            pointRadius: 0
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: "index", intersect: false },
        plugins: {
          legend: {
            position: "top",
            labels: {
              boxWidth: 12,
              color: textColor,
              font: { family: "'Plus Jakarta Sans', sans-serif", size: 11 }
            }
          },
          tooltip: {
            callbacks: {
              label: (context) => ` ${context.dataset.label}: ${context.parsed.y}% Quality Index`
            }
          }
        },
        scales: {
          y: {
            min: 0,
            max: 105,
            title: { display: true, text: "Quality Retention Index (%)", color: textColor, font: { size: 10 } },
            grid: { color: gridColor },
            ticks: { color: textColor, font: { size: 10 } }
          },
          x: {
            grid: { display: false },
            ticks: { color: textColor, font: { size: 10 }, maxTicksLimit: 12 }
          }
        }
      }
    });
  }

  // Sustainability & LCA Scorecard
  function updateSustainabilityScorecard(material) {
    const lca = window.sustainabilityEngine.evaluateImpact(material, 10000);
    if (!lca) return;

    elements.ecoMaterialName.textContent = lca.materialName;
    elements.ecoStreamText.textContent = `Stream: ${lca.recyclabilityStream}`;
    elements.ecoScoreNum.textContent = lca.circularityIndex;
    elements.ecoPPWRText.textContent = lca.compliance.euPPWR2030;
    elements.ecoTaxText.textContent = lca.compliance.plasticPackagingTax;
    elements.ecoCarbonText.textContent = `${lca.carbonFootprintPerKg} kg CO2e / kg resin`;
    elements.ecoEndOfLifeText.textContent = lca.compliance.endOfLifeRoute;
  }

  // Commercial Cost Economics
  function updateCostEconomics(material, inputData) {
    const cost = window.costEngine.calculate(material, {
      widthMm: inputData.packWidthMm,
      heightMm: inputData.packHeightMm,
      type: "Stand-Up Barrier Pouch"
    }, inputData.productWholesalePrice);

    if (!cost) return;

    elements.costHealthBadge.textContent = cost.costCategoryLabel;
    elements.costBatchArea.textContent = `${cost.packagingGeometry.totalFilmSqMPer1000} m² / 1,000 packs`;
    elements.costRatioVal.textContent = `${cost.costAsPercentOfFoodValue} of product value`;

    elements.costTableBody.innerHTML = `
      <tr>
        <td><strong>Raw Substrate Film</strong></td>
        <td>${cost.packagingGeometry.grossAreaSqMPerPack} m²/pack (with 8% converting scrap)</td>
        <td style="text-align: right;">$${(parseFloat(cost.costBreakdownPer1000Units.rawFilmSubstrateUSD) / 1000).toFixed(3)}</td>
        <td style="text-align: right;">$${cost.costBreakdownPer1000Units.rawFilmSubstrateUSD}</td>
      </tr>
      <tr>
        <td><strong>Printing & Pouch Converting</strong></td>
        <td>2-color flexographic surface print + heat-seal slitting</td>
        <td style="text-align: right;">$${(parseFloat(cost.costBreakdownPer1000Units.convertingAndPrintingUSD) / 1000).toFixed(3)}</td>
        <td style="text-align: right;">$${cost.costBreakdownPer1000Units.convertingAndPrintingUSD}</td>
      </tr>
      <tr>
        <td><strong>MAP Gas Injection (N2/CO2)</strong></td>
        <td>Food-grade gas flush (0.5L / pack basis)</td>
        <td style="text-align: right;">$${(parseFloat(cost.costBreakdownPer1000Units.mapGasFlushUSD) / 1000).toFixed(3)}</td>
        <td style="text-align: right;">$${cost.costBreakdownPer1000Units.mapGasFlushUSD}</td>
      </tr>
      <tr style="font-weight: 700;">
        <td><strong>TOTAL ESTIMATED PACKAGING COST</strong></td>
        <td>Turnkey converted pouch format (10,000 unit batch basis)</td>
        <td style="text-align: right; color: var(--brand-primary); font-family: var(--font-mono);">${cost.costPerSingleUnitUSD}</td>
        <td style="text-align: right; color: var(--brand-primary); font-family: var(--font-mono);">$${cost.costBreakdownPer1000Units.totalCostUSD}</td>
      </tr>
    `;
  }

  // Digital Product Passport (DPP) & Dynamic Canvas QR
  function updateQRPassport(rec) {
    const passport = window.qrTraceabilityEngine.generatePassport(rec);
    const p = passport.data;

    elements.passportLotBadge.textContent = passport.lotNumber;
    elements.ppValCommodity.textContent = p.commodity;
    elements.ppValMaterial.textContent = p.packagingMaterial;
    elements.ppValBarrier.textContent = `${p.barrierPerformance.otr} OTR / ${p.barrierPerformance.wvtr} WVTR`;
    elements.ppValStorage.textContent = p.storageConditions;
    elements.ppValRecycling.textContent = p.ppwrRecyclabilityClass;

    // Render Canvas QR Code
    window.qrTraceabilityEngine.renderQR(elements.passportQRCanvas, passport.qrText, 140);
  }

  // 4-Way Material Comparison Table
  function updateComparisonMatrix(rec) {
    const primary = rec.primaryRecommendation;
    const sustainable = window.getMaterialById("mono-pe-barrier") || window.getMaterialById("bio-pla-pbat-barrier") || primary;
    const highBarrier = window.getMaterialById("pet-alu-pe-foil") || window.getMaterialById("pa-evoh-pe-coex") || primary;
    const budget = window.getMaterialById("bopp-micro-perf") || window.getMaterialById("monolayer-ldpe-produce") || primary;

    elements.compareMatrixTable.innerHTML = `
      <thead>
        <tr>
          <th style="width: 20%;">Property / Metric</th>
          <th class="compare-highlight-cell" style="width: 25%;">Primary Recommendation</th>
          <th style="width: 20%;">Sustainable Option</th>
          <th style="width: 20%;">Ultra-High Barrier</th>
          <th style="width: 15%;">Cost-Optimized</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Material Name</strong></td>
          <td class="compare-highlight-cell">${primary.shortName || primary.name}</td>
          <td>${sustainable.shortName || sustainable.name}</td>
          <td>${highBarrier.shortName || highBarrier.name}</td>
          <td>${budget.shortName || budget.name}</td>
        </tr>
        <tr>
          <td><strong>Structure Type</strong></td>
          <td class="compare-highlight-cell">${primary.type}</td>
          <td>${sustainable.type}</td>
          <td>${highBarrier.type}</td>
          <td>${budget.type}</td>
        </tr>
        <tr>
          <td><strong>Oxygen Barrier (OTR)</strong><br><span style="font-size:0.65rem; color:var(--text-dim);">ASTM D3985</span></td>
          <td class="compare-highlight-cell">${primary.otrRange || primary.otr} cc/m²·day·atm</td>
          <td>${sustainable.otrRange || sustainable.otr} cc/m²·day·atm</td>
          <td>${highBarrier.otrRange || highBarrier.otr} cc/m²·day·atm</td>
          <td>${budget.otrRange || budget.otr} cc/m²·day·atm</td>
        </tr>
        <tr>
          <td><strong>Moisture Barrier (WVTR)</strong><br><span style="font-size:0.65rem; color:var(--text-dim);">ASTM F1249</span></td>
          <td class="compare-highlight-cell">${primary.wvtrRange || primary.wvtr} g/m²·day</td>
          <td>${sustainable.wvtrRange || sustainable.wvtr} g/m²·day</td>
          <td>${highBarrier.wvtrRange || highBarrier.wvtr} g/m²·day</td>
          <td>${budget.wvtrRange || budget.wvtr} g/m²·day</td>
        </tr>
        <tr>
          <td><strong>Total Thickness</strong></td>
          <td class="compare-highlight-cell">${primary.totalThicknessMicrons} µm</td>
          <td>${sustainable.totalThicknessMicrons} µm</td>
          <td>${highBarrier.totalThicknessMicrons} µm</td>
          <td>${budget.totalThicknessMicrons} µm</td>
        </tr>
        <tr>
          <td><strong>EU PPWR Recyclability</strong></td>
          <td class="compare-highlight-cell">${primary.recyclabilityClass}</td>
          <td style="color: var(--brand-primary); font-weight: 700;">${sustainable.recyclabilityClass}</td>
          <td>${highBarrier.recyclabilityClass}</td>
          <td>${budget.recyclabilityClass}</td>
        </tr>
        <tr>
          <td><strong>Cradle-to-Gate Carbon</strong></td>
          <td class="compare-highlight-cell">${primary.carbonFootprintKgCO2e} kg CO2e/kg</td>
          <td>${sustainable.carbonFootprintKgCO2e} kg CO2e/kg</td>
          <td>${highBarrier.carbonFootprintKgCO2e} kg CO2e/kg</td>
          <td>${budget.carbonFootprintKgCO2e} kg CO2e/kg</td>
        </tr>
        <tr>
          <td><strong>Estimated Substrate Cost</strong></td>
          <td class="compare-highlight-cell">$${primary.costPerSqM}/m²</td>
          <td>$${sustainable.costPerSqM}/m²</td>
          <td>$${highBarrier.costPerSqM}/m²</td>
          <td>$${budget.costPerSqM}/m²</td>
        </tr>
      </tbody>
    `;
  }

  // =========================================================================
  // 7. Material Library Catalog (with Indian Rupee ₹ Conversion)[cite: 24, 32]
  // =========================================================================
  function renderCatalogGrid() {
    const materials = window.getPackagingMaterials ? window.getPackagingMaterials() : (window.PACKAGING_MATERIALS || []);
    const query = (elements.catalogSearchInput ? elements.catalogSearchInput.value : "").toLowerCase().trim();
    const typeFilter = elements.catalogTypeFilter ? elements.catalogTypeFilter.value : "ALL";

    const filtered = materials.filter(m => {
      const matchQuery = m.name.toLowerCase().includes(query) || 
                         (m.layers && m.layers.toLowerCase().includes(query)) || 
                         (m.recyclabilityClass && m.recyclabilityClass.toLowerCase().includes(query));
      const matchType = typeFilter === "ALL" || m.type === typeFilter;
      return matchQuery && matchType;
    });

    if (!elements.materialsCatalogGrid) return;
    elements.materialsCatalogGrid.innerHTML = "";

    filtered.forEach(mat => {
      // Calculate price in Indian Rupees (INR)[cite: 32]
      const costInINR = (parseFloat(mat.costPerSqM || 0) * USD_TO_INR).toFixed(1);

      const card = document.createElement("div");
      card.className = "catalog-material-card";
      card.innerHTML = `
        <div class="catalog-card-body">
          <div class="catalog-mat-header">
            <h4 class="catalog-mat-name">${mat.name}</h4>
            <span class="catalog-mat-badge">${mat.type}</span>
          </div>
          <div class="catalog-mat-structure">
            ${mat.layers}
          </div>
          <div class="catalog-mat-specs-grid">
            <div class="mat-spec-item">
              <span class="mat-spec-label">OTR:</span>
              <span class="mat-spec-val">${mat.otrRange || mat.otr} cc/m²·d·atm</span>
            </div>
            <div class="mat-spec-item">
              <span class="mat-spec-label">WVTR:</span>
              <span class="mat-spec-val">${mat.wvtrRange || mat.wvtr} g/m²·d</span>
            </div>
            <div class="mat-spec-item">
              <span class="mat-spec-label">Seal Temp:</span>
              <span class="mat-spec-val">${mat.sealTempRange || `${mat.sealInitiationTemp}°C`}</span>
            </div>
            <div class="mat-spec-item">
              <span class="mat-spec-label">PPWR:</span>
              <span class="mat-spec-val ${mat.recyclabilityClass.includes('Class A') ? 'highlight-ppwr' : ''}">${mat.recyclabilityClass}</span>
            </div>
          </div>
        </div>
        <div class="catalog-card-footer">
          <div class="catalog-mat-price">
            <span class="currency-symbol">₹</span>${costInINR} <span class="price-unit">/ m²</span>
          </div>
          <button type="button" class="btn-secondary btn-sm apply-plan-btn" onclick="applyMaterialToWorkbench('${mat.id}')">
            Apply to Plan
          </button>
        </div>
      `;
      elements.materialsCatalogGrid.appendChild(card);
    });
  }

  // Globally exposed apply function from Catalog
  window.applyMaterialToWorkbench = function(materialId) {
    const mat = window.getMaterialById(materialId);
    if (!mat) return;
    if (currentRecommendation) {
      currentRecommendation.primaryRecommendation = mat;
      updateHeroRecommendation(currentRecommendation);
      updateShelfLifeSimulation(currentRecommendation.inputParameters, mat);
      updateSustainabilityScorecard(mat);
      updateCostEconomics(mat, currentRecommendation.inputParameters);
      updateQRPassport(currentRecommendation);
      updateComparisonMatrix(currentRecommendation);

      const heroEl = document.getElementById("primaryRecommendationCard");
      if (heroEl) {
        smoothScrollTo(heroEl.offsetTop - 80);
      }
    } else {
      const workbenchCard = document.getElementById("engineerControlsCard");
      if (workbenchCard) {
        smoothScrollTo(workbenchCard.offsetTop - 80);
      }
      if (elements.validationAlertBox) {
        elements.validationAlertBox.style.display = "flex";
        elements.validationAlertMessage.textContent = `Selected substrate: ${mat.name}. Choose a food commodity and click "Run Recommendation Model" to evaluate this packaging structure.`;
      }
    }
  };

  // =========================================================================
  // 8. Modal: Export Formal ASTM Specification Sheet Document
  // =========================================================================
  function renderSpecSheetDocument() {
    if (!currentRecommendation) return;
    const rec = currentRecommendation;
    const p = rec.inputParameters;
    const mat = rec.primaryRecommendation;
    const shelfDays = rec.estimatedShelfLifeDays.estimatedDays || rec.estimatedShelfLifeDays;

    elements.printableSpecContent.innerHTML = `
      <div style="display: flex; justify-content: space-between; border-bottom: 2px solid var(--brand-primary); padding-bottom: 14px; margin-bottom: 18px;">
        <div>
          <h2 style="font-size: 1.35rem; font-weight: 800; color: var(--brand-primary); margin-bottom: 2px;">Annakavach Technical Packaging Specification Sheet</h2>
          <div style="font-size: 0.8rem; color: var(--text-muted);">Food Preservation, Barrier Materials & Circular Compliance Engineering Certification</div>
        </div>
        <div style="text-align: right; font-size: 0.76rem; font-family: var(--font-mono);">
          <div>Doc Ref: <strong>SPEC-ANNAKAVACH-${Date.now().toString().slice(-6)}</strong></div>
          <div>Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
          <div>Standard: ASTM D3985 / ASTM F1249 / EU PPWR</div>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 16px;">
        <div style="background: var(--bg-subtle); padding: 12px; border: 1px solid var(--border-subtle); border-radius: 6px;">
          <h4 style="font-size: 0.82rem; font-weight: 700; color: var(--brand-primary); margin-bottom: 6px; text-transform: uppercase;">1. Commodity Physico-Chemical Profile</h4>
          <table style="width: 100%; font-size: 0.78rem;">
            <tr><td style="color:var(--text-dim); padding:2px 0;">Commodity Name:</td><td><strong>${p.commodityName}</strong></td></tr>
            <tr><td style="color:var(--text-dim); padding:2px 0;">Category:</td><td>${p.category}</td></tr>
            <tr><td style="color:var(--text-dim); padding:2px 0;">Moisture Content:</td><td>${p.moisture}%</td></tr>
            <tr><td style="color:var(--text-dim); padding:2px 0;">Water Activity (aw):</td><td>${p.waterActivity}</td></tr>
            <tr><td style="color:var(--text-dim); padding:2px 0;">Acidity (pH):</td><td>${p.ph}</td></tr>
            <tr><td style="color:var(--text-dim); padding:2px 0;">Respiration Rate:</td><td>${p.respirationRate}</td></tr>
          </table>
        </div>

        <div style="background: var(--bg-subtle); padding: 12px; border: 1px solid var(--border-subtle); border-radius: 6px;">
          <h4 style="font-size: 0.82rem; font-weight: 700; color: var(--brand-primary); margin-bottom: 6px; text-transform: uppercase;">2. Storage Logistics & Target Span</h4>
          <table style="width: 100%; font-size: 0.78rem;">
            <tr><td style="color:var(--text-dim); padding:2px 0;">Storage Class:</td><td><strong>${p.storageType.toUpperCase()}</strong></td></tr>
            <tr><td style="color:var(--text-dim); padding:2px 0;">Storage Temperature:</td><td>${p.storageTemp}°C</td></tr>
            <tr><td style="color:var(--text-dim); padding:2px 0;">Relative Humidity:</td><td>${p.storageRH}% RH</td></tr>
            <tr><td style="color:var(--text-dim); padding:2px 0;">Modelled Shelf Life:</td><td><strong>${shelfDays} Days (ASLT Pending)</strong></td></tr>
            <tr><td style="color:var(--text-dim); padding:2px 0;">Suitability Score:</td><td><strong>${rec.suitabilityScore}/100</strong></td></tr>
          </table>
        </div>
      </div>

      <div style="margin-bottom: 16px;">
        <h4 style="font-size: 0.82rem; font-weight: 700; color: var(--brand-primary); margin-bottom: 6px; text-transform: uppercase;">3. Recommended Material & Barrier Specifications</h4>
        <div style="background: var(--bg-surface); border: 1.5px solid var(--brand-primary); padding: 12px; border-radius: 6px;">
          <div style="font-weight: 800; font-size: 0.95rem; color: var(--text-main); margin-bottom: 3px;">${mat.name}</div>
          <div style="font-family: var(--font-mono); font-size: 0.74rem; color: var(--text-muted); margin-bottom: 8px;">Structure: ${mat.layers}</div>

          <table style="width: 100%; border-collapse: collapse; font-size: 0.76rem;">
            <tr style="background: var(--bg-subtle);"><th style="padding:5px; text-align:left;">Property</th><th style="padding:5px; text-align:left;">Target Range</th><th style="padding:5px; text-align:left;">ASTM / ISO Standard</th></tr>
            <tr><td style="padding:5px; border-bottom:1px solid var(--border-subtle);">Oxygen Transmission Rate (OTR)</td><td style="padding:5px; border-bottom:1px solid var(--border-subtle); font-family:var(--font-mono);"><strong>${mat.otrRange || mat.otr} cc/m²·day·atm</strong></td><td style="padding:5px; border-bottom:1px solid var(--border-subtle);">${mat.otrStandard || "ASTM D3985 (23°C, 0% RH)"}</td></tr>
            <tr><td style="padding:5px; border-bottom:1px solid var(--border-subtle);">Water Vapor Transmission (WVTR)</td><td style="padding:5px; border-bottom:1px solid var(--border-subtle); font-family:var(--font-mono);"><strong>${mat.wvtrRange || mat.wvtr} g/m²·day</strong></td><td style="padding:5px; border-bottom:1px solid var(--border-subtle);">${mat.wvtrStandard || "ASTM F1249 (38°C, 90% RH)"}</td></tr>
            <tr><td style="padding:5px; border-bottom:1px solid var(--border-subtle);">Seal Initiation Temperature (SIT)</td><td style="padding:5px; border-bottom:1px solid var(--border-subtle); font-family:var(--font-mono);">${mat.sealTempRange || `${mat.sealInitiationTemp}°C`}</td><td style="padding:5px; border-bottom:1px solid var(--border-subtle);">ASTM F88 / ASTM F2029</td></tr>
            <tr><td style="padding:5px;">Puncture / Dart Impact Resistance</td><td style="padding:5px; font-family:var(--font-mono);">${mat.punctureResistance || "24 N"}</td><td style="padding:5px;">ASTM D1709 / ASTM D882</td></tr>
          </table>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 16px;">
        <div style="background: var(--bg-subtle); padding: 12px; border: 1px solid var(--border-subtle); border-radius: 6px;">
          <h4 style="font-size: 0.82rem; font-weight: 700; color: var(--brand-primary); margin-bottom: 6px; text-transform: uppercase;">4. MAP Gas Formulation (Starting Atmosphere)</h4>
          <div style="font-size: 0.78rem;">
            <div>Suggested Blend: <strong>${rec.mapRecommendation ? `${rec.mapRecommendation.gasBlend.o2}% O2 / ${rec.mapRecommendation.gasBlend.co2}\% CO2 / ${rec.mapRecommendation.gasBlend.n2}% N2` : "Ambient"}</strong></div>
            <div style="color: var(--text-muted); margin-top: 4px;">${rec.mapRecommendation ? rec.mapRecommendation.rationale : ""}</div>
          </div>
        </div>

        <div style="background: var(--bg-subtle); padding: 12px; border: 1px solid var(--border-subtle); border-radius: 6px;">
          <h4 style="font-size: 0.82rem; font-weight: 700; color: var(--brand-primary); margin-bottom: 6px; text-transform: uppercase;">5. Circularity & EU PPWR 2030 Status</h4>
          <div style="font-size: 0.78rem;">
            <div>Recyclability Class: <strong>${mat.recyclabilityClass}</strong></div>
            <div>Cradle-to-Gate Carbon: <strong>${mat.carbonFootprintKgCO2e} kg CO2e/kg</strong></div>
            <div>Standards: <strong>ASTM D3985, ASTM F1249, EU PPWR, FDA 21 CFR</strong></div>
          </div>
        </div>
      </div>

      <div style="background: var(--bg-subtle); padding: 10px; border-radius: 6px; font-size: 0.72rem; color: var(--text-muted); margin-bottom: 14px; line-height: 1.4;">
        <strong>Scientific Decision-Support Limitation:</strong> This specification is a computational engineering model. Prior to commercial filling and retail distribution, physical Accelerated Shelf-Life Testing (ASLT) and overall migration limit testing (OML/SML under EU 10/2011 or FDA 21 CFR) are mandatory.
      </div>

      <div style="border-top: 1px solid var(--border-subtle); padding-top: 10px; display: flex; justify-content: space-between; font-size: 0.7rem; color: var(--text-dim);">
        <div>Generated by Annakavach Intelligent Food Packaging Engine</div>
        <div>Page 1 of 1 • Controlled Engineering Document</div>
      </div>
    `;
    elements.specSheetModal.style.display = "flex";
  }

  // =========================================================================
  // 9. Global Viewport Tap & Click Ripple Animation Engine[cite: 32]
  // =========================================================================
  function spawnGlobalRipple(clientX, clientY) {
    const ripple = document.createElement("span");
    ripple.className = "global-tap-ripple";
    ripple.style.left = `${clientX}px`;
    ripple.style.top = `${clientY}px`;
    document.body.appendChild(ripple);

    ripple.addEventListener("animationend", () => {
      ripple.remove();
    }, { once: true });
  }

  function initClickAnimations() {
    // Single subtle pointer listener across all viewports
    document.addEventListener("pointerdown", (e) => {
      // Ignore right/middle clicks
      if (e.button !== undefined && e.button !== 0) return;
      
      spawnGlobalRipple(e.clientX, e.clientY);

      // Controlled subtle depression on buttons without bouncing or jitter
      const clickable = e.target.closest(
        "button, a, .cat-chip, .presets-category-filter, .preset-card, .detail-tab-btn, .theme-toggle-btn, .mode-btn, .history-chip, .catalog-material-card, .pipeline-step, .search-clear-btn, .pipeline-info-close"
      );
      if (clickable && !clickable.classList.contains("click-bounce-anim")) {
        clickable.classList.add("click-bounce-anim");
        setTimeout(() => clickable.classList.remove("click-bounce-anim"), 180);
      }
    }, { passive: true });
  }

  // Viewport IntersectionObserver Scroll Animation System[cite: 32]
  function initScrollAnimations() {
    const scrollElements = document.querySelectorAll(".reveal-on-scroll");

    if ("IntersectionObserver" in window) {
      const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            observer.unobserve(entry.target);
          }
        });
      }, {
        root: null,
        threshold: 0.08,
        rootMargin: "0px 0px -25px 0px"
      });

      scrollElements.forEach(el => revealObserver.observe(el));
    } else {
      scrollElements.forEach(el => el.classList.add("is-revealed"));
    }

    // Dynamic Sticky Header Elevation & Nav ScrollSpy[cite: 32]
    const siteHeader = document.querySelector(".site-header");
    const sections = [
      { id: "workbench-section", link: document.getElementById("navLinkWorkbench") },
      { id: "simulator-anchor", link: document.getElementById("navLinkSim") },
      { id: "sustainability-anchor", link: document.getElementById("navLinkEco") },
      { id: "catalog-anchor", link: document.getElementById("navLinkCatalog") },
      { id: "methodology-anchor", link: document.getElementById("navLinkMethod") }
    ];

    window.addEventListener("scroll", () => {
      const scrollY = window.scrollY || window.pageYOffset;

      // Header shadow and padding elevation
      if (siteHeader) {
        if (scrollY > 20) {
          siteHeader.classList.add("scrolled");
        } else {
          siteHeader.classList.remove("scrolled");
        }
      }

      // ScrollSpy Active Link Tracking[cite: 32]
      let currentActiveId = "workbench-section";
      for (let i = 0; i < sections.length; i++) {
        const sectionEl = document.getElementById(sections[i].id);
        if (sectionEl) {
          const top = sectionEl.getBoundingClientRect().top;
          if (top <= 140) {
            currentActiveId = sections[i].id;
          }
        }
      }

      sections.forEach(sec => {
        if (sec.link) {
          sec.link.classList.toggle("active", sec.id === currentActiveId);
        }
      });
    }, { passive: true });
  }

  // =========================================================================
  // Smooth Scrolling & Anchor Navigation[cite: 32]
  // =========================================================================
  function smoothScrollTo(targetY) {
    window.scrollTo({
      top: targetY,
      behavior: "smooth"
    });
  }

  function setupSmoothAnchorScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener("click", function(e) {
        const targetId = this.getAttribute("href");
        if (!targetId || targetId === "#") return;
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          const headerHeight = 65;
          const elementPosition = targetEl.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

          smoothScrollTo(offsetPosition);
        }
      });
    });
  }

  // =========================================================================
  // 10. Event Listeners Setup[cite: 32]
  // =========================================================================
  function setupEventListeners() {
    // Theme Switchers (Light, Dark, Auto)[cite: 32]
    if (elements.themeBtnLight) {
      elements.themeBtnLight.addEventListener("click", () => window.setTheme("light"));
    }
    if (elements.themeBtnDark) {
      elements.themeBtnDark.addEventListener("click", () => window.setTheme("dark"));
    }
    if (elements.themeBtnAuto) {
      elements.themeBtnAuto.addEventListener("click", () => window.setTheme("auto"));
    }

    // Sliders Live Text Updates & Reactive Invalidation[cite: 32]
    elements.inputMoisture.addEventListener("input", (e) => {
      elements.valMoisture.textContent = `${e.target.value}%`;
      validateInputs();
      invalidateCurrentRecommendation();
    });
    elements.inputWaterActivity.addEventListener("input", (e) => {
      elements.valWaterActivity.textContent = `${e.target.value}`;
      validateInputs();
      invalidateCurrentRecommendation();
    });
    elements.inputFat.addEventListener("input", (e) => {
      elements.valFat.textContent = `${e.target.value}%`;
      validateInputs();
      invalidateCurrentRecommendation();
    });
    elements.inputPH.addEventListener("input", (e) => {
      elements.valPH.textContent = `${e.target.value}`;
      validateInputs();
      invalidateCurrentRecommendation();
    });
    elements.inputTemp.addEventListener("input", (e) => {
      elements.valTemp.textContent = `${e.target.value}°C`;
      validateInputs();
      invalidateCurrentRecommendation();
    });
    elements.inputRH.addEventListener("input", (e) => {
      elements.valRH.textContent = `${e.target.value}%`;
      validateInputs();
      invalidateCurrentRecommendation();
    });
    elements.inputShelfLife.addEventListener("input", (e) => {
      elements.valShelfLife.textContent = `${e.target.value} days`;
      validateInputs();
      invalidateCurrentRecommendation();
    });

    // Custom commodity name input changes lineage tag & invalidates stale recs[cite: 32]
    elements.inputCommodityName.addEventListener("input", () => {
      if (elements.tagLineageCommodity) {
        elements.tagLineageCommodity.textContent = elements.inputCommodityName.value.trim() ? "[User Input]" : "[Not Selected]";
      }
      validateInputs();
      invalidateCurrentRecommendation();
    });

    // Category Select change[cite: 32]
    if (elements.inputCategory) {
      elements.inputCategory.addEventListener("change", () => {
        validateInputs();
        invalidateCurrentRecommendation();
      });
    }

    // Respiration and Light Sensitivity selects[cite: 32]
    if (elements.inputRespiration) {
      elements.inputRespiration.addEventListener("change", () => invalidateCurrentRecommendation());
    }
    if (elements.inputLightSensitivity) {
      elements.inputLightSensitivity.addEventListener("change", () => invalidateCurrentRecommendation());
    }

    // Pouch dimensions & price inputs[cite: 32]
    if (elements.inputPackWidth) {
      elements.inputPackWidth.addEventListener("input", () => invalidateCurrentRecommendation());
    }
    if (elements.inputPackHeight) {
      elements.inputPackHeight.addEventListener("input", () => invalidateCurrentRecommendation());
    }
    if (elements.inputProductWholesalePrice) {
      elements.inputProductWholesalePrice.addEventListener("input", () => invalidateCurrentRecommendation());
    }

    // Storage Radio Buttons[cite: 32]
    document.querySelectorAll('input[name="storageTypeRadio"]').forEach(radio => {
      radio.addEventListener("change", (e) => {
        if (e.target.value === "chilled") {
          elements.inputTemp.value = 2;
          elements.valTemp.textContent = "2.0°C";
        } else if (e.target.value === "frozen") {
          elements.inputTemp.value = -18;
          elements.valTemp.textContent = "-18.0°C";
        } else {
          elements.inputTemp.value = 20;
          elements.valTemp.textContent = "20.0°C";
        }
        invalidateCurrentRecommendation();
      });
    });

    // Calculate Recommendation Button[cite: 32]
    elements.btnCalculate.addEventListener("click", executeEvaluation);

    // Reset Defaults / Start New Analysis Buttons (Full clean state reset)[cite: 32]
    if (elements.btnResetDefaults) {
      elements.btnResetDefaults.addEventListener("click", resetToEmptyState);
    }
    if (elements.btnResetFromHero) {
      elements.btnResetFromHero.addEventListener("click", () => {
        resetToEmptyState();
        const workbenchCard = document.getElementById("engineerControlsCard");
        if (workbenchCard) {
          smoothScrollTo(workbenchCard.offsetTop - 80);
        }
      });
    }

    // Empty state quick CTA button to browse presets[cite: 32]
    if (elements.emptyStateSelectPresetBtn) {
      elements.emptyStateSelectPresetBtn.addEventListener("click", () => {
        const presetsSection = document.getElementById("commoditySelectorSection");
        if (presetsSection) {
          smoothScrollTo(presetsSection.offsetTop - 70);
          if (elements.commoditySearchInput) {
            setTimeout(() => elements.commoditySearchInput.focus(), 300);
          }
        }
      });
    }

    // Preset Category Filter Chips in Nested Ribbon[cite: 32]
    if (elements.categoryFiltersWrap) {
      elements.categoryFiltersWrap.addEventListener("click", (e) => {
        const chip = e.target.closest(".cat-chip, .presets-category-filter");
        if (!chip) return;
        document.querySelectorAll(".cat-chip, .presets-category-filter").forEach(c => c.classList.remove("active"));
        chip.classList.add("active");
        currentCategoryFilter = chip.dataset.category || "ALL";
        renderPresetCards();
      });
    }

    // Commodity Live Search Input & Clear Button[cite: 32]
    if (elements.commoditySearchInput) {
      elements.commoditySearchInput.addEventListener("input", (e) => {
        currentSearchQuery = e.target.value;
        if (elements.commoditySearchClear) {
          elements.commoditySearchClear.style.display = currentSearchQuery.trim() ? "flex" : "none";
        }
        renderPresetCards();
      });
    }

    if (elements.commoditySearchClear) {
      elements.commoditySearchClear.addEventListener("click", () => {
        if (elements.commoditySearchInput) {
          elements.commoditySearchInput.value = "";
          elements.commoditySearchInput.focus();
        }
        currentSearchQuery = "";
        elements.commoditySearchClear.style.display = "none";
        renderPresetCards();
      });
    }

    // Toggle Progressive Disclosure (Show All / Show Fewer)[cite: 32]
    if (elements.btnToggleMoreCommodities) {
      elements.btnToggleMoreCommodities.addEventListener("click", () => {
        isPresetsExpanded = !isPresetsExpanded;
        renderPresetCards();
      });
    }

    // Interactive 7-Stage Workflow Pipeline Popover Information[cite: 32]
    if (elements.workflowPipelineBar) {
      elements.workflowPipelineBar.addEventListener("click", (e) => {
        const stepEl = e.target.closest(".pipeline-step");
        if (!stepEl) return;
        const stepNum = parseInt(stepEl.dataset.step, 10);
        const stageData = PIPELINE_STAGES[stepNum];
        if (!stageData) return;

        document.querySelectorAll(".pipeline-step").forEach(s => s.classList.remove("active-step"));
        stepEl.classList.add("active-step");

        if (elements.pipelineInfoBox) {
          if (elements.pipeInfoBadge) elements.pipeInfoBadge.textContent = stageData.badge || `STAGE 0${stepNum}`;
          if (elements.pipeInfoTitle) elements.pipeInfoTitle.textContent = stageData.title || "";
          if (elements.pipeInfoDesc) elements.pipeInfoDesc.textContent = stageData.desc || "";
          if (elements.pipeInfoInput) elements.pipeInfoInput.textContent = stageData.input || stageData.inputs || "";
          if (elements.pipeInfoOutput) elements.pipeInfoOutput.textContent = stageData.output || stageData.outputs || "";
          elements.pipelineInfoBox.style.display = "block";
        }
      });
    }

    // Robust Close Handler for Stage Info Box[cite: 32]
    if (elements.pipelineInfoClose && elements.pipelineInfoBox) {
      elements.pipelineInfoClose.addEventListener("click", (e) => {
        e.stopPropagation();
        elements.pipelineInfoBox.style.display = "none";
        document.querySelectorAll(".pipeline-step").forEach(s => s.classList.remove("active-step"));
      });
    }

    // Mode Toggle (Engineer vs Fast Wizard)[cite: 32]
    elements.modeBtnEngineer.addEventListener("click", () => {
      elements.modeBtnEngineer.classList.add("active");
      elements.modeBtnFarmer.classList.remove("active");
      elements.farmerWizardSection.style.display = "none";
      elements.engineerControlsCard.style.display = "block";
    });

    elements.modeBtnFarmer.addEventListener("click", () => {
      elements.modeBtnFarmer.classList.add("active");
      elements.modeBtnEngineer.classList.remove("active");
      elements.farmerWizardSection.style.display = "block";
      elements.engineerControlsCard.style.display = "none";
    });

    // Fast Wizard Run Button[cite: 32]
    elements.btnRunWizard.addEventListener("click", () => {
      const chosenCommodity = elements.wizardCommoditySelect.value;
      const chosenStorage = elements.wizardStorageSelect.value;
      loadPreset(chosenCommodity);

      const radio = document.querySelector(`input[name="storageTypeRadio"][value="${chosenStorage}"]`);
      if (radio) {
        radio.checked = true;
        radio.dispatchEvent(new Event("change"));
      }

      executeEvaluation();
      const heroEl = document.getElementById("primaryRecommendationCard");
      if (heroEl) {
        smoothScrollTo(heroEl.offsetTop - 80);
      }
    });

    // Detail Tabs Switching[cite: 32]
    elements.detailTabBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        elements.detailTabBtns.forEach(b => b.classList.remove("active"));
        elements.tabPanes.forEach(p => p.classList.remove("active"));
        btn.classList.add("active");
        const targetPane = document.getElementById(btn.dataset.tab);
        if (targetPane) targetPane.classList.add("active");
      });
    });

    // Catalog Search & Filter[cite: 32]
    if (elements.catalogSearchInput) {
      elements.catalogSearchInput.addEventListener("input", renderCatalogGrid);
    }
    if (elements.catalogTypeFilter) {
      elements.catalogTypeFilter.addEventListener("change", renderCatalogGrid);
    }

    // Spec Sheet Export Modal[cite: 32]
    elements.btnExportTopSpec.addEventListener("click", renderSpecSheetDocument);
    elements.btnCloseSpecModal.addEventListener("click", () => elements.specSheetModal.style.display = "none");
    elements.btnPrintModalDoc.addEventListener("click", () => window.print());

    // Print Batch Tag button[cite: 32]
    elements.btnPrintQRBadge.addEventListener("click", () => {
      const printWin = window.open('', '_blank', 'width=500,height=600');
      const canvas = elements.passportQRCanvas;
      const dataUrl = canvas.toDataURL();
      printWin.document.write(`
        <html>
          <head><title>Batch QR Tag - ${elements.passportLotBadge.textContent}</title></head>
          <body style="font-family:sans-serif; text-align:center; padding:30px;">
            <div style="border:2px solid #1D4333; padding:20px; border-radius:12px; display:inline-block;">
              <h2 style="margin:0 0 10px; color:#1D4333;">Annakavach Digital Packaging Passport</h2>
              <img src="${dataUrl}" style="width:160px; height:160px;" />
              <div style="font-weight:bold; font-size:16px; margin:10px 0;">${elements.passportLotBadge.textContent}</div>
              <div style="font-size:14px; color:#333;">${elements.ppValCommodity.textContent}</div>
              <div style="font-size:12px; color:#666; margin-top:4px;">${elements.ppValMaterial.textContent}</div>
              <div style="font-size:11px; color:#888; margin-top:4px;">Storage: ${elements.ppValStorage.textContent}</div>
            </div>
            <script>window.onload = function() { window.print(); }<\/script>
          </body>
        </html>
      `);
      printWin.document.close();
    });
  }

  // Run Application[cite: 32]
  init();
});
