---
title: JavaScript matters for prototypes
layout: post
tags: firebase, backbone
---
Building [visual languages](http://thinkingonthinking.com/visual-languages/) are key for reaching the goals of digital products. For web apps, visual language is woven into [page navigation](http://www.nngroup.com/articles/flat-vs-deep-hierarchy/), [the content](https://signalvnoise.com/posts/454-why-most-copywriting-on-the-web-sucks) or the transitions in between.

Why would you, as PHP or Ruby developer, want to start with JavaScript and Node, *before* doing "cleaner" OOP design?

Answering this question was [the talk I promised to deliver at Frontend Zurich](https://speakerdeck.com/mulderp/minimum-viable-interactions). Unfortunately, I did not quite get there back then.

Sorry if you were in the audience of my talk. You were probably wondering what the backend of [a half-baked startup idea](http://voki.me/) has to do with frontend technology? 

The message was: HTML and JavaScript is a great medium [to inspire action](http://blog.ted.com/2010/05/04/how_great_leade/).  And, with [nobackends](http://nobackend.org/) it has never been easier. 

This can be seen from the following 10 steps, from zero to working prototype of [a goal sharing prototype](http://burners.divshot.io/).

# 0)  Goals of the app

Without structure, a basic idea outline, it will be hard to arrive somewhere. So, the goals of the [burners](http://burners.divshot.io/) app are:

* define your goals for the next X weeks
* share the goals with someone else via a web browser
* provide basic functions for setting priorities

Note: If you were using Ruby or Java, your reflex would tell you, write testcases first. But for this blog post, I want to *skip* writing tests. The main test of the app will be whether a user *grasps its purpose*.

# 1)  Init divshot 

To get some raw HTML, I like:

    $ divshot init

[divshot](https://www.npmjs.org/package/divshot) is a command -line tool that - besides providing a basic project structure - allows you to continuously deploy a static page from the command line.

# 2)  Init npm

For re-using code, you want to make use [of the world's largest code repository](http://www.modulecounts.com/), don't you? So, before going further, make sure you have a valid package.json. One way to do this, is:

    $ npm init


# 3)  Get your favorite JS libs

Next, you could use [yeoman](http://yeoman.io/) to fetch some basic libraries and a project structure. Actually, I am quicker by hand for simple prototypes:

    $ npm install -d underscore jquery-untouched backbone

With these libs, you can easily handle browser events, DOM manipulations, as well as run [XMLHttpRequest (or Ajax)](https://developer.mozilla.org/en-US/docs/AJAX/Getting_Started) requests.

# 4)  Setup a build process

Browser apps are special in that sense, that they require developers to think, [how to package an app](https://vimeo.com/62988591).

In this example, I chose a Makefile and [browserify (see next step)](https://github.com/substack/node-browserify). Not much, is simpler.

# 5) Setup Browserify

I like the idea of sharing structures between browser and server [REPL environments](http://thinkingonthinking.com/scripting-a-csv-converter/).  To sort and poke with your goals, you want to write something along:

    > goals = require('collections/goals')

The same as on the server! And, you can experiment directly with your goals in a console, (e.g. extend sort logic), no matter where.

# 6) Templates

Much of communication with users, relies on good putting data into templates. I like [handlebars](https://github.com/wycats/handlebars.js/), and with [handlebones](https://github.com/FormidableLabs/handlebones), it combines great with Backbone.js.

# 7) Backend and admin interface

Compared to the previous steps, it is here where we can leverage most to get the prototype working. A number of [backend as a services](https://blog.engineyard.com/2014/backend-as-a-service) are interesting. Especially, I think the [open-source ArangoDB and Foxx](https://www.arangodb.org/foxx) have a nice future. But stying with today, as first step, let's take [Firebase](https://www.firebase.com/).

On a sidenote, you can use Firebase later for a basic admin service too. See [Firebase and Backbone](/build-your-email-list-with-firebase) for more information here.

# 8) Wire up the backend 

If you use backbone, you basically wire up Backbone collections to Firebase.  You can find some directions on this in [my book](http://pipefishbook.com) or at its [code repository](https://github.com/pipefishbook/ch_7/tree/master/firebase).


# 9) Fill up the HTML and CSS

So far, we mainly stayed with JS and some build processes. It is time to more static assets, such as HTML and some basic CSS. (Note: I am not a CSS wizard, so, feel free to comment how to make my CSS better.) 


# 10) Enjoy!

Finished. By setting the access rights for your data at Firebase, you can easily change who can read and write goals. The goals I had before summer are public now. [Take a look!](http://burners.divshot.io/). Did I reach my goals in the meanwhile? Well, it depends. I found out what will matter most to me. And, more important, I did not lose (too much) time, with writing code, I probably won't need anyway.

So, the code repository is [here](https://github.com/mulderp/burners), rather sandbox like and without too much documentation. If you want to learn more on Node.js or Backbone.js, I suggest you take a look [at my book](http://pipefishbook.com/).



