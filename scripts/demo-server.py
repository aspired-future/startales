#!/usr/bin/env python3
"""
Simple HTTP server to serve the voice demo
"""

import http.server
import socketserver
import os
import webbrowser
from pathlib import Path

PORT = 8090
DEMO_DIR = Path(__file__).parent.parent / "demo"

class CORSHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

def main():
    # Change to demo directory
    os.chdir(DEMO_DIR)
    
    print(f"🌐 Starting demo server on port {PORT}")
    print(f"📁 Serving files from: {DEMO_DIR}")
    print(f"🔗 Demo URL: http://localhost:{PORT}/voice-demo.html")
    print("")
    print("🎙️ Voice Services Status:")
    print("   • STT (Whisper): http://localhost:8001 ✅")
    print("   • TTS (Coqui):   http://localhost:8002 🔄 (building)")
    print("   • Demo Server:   http://localhost:8080 🚀")
    print("")
    print("Press Ctrl+C to stop the server")
    print("=" * 50)
    
    # Start server
    with socketserver.TCPServer(("", PORT), CORSHTTPRequestHandler) as httpd:
        try:
            # Try to open browser
            webbrowser.open(f'http://localhost:{PORT}/voice-demo.html')
        except:
            pass
            
        httpd.serve_forever()

if __name__ == "__main__":
    main()
