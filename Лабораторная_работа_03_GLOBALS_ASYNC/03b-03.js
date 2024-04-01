const http = require('http');
const url = require('url');
const fs = require('fs');


function thirdJob(data) {
  return new Promise((resolve, reject) => {
    if (isNaN(data)) {
      reject("error");
    } else if (data % 2 !== 0) {
      setTimeout(() => {
        resolve("odd");
      }, 1000);
    } else {
      setTimeout(() => {
        reject("even");
      }, 2000);
    }
  });
}


const server = http.createServer((req, res) => {
  const { pathname, query } = url.parse(req.url, true);
  
  if (pathname === '/') {
  
    res.writeHead(200, { 'Content-Type': 'text/html' });
    fs.createReadStream('index.html').pipe(res);
  } else if (pathname === '/process') {
    
    const inputData = query.number;

    // then/catch
    thirdJob(inputData)
      .then(result => {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end("Third Job Promise result: " + result);
      })
      .catch(error => {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end("Third Job Promise error: " + error);
      });

    //async/await и try/catch
    async function handleThirdJob() {
      try {
        const result = await thirdJob(inputData);
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end("Third Job Async/Await result: " + result);
      } catch (error) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end("Third Job Async/Await error: " + error);
      }
    }

    handleThirdJob();
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
  }
});


const PORT = 3003;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/`);
});
