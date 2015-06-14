---
layout: post
title: Push State from an Embedded Device
tags: arduino embedded
---
In this post, I want to show you how to read sensor data and work with it in the browser. To solve this problem, you need to "push" state from an embedded device into a ["socket"](https://en.wikipedia.org/wiki/Network_socket). For the web, this usually means applying the [WebSocket protocol](https://en.wikipedia.org/wiki/WebSocket).

We will use what we have learned in the previous [post on serial communication with Node.js](http://thinkingonthinking.com/serial-communication-with-nodejs/). If you haven't read that post, you can also run the embedded [Yeoman](http://yeoman.io/) generator which provides a number of files to get started. If you have read that post, you probably can skip the first section on getting the project files.

With the code from this post, you will be able to start a socket connection on client and server, and move data from an Arduino with serial communication.

# A basic web server

Assuming you want to start with a fresh Node.js project, you need to install some basic dependencies and setup some files. Yeoman provides many "generators" for different type of projects. My [embedded Yeoman generator](https://github.com/mulderp/generator-embedded) provides some help with a basic webserver that has a Firmata connection for Arduino.

First, you must install Yeoman and the generator with:

    $ npm install -g yeoman-cli 
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

# Setup the Arduino

It is often a good idea to read out the position of a potentiometer before reading data from a sensor. A potentiometer behaves somewhat similar to a sensor. In both cases, a continuous signal (= "analog" quantity) is sampled by the microcontroller and converted into a digital quantity which a computer can work with it.

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

For many cases, we want an open connection between Arduino and browser to process measurements from sensors in realtime. This approach is given with WebSockets 
 
static/index.html
 
<code>
</code>
 
static/bundle.js
 
<code>
</code>
 
Next, we will move onto/look at following code for "server.js", so you can see what we are building and how it will operate once the code is run and is interacting with the Arduino.
 
Repeat until all stages complete.
 
Now we will execute the code above, using the default method of initialising/starting a Node.js instance:
 
<insert cmd here>
 
and so on.
 
// Wrap up of example
 
You can see how the Node.js code that we wrote above/just now does E, F & G and how it gives you the ability to do H, I and J. This is a simple but powerful method than can be extended to do <insert stuff here>.


# References

 Maybe you want to plot it similar to [plotting data from an Arduino](http://www.instructables.com/id/Plotting-Data-From-Arduino/). 
