import http.server
import socketserver
import os
import sys

PORT = 3000
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

class SPAHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=SCRIPT_DIR, **kwargs)

    def translate_path(self, path):
        clean_path = path.split('?')[0].split('#')[0]

        # Handle explicit index.html requests
        if clean_path in ['/', '/index.html']:
            return os.path.join(SCRIPT_DIR, 'index.html')

        # Strip subroute prefixes for static asset requests (e.g. /admin/js/ -> /js/)
        for prefix in ['/admin/js/', '/admin/css/', '/admin/assets/', '/owner/js/', '/owner/css/', '/owner/assets/']:
            if clean_path.startswith(prefix):
                clean_path = clean_path[len(prefix)-4:]
                break

        full_path = super().translate_path(clean_path)

        # If target is an existing regular file, serve it directly
        if os.path.isfile(full_path):
            return full_path

        # SPA routing fallback: For any directory or non-existing route, return index.html path
        if not clean_path.startswith('/api'):
            index_path = os.path.join(SCRIPT_DIR, 'index.html')
            if os.path.isfile(index_path):
                return index_path

        return full_path

    def list_directory(self, path):
        # Override directory listing completely so it NEVER outputs a directory listing page
        index_path = os.path.join(SCRIPT_DIR, 'index.html')
        try:
            f = open(index_path, 'rb')
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            fs = os.fstat(f.fileno())
            self.send_header("Content-Length", str(fs[6]))
            self.end_headers()
            return f
        except OSError:
            self.send_error(404, "File not found")
            return None

    def do_GET(self):
        clean_path = self.path.split('?')[0].split('#')[0]

        # Strip subroute prefixes
        for prefix in ['/admin/js/', '/admin/css/', '/admin/assets/', '/owner/js/', '/owner/css/', '/owner/assets/']:
            if clean_path.startswith(prefix):
                self.path = clean_path[len(prefix)-4:]
                clean_path = self.path.split('?')[0].split('#')[0]
                break

        # If clean_path does not point to an existing file, target index.html
        target_file = self.translate_path(self.path)
        if not os.path.isfile(target_file) and not clean_path.startswith('/api'):
            self.path = '/index.html'

        return super().do_GET()

    def end_headers(self):
        # Prevent aggressive browser caching during development
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

class ReusableThreadingHTTPServer(http.server.ThreadingHTTPServer):
    allow_reuse_address = True

if __name__ == '__main__':
    print(f"Starting StayNest server serving '{SCRIPT_DIR}' on http://localhost:{PORT}...")
    try:
        with ReusableThreadingHTTPServer(("", PORT), SPAHandler) as httpd:
            httpd.serve_forever()
    except OSError:
        print(f"Server is already running on http://localhost:{PORT}!")
