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
  } else if (req.method === 'GET' && pathname === '/index.html') {
    
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8 '});
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

const calculateFactorial = (n) => {
  if (n === 0 || n === 1) {
    return 1;
  } else {
    return n * calculateFactorial(n - 1);
  }
};

const PORT = 5003;
server.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
