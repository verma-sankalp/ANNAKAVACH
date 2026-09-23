import os
import sys
import json
import mimetypes
import socketserver
import webbrowser
from http.server import BaseHTTPRequestHandler

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.dirname(BASE_DIR)
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

from backend.config import HOST, PORT, FRONTEND_DIR, SECURITY_HEADERS
from backend.middleware.security import sanitize_and_resolve_path
from backend.routes.api import handle_api_request

mimetypes.init()
mimetypes.add_type("text/css", ".css")
mimetypes.add_type("application/javascript", ".js")
mimetypes.add_type("image/svg+xml", ".svg")
mimetypes.add_type("font/woff2", ".woff2")
mimetypes.add_type("font/woff", ".woff")


class AnnakavachRequestHandler(BaseHTTPRequestHandler):
    server_version = "Annakavach/2.4"
    sys_version = ""

    def send_headers(self, content_type: str = "text/html; charset=utf-8", status_code: int = 200):
        self.send_response(status_code)
        self.send_header("Content-Type", content_type)
        for header, value in SECURITY_HEADERS.items():
            self.send_header(header, value)
        self.end_headers()

    def do_GET(self):
        if self.path.startswith("/api/"):
            status, res_data = handle_api_request("GET", self.path, b"")
            self.send_headers("application/json; charset=utf-8", status)
            self.wfile.write(json.dumps(res_data).encode("utf-8"))
            return

        is_safe, resolved_path, err_msg = sanitize_and_resolve_path(self.path)
        if not is_safe:
            self.send_headers("application/json; charset=utf-8", 403)
            self.wfile.write(json.dumps({"error": "Forbidden", "detail": err_msg}).encode("utf-8"))
            return

        if not os.path.isfile(resolved_path):
            self.send_headers("application/json; charset=utf-8", 404)
            self.wfile.write(json.dumps({"error": "Not Found", "path": self.path}).encode("utf-8"))
            return

        mime_type, _ = mimetypes.guess_type(resolved_path)
        if not mime_type:
            mime_type = "application/octet-stream"
        if mime_type.startswith("text/") or mime_type in ("application/javascript", "application/json"):
            mime_type += "; charset=utf-8"

        try:
            with open(resolved_path, "rb") as f:
                payload = f.read()
            self.send_headers(mime_type, 200)
            self.wfile.write(payload)
        except Exception as err:
            self.send_headers("application/json; charset=utf-8", 500)
            self.wfile.write(json.dumps({"error": "Internal Error", "detail": str(err)}).encode("utf-8"))

    def do_POST(self):
        if self.path.startswith("/api/"):
            content_length = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(content_length) if content_length > 0 else b""
            status, res_data = handle_api_request("POST", self.path, body)
            self.send_headers("application/json; charset=utf-8", status)
            self.wfile.write(json.dumps(res_data).encode("utf-8"))
            return

        self.send_headers("application/json; charset=utf-8", 405)
        self.wfile.write(json.dumps({"error": "Method Not Allowed"}).encode("utf-8"))

    def log_message(self, format, *args):
        code = str(args[1]) if len(args) > 1 else ""
        prefix = "[ok]" if code in ("200", "304") else "[err]"
        sys.stderr.write(f"{prefix} {self.command} {self.path} {code}\n")


def start():
    with socketserver.TCPServer((HOST, PORT), AnnakavachRequestHandler) as server:
        server.allow_reuse_address = True
        local_url = f"http://localhost:{PORT}"
        print(f"Annakavach Server running at {local_url} (serving {FRONTEND_DIR})")
        print("Press Ctrl+C to terminate.")

        try:
            webbrowser.open(local_url)
        except Exception:
            pass

        try:
            server.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server...")
            server.shutdown()


if __name__ == "__main__":
    start()
