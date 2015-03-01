---
layout: post
title: Digital and analog interactions
tags: iot hardware analog digital
---
It was great to learn about a mash up of interfaces, hardware and software that is generally labelled "Internet of Things". [Massimo Banzi](https://www.youtube.com/watch?v=QB0ordd2nOI) from [Arduino](http://arduino.cc/) provided a lot of interesting material for doing further experiments.

# Designing smart interactions

Sitting in one of IDEO Munich's creative spaces, the workshop started with general design discussions about needs for connected devices. When you start listing devices of daily usage, you quickly discover many sensors and feedback loops to run our everyday lifes. In the next years, Internet of Things offers smarter devices by recording, communicating and visualizing patterns about interactions with these devices.

After brainstomring connected devices, we learnt how the [Arduino Yun](http://arduino.cc/en/Guide/ArduinoYun) can help a lot in prototyping interactions for the Internet of Things. The Arduino Yun combines Wifi and ethernet capabilities with an [Arduino Leonardo](http://arduino.cc/en/Main/arduinoBoardLeonardo) which has among other things 6 analog *inputs* and 6 analog *outputs*.

## Sidenote: The Ivrea design school
Arduino and its role for interaction design were rooted in the [Ivrea design school](http://interactionivrea.org/en/index.asp). Italy is famous for design, and Ivrea in particular for building Olivetti. Olivetti experimented with a design culture beyond their products as this video shows.

<iframe width="420" height="315" src="https://www.youtube.com/embed/97O5Iyb8Sz0" frameborder="0" allowfullscreen></iframe>

The Ivrea design school collaborated with many important designers and design thinkers, such as [Bill Moggridge](http://www.designinginteractions.com/bill), co-founder of IDEO. To grasp an idea of his work, this video is interesting.

<iframe width="420" height="315" src="https://www.youtube.com/embed/kVkQYvN4_HA" frameborder="0" allowfullscreen></iframe>


# No screens

Back to the workshop, when building devices with Arduino, it quickly becomes clear: There are no screens. You can read and write things via the Serial monitor. But a lot of physical computing is done directly with light, motion or sound. This is rather different when you are used to build UIs with software only.

Still, when gathering data from sensors, visualizations play an important role. We used [this simple gauge library](http://wiki.sandaysoft.com/a/SteelSeries_Gauges) to show data from remote sensors.

Before you can visualize data, you must fetch it over the network. Here, we saw the role of [MQTT](http://mqtt.org/), [HiveMQ](http://hivemq.com/demos/websocket-client/) and [Mosquitto](http://test.mosquitto.org/). Massimo provided many details about the background of this protocol, and why the publish-subscribe pattern is so important for Internet of Things.

# APIs

Services for connecting devices were the last topic of the workshop. By skipping the software UI's, this part led to questions about how to wrap APIs. Working with [Temboo](https://www.temboo.com/library/Library/NYTimes/TimesNewswire/GetRecentNewsItems/), we quickly had some working examples of reading and writing messages to Twitter, for example.

# Conclusions

It was a great weekend. By putting many simple ideas in a new context, it was interesting to get a feeling for the future: Connected worlds. Connectivity, however, is still not easy these days. What feels seamless transmission over the air, are often highly engineerd software solutions around Wifi protocols. Yet, combining interfaces, circuits and code is very nice to explore. 


