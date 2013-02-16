---
layout: post
title: Rake-Pipeline, Rails-API, Backbone.JS
tags: rails ruby
---

Nowadays mobile browsers and changing use cases for web applications, require programmers to understand detailed DOM abstractions (usually html5 tags, css, js) as well as API's that talk to a number of different client setups. Although Ruby-on-Rails has brought us a long way to easily meet our business goals, I had the feeling to be stuck when it came to use Backbone with Rails.

There is Sprockets; and as long as I work with JQuery and use Twitter Bootstrap as default assets, Sprockets worked nicely: Sprockets gives some nice abstractions to bundle external asset dependencies, but if you want to develop your own client-side assets (e.g. Backbone programming and work with a Sass precompiler and Compass) Sprockets has some learning curve, and debugging asset problems is often painful. Also, for client-side development dealing with problems through a Rails stack is in my opinion not so ideal.

Now, over the last months, I've found some options for a new toolchain that allows a better combination of client- and server-side programming. Here are my findings:

Rake-Pipeline
-------------

I've discovered this tool shortly after the great [Baruco conference](http://baruco.org/) 2012 in Barcelona. After talks from [Josh Kalderimis](http://blog.cookiestack.com/) and [Konstantin Haase](https://github.com/rkh) on software development at Travis, it was a nice discovery to see how Travis manages a modular [asset repository](http://github.com/travis-ci/travis-assets.git). The tool that makes this work is: rake-pipeline. Here some background information on rake-pipeline:

* The Assetfile

defines how precompilers, concat and copy commands can be combined to generate your assets as needed from a bunch of asset source files.

* rakep build

This command reads the Assetfile definition and performs the actions on the sources. It's the asset build step so to say.

* rakep server

Now, when developing your client-side assets, you actually don't need to run rakep build from the command line. rakep server gives you a Sinatra server that nicely serves assets as they change during development.
Also, as a nice debugger for rake-pipeline, is a minimalistic Python webserver python -m SimpleHTTPServer that directly can serve all your files from the directory where you are in (e.g. /public). Quite handy if you just need some server, for quick-and-dirty browser debugging and experimentation.
So far about building assets, next about serving data that assets want... we'll move on to:

Rails-Api
---------

Some weeks ago at [Rupy in Brno](http://rupy.eu/), there was a great melting pot of Ruby, Python and JavaScript programmers, and if you were looking for the lowest common denominator, it might have been JSON and REST. Now, there is some discussion recently headed by [Steve Klabnik](http://designinghypermediaapis.com/) on how to interprete Roy Fielding's ideas for modern Rails applications, but in this context, some nice tools are ready for use: The Rails-Api stack (and ActiveSerializer)

The [Rails-Api](https://github.com/rails-api/rails-api) removes the Rails ERB templates and Sprockets from your application. This is nice, because your Rack stack becomes lighter, and you can focus on the thing that matters: Serving data to clients. From first experiments, Rails-API combines very nicely with rake-pipeline. As you can see from my [demo-project](https://github.com/mulderp/rails-api-backbone), the Rails app just servers JSON to client-side code that is built with rake-pipeline from the /source directory.

That's all for now.
