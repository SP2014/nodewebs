'use strict';

const express = require('express');
const { WebSocket } = require('ws');

const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';

const WS_PORT  = 65080;


var app = express();

  // .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  // .listen(PORT, () => console.log(`Listening on ${PORT}`));

const wss = new WebSocket.Server({port: WS_PORT},() => console.log(`WS Server is listening at ${WS_PORT}`));

wss.on('connection', (ws) => {
  console.log('Client connected');
  ws.on('message', data => {
  	wss.clients.forEach((client) => {
  		//if(client.readyState === ws.OPEN){
  			client.send(data);
  		//}
  	})
  });
  ws.on('close', () => console.log('Client disconnected'));
});

app.get('/',(req, res) => res.sendFile(INDEX, {root: __dirname}));
app.listen(PORT, () => console.log(`HTTP server listening at ${PORT}`));

// setInterval(() => {
//   wss.clients.forEach((client) => {
//     client.send(new Date().toTimeString());
//   });
// }, 1000);