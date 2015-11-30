---
layout: post
tags: javascript, hardware
title: Espruino - JavaScript on bare metal
---
Probably the easiest way to get started with JavaScript and embedded devices are Espruino boards. Espruino is "mini" Node.js for embedded devices.

The [Espruino project](http://espruino.com) by Gordon Williams was [funded in a Kickstarter campaign 2014](http://makezine.com/2014/11/11/javascript-by-the-pico/) and has been continuously improved since.

<img src="/static/images/espruino.png" />

A simple blinking LED example with Espruino can look as follows. First, you mount an [Espruino Pico](http://www.espruino.com/Pico) (which costs around 30USD) with a LED and resistor on a breadboard as is shown above. In this case, I use pin B7 and GND as shown in detail on the [hardware pinout](http://www.espruino.com/Pico). (By the way, if you are new to electronics: Breadboards and components will be discussed in my new book [Node.js for embedded systems](http://embeddednodejs.com)).

In contrast to an Arduino Uno or other microcontrollers, you don't need to setup an IDE to run code on Espruino. On most systems, you don't even need to install install drivers. You only need a terminal program which comes pre-installed on many computers these days.

Once the hardware is setup, you can connect to the Espruino with a terminal program. A good terminal program for MacOS and Linux is "screen", while "hterm" is a popular choice on Windows machines.

On MacOS, you can connect to the Espruino with 'screen' as follows:

    $ screen /dev/cu.usbmodem141 9600

Once you are connected you should a welcome screen similar to the one below.

<img src="/static/images/espruino_welcome.png" />

You now can turn the LED on B7 ON with:

    > digitalWrite(B7, HIGH);

And OFF, with:

    > digitalWrite(B7, LOW);

You could add a toggle function to the Espruino workspace with:

    > var pinStates=[];
    > function togglePin(pin) {
        pinStates[pin] = !pinStates[pin];
        digitalWrite(pin, pinStates[pin]);
      }
    > togglePin(B7);  // ON
    > togglePin(B7);  // OFF

Espruino comes with some [global functions](http://www.espruino.com/Reference#_global) built-in. 

For example, you could attach (or "bind") functions to a certain pin, e.g. with:

    > toggleB7 = togglePin.bind(null, B7)
    > toggleB7();

And to toggle the LED off, use:

    > toggleB7();

Besides digital signals, an Espurino makes working with analog signals equally simple with [analogWrite](http://www.espruino.com/Reference#l__global_analogWrite). For example, a pulse-width-modulated (PWM) signal can be simply be generated with:

    > >analogWrite(B7, 0.3, {freq: 1000});

Or, to generate flickering pulses of 10 Herz would be possible with:

    > >analogWrite(B7, 0.5, {freq: 10})

In contrast to Raspberry Pi and other Linux based devices, Espruino fills the gap for programming battery powered devices with JavaScript. 

Boards can be obtained from [Espruino.org](http://espruino.org). Or, if you have some extra time and/or interests in deeper embedded software development, you can flash the JavaScript firmware to other boards, such as STM32 based discovery boards. Other boards are listed [here](http://www.espruino.com/Other+Boards). 

New Espruino devices even support connectivity with Wifi or Ethernet.
