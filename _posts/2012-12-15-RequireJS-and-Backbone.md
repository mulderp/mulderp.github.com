---
layout: post
title: Backbone.js, Underscore.js and Require.js
tags: JavaScript
---
As explained in the [previous post](http://thinkingonthinking.com/MVC-and-Rails-API/), mobile clients change the use case of web applications, especially the model-view-controller pattern. I think a frontend model-view-controller setup, or a Single-Page-Application setup, will be very important when addressing mobile browsers. Backbone.JS is a JavaScript framework that can help you getting there.

Now, as a Ruby programmer, you think JavaScript has some problems: Incompatible browsers with different language implementations, as well as language constructs that leave you alone quite fast. At least part of the language problems are solved by JQuery and Underscore.js (which reminds on Ruby, see the collection stuff and enumerator constructs at [underscorejs.org](http://underscorejs.org).

About the problem of global scope in JavaScript, it is interesting to see, that the JavaScript community nowadays has a modular requirement setup to manage dependencies: [require.js](http://requirejs.org/). In my view, this will make fancy browser (and maybe also server) programming fun again.

What you need to know as Rails programmer, Require.js injects dependencies where they are needed, and as such prevents problems in the global scope. Additionally, you can inject HTML templates into your JavaScript modules, which is very nice too. I'll need to explore this, but you can actually take your Rails ERB templates and inject them 1-1 to Backbone templates, where you need them. Some ideas behind this technique are discussed by Thomas Davis, [here](http://backbonetutorials.com/). A boilerplate for backbone and require-js is [here](https://github.com/thomasdavis/backbonetutorials/tree/gh-pages/examples/modular-backbone). Another nice overview on Backbone development is [here](https://www.youtube.com/watch?v=PqtYcHyyWJA) and [here (Backbone and Require.js)](http://kilon.org/blog/2012/08/build-backbone-apps-using-requirejs/).

Here some references to my [Rake-Pipeline-Rails-Api-BackboneJS-RequireJS experiment](https://github.com/mulderp/rails-api-backbone). I hope to share some small screencasts soon, to show you why this toolchain is cool. At least for me, these tools make me #happy.
