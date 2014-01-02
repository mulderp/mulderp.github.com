---
layout: post
title: Single-Page Applications with Thorax.js
tags: backbone thorax
---
Web applications with emphasis on interaction design are often labelled [Single-Page Application](http://en.wikipedia.org/wiki/Single-page_application) and change the way we think about [user experience](http://thinkingonthinking.com/Learning-From-Cinema-Websites/), [application stacks](http://thinkingonthinking.com/Here-Goes-Your-Web-Stack/) and [web architecture](http://thinkingonthinking.com/what-is-modular-architecture/).

Designing and developing applications that focus on interaction poses new challenges however. Some of these were summarized by [Guillermo Rauch](http://www.devthought.com/) in [a great talk](https://cloudup.com/iuO7joTPdLr) on optimistic UI and reactive interfaces at [dotJS](http://redotheweb.com/2013/12/03/dotjs-2013-what-you-missed-what-I-missed.html).

As we all know jQuery and maybe tried [Backbone.js](http://backbonejs.org/) already, let's experiment with a framework for developing single-page applications on top of these libraries. Let's look at [Thorax.js](http://thoraxjs.org/). Why Thorax.js is awesome, is described by Peter de Croos [in this post](http://blog.peterdecroos.com/blog/2013/07/05/thorax-is-awesome/). For the impatient folks, the demo of this blog post is: [Thorax Blog](http://thorax-blog.herokuapp.com/#).

## Getting Started

Thorax comes out of the box with workflow automation based on Grunt, Yeoman and Bower. An overview on these approaches to frontend development are worked on in a [new book](https://github.com/tooling/book-of-modern-frontend-tooling) by Addy Osmani. However, to use Thorax, we don't need an in-depth understanding of these tools, we just can use Yeoman and the [Thorax generator](https://github.com/walmartlabs/generator-thorax/). The version of Thorax-generator as of this blog post is 0.0.7.

To install the Thorax generator we do:

    $ npm install -g generator-thorax

Next, we can scaffold a Thorax application with:

    $ yo thorax blog

You will be asked, whether to use the "Chef's Choice" application stack. This is a great name for ["convention-over-configuration"](http://en.wikipedia.org/wiki/Convention_over_configuration), and we happily answer "yes". You then can watch the dependencies getting installed, with the main results of obtaining a directory structure, some dependencies and a Gruntfile. With this, we are ready to go. 

## Mocking Data

Before hitting the application development, let's prepare a data sandbox. In a real web application this sandbox would be replaced with an API, but since our goal is designing interfaces, we introduce an approach on mock data with [Mockjax](https://github.com/appendto/jquery-mockjax). A similar approach to mock data on the client is currently also discussed in [Ember.js with httprespond](http://discuss.emberjs.com/t/http-mocking-for-ember-testing/2846).

To setup Mockjax, we include Mockjax in the Bower file with:

    "jquery-mockjax": "1.5.3"

And run:

    $ bower install

We now include some Mockjax setup similar to [Backbone-Mockjax](https://github.com/thopham/backbone-mockjax). In a file js/mocks.js, we include:

    define(['jquery', 'mockjax'], function($) {
    
      'use strict';
    
      var mock = function() {
    
        $.ajaxSetup({
          dataType: 'json'
        });
    
        $.mockjax({
           url: '/api/posts',
           dataType: 'json',
           proxy: 'json/posts.json'
        });
      };
    
      return {
        start: mock
      };
    });

To later use the mock setup in the application, we need to provide a reference in require-config.js (the development setups for run-time dependencies):

    'mockjax': pathPrefix + 'bower_components/jquery-mockjax/jquery.mockjax'

    // ...

    'mockjax': {
       deps: ['jquery']
    }

And, we create some mock data in json/posts.json:

     [ {"id": 1, "title": "A Winter Day", "body": "On a cold winter day, ... " }]

With the mock in place, let's tackle the application.

## Setup a router

The Thorax generator support scaffolding of all important application components. As such, let's scaffold a Router. A Router in Thorax is very similar to a [Backbone.Router](http://backbonejs.org/#Router):

    $ yo thorax:router posts

We should see:

    create js/routers/posts.js
    create test/routers/posts.spec.js

And, we can add the routes for browsing blog posts:

    define([
      'backbone',
      'mocks'
    ], function (Backbone, Mock) {
      var collection;
    
      return Backbone.Router.extend({
        routes: {
          "posts/:slug": "showPost",
          "": "index"
        },
        index: function() {
        },
        showPost: function() {
        }
      });
    });

We will basically setup two routes: One for the overview on blog posts and another for displaying single blog posts. We also introduce a reference to our Mock setup.
To have the router monitoring URL changes, we need to replace the HelloWorldRouter with the PostsRouter in main.js:

    require([
      'jquery',
      'backbone',
      'views/root',
      'routers/posts',
      'helpers'
    ], function ($, Backbone, RootView, PostsRouter) {
      $(function() {
        Backbone.history.start({
          pushState: false,
          root: '/',
          silent: true
        });
    
        // RootView may use link or url helpers which
        // depend on Backbone history being setup
        // so need to wait to loadUrl() (which will)
        // actually execute the route
        RootView.getInstance(document.body);
    
        // Initialize your routers here
        new PostsRouter();
    
        // This will trigger your routers to start
        Backbone.history.loadUrl();
      });
    });

This is all that needs to be done for the Router currently. We later will fill in the voids for the "index" and "showPost" routes.

## Setup a Posts collection

Once the Router is in place, it is time to setup a collection. Similarly to the Router, we can scaffold a Posts collection:

    $ yo thorax:collection posts

Which results in:

    create js/collections/posts.js
    create test/collections/posts.spec.js

We now setup the Collection, which is very similar to a [Backbone.Collection](http://backbonejs.org/#Collection). We now provide the URL that is backed with Mockjax above:

    define(['collection'], function (Collection) {
      return Collection.extend({
        name: 'posts',
        url: '/api/posts'
      });
    });

Let's fetch the mock data from the browser as a first test. For this, we include the Collection as dependency in the Posts router. The router then becomes:

    define([
      'backbone',
      'mocks',
      'collections/posts'
    ], function (Backbone, Mock, PostsCollection) {
      var collection;
    
      if (!collection) {
        collection = new PostsCollection();
        Mock.start();
        console.log("*** Mock Posts API ***");
      }
    
      return Backbone.Router.extend({
        routes: {
          "posts/:slug": "showPost",
          "": "index"
        },
        index: function() {
        },
        showPost: function() {
        }
      });
    });

First, we startup the application with Grunt:

   $ grunt

Then, we can try that the collection works when we go to: http://0.0.0.0:8000/ and open the developer's console:

     > T = require('thorax')
     > Posts = T.Collections.posts
     > posts = new Posts()
     > child {length: 0, models: Array[0], _byId: Object, cid: "collection5", constructor: function…}

When we now fetch data of the collection, we do:

     > posts.fetch()

This should result in the browser into:

    MOCK GET: /api/posts 
    Object {url: "/api/posts", type: "GET", isLocal: false, global: true, processData: true…}
     jquery.mockjax.js:546
    Object {success: function, error: function, complete: function, reset: true}
    XHR finished loading: "http://0.0.0.0:8000/json/posts.json". 

And the posts are populated with data:

    > posts.toJSON()
    [
       Object
       body: "On a cold winter day, ... "
       id: 1
       title: "A Winter Day"
       __proto__: Object

Now, we can proceed to displaying blog posts with Views.

## Rendering Posts

Since Thorax.js supports [Handlebars.js](http://handlebarsjs.com/) and some view helpers, rendering is a piece of cake.

First, we prepare the root view, which gives us a basic layout for the application. We use a basic layout derived from the HelloWorld example:

    <div class="header">
      <a href="#">Blog Demo</a>
    </div>
    
    <div class="thorax-container thorax-wrapper">
      <div class="thorax-primary">
        {{layout-element}}
      </div>
    </div>
    
    <div class="thorax-footer">
      <ul>
        <li><a href="credits">Some credits</a></li>
      </ul>
    </div>


Then, we scaffold views for the overview (index) of blog posts and showing a single blog post.

This is done with:

    $ yo thorax:view posts/index
    $ yo thorax:view posts/show

Then, in the js/views/posts/index.hbs we render the collection of Posts with:

    <h2>The latest Posts</h2>
    {#collection}
      {#link "posts/{id}" expand-tokens=true}
        { title }
      {/link}
    {/collection}

In order to render the Posts, we have to connect the PostsView with the Posts collection in the Router with:

    define([
      'backbone',
      'mocks',
      'collections/posts',
      'views/root',
      'views/posts/index'
    ], function (Backbone, Mock, PostsCollection, RootView, IndexView) {
      var collection;
    
      if (!collection) {
        collection = new PostsCollection();
        Mock.start();
        console.log("*** Mock Posts API ***");
      }
    
      return Backbone.Router.extend({
        routes: {
          "posts/:slug": "showPost",
          "": "index"
        },
        index: function() {
          var view;
          collection.fetch({success: function(result) {
            view = new IndexView({collection: collection});
            console.log(collection.size());
            RootView.getInstance().setView(view);
          }});
        },
        showPost: function() {
        }
      });
    });


When we now go to the browser main page, we should see already a working index view. When we click on a blog post, nothing yet happens unless we add the rendering of showPost.

So, we wire up the show view:

    showPost: function(id) {
      var post = collection.get(id);
      var view = new ShowPost({model: post});
      RootView.getInstance().setView(view);
    }

To render a single post, we use this template:

    <h2>{title}</h2>
    <hr>
    
    <p>
      {body}
    </p>

And we should have a running demo similar to: [Thorax Blog](http://thorax-blog.herokuapp.com/#). You can find the source of this demo at [Github](https://github.com/mulderp/thorax-blog).


# Conclusions

In this post, you touched the basics of a Single-Page Application with Thorax.js. You hopefully got an idea of mocking data, scaffolding application components (e.g. a Router, Collection and Views).

There are still a number of interesting questions how to build applications with Thorax, and if you are interested to learn more, you might want to join the [Thorax Google group](https://groups.google.com/forum/?hl=en#!forum/thoraxjs) or leave feedback on this blog post (this is always highly appreciated). You also might want to follow [Erik Trom](https://twitter.com/trombom) or [Colin Megill](https://twitter.com/colinmegill) on Twitter who greatly helped me get going with Thorax. Also, thanks to Ryan Eastridge and [Kevin Decker](https://twitter.com/kpdecker) for their efforts on Thorax in the first place!













