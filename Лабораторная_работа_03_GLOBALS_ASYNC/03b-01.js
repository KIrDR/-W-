const http = require('http');

function firstJob() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("Hello World");
    }, 2000);
  });
}


const server = http.createServer((req, res) => {

  if (req.url === '/then-catch') {
    
    firstJob()
      .then(result => {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end("Promise result: " + result);
      })
      .catch(error => {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end("Promise error: " + error);
      });
  } else if (req.url === '/async-await') {
    
    async function handleFirstJob() {
      try {
        const result = await firstJob();
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end("Async/Await result: " + result);
      } catch (error) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end("Async/Await error: " + error);
      }
    }

    handleFirstJob();
  } else {
    
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
  }
});


const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/`);
});
