---
title: Getting Started with D3
layout: post
tags: d3 interaction
---
Visualizations are great tools to understand ideas and play with data. As Tim Brown from Ideo puts in [this post](http://designthinking.ideo.com/?p=1294)

<blockquote lang="en"><p>Visual thinking isn’t limited to illustrations. It can take many forms. Mind maps, two-by-two matrices, and other visual frameworks can help explore and describe ideas in valuable ways that require little more than a few straight lines and some imagination.</p></blockquote>

Especially for visualizing data in graphs, D3 might be helpful. D3 is an easy way to build visualizations and stands for data-driven documents. Here is a short overview on how to get started.

## Loading D3

The easiest way to load D3 is by loading the script from a CDN, such as:

    https://cdnjs.cloudflare.com/ajax/libs/d3/3.4.1/d3.min.js

Alternatively, we can copy the library from the github repository or the project website.

Basically, that is all we need to get started. We now should have a "d3" object to work with.

## The d3 object

The d3 object is somewhat similar to the "$" object in jQuery. This means, that we can "select" DOM nodes, and we can build nodes with "append". For drawing, we need an "svg" based canvas. I like to think that adding this "svg" is the first step of a visualization. Therefore, we define the following construct:

    var vis = d3.select("#graph")
                .append("svg:svg");

We can add attributes such as width and height of the graph with:

         var w = 900,
             h = 400;
         vis.attr("width", w)
            .attr("height", h);

We can also add text with:

         vis.text("Our Graph")
            .select("#graph")

## Loading data

To load data, we need to have a "data()" command on the visualization. This is a bit magical command, since it joins data with nodes, as can be read in the documentation [here](https://github.com/mbostock/d3/wiki/Selections#wiki-data)


  var node = vis.selectAll("circle.node")
        .data(nodes)
        .enter().append("g")
        .attr("class", "node")
  
     node.append("svg:circle")
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; })
        .attr("r", circleWidth)
        .attr("fill", function(d, i) { if (i>0) { return  palette.pink; } else { return palette.paleryellow } } )


