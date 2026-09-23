import os
import sys
import json
import time
import urllib.request
import urllib.error
import threading
import socketserver
import unittest

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from backend.config import SECURITY_HEADERS
from backend.app import AnnakavachRequestHandler


class LiveServerThread(threading.Thread):
    def __init__(self, port=8899):
        super().__init__()
        self.daemon = True
        self.port = port
        self.server = socketserver.TCPServer(("127.0.0.1", self.port), AnnakavachRequestHandler)
        self.server.allow_reuse_address = True

    def run(self):
        self.server.serve_forever()

    def stop(self):
        self.server.shutdown()
        self.server.server_close()


class TestLiveHTTPSecurity(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.port = 8899
        cls.base_url = f"http://127.0.0.1:{cls.port}"
        cls.server_thread = LiveServerThread(port=cls.port)
        cls.server_thread.start()
        time.sleep(0.15)  # Wait for server bind

    @classmethod
    def tearDownClass(cls):
        cls.server_thread.stop()

    def test_live_homepage_status_and_security_headers(self):
        req = urllib.request.Request(f"{self.base_url}/")
        with urllib.request.urlopen(req) as res:
            self.assertEqual(res.status, 200)
            self.assertEqual(res.headers.get("X-Content-Type-Options"), "nosniff")
            self.assertEqual(res.headers.get("X-Frame-Options"), "SAMEORIGIN")
            self.assertIn("default-src 'self'", res.headers.get("Content-Security-Policy", ""))
            self.assertIn("Annakavach", res.headers.get("Server", ""))
            content = res.read().decode("utf-8")
            self.assertIn("Annakavach", content)

    def test_live_traversal_returns_403(self):
        url = f"{self.base_url}/../backend/app.py"
        try:
            urllib.request.urlopen(url)
            self.fail("Expected HTTP 403 Forbidden")
        except urllib.error.HTTPError as e:
            self.assertEqual(e.code, 403)
            data = json.loads(e.read().decode("utf-8"))
            self.assertEqual(data.get("error"), "Forbidden")

    def test_live_blocked_extension_returns_403(self):
        url = f"{self.base_url}/backend/config.py"
        try:
            urllib.request.urlopen(url)
            self.fail("Expected HTTP 403 Forbidden")
        except urllib.error.HTTPError as e:
            self.assertEqual(e.code, 403)

    def test_live_api_health_endpoint(self):
        url = f"{self.base_url}/api/health"
        with urllib.request.urlopen(url) as res:
            self.assertEqual(res.status, 200)
            data = json.loads(res.read().decode("utf-8"))
            self.assertEqual(data.get("status"), "healthy")
            self.assertTrue(data.get("security", {}).get("jailed"))

    def test_live_api_validation_post(self):
        url = f"{self.base_url}/api/validate"
        payload = json.dumps({"moisture": 45, "waterActivity": 0.65, "ph": 6.2}).encode("utf-8")
        req = urllib.request.Request(url, data=payload, headers={"Content-Type": "application/json"}, method="POST")
        with urllib.request.urlopen(req) as res:
            self.assertEqual(res.status, 200)
            data = json.loads(res.read().decode("utf-8"))
            self.assertTrue(data.get("isValid"))


if __name__ == "__main__":
    unittest.main(verbosity=2)
