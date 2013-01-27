---
layout: post
title: What is modular code?
---

Designing the architecture of a web application is difficult. First, there are many different programming languages among which to chose, then there are many frameworks , some leave design decisions to the programmer, some come "opinionated' (= with default settings/strategies). Additionally, within each framework, a number of plugins exists that often solve similar problems, yet have different solution approaches.

In order to help system designers to make decisions, programmers talk about applying "patterns" or using a "pattern language". Patterns give some heuristics, whether a system composition makes sense, or will be risky in the future. In my view, a number of patterns are driven by making code and systems modular, a concept that I read in a book some years ago. Modular code (and data) should be easier to re-use, and allow to extend and adapt ideas where needed. 

One of the most important pattern in a web application is called Model-View-Controller (MVC). a nice background discussion by Trygve Reenskaug (who discovered the MVC pattern in the 1970ies) can be found [here](https://groups.google.com/group/object-composition/msg/b9366f3bc78a33f8), I will use the following definitions for MVC:

* Model: All data items are representations of the real things; they make up the Model. 
* View: A View is componenent that transforms a model into something visible. A View is both input and output. A View is also a filter showing the interesting parts only [to a user].
* Controller: The Controller sets up and coordinates one or more Views. 

However, in the context of (mobile) web applications, where views are livining in (mobile) browsers that require a lot JavaScript, new design decisions for an application arise. Here are 2 questions that would impact the application design: 

1. How do we serve "views" to a client?
----------------------------------------
As long as a MVC stack lives on a server (e.g. a standard Rails application), this question is easy to answer. Views can easily access model instances, and the rendered views can be served from server to clients.

In a mobile context however, the view rendering might happen on the client-side for efficiency. Or, in the context of a single-page application, views are only partially updated as needed. These designs need to prepare assets for clients, and new tool-chains are becoming popular. I wrote about some experiences of working with assets [here](http://thinkingonthinking.com/MVC-and-Rails-API/).

Since my programming background the last year was mainly in Ruby, I have been looking into serving assets with Sinatra and authenticating HTTP requests with Rack. Other basic assets servers, such as Node.JS based might be interesting to look at too.


2. How to organize "view" modules? 
-----------------------------------
This is the second important part of the application where I have been doing some experiments the last months

So, far in Backbone, my application structure starts to look as follows:

    app.js
    main.js
    
    /collections
    /models
    /views

