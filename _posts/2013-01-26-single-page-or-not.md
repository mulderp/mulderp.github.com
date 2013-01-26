-----
title: What is modular code?
layout: post
-------

Designing the architecture of a web application is difficult. First, there are many different programming languages among which to chose, then there are many frameworks , some leave design decisions to the programmer, some come "opinionated' (= with default settings/strategies). Additionally, within each framework, a number of plugins exists that often solve similar problems, yet have different solution approaches.

In order to help system designers to make decisions, programmers talk about applying "patterns" or using a "pattern language". Patterns give some heuristics, whether a system composition makes sense, or will be risky in the future. In my view, a number of patterns are driven by making code and systems modular, a concept that I read in a book some years ago. Modular code (and data) should be easier to re-use, and allow to extend and adapt ideas where needed. 

Now, here is an overview of modular design decisions (and experiments) in the context of Ruby and JavaScript for a web application, that would be able to deal with a number of different (mobile) use cases in the future.

1. Client/Server Separation
----------------------------
Sinatra, Rails-API


2. MVC on the client-side
--------------------------------------------
So, far in Backbone, my application structure starts to look as follows:

app.js
main.js

/collections
/models
/views


How do we see, it's MVC? Why do we see it's MVC?

MVC pattern helps to guide in the design of computer interaction. It'ls like the OSI abstraction layers, Publish-Subscriber Pattern one of the important pillars in web technology today.
