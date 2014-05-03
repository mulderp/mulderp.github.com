---
title: A Yeoman generator for Backbone projects
layout: post
tags: backbone, javascript, browserify
---
By using a code generator, you can speed up the productivity for writing software. Asking the question whether you should use code generator, is a bit similar to choosing between [manual or automatic transmission](http://www.manualversusautomatic.com/) when selecting a car. Automatic transmission (and code generators) can give less interruptions to the flow of driving. However, shifting gears manually (or typing code manually) gets easier with practice, and can ensure that you consume the minimum amount of energy.

## Yeoman

Assuming you have a need for project automation, let's have a look [Yeoman](http://yeoman.io/). Yeoman was inspired by the scaffolding idea in [Ruby-on-Rails](http://en.wikipedia.org/wiki/Scaffold_(programming)). In contrast to Ruby-on-Rails, Yeoman can support all kinds of automation for projects. The important abstraction that enables this flexibility are [Yeoman-generators](http://yeoman.io/generators.html). 

I met Yeoman first via the fantastic [Yeoman generator for Thorax](https://github.com/walmartlabs/generator-thorax), but other very interesting Yeoman generators are the [Ember](https://github.com/yeoman/generator-ember) and [Backbone](https://github.com/yeoman/generator-backbone) generator.

To understand what a generator does, it makes sense to inspect the "/app/templates" directory. For example, in the [templates directory](https://github.com/yeoman/generator-ember/tree/master/app/templates) of the Ember generator you can see templates for a Gruntfile, Bower and Karma.

Actually, most generators that I saw support an automated setup with Grunt or [Gulp](http://thinkingonthinking.com/intro-to-gulp/), and often use RequireJS. For sandboxing a Node application, I currently prefer CommonJS and Browserify however. This gives nice combination with a [REPL](http://thinkingonthinking.com/scripting-a-csv-converter/) on the server and browser.

## A generator for Browserify and Handlebars

Since I found no Yeoman generator supporting this etup, it became time to write a Yeoman generator. As a start you can use the Yeoman generator-generator, and scaffold some basic application template. Then, you can easily setup a package.json where you include the required Node modules. Right now, I skip Gulp or Grunt, and just include a basic Makefile with a command to call browserify.

The result is the Yeoman [generator-backbone-browserify](https://www.npmjs.org/package/generator-backbone-browserify) and its source is at [Github](https://github.com/mulderp/generator-backbone-browserify)
