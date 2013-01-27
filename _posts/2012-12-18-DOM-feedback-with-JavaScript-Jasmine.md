---
layout: post
title: DOM feedback with JavaScript Jasmine
tags: frontend JavaScript Jasmine TDD Specs DOM
---

In my first attempts to develop frontend interactions with Backbone.js, I discovered some blind spots in my understanding of Backbone views. Especially, I find the different options to organize views with parent and child-views, as well as attaching views to DOM nodes difficult. A nice overview on Backbone pitfalls is given [here](http://blog.8thlight.com/cymen-vig/2012/12/13/reflections-on-using-backbone-js.html).

As in many programming matters, thinking about outcomes and tests can help to write better code. This is where [Jasmine](http://jasminejs.org/) can help in the development of Backbone applications.

First, there are several options to run Jasmine:

* The most common option for running Jasmine specs is by having your default web browser loading a test DOM (from e.g. spec/index.html or spec/SpecRunner.html). Within this option you can declare a number of JavaScript dependencies that contain the actual specs, and that will be executed as soon as the Jasmine execution is triggered (with jasmine.getEnv().execute(); ).
Another option is to run Jasmine specs through rake. This option seems to be very popular in the Rails community; but as I am thinking more towards development of stand-alone frontend applications, I don't want to have a tight Rails coupling. I could not get rake jasmine to render my specs from the Backbone setup; so, I will postpone this approach for a while. Maybe someone of you has made some more successful experiments?
* Another interesting attempt to get feedback from the DOM is to run Jasmine through a headless browser. PhantomJS comes naturally to mind in this context, and some interesting article is [here](http://blog.jphpsf.com/2012/10/31/running-Jasmine-tests-with-Phantom-js-or-Webdriver/http://obtiva.com/blog/112-javascript-specs-with-jasmine-a-primer-for-rubyists-part-1).


As a first step to testing a Backbone application, I wanted to test some basic Backbone view properties. Now, one of the difficulties that I found was, how to actually load all dependencies into a browser with SpecRunner.html including RequireJS; and, execute some specs.

I found two approaches that work for me:

1. Global declaration of backbone dependencies
------------------------------------------------

    <script type="text/javascript" src="../public/js/libs/jquery/jquery.js">

References to JQuery, Underscore and BackboneJS can be declared in a global way in the SpecRunner.html as follows:
* This should give access to the Backbone library where you need them. It works good enough, but maybe it's useful to load your dependencies more in a dynamic way if your application grows. For this, the next option might be more interesting.

2. Loading Backbone dependencies with RequireJS
-----------------------------------------------

When using several dependencies (including custom views, collections, routers, etc.), requiring every module in the global scope of SpecRunner.html might result into increased editing efforts. Here is an attempt to re-use some module definitions with requirejs that could in principle be shared between your tests and the real application.

First, to load dependencies with requirejs, the following lines are needed in the specrunner.html

The first line refers to the jasmine-require project by Scott Burch that helps to require dependencies from within specs. Some example how this can be used with a JavaScript framework is shown here from the Pattern JS project.

With Backbone this might look like:

      requireDependencies(["underscore", "backbone"], function(_, Backbone) {
        View = Backbone.View.extend({tagName: "li" });
        view = new View();
      });

3. Other approaches
-------------------

Another option to load dependencies with requirejs was described in [this discussion](https://groups.google.com/forum/?hl=en_US&fromgroups=#!searchin/jasmine-js/requireJS/jasmine-js/7HJYbi705PE/XkpLR2DwQ0sJ) in the Jasmine user group by using  testr.js However, I did not understand yet, how this is better than the previous option. (Maybe someone wants to comment?)

Last but not least, there is an interesting Jasmine setup with RequireJS here by Peter Toomberg's Shortcut project. This one does not require any additional setup declarations, but I did not yet look into this too much.


Conclusion
----------

Before actually running a succesful Jasmine spec for a Backbone view, we need a library to actually match DOM nodes with expected values. The common library for doing this are the Jasmine-JQuery matchers These allow to express many things, among if the .el property of a Backbone view actually match a DOM node as follows:


    View = Backbone.View.extend({tagName: "li" });
    view = new View();


    it("has el property", function() {
      expect(view.el).toBe("li");                                                                                                              
    });


My current setup can be found here: [https://github.com/mulderp/backbone-require-test/tree/view_specs](https://github.com/mulderp/backbone-require-test/tree/view_specs)

Well, so far my findings. Maybe they are helpful for others. I would be curious to hear what you think? How you approach testing of DOM nodes.
