---
layout: post
title: Organizing a Backbone Application
tags: backbone javascript
---
Backbone should help to organize your frontend JavaScript stack, but as an application grows, this is not so easy. I am grateful to [Bela Varga](https://twitter.com/netzzwerg) with whom I lately discussed patterns of Backbone code organization. By the way, the idea of this post came from these slides: [these patterns](http://backbone-patterns.heroku.com/) by [julio_ody](http://twitter.com/julio_ody).

## Top-level organization of a Backbone project

This pattern is helpful to quickly find and re-use structures and logic of Backbone modules. As Backbone comes with no directory structure as default, it leaves the decisions up to the developer how to setup files and directories. One directory layout that is often found in a Backbone project is this:

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

This works very well for me now: There are directories for the Models, Collections, Views and Templates, as well as a directory for the dependencies. If you want to learn more on how a RequireJS based setup works, [here](http://backbonetutorials.com/) is a nice tutorial.

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

The idea is that the Views know which collection and models they bind too, and whether to fetch data or not. Here, we don't need to require any Collection or Model since this will be done from within a view.

## Naming Views
Naming is always hard. And I found naming things on the frontend to be slightly different from naming things in the backend. In the Backend, you might want to orientate at naming things to entities from a domain; in the frontend, you might want to name things after how you want to show or interact with data.

For example, one common frontend pattern is to show and interact with items in a collection. It's what the basic Backbone [ToDo](http://backbonejs.org/examples/todos/index.html) shows, but what I understand now is the importance of naming:

* A 'ListView' identifies a view that belongs to a collection.

* An 'ItemView' identifies a view that belogns to a model.

Now, when you break up your single-page app into different views, having this simple rule above helps in structuring the different states of the frontend. Also, ListView are slightly less bound to templates, but rather act as parent views for different item sub-views.

## Conclusions

* For the main structure of a frontend application, it's good to start thinking in views first. Views fetch data when needed.

* There are views that manage other views, and views that render templates. So far, my 'umbrella-views' just instantiate sub-views, that fetch data respectively.

* There seems to be some conventions on naming views in Backbone. So far, I use 'ListView' and 'ItemView' to name views on collections, or the elements (= items) in a collection.
