const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {
  const { pathname, query } = url.parse(req.url, true);

  if (req.method === 'GET' && pathname === '/fact') {
    const k = parseInt(query.k, 10);

    if (!isNaN(k) && k >= 0) {
      const fact = calculateFactorial(k);
      const responseJson = { k, fact };
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(responseJson));
    } else {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid parameter. k must be a non-negative integer.' }));
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not Found' }));
  }
});

const calculateFactorial = (n) => {
  if (n === 0 || n === 1) {
    return 1;
  } else {
    return n * calculateFactorial(n - 1);
  }
};

const PORT = 5002;
server.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
