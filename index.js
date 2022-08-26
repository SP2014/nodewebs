'use strict';

const express = require('express');
const { Server } = require('ws');

const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';


const server = express().use((req, res) =>res.sendFile(INDEX, { root: __dirname }))
                        .listen(PORT, () => console.log(`Listening on ${PORT}`));
const wss = new Server({server},() => console.log(`WS Server is up`));

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