# ANNAKAVACH — Food Packaging Material Recommendation System

# SIH Project (2026) 
 - S.No.                   - 236                                                                                                                                   
 - Organization            - Ministry of Food Processing Industries (MoFPI)
 - Problem Statement Title - Al-Based Intelligent Food Packaging Material Recommendation System for Food Commodities                                            
 - Category                - Software                                                                                                                              
 - PS.No.                  - SIH26236                                                                                                                              
 - Theme                   - Agriculture, FoodTech & Rural Development                                                                                             
                                                                                                                                                                   
                                                                                                                                                                   

A scientific decision-support web application for the food processing and packaging industry, food startups, farmers, and packaging engineers.

---

## 🚀 Key Capabilities & Modules

1. **Intelligent Material Recommendation & Multi-layer Formulation**
   - Evaluates food moisture (%), water activity ($a_w$), fat content (%), acidity (pH), and post-harvest respiration kinetics ($R_{O2}, R_{CO2}$).
   - Recommends optimal film types (e.g., PET/Alu/PE, PA/EVOH/PE, Recyclable Mono-PE, PLA/PBAT bio-polymers, laser micro-perforated BOPP).
   - Generates multi-layer cross-section laminate recipes and thickness specifications ($\mu m$).

2. **ASTM Barrier & Permeability Matching**
   - Calculates target Oxygen Transmission Rate (OTR: ASTM D3985) and Water Vapor Transmission Rate (WVTR: ASTM F1249).
   - Determines light / UV blocking requirements to prevent lipid photo-oxidation.

3. **Modified Atmosphere Packaging (MAP) & Respiration Balancing**
   - Formulates gas flush ratios ($\% O_2, \% CO_2, \% N_2$) tailored to commodity categories.
   - Calculates laser micro-perforation count and hole diameter for active produce respiration.

4. **Arrhenius-Based Kinetic Shelf-Life Prediction Simulator**
   - Interactive visual decay simulator comparing *Unpackaged Baseline*, *Generic Polyethylene*, and *Annakavach-Optimized Barrier Packaging*.
   - Evaluates temperature acceleration factors ($Q_{10}$) and calculates shelf-life extension multipliers.

5. **Circularity & Life Cycle Assessment (LCA) Scorecard**
   - Computes material circularity index (0–100), carbon footprint ($kg\,CO_2e/kg$), and trees saved.
   - Checks compliance with EU PPWR 2030 Design for Recycling standards and UK Plastic Packaging Tax.

6. **Commercial Packaging Economics & Unit Cost Estimator**
   - Calculates film square meters, conversion printing costs, and gas flush expenses for 10,000 unit batches.
   - Evaluates packaging cost as a healthy percentage of food wholesale price.

7. **Digital Packaging Passport (DPP) & Dynamic QR Traceability**
   - Generates unique batch identifiers and renders dynamic traceability codes on HTML5 Canvas.
   - Provides verifiable food safety, storage regime, and disposal instructions.

8. **Three-Way Theme Switching (Light, Dark, and System Auto-Detect)**
   - Warm human-crafted editorial palette in light mode; clean obsidian/emerald theme in dark mode.
   - Responsive OS `prefers-color-scheme` listener with `localStorage` persistence.

9. **Dual-Mode Workflow (Engineer vs. Farmer Fast Wizard)**
   - **Packaging Engineer Workbench**: Full multi-variable parameter tuning.
   - **Farmer & SME Fast Track**: 3-step simplified decision wizard.

10. **ASTM/ISO Technical Specification Sheet Exporter**
    - Formats a formal, printable/PDF-exportable packaging specification document.

---

## 🛠️ How to Run Locally

### Option A: Using Python Secure Server (Recommended)
Double click `serve.bat` or run in terminal:
```bash
python backend/app.py
```
The server will start at `http://localhost:8080` with filesystem jail protection and security headers enabled.

### Option B: Direct Browser Open
Double-click `frontend/index.html` to run completely client-side in any modern web browser.

---

## 📂 Project Directory Structure
```
ANNAKAVACH/
│
├── README.md                    # System documentation & technical specifications
├── serve.bat                    # Windows one-click local launcher
├── .gitignore                   # Version control security exemptions
│
├── tests/                       # Automated security & server tests
|   ├── test_live_http.py        # Live HTTP server integration tests
|   └── test_security.py         # Security & path validation tests
│
├── backend/                     # Protected Server-Side Architecture (No source leakage)
│   ├── app.py                   # Secure HTTP application server & static file jail
│   ├── config.py                # Server runtime configuration & security policies
│   ├── requirements.txt         # Server requirements & production dependencies
│   ├── middleware/              # Security and boundary enforcement
│   │   ├── __init__.py
│   │   └── security.py          # Strict path jailing, traversal blocking & header injection
│   └── routes/                  # Backend REST API services
│       ├── __init__.py
│       └── api.py               # /api/health, /api/validate, /api/system-info
│
└── frontend/                    # Public Web Application Client
    ├── index.html               # Semantic application shell & workspace UI
    ├── assets/                  # Static assets & brand imagery
    │   ├── .gitkeep
    │   ├── favicons
    │   ├── ANNAKAVACH_mark.png
    ├── css/                     # Modular design system stylesheets
    │   ├── style.css            # Design tokens, themes (Light/Dark), resets, forms, animations
    │   ├── components.css       # Cards, gauges, scorecards, matrices, regulatory deck
    │   ├── layout.css           # Header, hero, 7-stage workflow bar, grid & footer
    │   └── responsive.css       # Media query breakpoints & @media print technical dossier
    └── js/                      # Frontend JavaScript modules
        ├── app.js               # Application state orchestrator & event wiring
        ├── data/                # Scientific datasets
        │   ├── foodDatabase.js  # 60+ Food commodity science dataset
        │   └── packagingMaterials.js # 15+ Engineered packaging polymers & bio-films
        ├── engines/             # Client-side analytical engines
        │   ├── recommendationEngine.js # Multi-parameter barrier & laminate engine
        │   ├── shelfLifeSimulator.js   # Arrhenius kinetic shelf-life decay model
        │   ├── sustainabilityEngine.js # Circularity, LCA & PPWR compliance engine
        │   ├── costEngine.js           # Conversion economics & pouch area calculator
        │   └── qrTraceability.js       # Digital product passport & Canvas QR engine
        └── utils/               # Helper utilities
            ├── validation.js    # Parameter limits & scientific bounds checking
            ├── formatting.js    # Currency, numbers, barrier units, dates & lot tags
            └── api.js           # Client-side REST API connector & bridge
```

---

## 🔒 Security Architecture

1. **Strict Root Jailing**: Static file resolution is strictly bounded to the `frontend/` directory. Any attempt to traverse (`../`, `%2e%2e/`, `/backend/`, `.env`) returns `403 Forbidden` or `404 Not Found`.
2. **Source Code Exposure Protection**: All backend Python files (`.py`, `.pyc`), configuration files, and system paths are blocked from web access.
3. **Enterprise HTTP Security Headers**:
   - `Content-Security-Policy`: Restricts scripts, styles, and resource origins.
   - `X-Content-Type-Options: nosniff`
   - `X-Frame-Options: SAMEORIGIN`
   - `X-XSS-Protection: 1; mode=block`
   - `Referrer-Policy: strict-origin-when-cross-origin`
   - `Permissions-Policy`: Restricts browser hardware access.
                                                                                                                              
                                                                                                                            
                                                                                                            

                                                                                                                  



---
Developed this Project with Hard Work.
Contact at - sankalpverma2111@gmail.com
