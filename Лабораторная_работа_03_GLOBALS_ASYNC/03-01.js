const http = require('http');
const readline = require('readline');

let state = 'norm';
let lastRequest = null;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html ; charset=utf-8' });
    res.end(`<html><body><h1>Current state: ${state}</h1><p>Last input: ${lastRequest || ''}</p></body></html>`);
  }
});

const PORT = 5001;
server.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));

const changeState = () => {
  rl.question(`Current state: ${state}. Enter a new state (norm, stop, test, idle, exit): `, (newState) => {
    if (newState === 'exit') {
      console.log('Exiting the application.');
      console.log('PID:', process.pid);

      process.kill(process.pid, 'SIGTERM');

      server.close();
    } else if (['norm', 'stop', 'test', 'idle'].includes(newState)) {
      state = newState;
      lastRequest = `State changed to: ${state}`;
      console.log(lastRequest);
    } else {
      lastRequest = `Invalid state: ${newState}`;
      console.log(lastRequest);
    }
    changeState();
  });
};

changeState();
