import http.server
import json
import os
import logging

# Server Configuration
HOST = '127.0.0.1'  # Listen only on localhost
PORT = 8080         # Use port 8080 for HTTP
STATE_FILE = "state.json"

# Logging Configuration
LOG_FILE = "server.log"
logging.basicConfig(
    level=logging.DEBUG,
    filename=LOG_FILE,
    filemode='w',
    format='%(asctime)s - %(levelname)s - %(message)s'
)

class RequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        """Add necessary CORS headers to all responses."""
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        super().end_headers()

    def do_OPTIONS(self):
        """Handle preflight requests for CORS."""
        self.send_response(204)
        self.end_headers()

    def do_GET(self):
        logging.info(f"Received GET request for {self.path}")
        if self.path in ['/', '/loadState']:
            try:
                if os.path.exists(STATE_FILE):
                    with open(STATE_FILE, 'r') as f:
                        state = json.load(f)
                    logging.info("State loaded successfully")
                    self._send_response(200, state)
                else:
                    state = {"pages": [[]], "currentPageIndex": 0}
                    logging.warning("State file does not exist. Using default state.")
                    self._send_response(200, state)
            except Exception as e:
                logging.error(f"Error loading state: {e}")
                self._send_response(500, {"error": str(e)})
        else:
            self._send_response(404, {"error": "Invalid endpoint"})

    def do_POST(self):
        logging.info(f"Received POST request for {self.path}")
        if self.path == '/saveState':
            try:
                content_length = int(self.headers.get('Content-Length', 0))
                post_data = self.rfile.read(content_length)
                state = json.loads(post_data)

                with open(STATE_FILE, 'w') as f:
                    json.dump(state, f)
                    logging.info("State saved successfully")

                self._send_response(200, {"message": "State saved successfully"})
            except Exception as e:
                logging.error(f"Error saving state: {e}")
                self._send_response(500, {"error": str(e)})
        else:
            self._send_response(404, {"error": "Invalid endpoint"})

    def _send_response(self, status, response_data):
        """Helper function to send JSON responses."""
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(json.dumps(response_data).encode())

def run_server():
    """Runs the HTTP server."""
    try:
        server_address = (HOST, PORT)
        httpd = http.server.HTTPServer(server_address, RequestHandler)
        logging.info(f"Server started at http://{HOST}:{PORT}")
        print(f"Server running at http://{HOST}:{PORT}")
        httpd.serve_forever()
    except Exception as e:
        logging.error(f"Failed to start server: {e}")
        print(f"Error: {e}")

if __name__ == '__main__':
    run_server()
