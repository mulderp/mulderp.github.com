---
title: Getting Started with D3
layout: post
tags: d3 interaction
---
Visualizations are great tools to understand ideas and play with data. As Tim Brown from Ideo writes in [this post](http://designthinking.ideo.com/?p=1294)

<blockquote lang="en"><p>Visual thinking isn’t limited to illustrations. It can take many forms. Mind maps, two-by-two matrices, and other visual frameworks can help explore and describe ideas in valuable ways that require little more than a few straight lines and some imagination.</p></blockquote>

Especially for visualizing data in graphs, [D3](http://d3js.org/) might be helpful. D3 stands for "Data-Driven Documents" and is an JavaScript visualization library for HTML and SVG. This post is a short overview to help you get started.

## Loading D3

The easiest way to load D3 is by loading the script from a CDN, such as:

    https://cdnjs.cloudflare.com/ajax/libs/d3/3.4.1/d3.min.js

Alternatively, we can copy the library from the [github repository](https://github.com/mbostock/d3) or the [project website](http://d3js.org).

By adding a script reference to the library, we obtain a "d3" object to work with.

## The d3 object

The d3 object is somewhat similar to the "$" object in jQuery. This means, that we can "select" DOM nodes, and we can build nodes with "append". For drawing, we need an "svg" based canvas. Adding this "svg" is the first step to build a graph. Therefore, we define the following construct:

    var vis = d3.select("#graph")
                .append("svg:g");

We can add attributes such as width and height of the graph with:

         var w = 900,
             h = 400;
         vis.attr("width", w)
            .attr("height", h);

We can also add text with:

         vis.text("Our Graph")
            .select("#graph")

This should be pretty familiar if you work with jQuery.

## Placing nodes

To render data, we need to "join" data with with DOM nodes. This is done with the "data()" command. The mapping of data to node can feel a bit magical, since its [add relationships](http://bost.ocks.org/mike/join/) based on a declarative syntax. A good start is reading about this step in the documentation [here](https://github.com/mbostock/d3/wiki/Selections#wiki-data). If you end up still somewhat confused (as I was), you can read some additional explanation [here](http://knowledgestockpile.blogspot.de/2012/01/understanding-selectall-data-enter.html)


  var node = vis.selectAll("circle.node")
        .data(nodes)
        .enter().append("g")
        .attr("class", "node")

Since we start with a fresh canvas, all nodes will be new, and we can capture them with the "enter" scope.
  
     node.append("svg:circle")
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; })
        .attr("r", circleWidth)
        .attr("fill", function(d, i) { if (i>0) { return  palette.pink; } else { return palette.paleryellow } } )

## Resources

* http://alignedleft.com/tutorials/d3/
