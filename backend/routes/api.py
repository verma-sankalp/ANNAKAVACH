import json
import time
from typing import Any, Dict, Tuple

BOUNDS = {
    "moisture": (0.0, 100.0, "Moisture Content (%)"),
    "waterActivity": (0.05, 1.00, "Water Activity (aw)"),
    "fat": (0.0, 100.0, "Fat Content (%)"),
    "ph": (1.0, 14.0, "Product pH"),
    "temp": (-30.0, 60.0, "Storage Temperature (°C)"),
    "rh": (5.0, 100.0, "Relative Humidity (%)"),
    "shelfLife": (1.0, 730.0, "Target Shelf Life (days)"),
    "packWidth": (10.0, 2000.0, "Pouch Width (mm)"),
    "packHeight": (10.0, 2000.0, "Pouch Height (mm)"),
    "price": (0.01, 100000.0, "Wholesale Price ($)")
}

SERVER_BOOT_TIME = time.time()


def handle_api_request(method: str, path: str, body: bytes) -> Tuple[int, Dict[str, Any]]:
    route = path.rstrip("/").lower()

    if route == "/api/health":
        return 200, {
            "status": "healthy",
            "uptime": round(time.time() - SERVER_BOOT_TIME, 1),
            "security": {"jailed": True, "csp": True}
        }

    if route == "/api/validate":
        if method != "POST":
            return 405, {"error": "Method Not Allowed. Expected POST."}
        try:
            payload = json.loads(body.decode("utf-8")) if body else {}
        except Exception:
            return 400, {"error": "Invalid JSON payload."}

        errors = []
        for field, (min_val, max_val, label) in BOUNDS.items():
            if field in payload:
                try:
                    val = float(payload[field])
                    if val < min_val or val > max_val:
                        errors.append(f"{label} must be between {min_val} and {max_val}.")
                except (ValueError, TypeError):
                    errors.append(f"{label} must be a valid number.")

        return 200, {
            "isValid": len(errors) == 0,
            "errors": errors
        }

    if route == "/api/system-info":
        return 200, {
            "service": "Annakavach Packaging Recommendation System",
            "frameworks": [
                "ASTM D3985", "ASTM F1249", "EU PPWR 2030",
                "ISO 14040/14044", "FDA 21 CFR", "DIN EN 13432"
            ]
        }

    return 404, {"error": f"Route '{path}' not found."}
