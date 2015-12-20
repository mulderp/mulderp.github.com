---
title: Experiences from Moore's Law
layout: post
tags: writing, embedded
---
Hardware is getting cheaper and cheaper. It is fascinating to think about the origins of this phenomenon that people refer to [Moore's Law](https://en.wikipedia.org/wiki/Moore%27s_law). To understand how it works and where we are going, let's look at computers under a microscope. 

On a physical level, computers are pieces of silicon with hundreds of millions (sometimes billions) of transistos. These transistors often act as switches, either to store state or to run binary operations. In contrast to mechanical switches, transistor act on voltages and electrical signals.

Transistors are made from different layers of conducting, isolating and semi-conducting materials. All layers are added on top of a silicon substrate. Have a look at the picture below for a visual explanation of layers on a silicon wafer.

<br>
<image src="/static/images/layers_silicon.png" />
<br>

Importantly, the shape of transistors is defined with help of [photolithography](https://en.wikipedia.org/wiki/Photolithography). These machines that project images of transistors on a wafer are one of the main driving forces behind "Moore's Law". By using smaller wavelengths of light, it was possible to shrink transistors from micrometers in size to tens of nanometers. (It is generally believed that transistors can be shrunk to sub-nanometer size.)

<a data-flickr-embed="true"  href="https://www.flickr.com/photos/zeissmicro/9440302219/in/photolist-kUua-fod1Xn-5ZvEoJ-oWwhNq-oWwhJs" title="Semiconductor Integrated Circuit (IC), BSE Image from ZEISS EVO"><img src="https://farm6.staticflickr.com/5323/9440302219_3c613ecbac_n.jpg" width="320" height="240" alt="Semiconductor Integrated Circuit (IC), BSE Image from ZEISS EVO"></a><script async src="//embedr.flickr.com/assets/client-code.js" charset="utf-8"></script>

Besides going to smaller transistor sizes and higher system performance, Moore's Law affects the costs of hardware devices. The more transistors you can put on a wafer, the cheaper manufacturing of single device becomes. This is similar to buying a burger in McDonalds, the higher their production volume, the less costly a single unit becomes.

Now, while the costs of a chip are heavily influenced by the size of a transistor, many more things happen until a chip is sold. Especially packaging of a chip is increasingly important. In many Maker projects, it's nice to have large packages for easier handling. But with increasing size, device warehousing and transports mean higher costs than smaller packages. So, while Moore's Law fits very well to explain cost reduction of individual chips, cost reductions of packages and systems might have different origins. Cheap manufacturing in [China](https://www.reddit.com/r/arduino/comments/3vswl4/arduino_clones_for_5_usd_how_does_it_work_to_get/) for example is one reason that cheap Arduino boards exists.

Note: The role of Moore's Law is important in developing [embedded devices for the Internet of Things](http://embeddednodejs.com).
