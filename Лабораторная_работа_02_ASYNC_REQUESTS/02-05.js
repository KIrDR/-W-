const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
  if (req.method === 'GET') {
    if (req.url === '/html') {
      readFileAndRespond('index.html', 'text/html', res);
    } else if (req.url === '/png') {
      readFileAndRespond('slon.jpg', 'image/jpg', res);
    }
    else if (req.url === '/api/name') {
        res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Кирилл Драч');
      }
      else if (req.url === '/xmlhttprequest') {
        readFileAndRespond('xmlhttprequest.html', 'text/html', res);
      }
      else if (req.url === '/fetch') {
        readFileAndRespond('fetch.html', 'text/html', res);
      }
      
    else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
    }
  } else {
    res.writeHead(405, { 'Content-Type': 'text/plain' });
    res.end('Method Not Allowed');
  }
});

function readFileAndRespond(fileName, contentType, res) {
  fs.readFile(fileName, (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Internal Server Error');
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    }
  });
}

const PORT = 5000;
server.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
