(function(global) {
  'use strict';

  const api = {
    async checkHealth() {
      try {
        const res = await fetch('/api/health');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
      } catch (err) {
        return { status: "offline", local: true };
      }
    },

    async validateParams(params) {
      try {
        const res = await fetch('/api/validate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(params)
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
      } catch (err) {
        const valObj = global.ANNAKAVACH_VALIDATION;
        if (valObj) {
          return valObj.validateInputParameters(params);
        }
        return { isValid: true, errors: [] };
      }
    },

    async getSystemInfo() {
      try {
        const res = await fetch('/api/system-info');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
      } catch (err) {
        return null;
      }
    }
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  global.ANNAKAVACH_API = api;
})(typeof window !== "undefined" ? window : globalThis);
