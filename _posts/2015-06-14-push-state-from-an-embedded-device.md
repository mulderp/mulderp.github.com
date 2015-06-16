---
layout: post
title: Push State from an Embedded Device
tags: arduino embedded
---
In this post, I want to show you how to read sensor data and work with it in the browser. To solve this problem, you need to "push" state from an embedded device into a ["socket"](https://en.wikipedia.org/wiki/Network_socket). For the web, this usually means applying the [WebSocket protocol](https://en.wikipedia.org/wiki/WebSocket).

<img src="/static/images/epoch_analog.png" />

We will use what we have learned in the previous [post on serial communication with Node.js](http://thinkingonthinking.com/serial-communication-with-nodejs/). If you haven't read that post, you can also run the embedded [Yeoman](http://yeoman.io/) generator which provides a number of files to get started. If you have read that post, you probably can skip the first section on getting the project files.

The hardware used is an Arduino with the Grove Kit shield as shown below.

<img src="/static/images/grove_kit.png" />

Furthermore, a simple LED and an input switch are nice for debugging the hardware setup. The LED and input button are shown below:

<img src="/static/images/grove_kit_led.png" />

And the button:

<img src="/static/images/grove_kit_btn.png" />

With the code from this post, you will be able to start a socket connection on client and server, and move data from an Arduino with serial communication.

# A basic web server

Assuming you want to start with a fresh Node.js project, you need to install some basic dependencies and setup some files. Yeoman provides many "generators" for different type of projects. My [embedded Yeoman generator](https://github.com/mulderp/generator-embedded) provides some help with a basic webserver that has a Firmata connection for Arduino.

First, you must install Yeoman and the generator with:

    $ npm install -g yo
    $ npm install -g generator-embedded

Now, you can run:

    $ yo embedded

As first check, we can run the server with:

    $ node server

This should result into something similar to:

    Starting server at port: 3474
    There is a problem with: /dev/cu.usbmodem14231
    [Error: Cannot open /dev/cu.usbmodem14231]

This error appears because we not yet have an Arduino connected. Let's change this.

# Arduino Setup

It is often a good idea to read out the position of a potentiometer before reading data from a sensor. The potentiometer I use is shown below from the Grove Kit.

<img src="/static/images/grove_kit_pot.png" />

A potentiometer behaves somewhat similar to a sensor. In both cases, a continuous signal (= "analog" quantity) is sampled by the microcontroller and converted into a digital quantity which a computer can work with it.

In your project directory, you will find the following project files:
 
    package.json
    server.js
    static/index.html

Let's first look into the *package.json*. The interesting part are the dependencies:

  "dependencies": {
    "firmata": "^0.4.1",
    "ws": "^0.7.2",
    "finalhandler": "^0.3.5",
    "morgan": "^1.5.2",
    "router": "^1.1.0
  }

These are the minimum libraries to get a working server supporting both, an Arduino with Firmata and WebSockets. Let's run:

    $ npm install

Next, look through the following code for "server.js" to see what we are building. You will see how it will operate and interacts with the Arduino in a second.
 
server.js
 
    var fs = require('fs');
    
    // serial port with Firmata
    var firmata = require('firmata');
    
    // reference to embedded device
    var modem = '/dev/cu.usbmodem14231';
    
    // setup web server
    var port = 3474;
    var Router = require('router');
    var router = Router();
    var http = require('http');
    var finalhandler = require('finalhandler');
    var morgan = require('morgan');
    console.log('Starting server at port: ' + port);
    
    // HTTP logging
    router.use(morgan('default'));
    
    // sockets to push bytes
    var WebSocketServer = require('ws').Server;
    
    // basic static files
    router.get('/', function(req, res) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(fs.readFileSync('static/index.html'));
    });
    router.get('/bundle.js', function(req,res) {
        res.writeHead(200, {'Content-Type': 'application/javascript'});
        res.end(fs.readFileSync('static/bundle.js'));
    });
    
    // API to hardware
    var api = Router();
    
    api.get('/:pin/check', function(req, res) {
      board.digitalWrite(req.params.pin, 1);
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.end(JSON.stringify({status: 'ok'}));
    });
    router.use('/api', api);
    
    // board
    var board = new firmata.Board(modem, function(err){
      if (!err) {
        console.log('connected: ' + modem);
      } else {
        console.log('problem with: ' + modem);
        console.log(err);
        process.exit()
      }
    
      // configure ports
      board.pinMode(5, board.MODES.INPUT);
    
      // prepare server
      var server = http.createServer(function (req, res) {
        router(req, res, finalhandler(req, res));
      }).listen(port);
    
      // add websockets
      var wss = new WebSocketServer({server: server});
      wss.on('connection', function connection(ws) {
        console.log('websocket connected');
        ws.on('message', function incoming(message) {
          console.log('received: %s', message);
        });
    
        board.digitalRead(5, function(val, err) {
          if (val == 1) {
            console.log(val);
            ws.send('{"state": ' + val + '}');
          }
        });
      });
    });

The first part of this server provides a bridge from HTTP to an Arduino. Then, the Arduino board is connected with help of the [Firmata Library](http://www.arduino.cc/en/Reference/Firmata).  This is a common setup for controlling things on the embedded device.

Let's do a quick check from the command line by getting an LED to blink:

     $ curl http://localhost:3474/api/6/check

If you have put an LED to pin 6, you should now see it ON. But immediately after issueing the HTTP request, the connection between client and server is closed. If we want to stream sensor data from an Arduino, we need to look at a different approach.

# Push Data with WebSockets

For many cases, we want an open connection between Arduino and browser to process measurements from sensors in realtime. This approach is given with WebSockets. A socket is a virtual communication device that can be shared between different processes on a computer. A WebSocket provides a protocol to work with sockets in a network.

In the setup from above, the [ws library](https://www.npmjs.com/package/ws) for WebSockets in Node.js is already setup. For browsers, a [WebSocket API](https://developer.mozilla.org/en-US/docs/WebSockets/Writing_WebSocket_client_applications#Availability_of_WebSockets

) is often included natively. 

To test WebSockets from the command line, you can install a nice command line tool wscat:

    $ npm install -g wscat

Now, if you start the server:

    $ node server

And run:

    $ wscat -c ws://localhost:3474

You can already watch inputs from a digital switch on digital input 6. This should look similar to:

    < {"state": 1}
    
Now, take the potentiometer and connect it to e.g. analog input 5.

    board.analogRead(3, function(val, err) {
        console.log(val);
        ws.send('{"analog": ' + val + '}');
    });

Let's check again with wscat:

    $ wscat -c ws://localhost:3474
    < {"analog": 643}
    < {"analog": 643}

You now can observe the websocket connection in the browser and update a chart. This work is done in index.html
 
static/index.html
    
    <script>
      var ws = new WebSocket('ws://localhost:3474');
    
      ws.onmessage = function(e) {
          var timestamp = ((new Date()).getTime() / 1000)|0;
          var data = JSON.parse(e.data);
          var dataPoint = {time:  timestamp, y: data.analog};
          console.log(dataPoint);
      };
    </script>

A full example with plot function is [here](https://github.com/mulderp/nodejs-websockets-template).
 
# Wrap up

This post provided an outline to read data from an embedded device with Node.js and WebSockets. First, you had some contact with the web server. Then, the data was fed with a web socket into a browser. We still miss some basic connection to provide data over a network with a publish-subscribe pattern.


# References

 Maybe you want to plot it similar to [plotting data from an Arduino](http://www.instructables.com/id/Plotting-Data-From-Arduino/). 
