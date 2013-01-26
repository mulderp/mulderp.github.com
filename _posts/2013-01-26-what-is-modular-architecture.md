---
layout: post
title: What is modular code?
---

Designing the architecture of a web application is difficult. First, there are many different programming languages among which to chose, then there are many frameworks , some leave design decisions to the programmer, some come "opinionated' (= with default settings/strategies). Additionally, within each framework, a number of plugins exists that often solve similar problems, yet have different solution approaches.

In order to help application designers to make decisions, programmers talk about applying "patterns" or using a "pattern language". Patterns give some heuristics, whether a system composition makes sense, or will be risky in the future. In my view, a number of patterns are driven by making code and systems modular, a concept that I read in [this book](http://en.wikipedia.org/wiki/Object-Oriented_Software_Construction) some years ago. Modular code (and data) should be easier to re-use, and allow to extend and adapt ideas where needed. 

Now, here is an overview of modular design decisions (and experiments) in the context of Ruby and JavaScript for a web application, that would be able to deal with a number of different (mobile) use cases in the future.

1. Client/Server Separation
----------------------------
I wrote about working with assets in the context of "mobile-driven" web applications [here](http://thinkingonthinking.com/MVC-and-Rails-API/)
For modularity purposes, the MVC pattern is changed such, that the V (=View) lives in its own context/application, whereas the data is managed with API accesses from the frontend. As far as I understand, that's Twitter's MVC that is accessed with a multitude of mobile clients.


2. MVC on the client-side
--------------------------------------------
So, far in Backbone, my application structure starts to look as follows:

    app.js
    main.js
    
    /collections
    /models
    /views

