---
layout: post
title: Exploring Noble and BlueIOT
tags: bluetooth, hardware
---
(this is a draft)

Imagine a [smart meeting room](http://blog.telenor.io/iot/2015/08/04/smart-meetingroom.html) that you can ping whether it is free or not.
Or, imagine a stroll in a museum where you can receive messages from artworks, connecting with the artist or other visitors.

[Bluetooth Low Energy](https://en.wikipedia.org/wiki/Bluetooth_low_energy) might become an important building block to build these new kinds of connected experiences. 

And, as JavaScript developers, we are lucky that [Sandeep Mistry](https://github.com/sandeepmistry/) has translated much of the BLE specifications into Node.js modules.

Based on his [Noble](https://github.com/sandeepmistry/noble) library, it is possible to learn what Bluetooth Low Energy does.

But before coming to the JavaScript part, you need a peripheral, or a "beacon". Bluetooth is easier to grasp with some test vehicles.

This can be anything, but I go with the [BlueIOT](https://www.tindie.com/products/FabLab/platinchen/) module. BlueIOT is based on the [BlueGiga BLE113](https://www.bluegiga.com/en-US/products/ble113-bluetooth-smart-module/). It has a couple of advantages compared to other solutions:

* BlueIOT has a very small form factor and can be powered from a coin cell battery, sleeping currents can be smaller than 1 uA 
* It uses a FCC/Bluetooth certified BLE module. This can save you time and costs if you want to develop your own Beacons later.
* The module comes with an ATmega328p chip that can be easily programmed with the Arduino toolchain
* It is possible to update the module with OTA and  connectivity configuration could be scripted with [bgscript](http://ezoelectro.narod.ru/doc-pdf/ble112/BGScript_developer_guide_v2.5.pdf). This helps to separate application logic and communication logic, as well as reducing load on the host processor

Besides the BlueIOT modules, there are a couple of alternatives to explore Bluetooth connectivity:

* Michael Kroll has built a [BLE Arduino shield](https://github.com/michaelkroll/BLE-Shield) that you can buy from Seeedstudio
* [RedbearLabs Arduino Shields and boards](http://redbearlab.com/bleshield/)  are interesting if you like the Arduino form factor, and come with a number of nice apps and examples
* The Intel Edison comes with Bluetooth built-in and you run the (Node.js) Bleno module to act as Beacon.
* If you know a talented hardware hacker, you can also look at the Bluetooth module from [the Tessel project](https://github.com/tessel/reach-hardware). 


# Preparing the Beacon

To prepare working with the BlueIOT module, I build two little boards:

* The first board to support flashing a Beacond. It accepts a TTL-UART converter that fits well the Arduino toolchain (see [towards smaller devices](http://blog.farsinotare.com))
<img src="/static/images/blueiot_2.png" />

* The second board provides a LED and a coin cell to experiment with states of a beacond. It also has a jumper to save battery power.

<img src="/static/images/blueiot_1.png" />

Besides the hardware helpers, you need to flash some firmware that can look as follows (credits to ]Guido Burger](https://twitter.com/guido_burger)):

      #include <Wire.h>
      #include <LowPower.h>
      #include <SPI.h>
      #include <SoftwareSerial.h>
      
      SoftwareSerial blueIOT(6, 9);
      
      void setup() {
        Serial.begin(9600);
         delay(1000);
         blueIOT.begin(57600);
         
         // BLE Module wakeup - HIGH prevents module to go to sleep mode
         pinMode(3, OUTPUT);
         digitalWrite(3, HIGH);
       
         // TEST LED on PIN5
         pinMode(5, OUTPUT);
         blueIOT.write(20); // BLE buffer size
         delay(1000);
         Serial.println("start");
      }
      
      void loop(){
        
        if (blueIOT.available()) {
          char c = blueIOT.read();
          Serial.println(c, HEX);
          
          if (c == '5') {
            digitalWrite(5, HIGH);
            blueIOT.write("on");
          }
          else {
           digitalWrite(5, LOW);
           blueIOT.write("off");
          }
          blueIOT.write("idle");
        }
      }



# Using BLE with Noble.js

The first contact with Noble is probably via the [beacon test script](https://github.com/sandeepmistry/noble/blob/master/test.js) from the Noble repository.  The following steps are necessary:

1) Your local Bluetooth "radio" (e.g. your laptop) must be powered on. This is not always the case, since many devices switch off Bluetooth to save power.
2) Once the "Radio" is running, you can start the "discovery" process
3) A discovered device is called "peripheral" and it provides "services"
4) You can "connect" to the peripheral to find out
5) You can then list the "services"
6) A service comes with "characteristics" that you can read or write to


In the case of a BlueIOT beacon with a LED, the first step is discovering the device.

Noble provides a number of events. So, on a first attempt to run this library, let's try this:

    var noble = require('noble');
    var MyRadio = require('./ble_radio');
    
    // the service unique identifier tells us that it's a BlueIOT beacon
    var blueIOTServiceUuid = 'b4bdb9988f4a45f6a4076b48d79cfc2f';

    // we mainly use the service to write the state of a LED
    var blueIOTwriteCharacteristicUuid = 'b4bdb9988f4e45f6a4076b48d79cfc2f';
    
    var myRadio = new MyRadio({serviceIds: [blueIOTServiceUuid]});
    
    noble.on('stateChange', myRadio.startScanning);
    noble.on('discover', myRadio.processDiscovery);

With this construction, the main events from the beacon are processed behind the scenes in the "BLERadio" module.

Let's look how to scan for devices and process "discoveries".

# Scanning for devices

Scanning for devices is shown in the Noble examples:

    BLERadio.prototype.powerOn = function (state) {
      console.log('state change: ' + state);
    
      if (state === 'poweredOn') {
    
        // Once the BLE radio has been powered on, it is possible
        // to begin scanning for services. Pass an empty array to
        // scan for all services (uses more time and power).
    
        console.log('scanning...');
    
        if (this.serviceUuid) {
          noble.startScanning([this.serviceUuid], false);
        } else {
          noble.startScanning([], false);
        }
      }
      else {
        console.log('there is no BLE device. stop scanning.');
        noble.stopScanning();
      }
    }

It is possible to scan only for specific devices. This is indicated with the serviceUuid.
Once the scanning has finished, you can process discoveries. I found the need to use a Connection module as follows:


    BLERadio.prototype.processDiscovery = function(peripheral) {
    
      // once there is a peripheral, connect to it
      var connection = new Connection(peripheral);
      connection.start();
    
      noble.stopScanning();
    }

Now, from a Connection you can interact with services and characteristics on the device.

