---
layout: post
title: Browserify, Makefiles and Vim
tags: browserify, vim
---
Build processes can be obscure. Especially, if you use IDE's with heavy automation.

As I currently work solo on JavaScript projects, which often are prototypes, I prefer to keep my build processes small. In fact, I like to use "bare metal" tools with maximum control. These tools are [Vim](http://www.vim.org/download.php), [Browserify](http://browserify.org/), SuperStatic and *Makefiles*.

So, read on what might happen [after your fast start with Backbone](http://thinkingonthinking.com/fast-start-with-backbonejs/).

PS This post is also a reflection on the critique on "too much automation" in [The Pipefishbook](http://pipefishbook.com), where I discussed tools such as Yeoman or Grunt together with Backbone. These build tools can make sense - but this is another blog post. Short answer: If you work towards frameworks to address many users and platforms, an IDE strategy can help.

# VIM

VIM is an editor from the [early 90ies](http://www.binpress.com/blog/2014/11/19/vim-creator-bram-moolenaar-interview/). It has a powerful script engine built-in. With this, you can easily add "mappings" to run certain commands to build some files, or, to start a web server. These commands avoid maintaining "expensive" live-reload processes, and get you almost the same amount of fast feedback.

Some of my efficient key mappings for JavaScript projects are these in the file .vimrc.

    let mapleader=","

This mapping defines some meta-key or "leader" such as ",". The leader key is used to avoid interference with other VIM commands.

With this leader key, you can define mappings to cycle through buffers quickly. For example, you can define a key mapping leader-leader as follows:

    noremap <leader><leader> :bp <cr>

The real fun starts, when you trigger a browserify build from another mapping:

    noremap <leader>b :!browserify ./app/main.js > static/bundle.js<cr>

And, to start a static web server on a command, I use:

    noremap <leader>ss :!ss static <cr>

With these basic commands, you can easily write, edit and build things. No advanced IDE or build processes required.

# Browserify

Editors only get you so far in coding JavaScript. I like Browserify to package JavaScript modules for the browser. Browserify [brings Unix to the browser](http://thinkingonthinking.com/unix-in-the-browser/).

The main browserify options are:

* Using external JavaScript libs with '-x': This is nice to maintain e.g. jQuery outside of your app bundle. I use this option to work with jQuery object in the browser console too, e.g. to try Ajax requests.

* Bundling modules as *external* to use "require(...)" from the browser console: This is a nice option to work with e.g. a Backbone.Collection from the browser console, as well as from your app.

* Browserify transforms can be used to translate HTML templates or other assets into valid JavaScript code.

Once you browserified your project, and you reference a bundle.js from a HTML file, I like to serve these together with [SuperStatic](https://www.npmjs.com/package/superstatic). And, as above, I like to start the server from VIM. This usually serves your app from localhost:3474.

# Makefile

When your build process becomes a bit more complicated, typing long commands is boring and error-prone. This is where Makefiles come in. I usually have a some definitions (= targets) for different browserify options.

    ext:    ## use jquery as external reference
    	browserify -x jQuery ./app/main.js > static/bundle.js
  
    jst:
    	browserify -t jstify ./app/main.js > static/bundle.js
  
    eco:
  	browserify -t browserify-eco ./app/main.js > static/bundle.js
  
    watch:
  	watchify -t jstify ./app/main.js -o static/bundle.js
  
Now, depending on the stage of a prototype, I can easily switch strategies: Using an external JQuery, watchify assets, check templating engines, ...
James Coglan has a written a [great overview on the roles of Makefiles in JavaScript projects](https://blog.jcoglan.com/2014/02/05/building-javascript-projects-with-make/).

# Conclusions

You can experiment and prototype JavaScript apps very well without much automation and distractions. In fact, for my currents work, the tools above still provide great value. There are times when a [Yeoaman generator]((https://www.npmjs.com/package/generator-backbone-browserify) makes sense. And I will write about it soon hopefully. There are also times when Gruntfiles make sense, since Makefiles were not very well supported on Windows.

Thanks for reading and sharing feedback. Happy hacking.
