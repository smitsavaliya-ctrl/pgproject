import http.server
import socketserver
import os
import sys

PORT = 3000
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
FRONTEND_DIR = os.path.join(SCRIPT_DIR, "frontend")

if not os.path.exists(FRONTEND_DIR):
    FRONTEND_DIR = SCRIPT_DIR

class SPAHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=FRONTEND_DIR, **kwargs)

    def do_GET(self):
        clean_path = self.path.split('?')[0].split('#')[0]

        # Route standalone CMS admin page requests directly to admin.html
        if clean_path in ['/admin', '/admin/', '/admin-login', '/admin.html'] or (clean_path.startswith('/admin-') and not clean_path.startswith('/admin/')):
            self.path = '/admin.html'

        return super().do_GET()

    def translate_path(self, path):
        clean_path = path.split('?')[0].split('#')[0]

        # 1. Standalone CMS Admin page route -> admin.html
        if clean_path in ['/admin', '/admin/', '/admin-login', '/admin.html'] or (clean_path.startswith('/admin-') and not clean_path.startswith('/admin/')):
            return os.path.join(FRONTEND_DIR, 'admin.html')

        # 2. Main Public Website route -> index.html
        if clean_path in ['/', '/index.html']:
            return os.path.join(FRONTEND_DIR, 'index.html')

        full_path = super().translate_path(clean_path)

        # 3. If target is an existing static file on disk (including files in /admin/ views/ etc), serve directly
        if os.path.isfile(full_path):
            return full_path

        # 4. Fallback for non-existing paths -> index.html
        if not clean_path.startswith('/api'):
            return os.path.join(FRONTEND_DIR, 'index.html')

        return full_path

    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

class ReusableThreadingHTTPServer(http.server.ThreadingHTTPServer):
    allow_reuse_address = True

if __name__ == '__main__':
    print(f"Starting StayNest server serving '{FRONTEND_DIR}' on http://localhost:{PORT}...")
    try:
        with ReusableThreadingHTTPServer(("", PORT), SPAHandler) as httpd:
            httpd.serve_forever()
    except OSError:
        print(f"Server is already running on http://localhost:{PORT}!")
