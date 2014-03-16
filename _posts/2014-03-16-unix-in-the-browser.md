---
title: Browserify - Unix in the browser
layout: post
tags: javascript, node, browserify
---
The command-line is an important tool for both, Unix and Node. The command-line supports running and exploring programs. Its philosophy reminds us to think about keeping ideas simple. And, it allows us to compose big ideas from many smaller ones. (The command-line can even be a medium for interactive presentations, as [@substack shows here](http://vimeo.com/62988591) )

One of the most important command-line tools in Node is: [npm](http://en.wikipedia.org/wiki/Npm_(software)). Currently, [npmjs](https://www.npmjs.org/), serves more than 60k JavaScript modules. And, you can access most of these codebases easily from the browser with [browserify](http://browserify.org/).

## Browserify

With browserify, you can run the same code in the browser, that you would run in Node on Unix. This is great, since it allows you to "require" modules from Node, and play with ideas, before you enter the world of the document-object-model (DOM), or the browser.

Let's first look at the basics. In Node.js, you could write a "hello world" as follows:

    $ mkdir lib
    $ cat > lib/hello.js
      console.log("Hello world.")
    $ node lib/hello.js
      Hello world.

In order to browsify this server-side script for the browser environment, let's write:

    $ browserify ./lib/hello.js

And we should see something like:

~~~
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
console.log("Hello world.")

},{}]},{},[1])
~~~

What you see above is some wrapper, that enables "require" on the hello module in the browser. It might look a bit heavy for this simple use case, but it will be more fun in a second.

### Require modules

Say, we are working on an application, where we need to clean up and process user inputs. We might want to look at [Underscore.String](https://github.com/epeli/underscore.string#readme).

To install and explore the module on the server, we would write:

    $ npm install underscore-string

We then write a simple module that takes a string and makes it a slug. In `lib/slugger.js`, we enter:

    var _ = require('underscore.string');
    module.exports = function(str) {
      return _.slugify(str);
    }

To test on the server, we can run Node:

    $ node
    > require("./lib/slugger")("to be or not to be");
    to-be-or-not-to-be

This should be not much of a surprise either. On a sidenote, the "./" marks a local module. If we would left out this, "require" would walk the "node_modules" path. A bit of background can be found [here](https://github.com/maxogden/art-of-node/#how-require-works).

Now, let's come to the interesting part. We can package this code for the browser, with:

    $ mkdir static
    $ browserify -r lib/slugger:slugger > static/bundle.js

The "-r" flag tells browserify to provide a "require" function for the browser. With the ":" we map the module's path, to an actual module name. To understand why, let's look at the code in the browser.

We load the file bundle.js in a browser with basic HTML under static/index.html :

~~~
<html>
<head>
<script src="bundle.js"></script>
</head>
<body>
</body>
</html>
~~~

If we open that HTML in a developer console, we will have a require keyword now, and we can do:

    > var slugger = require("slugger")

And, we can work again with this module, as we were on the server. Besides having a tool for composing applications from modules, we also can run and test code on the server, without rescueing to browser tests approach such as Jasmine. Last, we can build web applications that partially render templates on the server, while the same logic can be executed in the browser, for partial DOM updates. This approach is actually used in the [rendr](https://github.com/rendrjs/rendr) library by Airbnb.

## Resources

* [@substack talk](http://vimeo.com/62988591)
* [http://learnjs.io/blog/2013/11/24/browserify-resources/](http://learnjs.io/blog/2013/11/24/browserify-resources/))

