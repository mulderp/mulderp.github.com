---
title: Getting Started with D3
layout: post
tags: d3 interaction
images:
  - /static/images/3_circles.png
  - /static/images/graph_levelgraph.png
---
Visualizations are great tools to understand ideas and play with data. As Tim Brown from Ideo writes in [this post](http://designthinking.ideo.com/?p=1294)

<blockquote lang="en"><p>Visual thinking isn’t limited to illustrations. It can take many forms. Mind maps, two-by-two matrices, and other visual frameworks can help explore and describe ideas in valuable ways that require little more than a few straight lines and some imagination.</p></blockquote>

Especially for visualizing data in graphs, [D3](http://d3js.org/) might be helpful. D3 stands for "Data-Driven Documents" and is a JavaScript visualization library for HTML and SVG. This post is a short overview to help you get started.

## Loading D3

The easiest way to load D3 is by loading the script from a CDN, such as:

    <script src="https://cdnjs.cloudflare.com/ajax/libs/d3/3.4.1/d3.min.js"></script>

Alternatively, you can copy the library from the [github repository](https://github.com/mbostock/d3) or the [project website](http://d3js.org).

Important: By adding a script tag with a reference to the D3.js library, you obtain a "d3" object to work with. With this, you have a tool to render data in a browser.

## The d3 object

The d3 object is somewhat similar to the "$" object in jQuery. For example, you can "select" DOM nodes, like a circle tag. And you can build new nodes with "append".

The d3 object also helps you with the setup of a convas for rendering graphics.  And, you need a "svg" based canvas. Adding this "svg" is the first step to build a graph. Therefore, let's define the following construct:

    var vis = d3.select("#graph")
                .append("svg");

This selects the DOM node with id '#graph'. You can then add attributes such as width and height of the graph with:

         var w = 900,
             h = 400;
         vis.attr("width", w)
            .attr("height", h);

You can also add text with:

         vis.text("The Graph")
            .select("#graph")

Selecting and adding DOM nodes should look pretty familiar if you have worked with selectors in jQuery.

## Placing nodes

However, D3 differs from jQuery as it allows to "layout" graphical structures according to "data". This means, [a selection of DOM nodes](http://bost.ocks.org/mike/selection/) provides a number of different functions than the same selection with jQuery.

Once you have a selection of DOM nodes, you can "join" data to the DOM nodes! This is done with the [data()](https://github.com/mbostock/d3/wiki/Selections#wiki-data) command. The mapping of data to nodes can feel a bit magical, since this [adds relationships](http://bost.ocks.org/mike/join/) based on a declarative syntax. If you end up somewhat confused (as I was), you can read some additional explanation [here](http://knowledgestockpile.blogspot.de/2012/01/understanding-selectall-data-enter.html)

To make a first mapping, we first define nodes:

     var nodes = [{x: 30, y: 50},
                  {x: 50, y: 80},
                  {x: 90, y: 120}]

Since we start with a fresh canvas, all nodes will be new, and we can map these with "selectAll" - "data" - "enter":


      vis.selectAll("circle .nodes")
         .data(nodes)
         .enter()
         .append("svg:circle")
         .attr("class", "nodes")
         .attr("cx", function(d) { return d.x; })
         .attr("cy", function(d) { return d.y; })

The sequence is this: You select a group of DOM nodes (that might exist or not). You then [join](http://bost.ocks.org/mike/join/) these nodes with data. For every new DOM node, you specify a tag name (circle) and add a class and more attributes.

To actually see the circles, you must set the fill attribute:

      vis.selectAll("circle .nodes")
          .data(nodes)
          .enter()
          .append("svg:circle")
          .attr("class", "nodes")
          .attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; })
          .attr("r", "10px")
          .attr("fill", "black") 

This should result into something like:

<img src="{{page.images[0]}}">

Since the circles are setup, you now can add and remove data, and the graph will update automatically: [Try this codepen](http://codepen.io/mulderp/pen/aDrxq) 

## Connecting the Dots

A graph is based on nodes and _links_. To render these links, you need lines between the circles. Since you have the coordinates of the circles, you could add lines as follows:

    var links = [
      {source: nodes[0], target: nodes[1]},
      {source: nodes[2], target: nodes[1]}
    ]

You can use the [line SVG shape](https://github.com/mbostock/d3/wiki/SVG-Shapes#wiki-svg_line) for connecting the dots:

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
To see some of the mechanics, you can add and remove data, and see how the graph changes.

## Exploring further

Setting up graphs manually with nodes and edges might be interesting for small examples. However, if you often need to setup graphs, or the number of nodes and edges increases, a graph can be be setup with an algorithm too. This is where [force layouts](http://en.wikipedia.org/wiki/Force-directed_graph_drawing) help.

With this, you can setup a graph like in [this example](http://codepen.io/mulderp/full/KGFvx):

<img src="{{page.images[1]}}">

D3 also supports force layout algorithms, and a nice place to start is [here](http://www.d3noob.org/2013/03/what-is-force-layout-diagram-in-d3js.html). Another option might be using D3 plugins, such as the [graph plugin](https://github.com/d3/d3-plugins/tree/master/graph).

What are your experiences with D3 for graphs and the different approaches? Leave feedback here, or at (hackernews)[https://news.ycombinator.com/item?id=7210162].

## Resources

If you want to explore further, here are some interesting links:

* [D3 Tutorials by Scott Murray](http://alignedleft.com/tutorials/d3/)
* Fine tuning the display of circles: [A question on SO](http://stackoverflow.com/questions/15859457/d3-js-circles-are-not-appearing)
* An overview on [basic shapes](https://www.dashingd3js.com/svg-basic-shapes-and-d3js)
* Another tutorial [flow visualization](http://blog.stephenboak.com/2012/06/15/d3-flow-vis-tutorial.html)
* SO question on [using a force layout](http://stackoverflow.com/questions/17656502/d3js-create-a-force-layout-with-fixed-nodes)

And some graph examples with D3:

* Graph of [Mobile Patent Suits](http://bl.ocks.org/mbostock/1153292)
* [State Diagram Editor](http://bl.ocks.org/lgersman/5311202)
* Simple [directed graph](http://bl.ocks.org/rkirsling/5001347)
* Discussion of [force layout](http://www.is.kau.se/julioangulo/angulo/blog/?p=157568737)
* [Drawing Graphs with D3](http://toolongdidntread.com/graph-visualization/drawing-graphs-with-d3js-part-1/)
