import os

BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.dirname(BACKEND_DIR)
FRONTEND_DIR = os.path.join(ROOT_DIR, "frontend")

HOST = os.environ.get("ANNAKAVACH_HOST", "127.0.0.1")
PORT = int(os.environ.get("ANNAKAVACH_PORT", 8080))
DEBUG = os.environ.get("ANNAKAVACH_DEBUG", "0").lower() in ("1", "true", "yes")

SECURITY_HEADERS = {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "SAMEORIGIN",
    "X-XSS-Protection": "1; mode=block",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "geolocation=(), microphone=(), camera=(), payment=()",
    "Content-Security-Policy": (
        "default-src 'self'; "
        "script-src 'self' 'unsafe-inline' https://unpkg.com https://cdn.jsdelivr.net; "
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; "
        "font-src 'self' https://fonts.gstatic.com data:; "
        "img-src 'self' data: blob:; "
        "connect-src 'self' https://unpkg.com https://cdn.jsdelivr.net; "
        "frame-ancestors 'self';"
    )
}

BLOCKED_EXTENSIONS = {
    ".py", ".pyc", ".pyd", ".env", ".git", ".gitignore",
    ".md", ".bat", ".sh", ".jsonl", ".db", ".sqlite", ".bak"
}

BLOCKED_DIRECTORIES = {
    "backend", "__pycache__", ".git", ".claude", ".vscode"
}
