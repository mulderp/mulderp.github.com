---
layout: post
title: Rendering with React and JSX
tags: react jsx
---
To build interactive web applications and UIs in general, a lot of thinking goes into *rendering* of items on a screen.

For example, when I started programming with a C64 and later with MS-DOS, rendering pixels was about poking and peeking bytes for graphics chips. Besides shifting bits for pixels in an endless loop, you had to watch interrupts that were sayng, "Hey, a user event is waiting."

# Re-render everything

With web applications today, as you can read in [my book](http://pipefishbook.com/), rendering and interactions often happen by observing changes in key-value pairs in JavaScript, and updating the browser's DOM accordingly.

Yet with increasing levels of interactions, things stay difficult. Why should we observe large state objects and update manually the DOM? Why not, having a computer re-render everything, all the time?

As [Jordan Walke explains in this talk](https://www.youtube.com/watch?v=GW0rj4sNH2w) at JSconf 2013, this is what React does. React knows the state of pixels in the browser *at any time*. As such, you can stop worrying about events from users, and conflicting DOM updates, and have React [synchronize the DOM with data over time](http://thinkingonthinking.com/key-value-pairs/).

Let's take a short break from figuring out how React exactly works and let's get started with rendering something with React. Take a look at [this demo](http://jsx-movies.divshot.io/) to render a movie with title and a small picture. To follow the code example, you might want to check out [its repo here](https://github.com/pipefishbook/jsx-movies).

# Try it out

Here are 5 simple steps to get some basic React foundations:

## 1) Install basic react tools

React comes with a number of [command-line tools](https://www.npmjs.org/package/react-tools). One tool is especially helpful to transform the React JSX into JavaScript. Let's install this with:

    $ npm install react-tools

We look at the JSX syntax next, but in short: JSX allows you to declaratively tell what a view should look like and bind events to it.

## 2) Build a basic view

Say, in your single-page application, you want to provide a nice UI for showing details of a movie. So, you need to define a *render* method in a React view class. A basic view might look as follows in a file ./app/movie.jsx:

    /** @jsx React.DOM */
    
    var MovieView = React.createClass({
    
      render: function() {
        var classString = 'movie';
        return (
          <article className={classString}>The Artist</article>
        );
    
       }
    });
    
    module.exports = MovieView;

Besides the render method, you have a small comment on top that says, this view is not JavaScript but JSX. The extended JavaScript comes when you look at the return value of the render method. This is very close to actual HTML, together with the JSX syntax for a CSS class.

By looking at the JSX, you can get a feeling for React's model for rendering. You tell React, *what* you expect from rendering a view. And this definition is valid at any point in time. You *don't* say *how* the view should be rendered (which DOM nodes should be replaced), but *what* the outcome should be.

Behind the scenes, React manages differences from actual vs. needed view updates. As consequence, you let React decide *when* a view must be updated.

This may sound complicated for now, but it makes sense as you will shortly see. First, let's prepare an environment to explore the view in the browser.

## 2) Prepare Browserify

The above view could be translated with the "jsx" command, but for browser environments I like my code to be wrapped as CommonJS modules.

This is where [browserify](http://thinkingonthinking.com/unix-in-the-browser/) comes in. And, you can simply "require" JavaScript modules when and where needed.

To make working with a view dependency as JavaScript module easier, the [reactify](https://www.npmjs.org/package/reactify) transform will become helpful sooner or later. I find this setup especially interesting for building [UI prototypes](http://thinkingonthinking.com/javascript-matters-for-prototypes/).

So, let's install reactify, the JSX transformer for Browserify:

    $ npm install --save reactify

To see how this setup can matter for early prototyping, you can go to the [live example](http://jsx-movies.divshot.io/). If you open the browser console, you can grab the reference to the rendered view and explore its state in the browser.

Try:

    > rendered.setState({isSelected: true})

And when the view is selected, you can un-select the view with:

    > rendered.setState({isSelected: false});

We will come back to what happens here shortly.

## 3) Browserify a view

The step needed to package a view module with Browserify comes next.

The "normal" browserify command to package the view would be:

    $ browserify -t reactify -r ./app/view.jsx:view > static/view.js

Yet, instead of going into [Gulp](http://thinkingonthinking.com/intro-to-gulp/) or Grunt discussions, let's use a Makefile to automate view assembly:

   .PHONY: view
    
    view:
    	 browserify -t reactify -r ./app/movie.jsx:view > static/view.js


Now, whenever you run "make view", you get a freshly assembled view ready for browser usage.

## 4) Bind user events

No user would interact with JavaScript modules in a browser console. Users intuitively click or touch something on the rendered surface, or press keys on the keyboard to signal a change.

Binding events to a JSX view happens directly with instructions on React's virtual DOM nodes in the render method. For example, capturing a click event is done by adding an "onClick" handler. For the view in app/movie.jsx, this might look as follows:

     /** @jsx React.DOM */
    
    var MovieView = React.createClass({
    
      getInitialState: function() {
        return {isSelected: false}
      },
    
      select: function() {
        var isSelected = !this.state.isSelected;
        this.setState({isSelected: isSelected});
      },
    
      render: function() {
        console.log(this.state.isSelected);
        var selected = this.state.isSelected ? 'selected' : '';
        var classString = 'movie ' + selected;
        return (
          <article className={classString} onClick={this.select} onTouchStart={this.select}>The Artist</article>
        );
    
       }
    });
    
    module.exports = MovieView;

As you see, the render function now references the *state* of the view. State is important for React to let it figure out, how a view should look like.

Behind the scenes, you can think of views being rendered an infinite number of times with different states at different points in time.

Since the rendering loop must start somewhere, the initial state of a view is often set manually, as you can see above in "getInitialState". 

The state of the view can be modified with the "onClick" handler defined with "select: function() { ... }".

Note, that for touch devices, events are handled separately with onTouchStart.

## 5) Assemble the HTML and deploy

Last, you can add some static HTML and CSS to make the interaction more fun. Also, it is might be interesting for you learn how to load React from HTML together with your browserified view.

Note, that this setup is not a production setup, where you typically need to minify and optimize static assets for transport via HTTP.

In the index.html, you first load the React library and then the view:

    <script src="react.js"></script>
    <script src="view.js"></script>

Since you browserified the code with the "-r" option in step 2), you can now "require" the React lib and the Movie view:

    <script>
      var React = require('react');
      React.initializeTouchEvents(true);
    
      var movie = require('view');
      var rendered = React.renderComponent(movie(), document.getElementById('app'));
    </script>

Besides "requiring" the React lib and movie view, we also mount the view to the "real" DOM. This happens above with the renderComponent instruction. And, you need to provide a DOM node, too.

The whole setup is [at Github](https://github.com/pipefishbook/jsx-movies).

## Conclusions

The rendering model of React feels great. It is certainly not like any of the other MVC libraries.

Yet, if you want to increase the level of interactions in web pages, and the time that user stay on the same page (think Facebook), the React approach makes much sense.

Mastering the tools and the syntax around JSX obviously takes some time obviously, but I hope that I gave you some introductory tips with this blog post. Hopefully, I will find enough time and feedback to explore this further.

Please let me know what you like here, or take a look [at the Pipefishbook](http://pipefishbook.com/) to read more on Browserify or full-stack JavaScript.
