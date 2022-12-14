'use strict';

const express = require('express');
const app = express();
const server = require('http').Server(app);
const url = require('url');

const WebSocket = require('ws');

const port = process.env.PORT || 3000;

const express_config= require('./config/express.js');

express_config.init(app);

const wss1 = new WebSocket.Server({ noServer: true });
const wss2 = new WebSocket.Server({ noServer: true });

var os = require( 'os' );
var networkInterfaces = Object.values(os.networkInterfaces())
    .reduce((r,a) => {
        r = r.concat(a)
        return r;
    }, [])
    .filter(({family, address}) => {
        return family.toLowerCase().indexOf('v4') >= 0 &&
            address !== '127.0.0.1'
    })
    .map(({address}) => address);
var ipAddresses = networkInterfaces.join(', ');



var cameraArray={};

//esp32cam websocket
wss1.on('connection', function connection(ws) {

  ws.on('error', console.error);

  ws.on('message', function incoming(message) {
    wss2.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });
});

//webbrowser websocket
wss2.on('connection', function connection(ws) {
  ws.on('error', console.error);
  
  ws.on('message', function incoming(message) {
    // nothing here should be received
    console.log('received wss2: %s', message);
  });
});

server.on('upgrade', function upgrade(request, socket, head) {
  const pathname = url.parse(request.url).pathname;

  if (pathname === '/jpgstream_server') {
    wss1.handleUpgrade(request, socket, head, function done(ws) {
      wss1.emit('connection', ws, request);
    });
  } else if (pathname === '/jpgstream_client') {
    wss2.handleUpgrade(request, socket, head, function done(ws) {
      wss2.emit('connection', ws, request);
    });
  } else {
    socket.destroy();
  }
});


app.get('/', (req, res) => {
    res.render('index', {});
});


server.listen(port, () => {
    console.log(`App listening at http://${ipAddresses}:${port}`)
})



// const express = require('express');
// const { Server } = require('ws');

// const PORT = process.env.PORT || 3000;
// const INDEX = '/index.html';


// const server = express().use((req, res) =>res.sendFile(INDEX, { root: __dirname }))
//                         .listen(PORT, () => console.log(`Listening on ${PORT}`));
// const wss = new Server({server},() => console.log(`WS Server is up`));

// wss.on('connection', (ws) => {
//   console.log('Client connected');
//   ws.on('message', data => {
//   	wss.clients.forEach((client) => {
//   		//if(client.readyState === ws.OPEN){
//   			client.send(data);
//   		//}
//   	})
//   });
//   ws.on('close', () => console.log('Client disconnected'));
// });