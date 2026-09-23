import os
import posixpath
import urllib.parse
from backend.config import FRONTEND_DIR, SECURITY_HEADERS, BLOCKED_EXTENSIONS, BLOCKED_DIRECTORIES


def sanitize_and_resolve_path(url_path: str) -> tuple[bool, str, str]:
    """Resolves URL path to an absolute path confined strictly inside FRONTEND_DIR."""
    raw_path = urllib.parse.unquote(url_path.split("?", 1)[0].split("#", 1)[0])
    normalized = posixpath.normpath(raw_path)

    segments = [seg.lower() for seg in normalized.strip("/").split("/") if seg]
    if any(dir_name in segments for dir_name in BLOCKED_DIRECTORIES):
        return False, "", "Access denied: protected directory."

    target_relative = "index.html" if normalized in ("/", "", ".") else normalized.lstrip("/")
    _, ext = os.path.splitext(target_relative)
    if ext.lower() in BLOCKED_EXTENSIONS:
        return False, "", f"Access denied: blocked file extension '{ext}'."

    target_abs = os.path.abspath(os.path.join(FRONTEND_DIR, target_relative))
    frontend_canonical = os.path.abspath(FRONTEND_DIR)

    # Prevent directory traversal attacks
    if os.path.commonpath([frontend_canonical, target_abs]) != frontend_canonical:
        return False, "", "Access denied: directory traversal detected."

    if os.path.isdir(target_abs):
        index_file = os.path.join(target_abs, "index.html")
        if os.path.isfile(index_file):
            return True, index_file, ""
        return False, "", "Directory listing disabled."

    return True, target_abs, ""


def get_security_headers() -> dict:
    return dict(SECURITY_HEADERS)
