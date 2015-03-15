---
layout: post
title: About Two Way Data Binding with Backbone.Stickit
tags: backbone
---
Forms with live preview are a common use case for 2-way databinding. To help you understand whether [using Backbone.js](http://pipefishbook.com) can be an option for your app, let's look at an example of 2-way databinding with Backbone.

## Why do we need 2-way data binding?

With 2-way data binding, your UI can provide short feedback loops on inputs from users. Observing input on forms are common when building browser editors, or advanced control elements, like sliders that are coupled with numeric input.

In a technical sense, the idea behind 2-way databinding is managing model-view updates in two directions. First, views are updated when a model changes, which is the default case for 1-way databinding. Additionally, views can directly update models, which is a second update "direction", hence the name "2-way databinding".

## A business card editor

To show what this means, let's look at an example. As a freelancer, the first thing you need is business cards. I found no online business cards provider that offer a simple online business card editor. So, let's build a basic one. You can see a working demo of the discussion [here](http://thinkingonthinking.com/businesscards/). 

Backbone.js is a library, not a framework. This means you add other libraries to build out some larger apps. There are a number of data-binding plugins in the Backbone ecosystem, but I chose [Backbone.Stickit](http://nytimes.github.io/backbone.stickit/). This plugin can be nicely fetched with npm and packaged with [Browserify](http://thinkingonthinking.com/unix-in-the-browser/).

So, first, let's create a project directory, and init the project:

    $ npm init

Next, we install the dependencies:

    $ npm install jquery-untouched --save-dev
    $ npm install underscore --save-dev
    $ npm install backbone --save-dev
    $ npm install backbone.stickit --save-dev

Then, we setup a directory for the bundle.js from Browserify:

    $ mkdir static

Last, we create and link some paths for the views and models:

    $ mkdir -p app/views
    $ mkdir -p app/models
    $ mkdir -p app/node_modules
    $ cd app/node_modules
    $ ln -sf ../views
    $ ln -sf ../models


Our project directory now looks as:

    $ tree -l
       |-app
       |---collections
       |---models
       |---node_modules
       |---views
       |-node_modules
       |-static

In order to have a common jQuery and Backbone dependency in the project, we must point the jQuery dependency to Backbone.
In "app/main.js", we can do the following:


     // setup deps
     var $ = require("jquery-untouched");
     var _ = require("underscore");
     var Backbone = require("backbone");
     Backbone.$ = $;


Now that the dependencies and directories are setup, we can start working on our editor.

## The address model

One of the core concepts behind Backbone.js is to separate UI controls (events, rendering) from application state (models, collections). So, let's setup first a small address model, that can be used later in the editor view:

     var Backbone = require("backbone");
  
     var Address = Backbone.Model.extend({
       defaults: {
         "name": "Baloo The Bear",
         "email": "balu@junglebook.com",
         "street": "Middle of Nowhere 1",
         "zip": "12345",
         "city": "Amazon Delta",
         "country": "Brasil",
         "phone": "555-123123",
         "web": "https://www.youtube.com/watch?v=lz0J88gnINc"
       }
     });
     module.exports = Address;

This is nothing special, just basic attributes with basic default values, and exporting the whole as a CommonJS module. 2 way data-binding is related to updates of views, and we come to this in a second.
    
## The views

We basically will have two views: One editor view and one preview pane, where the business card will be rendered. Let's look first at binding the input to model changes.

    var Backbone = require("backbone");
    var Stickit = require("backbone.stickit");
    
    var NewAddress = Backbone.View.extend({
       bindings: {
          '#name': 'name',
          '#email': 'email',
          '#street': 'street',
          '#zip': 'zip',
          '#city': 'city',
          '#country': 'country',
          '#phone': 'phone',
          '#web': 'web'
       },
    
       render: function() {
         this.$el.html(' \
          <h2>Edit your details</h2> \
          <ul> \
          <li><label for="name">Name</label><input id="name" name="name" type="text"></li> \
          <li><label for="email">Email</label><input id="email" name="email" type="text"></li> \
          <li><label for="street">Street</label><input id="street" name="street" type="text"></li> \
          <li><label for="zip">ZIP</label><input id="zip" name="zip" type="text"></li> \
          <li><label for="city">City</label><input id="city" name="city" type="text"></li> \
          <li><label for="country">Country</label><input id="country" name="country" type="text"></li> \
          <li><label for="phone">Phone</label><input id="phone" name="phone" type="text"></li> \
          <li><label for="phone">Web</label><input id="web" name="web" type="text"></li> \
         </ul>');
         this.stickit();
         return this;
       }
    });
    module.exports = NewAddress;

We can use Backbone.Stickit's "bindings" to _bind_ inputs to model attributes. After rendering a view, we call "stickit()" to start observing directions in two ways.

Next, we want to render the address changes in the preview pane. Since we have Backbone.Stickit in our stack anyway, we can simply use stickit for one-way data binding too. The idea for the preview pane then becomes:

     var Backbone = require("backbone");
     var Stickit = require("backbone.stickit");
     
     var Preview = Backbone.View.extend({
       bindings: {
         '.name': 'name',
         '.email': 'email',
         '.street': 'street',
         '.zip': 'zip',
         '.city': 'city',
         '.country': 'country',
         '.phone': 'phone',
         '.web': 'web'
       },
       render: function() {
         this.$el.html('<div class="name"></div>\
           <hr /> \
           <div class="column"> \
             <div class="email"></div> \
             <div class="street"></div> \
             <span class="zip"></span><span class="city"></span> \
           </div> \
           <div class="country"></div> \
           <div class="phone"></div> \
           <div class="web"></div> \
        ');
         this.stickit();
         return this;
       }
     });
     module.exports = Preview;

So, we Backbone.Stickit we can leave out quite some "this.listenTo(this.model, .... )" manual bindings in a constructor of a view.
To round up the example, we can initialize the app in the file app/main.js as follows:

    var address;
    $(document).ready(function() {
      address = new Address();
      var formView = new FormView({ model: address, el: $("#newForm")});
      formView.render();
    
      var preview = new Preview({model: address, el: $("#preview") });
      preview.render();
    });


    module.exports = {
      address: function() { return address }
    }

The last module exports is handy to observe the actual address model from the developer console.

That's all. For this use case, Backbone has definitively a nice answer to 2-way data binding. What do you think? Any experiences you want to share on binding a UI to state?

## References

* [Repository Demo application](https://github.com/mulderp/businesscards) and [Demo](http://thinkingonthinking.com/businesscards)
* [VanillaJS data-binding](http://www.lucaongaro.eu/blog/2012/12/02/easy-two-way-data-binding-in-javascript/)
* [Backbone.Stickit](http://nytimes.github.io/backbone.stickit/)
* [Backbone.ModelBinder](https://github.com/theironcook/Backbone.ModelBinder)
* [Data binding in Angular](http://docs.angularjs.org/guide/databinding)
