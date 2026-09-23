(function(global) {
  'use strict';

  const PARAM_LIMITS = {
    moisture: { min: 0, max: 100, label: "Moisture Content (%)" },
    waterActivity: { min: 0.05, max: 1.00, label: "Water Activity (aw)" },
    fat: { min: 0, max: 100, label: "Fat / Lipid Content (%)" },
    ph: { min: 1.0, max: 14.0, label: "Product Acidity (pH)" },
    temp: { min: -30, max: 60, label: "Storage Temperature (°C)" },
    rh: { min: 5, max: 100, label: "Storage Relative Humidity (%)" },
    shelfLife: { min: 1, max: 730, label: "Target Shelf Life (days)" },
    packWidth: { min: 10, max: 2000, label: "Pouch Width (mm)" },
    packHeight: { min: 10, max: 2000, label: "Pouch Height (mm)" },
    price: { min: 0.01, max: 100000, label: "Wholesale Unit Price ($)" }
  };

  const validation = {
    PARAM_LIMITS,

    validateValue(key, val) {
      const limits = PARAM_LIMITS[key];
      if (!limits) return { isValid: true };

      const num = Number(val);
      if (isNaN(num)) {
        return { isValid: false, message: `${limits.label} must be a valid number.` };
      }
      if (num < limits.min || num > limits.max) {
        return {
          isValid: false,
          message: `${limits.label} must be between ${limits.min} and ${limits.max}.`
        };
      }
      return { isValid: true };
    },

    validateInputParameters(params) {
      const errors = [];

      if (!params.commodityName || !params.commodityName.trim()) {
        errors.push("Please select or enter a food commodity name.");
      }
      if (!params.category) {
        errors.push("Please select a food category.");
      }

      for (const [key, val] of Object.entries(params)) {
        if (PARAM_LIMITS[key]) {
          const res = this.validateValue(key, val);
          if (!res.isValid) {
            errors.push(res.message);
          }
        }
      }

      return {
        isValid: errors.length === 0,
        errors
      };
    }
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = validation;
  }
  global.ANNAKAVACH_VALIDATION = validation;
})(typeof window !== "undefined" ? window : globalThis);
