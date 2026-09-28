'use strict';
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const files = { '/': 'index.html', '/index.html': 'index.html', '/styles.css': 'styles.css', '/app.js': 'app.js', '/math-game.js': 'math-game.js' };
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8' };
http.createServer((req, res) => {
  const file = files[new URL(req.url, 'http://localhost').pathname];
  if (!file) { res.writeHead(404); res.end('Not found'); return; }
  fs.readFile(path.join(__dirname, file), (error, content) => {
    if (error) { res.writeHead(500); res.end('Read error'); return; }
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] });
    res.end(content);
  });
}).listen(Number(process.env.PORT) || 4173, '127.0.0.1', () => console.log('Larry Math: http://127.0.0.1:' + (process.env.PORT || 4173)));
