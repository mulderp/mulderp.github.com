---
title: Getting Started with D3
layout: post
tags: d3 interaction
---
Visualizations are great tools to understand ideas and play with data. As Tim Brown from Ideo writes in [this post](http://designthinking.ideo.com/?p=1294)

<blockquote lang="en"><p>Visual thinking isn’t limited to illustrations. It can take many forms. Mind maps, two-by-two matrices, and other visual frameworks can help explore and describe ideas in valuable ways that require little more than a few straight lines and some imagination.</p></blockquote>

Especially for visualizing data in graphs, [D3](http://d3js.org/) might be helpful. D3 stands for "Data-Driven Documents" and is a JavaScript visualization library for HTML and SVG. This post is a short overview to help you get started.

## Loading D3

The easiest way to load D3 is by loading the script from a CDN, such as:

    <script src="https://cdnjs.cloudflare.com/ajax/libs/d3/3.4.1/d3.min.js"></script>

Alternatively, we can copy the library from the [github repository](https://github.com/mbostock/d3) or the [project website](http://d3js.org).

By adding a script reference to the library, we obtain a "d3" object to work with.

## The d3 object

The d3 object is somewhat similar to the "$" object in jQuery. This means, that we can "select" DOM nodes, and we can build nodes with "append". For drawing, we need an "svg" based canvas. Adding this "svg" is the first step to build a graph. Therefore, we define the following construct:

    var vis = d3.select("#graph")
                .append("svg");

We can add attributes such as width and height of the graph with:

         var w = 900,
             h = 400;
         vis.attr("width", w)
            .attr("height", h);

We can also add text with:

         vis.text("Our Graph")
            .select("#graph")

This should look pretty familiar if you have worked with selectors in jQuery.

## Placing nodes

To render data, we need to "join" data with DOM nodes. This is done with the [data()](https://github.com/mbostock/d3/wiki/Selections#wiki-data) command. The mapping of data to nodes can feel a bit magical, since this [adds relationships](http://bost.ocks.org/mike/join/) based on a declarative syntax. If you end up somewhat confused (as I was), you can read some additional explanation [here](http://knowledgestockpile.blogspot.de/2012/01/understanding-selectall-data-enter.html)

To make a first mapping, we first define nodes:

     var nodes = [{x: 30, y: 50},
                  {y: 50, y: 80},
                  {x: 90, y: 120}]

Since we start with a fresh canvas, all nodes will be new, and we can map these with "selectAll" - "data" - "enter":

     var node = vis.selectAll("circle.node")
        .data(nodes)
        .enter().append("g")
        .attr("class", "node")

     node.append("svg:circle")
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; })
        .attr("r", "10px")
        .attr("fill", "black");

     
     vis.selectAll("circle.nodes")
        .data(nodes)
        .enter()
        .append("svg:circle")
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; })

Since the circles are setup, we now can add and remove data, and the graph will update automatically: [Try this codepen](http://codepen.io/mulderp/pen/aDrxq) 

## Connecting the Dots

To render a graph, we need lines between the circles. Since we have the coordinates of the circles, let's define the line data structure with:

    var links = [
      {source: nodes[0], target: nodes[1]},
      {source: nodes[2], target: nodes[1]}
    ]

We can use the [line SVG shape](https://github.com/mbostock/d3/wiki/SVG-Shapes#wiki-svg_line) for connecting the dots:

    vis.selectAll(".line")
       .data(links)
       .enter()
       .append("line")
       .attr("x1", function(d) { return d.source.x })
       .attr("y1", function(d) { return d.source.y })
       .attr("x2", function(d) { return d.target.x })
       .attr("y2", function(d) { return d.target.y })
       .style("stroke", "rgb(6,120,155)");

We have functions to translate the coordinates to line attributes. The result can be seen [in this codepen](http://codepen.io/mulderp/pen/wxmBd)

## Exploring further

We can continue building a graph by manually 

* http://www.d3noob.org/2013/03/what-is-force-layout-diagram-in-d3js.html

force layouts: http://en.wikipedia.org/wiki/Force-directed_graph_drawing

plugins: https://github.com/d3/d3-plugins/tree/master/graph

## Resources

* http://alignedleft.com/tutorials/d3/
* http://stackoverflow.com/questions/15859457/d3-js-circles-are-not-appearing
* http://codepen.io/mulderp/pen/aDrxq
* https://www.dashingd3js.com/svg-basic-shapes-and-d3js
* http://bl.ocks.org/mbostock/1153292
* http://blog.stephenboak.com/2012/06/15/d3-flow-vis-tutorial.html
* http://bl.ocks.org/lgersman/5311202
* http://bl.ocks.org/rkirsling/5001347
* http://stackoverflow.com/questions/17656502/d3js-create-a-force-layout-with-fixed-nodes
* http://www.is.kau.se/julioangulo/angulo/blog/?p=157568737
* http://toolongdidntread.com/graph-visualization/drawing-graphs-with-d3js-part-1/
