---
layout: post
title: Booting single board computers
tags: computers
---
Last week, I have spend my evenings hacking operating systems for single board computers. I wanted to try out two things: Scripting a display on a Raspberry Pi. And, exploring Node.js on the Intel Galileo board.

Talking to a display on an Raspberry Pi was not too difficult. Working with graphics on bare metal requires some reading about ["framebuffers"](https://en.wikipedia.org/wiki/Linux_framebuffer). On the Raspberry Pi, you must build a framebuffer device first. There is a nice [write-up](https://github.com/notro/fbtft/wiki) here, and I arrived quickly at a working device:

    /dev/fb1

To then show an image on the display requires a command "fbi". First, we must install the program:

    # apt-get install fbi

Then [you could see the image quickly by running](https://www.raspberrypi.org/forums/viewtopic.php?f=27&t=15182):

    # fbi -T 2 IMAGE.jpg

I played with some scripts to change the image, but the processor on the RPi B was not fast enough (or my images were too large) to make it really fun.

<img src="/static/images/rpi_display.png" />

In my second project this week, I explored a new Linux image for the Intel Galileo. This was harder than expected.

My main idea is: Build an SD Card with Node.js and some libraries pre-installed. Following the manuals, I formatted the SD card with an FAT32 filesystem. But booting that one was difficult. Formatting the card with an ext3 filesystem made the content readable, but the SD Card was neither bootable.

Exploring this problem, let me to play with the [Grub bootloader]8http://www.dedoimedo.com/computers/grub.html#mozTocId616834) and [Grub from the command line](http://www.mepis.org/docs/en/index.php?title=GRUB_from_command_line). Also, [UEFI](https://en.wikipedia.org/wiki/Unified_Extensible_Firmware_Interface) might open new doors and I discvered [a wiki dedicated to development of operating systems](http://wiki.osdev.org/Main_Page).

Why bother? We usually pay money for this (to Apple or Microsoft) because we have better things to do, then learing about the boot process of an OS. But if we want to build embedded devices that have constrained resources, understanding an operating system becomes important again.

