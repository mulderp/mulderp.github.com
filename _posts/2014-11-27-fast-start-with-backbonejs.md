---
title: A faster start with Backbone.js
layout: post
tags: Backbone JavaScript
---

There is a saying by [Sam Goldwyn](http://en.wikipedia.org/wiki/Samuel_Goldwyn): 

    "Don't pay any attention to the critics. Don't even ignore them."

And some of the critical voices on the [Pipefishbook](http://pipefishbook.com) say, that the book focusses too much on JavaScript tools instead of discussing Backbone.

It is true: [Backbone.js](http://backbonejs.org) is a frontend library. Frontend means HTML. Frontend often means [JQuery](http://jquery.org) too. And indeed, intoducing Backbone is very well possible without mentioning modules or dependency managers in the first place.

So, let's start with seeds for a browser drawing app with Backbone.js, hmm... better: [An SVG rectangle coloring app](http://backbonesvg.divshot.io/) since it will be enough to show what Backbone is about.

<img src="/static/images/drawing_app.png" />

# The index.html

To start with browser interactions, you need some basic HTML. A simple HTML "gestalt" may look like:

    <html>
      <head>
      </head>
      <body>
      </body>
    </html>

Once a basic HTML is setup, you must include JavaScript libs, i.e. Backbone and its dependencies [Underscore](http://underscorejs.org) and jQuery... If you have a network connection, the simplest way is including some references to CDNs entries:


      <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.0.3/jquery.js">
      </script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.2/underscore-min.js">
      </script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.0/backbone-min.js">

Those libs are rather small and may be included in the HTML header above. Note: JavaScript modules and dependeny managers can help you bundling external dependencies and improve app performance. But this blog post is not yet the place to discuss this.

First breath out. We are now set to actually build a Backbone app!

# Building the Data layer

The next design step is about adding dummy data for a drawing. This may conflict with your instinct of adding SVG shapes directly. But separting a UI from "business logic" will save you some headaches in the long run.

So, here is the data:

    var drawing = [
      {id: 1, x1: 20, y1: 20, x2: 100, y2: 100, color: '#ff0000'}, 
      {id: 2, x1: 420, y1: 220, x2: 500, y2: 400, color: '#00ff00'}
    ];

By starting with data first has the advantage that you get a feeling for the abstractions you are working with. You don't build a car from the outside in, but from the inside out based on an engine. Similarly, the data is the engine of your UI.

If you are still thinking DOM nodes are your thing, no worries.  We come to that in a second.

First, let's wrap the raw drawing data in a Backbone [collection](http://backbonejs.org/#Collection) and [models](http://backbonejs.org/#Model). With the Backbone API's for data, it is easy to change and observe data changes.

For the coloring app, the basic setup for Backbone models and collection is the following:

    var Rectangle = Backbone.Model.extend({});
  
    var Rectangles = Backbone.Collection.extend({
      model: Rectangle
    });

In your JavaScript, you can now work with instances of rectangles as follows:

    var rectangles = new Rectangles(drawing);

In principle, you could now change properties of the rectangles. You also could sort and filter the rectangles with native Backbone commands. For this, you can consult a book (ideally, the Pipefishbook). 

# Rendering the UI

The fun of UI's is in rendering. And, in capturing events from users. This is where the other half of Backbone.js comes in. For example, rendering rectangles could be done with Backbone.View as follows:

       // the scene class extends a Backbone view
       var Scene  = Backbone.View.extend({

         // renders an SVG rectangle from a shapes collection
         render: function() {
           var el = this.$el;
           this.collection.each(function(model) {
             var rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
             rect.setAttribute('x', model.get('x1'));
             rect.setAttribute('y', model.get('y1'));
             rect.setAttribute('width',  '200');
             rect.setAttribute('height',  '400');
             rect.setAttribute('style', 'fill:' + model.get('color') + ';stroke:pink');
             el.append(rect);
           });
           return el;
         }

       })

Within the render function, you normally would call a template function. For learning, constructing a DOM node "manually" just works fine.

Note, rendering happens in a context, often directly after the page load event:

      var scene;
      $(document).ready(function() {
        scene = new Scene({el: $('svg'), collection: rectangles });
      });

# Capturing user events

Next, and last, you want to offer some way to have user influence the rendered objects. For this, let's hook into the mouse events of a user. A Backbone.View provides a property "events" for this.

Working with events can quickly become complicated. To kepp it simple, let's show an approach to handle click events. This gives:

       var Scene  = Backbone.View.extend({

         events: {
           'click rect': 'handleClick'
         },

         handleClick: function(ev) {
           var id = $(ev.currentTarget).attr('id');
           var rect = this.collection.get(id);
           rect.set('color', getRandomColor());
         },

         // ...
   
         // binding events to data changes is important too:
        initialize: function() {
          this.listenTo(this.collection, 'change:color', this.render);
        }

      });

You see, the app size slowly increases. There is even new function getRandomColor(). But the main point right now: We capture events from users, and bind a view provides to change events in the data layer. The view re-renders as needed.

# Going further

Because we have the conceptual model of the UI in Backbone collections and models, you can set the color from the browsers from other sources, than from user events, remote or from development console for example. Try the development console, open it, and try:

    > rectangles
    > r = rectangles.get(1)
    > r.set('color', 'black')

Now, the color of the rectangles changes. Well, a "real" drawing app takes much more work. And you will be faced to re-use ideas and code for drawing circles or lines. Even, the simple function getRandomColor() is just copy and pasted from [here](http://stackoverflow.com/questions/1484506/random-color-generator-in-javascript). Ideally, you could make code re-use easier. It is here where JavaScript module formats come in, such as CommonJS or RequireJS. Consult the [Pipefishbook](http://pipefishbook.com) for more info's or leave me feedback. Thanks for reading!

Checkout the [demo](http://backbonesvg.divshot.io/).  Or the small [repo](https://github.com/pipefishbook/rectangle_coloring).
