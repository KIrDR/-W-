const http = require('http');
const { v4: uuidv4 } = require('uuid');


function validateCard(cardNumber) {
  console.log("Card number:", cardNumber);
  return Math.random() < 0.5; 
}

function createOrder(cardNumber) {
  return new Promise((resolve, reject) => {
    if (!validateCard(cardNumber)) {
      reject("Card is not valid");
    } else {
      setTimeout(() => {
        const orderId = uuidv4(); 
        resolve(orderId);
      }, 5000); 
    }
  });
}
 

function proceedToPayment(orderId) {
  console.log("Proceeding to payment for order:", orderId);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.5) {
        resolve("Payment successful");
      } else {
        reject("Payment failed");
      }
    }, 3000);  
  });
}
 
const server = http.createServer((req, res) => { 
  if (req.method === 'GET' && req.url === '/checkout') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const requestData = JSON.parse(body);
      const cardNumber = requestData.cardNumber;

      
      createOrder(cardNumber)
        .then(orderId => {
            
          proceedToPayment(orderId)
            .then(paymentResult => {
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ cardNumber,orderId, paymentResult }));
            })
            .catch(paymentError => {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: paymentError }));
            });
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


const PORT = 3004;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/`);
});
