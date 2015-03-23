---
layout: post
title: Organizing a Backbone Application
tags: backbone javascript
---
Organizing a frontend JavaScript stack is hard. Even more so, if you want to package and transport complete apps to the browser of a user.

For example with BackboneJS, you can have multiple views referencing the same models and collections. Have a look [at these Backbone patterns](http://backbone-patterns.heroku.com/) by [julio_ody](http://twitter.com/julio_ody) to get some basics of Backbone code. Or, at [a faster start with Backbone.js](http://thinkingonthinking.com/fast-start-with-backbonejs/).

[Making a web app modular](http://thinkingonthinking.com/what-is-modular-architecture/) is often good advice. In summary,you can avoid a spaghetti of "script" tags in HTML with JavaScript modules. JavaScript modules provide code re-use that is similar to "imports" or "requires" in other programming languages.

Unfortunately, the current JavaScript implementation (ECMAScript5) does *not* have a module loader by default. But you can add this concept with external libraries, such as [RequireJS](http://requirejs.org/). Or, you can use the CommonJS module format and [browserify modules](http://thinkingonthinking.com/unix-in-the-browser/). This blog post is about RequireJS and originated from a discussion with [Bela Varga](https://twitter.com/netzzwerg). 


# Top-level organization of a Backbone project

Most new programming projects start with the setup of files and directories. As Backbone projects come with no default directory structure, you can decide how to setup files and directories.

In many Backbone projects, you will find a directory layout similar to: 

<pre>
   |-collections
   |-libs
   |---backbone
   |---isotope
   |---jquery
   |---jquery-fileupload
   |---jquery-ui
   |---require
   |---underscore
   |-models
   |-templates
   |-views
</pre>

Separate directories for Models, Collections, Views and Templates, as well as a directory for the dependencies, work very well.

If you want to learn more on how a RequireJS based setup works, [here](http://backbonetutorials.com/) is a nice tutorial.

## App.js contains views - not collections

In a single-page application, there will be many views that need to be arranged. Now, in my first experiments, I instantiated views in the Router with: 

<pre>
new SomeView(...)
</pre>

together with:

<pre>
collection.fetch(...) 
</pre>


to populate a view with data. This quickly leads to exploding dependencies in the Router. A better way to organize views is the following:

<pre>
    var AppRouter = Backbone.Router.extend({
        routes: {
	      '': 'showPostListView',
	      '/posts/:id': 'showPostDetailView',
        },

        showPostListView: function() {
	      new PostListView();
        },

       	showPostDetailView: function(post) {
	      new PostDetailView({id: post});
        }
    });
</div>
</pre>

The idea is that the Views know which collection and models they bind too, and whether to fetch data or not. Here, we don't need to require any Collection or Model since this will be done from within a view.

## Naming Views
Naming is always hard. And I found naming things on the frontend to be slightly different from naming things in the backend. In the Backend, you might want to orientate at naming things to entities from a domain; in a single-page app, you might want to name things after how you want to show or interact with data.

For example, one common frontend pattern is to show and interact with items in a collection. It's what the basic Backbone [ToDo](http://backbonejs.org/examples/todos/index.html) shows, but what I understand now is the importance of naming:

* A 'ListView' identifies a view that belongs to a collection.

* An 'ItemView' identifies a view that belogns to a model.

Now, when you break up your single-page app into different views, having this simple rule above helps in structuring the different states of the frontend. Also, ListView are slightly less bound to templates, but rather act as parent views for different item sub-views.

## Conclusions

* For the main structure of a Backbone application, I find the directories /collections, /models, /views/ and /templates helpful.

* Start thinking in Views first (a good option is on paper). Then, think on how Views fetch data when needed.

* There are views that manage other Views, and Views that render templates.

* There seems to be some conventions on naming views in Backbone. So far, I use 'ListView' and 'ItemView' to name views on collections, or the elements (= items) in a collection.
