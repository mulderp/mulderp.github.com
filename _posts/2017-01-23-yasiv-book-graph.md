---
layout: post
title: Learning from a Graph
tags: books, writing
---

[Yasiv](http://www.yasiv.com/) is a wonderful tool to browse product data at Amaozn. By looking at a graph of sales at Amazon, where does our book [[Node.js for embedded systems](http://embeddednodejs.com) stand? 

A graph of book sales can provide some insights.

<img src="/static/images/amz_nodejs_embedded.png" />

The graphs shows different kinds of products from the Amazon product catalog. The lines between nodes shows how books are combined in a shopping cart.

In the middle, the yellow circle shows the book "Node.js for Embedded Systems". It connects with a number of different product categories at amazon.

First, people buy this book together with books an materials on Raspberry Pi and Arduino (cyan circles top left). Single board computers are indeed an interesting start with embedded systems. Books on Beaglebone are also connected to this (see orange circle).

Second, there is a whole book category on Robots (red circle). Robot books are more connected to Raspberry Pi and Arduino, than they are to Beaglebone. It seems our book could add an interesting link here, but it is not yet what people see.Somehow in this direction, books are written on computer architecture and FPGA's as well.

Third, there is a whole category of books on design of user experiences for connected products. Interestingly, only few books link design with hardware for IoT. Two books are "Wearable Sensors: Fundamentals, Implementation and Applications" (2014) and "Learning Internet of Things" (2015).

Last, there is a large category of books on writing web applications with Node.js or JavaScript in general (blue circles bottom). This is the good news for "Node.js for Embedded Systems": It seems to be able to link hardware with web applications.



