---
layout: post
title: JS Modules for graph rendering
tags: graphs javascript
---
[Graphs](http://en.wikipedia.org/wiki/Graph_(mathematics)) are about connected data.

And, connections are useful: Look at Google graph for ranking keywords, Facebook or LinkedIn to see your social connections, or [yasiv](http://www.yasiv.com/) to explore connections between products at Amazon.

In the space of open-source graph modeling and rendering, the work by [Andrei Kaschcha](https://github.com/anvaka) is great.

I had heard from Adnrei before, but I was lucky to meet him in person at [JSFest](http://lanyrd.com/2014/jsfest/) in San Francisco in March this year.

Just after [@substack](https://github.com/substack) gave his talk on [browserify](https://vimeo.com/62988591), Andrei talked about how he was working on re-writing his [VivaGraph](https://github.com/anvaka/VivaGraphJS) project into a [modular form with Browserify](https://www.youtube.com/watch?v=Kp377p-NSFc).  This refactoring resulted into [ngraph](https://github.com/anvaka/ngraph).

# ngraph

To understand what ngraph is about, it is most helpful to open a [package.json](https://github.com/anvaka/ngraph/blob/master/examples/pixi.js/01%20-%20Basic/package.json) in one of the examples. The dependencies of package.json show references to the [ngraph.generators](https://github.com/anvaka/ngraph.generators) and a [graph layouter](https://github.com/anvaka/ngraph.forcelayout).

Also, you will need a renderer module, to see something in the browser, or even in 3D. Especially interesting, Andrei is working on a [SVG renderer](https://github.com/anvaka/ngraph.vivasvg) and a [DOM renderer](git@github.com:anvaka/vivasvg.git). As I work with SVG in my own projects, I hope to explore this direction in some future blog posts, too.

# Graphs applied

So, to provide some context for future blog posts, some inspiration what you can do with graphs.

First, in her [TED talk](https://www.youtube.com/watch?v=8CX-Q0gtSp8&t=10m10s), [Margo Gerritsen](https://earth.stanford.edu/margot-gerritsen) discusses some foundations for beauty behind matrices and graphs. A matrix can easily represent links in a graph with 0's and 1's. So, when talking about graphs, we are equally talking about matrices (at least, what I got from the talk.)

Besides great usage in sciences, studying links in graphs can give you practical insights and is just fun. For example, Andrei created an app to visualize [your connections in Facebook](http://www.yasiv.com/facebook). For my Facebook profile (which I don't actively maintain), it looks like:

<img src="/static/images/facebook_graph.png" />

It is rather interesting to see, how the graphs consists of different "planets" (= the gray clouds). Not many people are inter-linked (or connected), on a geographical scale. In fact, only one friend in Facebook links 2 locations. Also, the graph tells the story about my friends with certain interests live at certain locations. Probably, the graph of my web and Twitter friends would look much more distributed.

