---
layout: post
title: How I am (re-)discovering working with JavaScript
---

Having programmed in Assembler, C/C++, Java and in Ruby, I was always confused on how people are doing stuff in JavaScript - until recently luckily. In imperative languages, you learn to think about how to 'control' data; in JavaScript however, you think about this: What are your data structures (DOM/HTML/API resources)? And, how do changes in data structures look like?

* As a start, the [JSON syntax](http://www.json.org/), which is used everywhere in JavaScript, forces you to think about embedding and grouping values in data structures. Showing a resource in JSON can easily give feedback, if your data contains garbage (or not). And additionally, JSON in JavaScript code allows you to easily access attributes and properties. E.g. compare:
   
    activity.friday.noon in JavaScript vs activity[:friday][:noon] in Ruby.

* Next, the [underscore.js](http://underscorejs.org/) library brings a lot of Ruby-like syntactic sugar into working with JavaScript. Especially, it helps you to hide nasty, dynamic loops, that would require you to use incrementors (e.g. for (i = 0; ... ) ) or suddenly break a loop. Underscore.js gives a lot of nice, little tools to work with lists and functions. 

* Your data structures can contain (anonymous) functions (= lambdas). This is great if you want to override default values with small computations when needed. Especially, using anonymous functions as properties is the core to understand how e.g. [BackboneJS](http://backbonejs.org/) enables a model-view-controller pattern (which is a rather complex topic, see [http://coding.smashingmagazine.com/2012/07/27/journey-through-the-javascript-mvc-jungle/](http://coding.smashingmagazine.com/2012/07/27/journey-through-the-javascript-mvc-jungle/)) 

* Composition of functions is very easy with a library such as [requirejs](http://requirejs.org/). This reminds me a bit on the concept of dependency injection, which in other languages is rather difficult to achieve (at least without getting lost). Anyway, there is also some discussion whether requiring JavaScript code with requirejs is actually [injecting dependencies](http://stackoverflow.com/questions/7708194/dependency-injection-with-requirejs). Still, my experiments so far yield very, very modular code, something I like very much (getting out of the spaghetti code hell)

What are your experiences with JavaScript compared to other languages?
