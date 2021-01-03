
const http = require('http');
const httpServer = http.createServer()
const webSocketServer = require('websocket').server;
const { v4: uuidv4 } = require('uuid');


httpServer.listen(8080);
console.log('listening on port 8000');

//we will spawn up webSocketServer using the httpServer
 const wsServer = new webSocketServer({
    httpServer
})

//store all connected clients
const clients= {}

wsServer.on('request', (request)=>{
    var userId = uuidv4();
    console.log((new Date())+ 'Received a new connection from origin' + request.origin +'.')
    
    //accept any req from any origin
    const connection = request.accept(null, request.origin);
    clients[userId] = connection;
    console.log('connected: ' + userId + ' in ' + Object.getOwnPropertyNames(clients));

    connection.on('message', function(message) {
        if (message.type === 'utf8') {
          console.log('Received Message: ', message.utf8Data);
    
          // broadcasting message to all connected clients
          for(key in clients) {
            clients[key].sendUTF(message.utf8Data);
            console.log('sent Message to: ', clients[key]);
          }
        }
      })
})