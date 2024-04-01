const http = require('http');


function square(number) {
  return new Promise((resolve, reject) => {
    if (isNaN(number)) {
      reject("Invalid input");
    } else {
      resolve(number * number);
    }
  });
}


function cube(number) {
  return new Promise((resolve, reject) => {
    if (isNaN(number)) {
      reject("Invalid input");
    } else {
      resolve(number * number * number);
    }
  });
}


function fourthPower(number) {
  return new Promise((resolve, reject) => {
    if (isNaN(number)) {
      reject("Invalid input");
    } else {
      resolve(Math.pow(number, 4));
    }
  });
}


const server = http.createServer((req, res) => {
    
  if (req.method === 'GET' && req.url === '/calculate') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const requestData = JSON.parse(body);
      const number = requestData.number;

      
      Promise.all([square(number), cube(number), fourthPower(number)])
        .then(results => {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ square: results[0], cube: results[1], fourthPower: results[2] }));
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


const PORT = 3005;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/`);
});
