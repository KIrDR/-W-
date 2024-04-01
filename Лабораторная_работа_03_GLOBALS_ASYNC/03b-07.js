const http = require('http');

function f1(){
    console.log('f1');
}

function f2(){
    console.log('f2');
}

function f3(){
    console.log('f3');
}

function main(){ 
    console.log('main');

    setTimeout(f1, 50);
    setTimeout(f3, 50);

    new Promise((resolve, reject) => 
        resolve('I am a Promise, right after f1 and f3! Really?')).then(resolve => console.log(resolve));
    
    new Promise((resolve, reject) => 
        resolve('I am a Promise AFTER Promise')).then(resolve => console.log(resolve));

    f2();
}

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  main();
  res.end('Server is running!');
});

const PORT = 3007;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/`);
});
