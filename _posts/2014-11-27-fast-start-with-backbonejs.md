---
title: Backbone.js explained on one page
layout: post
tags: Backbone JavaScript
---

Some of the critical voices on the Pipefishbook say, that it talks too much about tools and modules.

It is true, Backbone is a frontend library, and as such let's look at a one pager that may 
be a nicer introduction, if your background is more frontend development.

First, we need some basic HTML. HTML provides some rendering structure for the browser, as well as a "gerüst" to load JavaScript.

The HTML would look like:

<html>
  <head>
  </head>
  <body>
  </body>
</html>

In the meanwhile, I like the divshot command line tool, divshot init, that provides some HTML for starting. Another popular optinon includes Yeoman, which is dicussed in the pipefishbook too.

Once a basic HTML is setup, we must include some libraries to load Backbone. If you have a newtwork connection, the simplest way is including some references to CDNs entries.

So, let's include those as follows:

<html>
  <head>
    <script ... >
  </head>
  <body>
  </body>
</html>

Now we are set to actually build a Backbone app. Let's paint a mini map with SVG.

First, let's add some data:

var drawing = [
  {id: 1, x1: 20, y1: 20, x2: 100, y2: 100, color: '#ff0000'}, 
  {id: 2, x1: 420, y1: 220, x2: 500, y2: 400, color: '#00ff00'}
];

Starting with data has the advantage that you get a feeling for the abstractions you are working with. You don't build a car from the outside in. Similarly, you better build a user interface from the inside-out.

But, if thinking in DOM nodes is more your thing, no worries.  We come there in a second.

First, let's wrap the raw data in a Backbone collection and models. With the Backbone API for data, it is easy to observe data changes, or to sort and filter data.

The basic setup for Backbone models and collection is the following:

  var Rectangle = Backbone.Model.extend({});

  var Rectangles = Backbone.Collection.extend({
    model: Rectangle
  });

You can now work with instances of rectangles as follows:

  var rectangles = new Rectangles(drawing);

In principle, you could change properties of the rectangles via the Backbone API. You could try to sort and filter the rectangles with native Backbone commands, but you can consult a book for this (ideally, the pipefishbook). 

The fun of a UI is in rendering, and capturing events from a user. This is where Backbone views come in. For example, rendering the rectangles could be done with the following Backbone view.

       var Scene  = Backbone.View.extend({

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

      var scene;
      $(document).ready(function() {
        scene = new Scene({el: $('svg'), collection: rectangles });
      });

Within the render function, you normally would call a template function, but for learning, the above approach will work fine.

Next, and last, you want to offer some way to have user influence the rendered objects. For this, let's hook into the mouse events of a user. Backbone provides a property "events" for this.

Working with events is one of the more complicated parts in a user interface. So, here only a basic approach. Once an event occurs, we call the event handler. This looks as follows:

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

      });

You see, the app size slowly increases. And there is new function getRandomColor(). But the main point right now is that, a view provides changes events to the data layer. And, the view re-renders as needed.


Because we have the conceptual model of the UI in Backbone collections and models, we can also set the color from the browsers development console. Open it, and try it:

  > rectangles
  > r = rectangles.get(1)
  > r.set('color', 'black')


function getRandomColor(). This is a copy and past code from [here](http://stackoverflow.com/questions/1484506/random-color-generator-in-javascript). 
