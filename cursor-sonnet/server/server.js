'use strict';

const fs = require('fs');
const path = require('path');
const http = require('http');
const url = require('url');

const distDir = path.resolve(__dirname, '..', 'dist');
const indexFile = path.join(distDir, 'index.html');
const port = process.env.PORT || 8080;

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.map': 'application/json; charset=utf-8'
};

function sendNotFound(res) {
  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Not found');
}

function serveFile(res, filePath) {
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      fs.readFile(indexFile, (indexErr, indexData) => {
        if (indexErr) {
          sendNotFound(res);
          return;
        }
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(indexData);
      });
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    const readStream = fs.createReadStream(filePath);
    readStream.on('error', () => sendNotFound(res));
    readStream.pipe(res);
  });
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url || '/');
  let pathname = decodeURIComponent(parsedUrl.pathname || '/');

  if (pathname.endsWith('/')) {
    pathname += 'index.html';
  }

  const filePath = path.join(distDir, pathname);
  if (!filePath.startsWith(distDir)) {
    sendNotFound(res);
    return;
  }

  serveFile(res, filePath);
});

server.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on port ${port}`);
});
