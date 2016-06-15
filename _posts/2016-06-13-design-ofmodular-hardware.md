---
layout: post
title: Design of break out boards 
tags: arduino, hardware
---
Breakout boards help to "break out" pins of chips and circuits. In a way, breakout boards are catalysts for hardware development. Learning to design breakout boards is a good start to design more complex circuits and hardware.

From a software perspective, a break out board feels like a unit test for hardware. Their function is limited to a couple of pins and a couple of square centimeters. Companies such as [Sparkfun](https://www.sparkfun.com/search/results?term=breakout+board) or [Adafruit](https://www.adafruit.com/product/2471?q=breakout%20board&) offer an impressive number of breakout boards. This shows that, at least for hobby purposes, breakout boards solve a real need.

<img src="/static/images/bb_boards_sparkfun.png" />

Not only does Sparkfun offer to buy their boards. They also provide a schematic and board layout to actually experiment, copy and modify the board for your purposes. This is quite revolutionary. It is similar to how Linux allows developers to improve toolchains or to write new tools based on the Linux kernel.

Nathan Seidle, founder of Sparkfun, provides a nice overview about the way that the internet revolutionizes hardware development in this talk:

<iframe width="560" height="315" src="https://www.youtube.com/embed/xGhj_lLNtd0" frameborder="0" allowfullscreen></iframe>

His main message is that our job as engineers is no longer the task to write patents. Our job is making products that sell. At Sparkfun, selling is done via the Internet and this means, that people also buy "information" and "content". They want to see and understand schematics and board layouts.

You might think that hardware for IoT is too complex for sharing online. The Tessel 2 is especially an interesting example that it is possible. Not only has the board been designed with open-source software toolchains. It also features a module system that allows software developers a plug-and-play experience for software development. With a simple [Tessel device for Eagle](https://github.com/embeddednodejs/tessellib) you can easily start to design your own Tessel modules. And with companies such as [oshpark](https://oshpark.com/) you can build your own prototype boards for under 10USD.

<img src="/static/images/t2_breakout.png" />
