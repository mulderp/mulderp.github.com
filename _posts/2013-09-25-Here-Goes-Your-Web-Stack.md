---
layout: post
title: Here goes your web stack
tags: web applications
---
I remember the days when Apache and PHP were the main building blocks for web applications. In fact, there are still many requests for help with PHP on sites as Elance.com or on StackOverflow. PHP is still widely used.

Yet, as easy it was (and is) to get started with PHP, applications in PHP are mainly about "dynamic" HTML. Today, there are more requirements on applications for developers and many customers. For developers, it feels like designing (and maintaining) applications is far better, when we allow concerns to be separated. For users, applications should be interactive and provide fast feedback.

To make developers and users happier, new layers of functionality are introduced in applications, like advanced frontend layers. We increasingly see people use tools as Ember.js, Marionette or Angular. To get this working and to combine interaction with features for recommendation and search, we need APIs. And there are interesting ideas to pull the routing layer into the database, such as [Foxx](http://www.arangodb.org/2013/03/29/foxx-a-lightweight-javascript-application-framework-for-arangodb) or [CouchApp](http://couchapp.org/page/index).

 we see that the main drivers come from users with small screens and/or mobile devices. Here, we need to design interactions with screen regions, or explore document structures  that fit less easily into the relational data model. An excellent example on how new kinds of application stacks look like can be read [here](http://blog.fogcreek.com/the-trello-tech-stack/) on the technology stack at Trello. 

Also, the technical blog by [Art.sy](http://artsy.github.io/) discusses many interesting questions from a web application that provides advanced interactions with content. And not for nothing, they often discuss the use of Backbone.js and MongoDB. Also the dev blog of [Airbnb](http://nerds.airbnb.com/) heavily shows the influence of mobile devices on application design. So, here goes your web stack ...
