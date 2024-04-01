const http = require('http');


function secondJob() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject("Error occurred after 3 seconds");
    }, 3000);
  });
}


const server = http.createServer((req, res) => {
  
  if (req.url === '/then-catch') {
    
    secondJob()
      .then(result => {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end("Second Job Promise result: " + result);
      })
      .catch(error => {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end("Second Job Promise error: " + error);
      });
  } else if (req.url === '/async-await') {
    
    async function handleSecondJob() {
      try {
        await secondJob();
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end("Second Job Async/Await result: not work");
      } catch (error) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end("Second Job Async/Await error: " + error);
      }
    }

    handleSecondJob();
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
  }
});

const PORT = 3002;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/`);
});
