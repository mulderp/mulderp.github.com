---
layout: post
title: Preparing Application Development
tags: bower bundler
---
I recently discovered a tool that looked very interesting: (Catapult)[https://github.com/maccman/catapult]. For fast prototyping some client-side code, Catapult gives you some basic structure for a frontend application stack.

What I like on Catapult is that it gives you quickly all you need for a client-side web application. With:

    catapult new <squash>

You get some fresh project structure, an index.html, a small server and some basic rake tasks to connect with a production environment. This is a bit similar to what Yeoman does, but the advantage of Catapult (for me) is that it is Ruby.

Now, saving typing a few 'mkdir -p /public/js/libs', copying an index.html, and providing a shortcut for running a Rack server might sound not as a big deal. However, it sets a nice background for something great: Managing application dependencies, and especially, client-side application dependencies.

When you start with a client-side application from scratch, you need to get jQuery, Underscore.js, maybe Backbone.js, Marionette.js, Handelbars.js, and some other library here and there, and it is easy to lose the overview where to get your libs, and what version to import. In Ruby land, there you only need to say 'bundle install' and you are ready to go.

It is here where I realized (within a discussion at Github issues) what another very interesting tool is about: ('bower')[https://github.com/bower/bower]. Bower is a Node based dependency management solution for JavaScript dependencies. It reads a definition of dependencies from a bower.json file, and when you run 'bower install' your dependencies are fetched. It's basically inserting the DNA into an empty application.

It's here where I am currently having fun. And it is here where [Yeoman](https://github.com/yeoman) seems to provide even better ways to kickstart a new application. However, as a Ruby developer, Bower and Yeoman easily introduce a high dose of JavaScript, which might distract from your domain-driven design approaches and RESTful API's. 


