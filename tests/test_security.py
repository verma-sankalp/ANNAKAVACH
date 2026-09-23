import os
import sys
import json
import unittest

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from backend.config import FRONTEND_DIR, SECURITY_HEADERS, BLOCKED_EXTENSIONS, BLOCKED_DIRECTORIES
from backend.middleware.security import sanitize_and_resolve_path
from backend.routes.api import handle_api_request


class TestAnnakavachSecurity(unittest.TestCase):
    """
    Automated security verification test suite covering:
    - Filesystem jailing & path resolution
    - Directory traversal mitigation (../, %2e%2e/)
    - Sensitive extension and folder protection
    - Mandatory HTTP security headers injection
    - REST API payload validation & method guards
    """

    # --- 1. Path Jailing & Directory Traversal Tests ---

    def test_frontend_root_allowed(self):
        safe, path, _ = sanitize_and_resolve_path('/')
        self.assertTrue(safe)
        self.assertEqual(path, os.path.abspath(os.path.join(FRONTEND_DIR, 'index.html')))

    def test_static_asset_allowed(self):
        safe, path, _ = sanitize_and_resolve_path('/css/style.css')
        self.assertTrue(safe)
        self.assertTrue(path.endswith('style.css'))

    def test_directory_traversal_parent_blocked(self):
        safe, _, msg = sanitize_and_resolve_path('/../backend/app.py')
        self.assertFalse(safe)
        self.assertIn('denied', msg.lower())

    def test_encoded_traversal_blocked(self):
        safe, _, _ = sanitize_and_resolve_path('/%2e%2e/%2e%2e/backend/config.py')
        self.assertFalse(safe)

    def test_direct_backend_access_blocked(self):
        safe, _, msg = sanitize_and_resolve_path('/backend/app.py')
        self.assertFalse(safe)
        self.assertIn('protected directory', msg)

    def test_blocked_extensions(self):
        for ext in ['.py', '.pyc', '.env', '.bat', '.git', '.md', '.sh']:
            safe, _, msg = sanitize_and_resolve_path(f'/secret{ext}')
            self.assertFalse(safe, f'Extension {ext} should be blocked')

    def test_hidden_directories_blocked(self):
        for d in ['.git', '.claude', '__pycache__', '.vscode']:
            safe, _, _ = sanitize_and_resolve_path(f'/{d}/data.json')
            self.assertFalse(safe, f'Directory {d} should be blocked')

    def test_directory_listing_disabled(self):
        safe, _, msg = sanitize_and_resolve_path('/css')
        self.assertFalse(safe)
        self.assertEqual(msg, 'Directory listing disabled.')

    # --- 2. HTTP Security Headers ---

    def test_security_headers_present(self):
        required_headers = [
            'Content-Security-Policy',
            'X-Content-Type-Options',
            'X-Frame-Options',
            'X-XSS-Protection',
            'Referrer-Policy',
            'Permissions-Policy'
        ]
        for header in required_headers:
            self.assertIn(header, SECURITY_HEADERS)
            self.assertTrue(len(SECURITY_HEADERS[header]) > 0)

    def test_csp_policy_rules(self):
        csp = SECURITY_HEADERS['Content-Security-Policy']
        self.assertIn("default-src 'self'", csp)
        self.assertIn("frame-ancestors 'self'", csp)

    # --- 3. REST API Endpoint Security & Validation ---

    def test_health_check_endpoint(self):
        status, data = handle_api_request('GET', '/api/health', b'')
        self.assertEqual(status, 200)
        self.assertEqual(data.get('status'), 'healthy')
        self.assertTrue(data.get('security', {}).get('jailed'))

    def test_validate_endpoint_method_guard(self):
        status, data = handle_api_request('GET', '/api/validate', b'')
        self.assertEqual(status, 405)

    def test_validate_endpoint_bad_json(self):
        status, data = handle_api_request('POST', '/api/validate', b'invalid-json{')
        self.assertEqual(status, 400)

    def test_validate_endpoint_out_of_bounds(self):
        payload = json.dumps({'moisture': 150.0, 'ph': -2.0, 'waterActivity': 1.5}).encode('utf-8')
        status, data = handle_api_request('POST', '/api/validate', payload)
        self.assertEqual(status, 200)
        self.assertFalse(data.get('isValid'))
        self.assertGreaterEqual(len(data.get('errors', [])), 3)

    def test_validate_endpoint_valid_payload(self):
        payload = json.dumps({'moisture': 65.0, 'ph': 5.8, 'waterActivity': 0.85}).encode('utf-8')
        status, data = handle_api_request('POST', '/api/validate', payload)
        self.assertEqual(status, 200)
        self.assertTrue(data.get('isValid'))
        self.assertEqual(len(data.get('errors', [])), 0)

    def test_unknown_api_route(self):
        status, data = handle_api_request('GET', '/api/nonexistent', b'')
        self.assertEqual(status, 404)


if __name__ == '__main__':
    unittest.main(verbosity=2)
