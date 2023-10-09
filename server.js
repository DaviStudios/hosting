const WebSocket = require('websocket').server;
const http = require('http');

const server = http.createServer((request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.end('<html><body>WS Server running - FIFA87 HOSTING</body></html>');
});

server.listen(8765, () => {
  console.log('WebSocket server is listening on port 8765');
});

const wsServer = new WebSocket({
  httpServer: server,
});

const connectedClients = [];

wsServer.on('request', (request) => {
  const connection = request.accept(null, request.origin);
  connectedClients.push(connection);

  connection.on('message', (message) => {
    if (message.type === 'utf8') {
      const messageData = message.utf8Data;
      console.log(`Received message from client: ${messageData}`);
      broadcast(messageData);
    }
  });

  connection.on('close', () => {
    const index = connectedClients.indexOf(connection);
    if (index !== -1) {
      connectedClients.splice(index, 1);
    }
  });
});

function broadcast(message) {
  connectedClients.forEach((client) => {
    if (client.connected) {
      client.sendUTF(message);
    }
  });
}
