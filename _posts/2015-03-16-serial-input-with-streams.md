---
title: Streaming data to the serial port
tags: arduino
layout: post
---
Many embedded systems have *no* screens (as in the case of an Arduino) or only small screens (a wrist-watch for example). You already saw in [the last post](http://thinkingonthinking.com/serial-communication-with-nodejs/), how you can read data from screen-less devices by listening on an UART with JavaScript.

Now, let's look at the opposite case:  *Writing* bytes into a device. This becomes interesting for device configuration, feeding displays, adjusting light or parameters of a robot.

As in the previous post, we use the serial port with JavaScript, and transmit data to an Arduino.  Before bytes can be transmitted, we must capture them, for example from a user. 

Here is an example for writing bytes over UART. Imagine you have a table football in your office. And, you want others allow to follow score on a 7 segment display.

<a href="https://www.flickr.com/photos/merlijnhoek/2672429188" title="Table football @ Fusion Festival 2008 (Sunday) by Merlijn Hoek, on Flickr"><img src="https://farm4.staticflickr.com/3090/2672429188_48356e4495.jpg" width="500" height="334" alt="Table football @ Fusion Festival 2008 (Sunday)"></a>

So, for this project you need to setup several things:

* Capture input from a user with JavaScript and write to an UART
* Display the score on a 7-segment display with an Arduino

# NodeJS streams

A fundamental concept behind moving bytes in NodeJS are [streams](https://nodejs.org/api/all.html#all_stream). With streams, you can observe and manipulate the flow of data over time. A good examples for streams are HTTP requests and responses. See [the NodeJS HTTP API docs for details](https://nodejs.org/api/http.html#http_class_http_clientrequest). 

Besides data in networks or databases, streams are nice to deal with user input too. Input from a user can be captured with a simple *writable* stream:

    var stream = require('stream');
    var Stream = stream.Stream;
    
    var ws = new Stream;
    ws.writable = true;
    
    ws.write = function(data) {
      console.log("input=" + data);
    }
    
    ws.end = function(data) {
      console.log("bye");
    }
    
    process.stdin.pipe(ws);


A simple test shows how this works:

    $ node pipe_out.js
    hello
    input=hello

The writeable stream handles "write" and "end" events from the standard input. This connection is made by *piping* standard input to the writable stream. You could also pipe the output of a file into the write stream, e.g. with:

    $ echo hello | node pipe_out.js
    input=hello
    
    bye

So far about the basics of a writeable stream. [@substack](http://twitter.com/substack) has [a great talk](https://www.youtube.com/watch?v=lQAV3bPOYHo) about details and types of streams.

# Transmitting data

As previously with the read command, you can simply *write* to the serial port on write events. When you include the serial port in the previous example, the code becomes:

    var Stream = require('stream');
    var modem = 'cu.usbmodem14231';
    
    var ws = new Stream;
    ws.writable = true;
    
    ws.write = function(data) {
      serialPort.write(data);
    };
    
    ws.end = function(buf) {
      console.log('bye');
    }
    
    var serialPort = new SerialPort('/dev/' + modem, {
      baudrate: 9600,
      parser: serialport.parsers.readline("\n")
    });


Now, you could connect to some periphery and send data with 9600 baud. Let's explore that. First we must again prepare the Arduino.

# The Arduino side

On the Arduino, we now need to examine its UART whether there is data in the receive buffer. If so, we parse the data and the do something, e.g. activating a display.

What follows is some simple Arduino code to read two numbers separated by a character:

      if (Serial.available() > 0) { 
        incoming[0] = Serial.parseInt(); 
        incoming[1] = Serial.parseInt(); 

        if (Serial.read() == '\n') {
           // light the display
        }
      }


More info can be found this can be found in the [ReadASCIIString example](http://arduino.cc/en/Tutorial/ReadASCIIString) and the [parseInt API docs](http://arduino.cc/en/Reference/ParseInt). 

An nice 7 segment display to see some action is [this product from Sparkfun](https://www.sparkfun.com/products/11442).
[Some examples](https://github.com/sparkfun/Serial7SegmentDisplay/blob/master/firmware/Serial%207-Segment%20Display/Arduino_Examples/S7S_Example_Serial_ColonDots/S7S_Example_Serial_ColonDots.ino) illustrate how to control the numbers on the screen.


# The result

The result? Now, you can write the scores of a table football match or any other game to an external display.  We are going to learn soon how to attach web services and interfaces to hardware.  Then streams and NodeJS can start to show its real benefits.

<a href="https://www.flickr.com/photos/pmulder99/16238050843" title="display by Patrick Mulder, on Flickr"><img src="https://farm9.staticflickr.com/8563/16238050843_db297cb3d3.jpg" width="375" height="500" alt="display"></a>

*Note: This post is the first post of a new series about JavaScript for embedded devices. This will be the topic of my new book. Any feedback, suggestions and criticism is highly appreciated.*
