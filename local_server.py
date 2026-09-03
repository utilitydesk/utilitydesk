#!/usr/bin/env python3
"""UtilityDesk local server: static files + same-origin /api/ai proxy."""
import json, os
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from urllib.request import Request, urlopen
from urllib.error import HTTPError, URLError
HOST='127.0.0.1'; PORT=8000

def load_dotenv():
    path=os.path.join(os.path.dirname(__file__), '.env')
    if not os.path.exists(path): return
    try:
        for line in open(path, encoding='utf-8'):
            line=line.strip()
            if not line or line.startswith('#') or '=' not in line: continue
            k,v=line.split('=',1); k=k.strip(); v=v.strip().strip('"').strip("'")
            if k and v and k not in os.environ: os.environ[k]=v
    except OSError: pass
load_dotenv()
class Handler(SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path.rstrip('/')=='/api/ai':
            self._json({'service':'UtilityDesk AI','configured':bool(os.environ.get('OPENROUTER_API_KEY','').strip()),'message':'AI service is ready.' if os.environ.get('OPENROUTER_API_KEY','').strip() else 'AI service is not configured locally. Set OPENROUTER_API_KEY before starting the server.'});return
        super().do_GET()
    def do_OPTIONS(self):
        if self.path.rstrip('/')=='/api/ai': self.send_response(204);self.send_header('Access-Control-Allow-Origin','*');self.end_headers();return
        super().do_OPTIONS()
    def do_POST(self):
        if self.path.rstrip('/')!='/api/ai': self.send_error(404);return
        key=os.environ.get('OPENROUTER_API_KEY','').strip()
        if not key: self._json({'error':'AI service is not configured locally. Set OPENROUTER_API_KEY before starting the server.'},503);return
        try:
            n=int(self.headers.get('Content-Length','0'))
            if n>120000:self._json({'error':'Request is too large.'},413);return
            body=self.rfile.read(n)
            req=Request('https://openrouter.ai/api/v1/chat/completions',data=body,method='POST',headers={'Authorization':f'Bearer {key}','Content-Type':'application/json','HTTP-Referer':'https://utilitydesk.in','X-Title':'UtilityDesk'})
            with urlopen(req,timeout=45) as r:self._json_raw(r.read(),r.status)
        except HTTPError as e:self._json_raw(e.read(),e.code)
        except (URLError,TimeoutError):self._json({'error':'Unable to reach the AI provider.'},502)
        except Exception as e:self._json({'error':str(e)[:300]},500)
    def _json(self,obj,status=200):self._json_raw(json.dumps(obj).encode(),status)
    def _json_raw(self,data,status=200):
        self.send_response(status);self.send_header('Content-Type','application/json; charset=utf-8');self.send_header('Cache-Control','no-store');self.end_headers();self.wfile.write(data)
if __name__=='__main__':
    print(f'UtilityDesk local server: http://{HOST}:{PORT}/');print('AI: enabled' if os.environ.get('OPENROUTER_API_KEY') else 'AI: disabled (set OPENROUTER_API_KEY)');ThreadingHTTPServer((HOST,PORT),Handler).serve_forever()
