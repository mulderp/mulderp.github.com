---
title: Layouts with Backbone
layout: post
tags: backbone layout
---
The "application layout" in a Ruby-on-Rails web application defines how to arrange multiple view templates (or "partials"). When you come to a client-side web application with e.g. Backbone, there are multiple approaches how to solve this.

# Attach Views to existing DOM nodes

A simple approach to arrange multiple views in a Backbone application is by delegation. The idea is to provide a "layout" from a basic HTML:

    <div id="main">
      <aside id="sibebar">
      </aside>
  
      <section id="main">
      </section>
    </div>

Next, Backbone views can attached to these DOM nodes by using the [setElement](http://backbonejs.org/#View-setElement) function of Backbone views. While this approach nicely delegates events from some basic HTML layout, dynamically "swapping" views, e.g. the main view, still would require some manual setups. You would need to take care to unbind existing views and event handlers from the DOM element.

# Using Thorax or Handlebones

A nice strategy to easily build a layout for views, and easily swapping DOM elements as needed, is given by the [Thorax.LayoutView](http://thoraxjs.org/api.html#thorax.layout-view) idea. Here, you place a Handlebars helper in a template with:

    {{layout-element}}

And now, whenever you call from a view:

    layout.setView(someView);

The old view is automatically cleaned up.

The idea works for placing sidebars, headers and footers too. You can place helpers in your layout with:

    {{view header}}
    {{view sidebar}}
    {{view footer}}

In [Handlebones](https://github.com/FormidableLabs/handlebones#helpers) and [Thorax](http://thoraxjs.org/api.html#template-helpers), the "view" helper lookups a child view, will render this and insert it into the DOM as needed. Also, the view helper takes care of unbinding and cleaning up event handler when views are swapped.


