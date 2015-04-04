---
title: Building an Arduino sketch from scratch
layout: post
tags: Arduino post
---
Unix programmers have been building software for many years with the command line and the [GCC toolchain](http://en.wikipedia.org/wiki/GNU_Compiler_Collection). When developing for embedded systems, where clock cycles and memory usage counts, some familiarity with GCC is often needed.

# The GCC toolchain

The GCC tools come in different forms. For example, there is a variant for [Atmel AVR microcontrollers](https://gcc.gnu.org/wiki/avr-gcc) which is an important part of the Arduino IDE. Also, you'll find GCC versions for [ARM](https://launchpad.net/gcc-arm-embedded) which e.g. the [Teensy 3](https://forum.pjrc.com/threads/1600-Compile-GCC-for-teensy-3) requires.

Let's shortly review some concepts behind the compilation tools. There are a number of commands to remember:

* _gcc/g++_: This is the compiler. Compilers parse an input file from a human, and translate it to a binary file that a microprocessor understands. However, in our source code we likely want to reference code from other files and libraries. This is where a compiler sometimes acts a frontend to the linker.
* *ld*: You need a linker to bundle multiple binary files into one single file that runs on the microprocessor. Besides code organization, a linker reduces build time. You just re-compile files that changed and link everything into one file. You'll find options on using g++ as linker [in the docs](http://www.nongnu.org/avr-libc/user-manual/using_tools.html).
* *ar*:  Certain core libraries are linked straight into the target program. In order to make those libraries "linkable", there is the [ar archiver](http://www.network-theory.co.uk/docs/gccintro/gccintro_79.html) to generate static libraries.
* *objcopy*: Binary files can still be in different formats. A popular format is [ELF](http://en.wikipedia.org/wiki/Executable_and_Linkable_Format) or "Executable and Linkable Format". But some microprocessors require a different format. For example to upload to an Arduino, you need the "intel hex format".  Converting between formats can be done with [objcopy](http://ccrma.stanford.edu/planetccrma/man/man1/avr-objcopy.1.html).
* *avrdude*: Once your binary file is ready and in the correct format you need to upload it to the embedded device. This is what [avrdude](http://www.nongnu.org/avrdude/) does for Arduino.

A picture how these tools form a chain is shown [here](http://www.jusquici.org/blog/?page_id=202).

The Arduino IDE will install all the the AVR GCC tools for you. You can also [manually install the AVR GCC toolchain](http://nothingtodisplay.org/avr-toolchain-with-homebrew-mac-os-x/) on a Mac:

    $ brew install avr-libc

On Linux, this should do the trick:

    $ sudo apt-get install gcc-avr binutils-avr gdb-avr avr-libc avrdude

Windows users should find instructions [here](winavr.sourceforge.net). 

To follow the rest of this post, you can also use the AVR GCC tools that come with the Arduino IDE.


# Compile a Blink sketch

Learning the secrets of compilers and build tools takes some practice. Let's walk through a simplified build cycle to get you more familiar with the GCC tools.

Imagine this `blink.ino` Arduino sketch:

    
    void setup() {
    	// initialize Pin13 as an output
    	pinMode(13, OUTPUT);
    }
    
    void loop() {
    	digitalWrite(13, LOW);   
    	delay(1000);            
    	digitalWrite(13, HIGH); 
    	delay(400);            
    }


To compile this sketch with `g++`, you must include the `Arduino.h` header and include a `main()` function. This can be done simply by adding:


    $ echo '#include "Arduino.h"'  > blink.cpp
    $ cat /Applications/Arduino.app/Contents/Java/hardware/arduino/avr/cores/arduino/main.cpp >> blink.cpp


With the `arduino.h` header, you get functions to work with pins and ports. Also, you get function prototypes for the main parts of your sketch:

    void setup(void);
    void loop(void);

Now, `blink.cpp` is valid for compilation.

You can compile this blink.cpp to a binary file with:

    $ avr-g++ \
       -I /Applications/Arduino.app/Contents/Java/hardware/arduino/avr/cores/arduino/ -I /Applications/Arduino.app/Contents/Java//hardware/arduino/avr/variants/standard \
       -x c++  -MMD -c -mmcu=atmega328p -Wall -DF_CPU=16000000L  -Wall  -Os  blink.cpp

By using the -I compiler flag, we include the function prototypes of Arduino core libraries as we used `pinMode` and `digitalWrite`. What follows are some harder to understand compiler flags that address the microprocessor type and its speed. We'll see how we can get these automatically with a `Makefile? at the end of this post. Important right now: You get a binary file `blink.o` after compilation.


# Linking Libraries

As we used the `pinMode` and `digitalWrite` [functions](https://github.com/arduino/Arduino/blob/master/hardware/arduino/avr/cores/arduino/wiring_digital.c) of Arduino core libraries, we need to package some of these libraries into our `blink.o` binary. This can be done with:

    $ avr-ar rcs libcore.a hooks.o wiring.o wiring_digital.o

The objects files from Arduino core libraries are obtained from compiling the corresponding C files (hooks.c, wiring.c and wiring_digital.c) from the Arduino folder.  By the way, the `hooks.o` binary provides an empty helper to build Arduino projects without plugins.

Then we link this together with:

    $ avr-gcc -mmcu=atmega328p -Wl,--gc-sections -Os -o blink.elf blink.o libcore.a  -lc -lm

As last step, you must convert the elf binaries into the hex format:

    $ avr-objcopy -O ihex -R .eeprom blink.elf blink.hex

The resulting hex file can then be uploaded to an Arduino UNO. An overview on the compilation steps can be found in this [gist](https://gist.github.com/mulderp/36ca39a9911d54de66ec).

# Makefile

Repeating these steps manually for every project would quickly become furstrating. To automate builds and [configurations](http://en.wikipedia.org/wiki/Configure_script), there are Makefiles.

A great start to build an Arduino Sketch with a Makefile is in the [Arduino-Makefile](https://github.com/sudar/Arduino-Makefile) project by [@sudarmuthu](https://twitter.com/sudarmuthu). On my MacOS, I reference this project from my local project as follows:

    # Arduino Make file. Refer to https://github.com/sudar/Arduino-Makefile
    
    BOARD_TAG    = uno
    
    ARDUINO_DIR   = /Applications/Arduino.app/Contents/Java/
    ARDMK_DIR     = ../../
    AVR_TOOLS_DIR = /Applications/Arduino.app/Contents/Java/hardware/tools/avr/
    MONITOR_PORT  = /dev/cu.usbmodem14131
    BOARD_TAG     = uno
    AVRDUDE_CONF = /Applications/Arduino.app/Contents/Java/hardware/tools/avr/etc/avrdude.conf
    
    include ../../Arduino.mk

# References

* Book: [An introduction to GCC](http://www.network-theory.co.uk/gcc/intro/)
* A blog post that explains the different steps for compiling an Arduino sketch with [GCC and Makefiles](https://www.ashleymills.com/node/327)
* A leaner [Makefile](https://gist.github.com/wolever/273821) for Arduino
* Building an [Arduino bootloader](http://angryelectron.com/stk500-arduino-bootloader/)
* Getting started with [AVR LIB-C](http://www.atmel.com/images/doc1497.pdf)
* Some basics about [programming an Atmel ATmega](http://hackaday.com/2010/10/25/avr-programming-02-the-hardware/)
* A basic [Makefile](https://github.com/muccc/arm-workshop/blob/master/mvp/Makefile) for ARM based MCU's
* Another discussions on [Makefiles](http://alejandroerickson.com/joomla/personal-projects/73-a-makefile-for-arduino-v-0021)

