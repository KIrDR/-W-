const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {
  const { pathname, query } = url.parse(req.url, true);

  if (req.method === 'GET' && pathname === '/fact') {
    const k = parseInt(query.k, 10);

    if (!isNaN(k) && k >= 0) {
      calculateFactorialAsync(k, (err, result) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Internal Server Error' }));
        } else {
          const responseJson = { k, fact: result };
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(responseJson));
        }
      });
    } else {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid parameter. k must be a non-negative integer.' }));
    }
  } else if (req.method === 'GET' && pathname === '/index.html') {
     
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
      <html>
        <body>
          <div id="resultsContainer"></div>
          <script>
            const start = Date.now();
            const resultsContainer = document.getElementById('resultsContainer');

            async function fetchDataAndDisplayResult(x) {
              const response = await fetch(\`/fact?k=\${x}\`);
              const data = await response.json();
              const elapsedTime = Date.now() - start;
              const result = \`Результат: \${elapsedTime}ms - \${x}/\${data.fact}\`;
              resultsContainer.innerHTML += \`<p>\${result}</p>\`;
            }

            for (let x = 0; x <= 20; x++) {
              fetchDataAndDisplayResult(x);
            }
          </script>
        </body>
      </html>
    `);
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not Found' }));
  }
});

const calculateFactorialAsync = (n, callback) => {
  if (n === 0 || n === 1) {
    setImmediate(() => callback(null, 1));
  } else {
    setImmediate(() => {
      calculateFactorialAsync(n - 1, (err, result) => {
        if (err) {
          callback(err);
        } else {
          callback(null, n * result);
        }
      });
    });
  }
};

const PORT = 5005;
server.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
