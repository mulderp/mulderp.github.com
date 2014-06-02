---
title: Visual Languages for the Web
tags: Processing, D3
layout: post
images:
  - /static/images/design_rules.png
---
When HTML was first conceived in [1989](http://en.wikipedia.org/wiki/HTML#Development), computers were dealing mainly with textual documents. In the meantime, we are dealing more and more with visual information. With web browsers, we are trying to solve the same problems that were solved with special spreadsheet, charting or slideshow software packages.

Luckily, browsers are perfectly able to do stunning visualizations based on HTML, CSS and [SVG](http://en.wikipedia.org/wiki/Svg). With the HTML5 standard, browsers also support a new [canvas](http://en.wikipedia.org/wiki/Canvas_element) tag.

Unfortunately, looking at many scientific or engineering websites, most visual data comes as JPG or PNG, instead of code that can be interpreted or adapted as needed.

Good places to explore visual ideas in browsers are [D3.js](http://d3js.org/) and [ProcessingJS](http://processingjs.org/). Besides support from these general infoviz libraries, there are often specialized JavaScript libraries to solve visual problems. For example, to draw digital waveforms [wavedrom](https://github.com/drom/wavedrom) looks interesting. Or, to draw and interact with small logical circuits, [JointJS](http://www.jointjs.com/demos/logic) looks great. For rendering graphs, Andrei Kashcha's [ngraph](https://github.com/anvaka/ngraph) project looks great and was recently featured in a [TEDx Stanford](https://www.youtube.com/watch?v=8CX-Q0gtSp8) talk.

But besides learning the tricks of libraries, crafting visual languages is important. This requires you to explore encodings and play with stories around graphics. For example at Fluen Conference 2014, Scott Murray shows how [visual interface design](https://speakerdeck.com/alignedleft/interface-design-considerations-for-data-visualization) can be explored with D3 and the [value of process](https://www.youtube.com/watch?v=e1HMmLcnpXg):

<img src="{{ page.images[0] }}">

That a design process is important to explore data is also emphasized in Ben Fry's [book "Visualizing Data"](http://shop.oreilly.com/product/9780596514556.do), where different stages for visualization design are discussed.

For my goals, the basic visualization goals would be:

1. prepare datasets with JSON
2. visualize datasets
3. provide interactions

The main power of D3 and Processing come in steps 2 and 3. Working with D3 and/or Processing can help you to explore and identify [ideas that can stick](http://thinkingonthinking.com/the-value-of-iteration/).

Let's compare both approaches by drawing a simple line.

## D3

In D3, you start with data that might look like:

     var dataset = [{coord: [10, 20, 30, 40]}];

The main point is that coordinates are wrapped in some property of a data element. The power of D3 is the ["mapping" or "binding"](http://alignedleft.com/tutorials/d3/binding-data) of data to a visual language of shapes and colors. Besides data binding, the toolbox of D3 provides many abstractions and tricks.

Another important idea of D3 is "chaining" commands. So, once you have bound data to properties of HTML or SVG tags, you can add more visual transformations, or add event bindings.

Drawing a line with D3 might then look like:

    <svg>
      <g id="canvas"></g>
    </svg>
    
    <script type="text/coffeescript">
      console.log d3
      svg = d3.select('svg')
      svg.attr({height: 400, width: 500})
      svg.selectAll('line')
         .data(dataset)
         .enter()
         .append('line')
         .attr('stroke', '#000')
         .attr('x1', (d) -> d.points[0])
         .attr('x2', (d) -> d.points[2])
    </script>

Note the usage of [CoffeeScript in the browser](http://coffeescript.org/#scripts). This is not something you would do in a production app, but for exploring ideas, CoffeeScript feels nice here. Also notice, how using D3 can abstract away the coordinate system easily. This might be good or bad, depending on your goals.

## Processing.JS

The idea of visualizing things with Processing is a bit different. With Processing, you control drawing more in an imperative way. Processing has been around for a quite a while, and plays an increasingly important role in the [DIY or maker](http://en.wikipedia.org/wiki/Maker_culture) culture.

To understand the background of Processing, let's look at this code:

    var line = [0, 0, 40, 0];

    function sketchProc(processing) {
      processing.setup = function() {
        console.log("* setup *");
      }

      processing.draw = function() {
        processing.translate(20, 30);
        processing.line(line[0], line[1], line[2], line[3]);
      }
    }
    var canvas = document.getElementById("canvas1");
    var processingInstance = new Processing(canvas, sketchProc);

With Processing, you differentiate between 2 stages of drawing: The setup (processing.setup) and actual drawing (processing.draw). Since the "draw" stage is looped over, you can easily build frames for animations. Basic geometrical processing happens directly with coordinates.

## Conclusion

D3 and Processing look great to build info graphics. With Processing, you can easily build advanced interfaces for drawing shapes and interactions, while D3's toolbox comes with many layout helpers out of the box. Working with graphics in a browser is still young, but it certainly will have a great future.
