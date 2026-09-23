(function(global) {
  'use strict';

  const formatting = {
    formatNumber(num, decimals = 2) {
      if (num === null || num === undefined || isNaN(num)) return "--";
      return Number(num).toFixed(decimals);
    },

    formatCurrency(val, decimals = 2) {
      if (val === null || val === undefined || isNaN(val)) return "$0.00";
      return "$" + Number(val).toFixed(decimals);
    },

    formatPercentage(val, decimals = 0) {
      if (val === null || val === undefined || isNaN(val)) return "0%";
      return Number(val).toFixed(decimals) + "%";
    },

    formatOTR(otr) {
      if (otr === null || otr === undefined) return "--";
      if (typeof otr === "string") return otr;
      return `${otr} cc/m²·day·atm`;
    },

    formatWVTR(wvtr) {
      if (wvtr === null || wvtr === undefined) return "--";
      if (typeof wvtr === "string") return wvtr;
      return `${wvtr} g/m²·day`;
    },

    formatDays(days) {
      if (!days && days !== 0) return "-- Days";
      return `${Math.round(days)} Days`;
    },

    generateLotNumber(commodityCode = "ANK") {
      const prefix = (commodityCode || "ANK").substring(0, 3).toUpperCase();
      const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
      const seq = Math.floor(1000 + Math.random() * 9000);
      return `${prefix}-${dateStr}-${seq}`;
    },

    formatDate(date = new Date()) {
      const d = typeof date === "string" ? new Date(date) : date;
      return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
      });
    }
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = formatting;
  }
  global.ANNAKAVACH_FORMATTING = formatting;
})(typeof window !== "undefined" ? window : globalThis);
