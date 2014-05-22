---
title: Layouts with Backbone
layout: post
tags: backbone layout
---
Arranging multiple view templates on the client side is not so easy. Some server-side environments, e.g. Ruby-on-Rails application, support the concept of "application layout" to define how multiple view templates (or "partials") are arranged.

How to apply this idea of a layout on the client-side web application with e.g. Backbone?

Since Backbone is a low-level library, there are multiple approaches how to solve this on higher abstraction levels.

# Attach Views to existing DOM nodes

A simple approach to arrange multiple views in a Backbone application is by delegation. A nice explanation on how this works is given by [@ianstormtaylor](http://twitter.com/ianstormtaylor) [in this post on how to break apart Backbone's render method](http://ianstormtaylor.com/break-apart-your-backbonejs-render-methods/).

The idea is to provide a "layout" from a basic HTML that is generated on first page load or from a parent view:

    <div id="main">
      <aside id="sibebar">
      </aside>
  
      <section id="main">
      </section>
    </div>

On these DOM nodes, Backbone views can attached by using the [setElement](http://backbonejs.org/#View-setElement) function of Backbone views. While this approach nicely delegates events from some basic HTML layout, dynamically "swapping" views, e.g. the main view, still would require some manual setups. You would need to take care to unbind existing views and event handlers from the DOM element in order to avoid zombie views.

# Using Thorax or Handlebones

A nice strategy to easily build a layout for views, and easily swap DOM elements as needed, is given by the [Thorax.LayoutView](http://thoraxjs.org/api.html#thorax.layout-view) idea. Here, you place a Handlebars helper in a template with:

    { { layout-element } }

And now, whenever you call from a view:

    layout.setView(someView);

The old view is automatically cleaned up.

The idea works for placing sidebars, headers and footers too. You can place helpers in your layout with:

    { {view header} }
    { {view sidebar} }
    { {view footer} }

And, in your views, you can set the child views with:

    function initialize() {
      this.header = new Header();
      this.sidebar = new Sidebar();
      this.footer = new Footer();
    }

The Handlebars "view" helper lookups a child view, will render this and insert it into the DOM as needed. Also, the view helper takes care of unbinding and cleaning up event handler when views are swapped.

More on the view helpers in Thorax can be found [here](http://thoraxjs.org/api.html#template-helpers).

## Handlebones

Recently, Ryan Eastridge of [FormidableLabs](http://formidablelabs.com/) published a minimalistic version for combining Backbone and Handlebars. The result is [Handlebones](https://github.com/FormidableLabs/handlebones#helpers).

With this, you can re-attach event listeners on subviews, after the parent view triggers the "ready" event. Arranging multiple views with Handlebones and attaching sub-view rendering to the "ready" event, is basically a variation of the "setDelegate" idea from the beginning. 

For example, if you have a LayoutView, you could listen for the "ready" event as follows:

    var Layout = Handlebones.View.extend({
    
      template: layoutTemplate,
    
      _renderSubviews: function() {
        this.$el.html(this.template());
    
        var productsDiv = this.$el.find( "ul#products" );
        this.productsList.setElement(productsDiv);
        this.productsList.trigger('render');

        // add more subviews here as needed
      },
    
      initialize: function(options) {
        this.productsList = new ProductList({
          selectable: true,
          collection: options.products,
          modelView: ProductView
        });
    
        // this triggers rendering the subviews, when the parent view is ready
        this.on('ready', _.bind(this._renderSubviews, this));
    });

Of course, there are many more approaches how to work with parent and childviews, and how to arrange multiple views with Backbone.

You might want to search for "subview" at [http://backplug.io](http://backplug.io) or directly at [http://npmjs.org](http://npmjs.org).

