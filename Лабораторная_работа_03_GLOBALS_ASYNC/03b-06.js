const http = require('http');

function square(number) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (true) {
        reject("Invalid input");
      } else {
        resolve(number * number);
      }
    }, 2000); 
  });
}

function cube(number) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (true) {
        reject("Invalid input");
      } else {
        resolve(number * number * number);
      }
    }, 2000);
  });
}

function fourthPower(number) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (isNaN(number)) {
        reject("Invalid input");
      } else {
        resolve(Math.pow(number, 4));
      }
    }, 4000); 
  });
}

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/calculate') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const requestData = JSON.parse(body);
      const number = requestData.number;

      Promise.race([square(number), cube(number), fourthPower(number)])
        .then(result => {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ result }));
        })
        .catch(error => {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error }));
        });
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/`);
});
