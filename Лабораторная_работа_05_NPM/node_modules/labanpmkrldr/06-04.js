const http = require('http');
const fs = require('fs');
const url = require('url');
const send = require('m06_LIV');

http.createServer((request, response) => {
    const pathname = url.parse(request.url).pathname;

    switch (pathname) {
        case '/':
            if(request.method === 'GET'){
                fs.readFile("./06-02.html", (error, data) => {
                    if (error) {
                        console.log(error.message);
                        return;
                    }
                    response.end(data);
                });
            }
            else if(request.method === 'POST'){
                request.on("data", (data) => send(
                    JSON.parse(data).sender,
                    JSON.parse(data).password,
                    JSON.parse(data).receiver,
                    JSON.parse(data).theme,
                    JSON.parse(data).textMessege));
                response.end("Email send successful");
            }
            else response.statusCode = 404;
            break;
        default:
            response.statusCode = 404;
            break;
    }
}).listen(3000, () => console.log('Start server at http://localhost:3000'));