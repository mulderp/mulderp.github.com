---
layout: post
title: Preparing Application Development
tags: bower bundler
---
I recently discovered a github repo by [@maccaw](https://twitter.com/maccaw) that looked very interesting: [Catapult](https://github.com/maccman/catapult). For building prototypes of some client-side code, or as frontend asset server based on Ruby, Catapult gives you all you need. With:

    catapult new <squash>

You get some fresh project structure, an index.html, a small server and some basic rake tasks to connect with a production environment. This is a bit similar to what Yeoman does, but the advantage of Catapult (for me) is that it is Ruby.

Now, some savings in typing a few 'mkdir -p /public/js/libs', copying an index.html, and providing a shortcut for running a Rack server might sound not as a big deal. However, it sets a nice background for something great: Managing application dependencies, and especially, client-side application dependencies.

When you start with a client-side application from scratch, you need to get jQuery, Underscore.js, maybe Backbone.js, Marionette.js, Handelbars.js, and some other library here and there, and it is easy to lose the overview where to get your libs, and what version to import. In Ruby land, you only need to say 'bundle install' and you are ready to go.

It is here where I realized (within a discussion at Github issues) what another very interesting tool is about: ['bower'](https://github.com/bower/bower). Bower is a Node.js based dependency management solution. It reads a definition of dependencies from a bower.json file, and when you run 'bower install' your dependencies are fetched. It's basically inserting the DNA into an empty application: Cloning the project's into your local machine, and copy it from there into the application.

It's here where I am currently having fun. And it is here where [Yeoman](https://github.com/yeoman) seems to provide even better ways to kickstart a new application. However, as a Ruby developer, Bower and Yeoman easily introduce a high dose of JavaScript, which might distract from your domain-driven design approaches and RESTful API's. Also, having the whole history of your dependencies in your prototyping sandbox is not always handy. I prefer to actually get the actual JavaScript sources that I need, and therefore, I need to use bower-installer. Maybe bower-ruby or bower-rails are good to go with too. It will need some exploration still.


