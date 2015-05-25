---
title: Some thoughts about writing
layout: post
tags: writing
---
After writing [The Pipefishbook](http://pipefishbook.com), there were some book reviews complaining: "This is not a full stack book." "This book does not go deep enough." "This book is more about automation than it is about web applications".

True, the book tries to discuss many topics. And, the directions of the book changed two times. First, the initial idea of the book was about writing on [combining Ruby-on-Rails with Backbone.js](http://thinkingonthinking.com/writing-on-ruby-and-backbone/) in the beginning of 2013. At that time, the idea of a "full stack" engineer was still vague. You either worked on the backend or the frontend, but you would not combine both worlds.

On the other hand, if you worked on web applications with Ruby-on-Rails, there was a certain stigma about working with JavaScript. Working with CoffeeScript was kind of accepted, but JavaScript had such bad press, that most advice you got was about avoiding it all together. Questioning these answers was why I wrote ["how I start liking JavaScript again"](http://thinkingonthinking.com/how-I-start-liking-javascript-again/) in my early blogging days.

Assuming JavaScript would be "primitive", how could you start exploiting the rendering engine of a browser? How could you learn to make better user interfaces or do graphics for the web? After all, [visual languages](http://thinkingonthinking.com/visual-languages/) are an important driver to tell stories and have remote interactions with data.

These questions bothered me in the early book draft. Confused about having to work with multiple programming languages for the web, such as Ruby, CoffeeScript, SQL, and realizing that others may be using Python or PHP for developing web applications, I decided to only use JavaScript after some weeks of book writing. This decision was around summer 2013 and I wrote about my new motivations [here](http://thinkingonthinking.com/Here-Goes-Your-Web-Stack/).

Switching to "full stack" JavaScript had an impact on another topic of book: How to work with JavaScript modules? As long as you work with a framework like Ruby-on-Rails, you had the asset pipeline to take care of "bundling" JavaScript. 

Since I think ["modular" web applications are important](http://thinkingonthinking.com/what-is-modular-architecture/), my favorite discovery was Browserify. This appraoch reminded me on [Unix in the browser](http://thinkingonthinking.com/unix-in-the-browser/). Switching to Browserify happened quite late in the writing process, and I had to redo most of my examples. While liking this new tool, the switch introduced some errors initially and I had to explore a new appraoch for build automation, for example based on [Gulp](http://thinkingonthinking.com/intro-to-gulp/) at a certain moment.

While I am convinced that JavaScript modules, DOM manipulation and HTTP libraries are important for writing web applications, the critical voices on my book pointed out, that the book's direction got a bit lost. Too many tree's hide the wood, one might say. Christian Heilmann formulates it as ["too easy, didn't learn"](https://www.youtube.com/watch?v=RHt3L5Lqs50).

Now, technical writing certainly is different from writing prose. And it is hard to find other technical writers sharing thoughts about writing. So, while trying to improve, I looked at the writing process from prose authors the last weeks.

For many, writing starts with *not* knowing, as John Drufesne explains in [this TED talk](https://www.youtube.com/watch?v=urJDbQl5W0I&feature=youtu.be&t=1m18s). He  tells us: "What you don't know is more important than what you know, because, what you don't know is what engages your senses of wonder."

In fact, cultivating this sense of wonder is extremely important for learning and writing. Isaac Asimov explains it [here](https://www.youtube.com/watch?v=1CwUuU6C4pk&feature=youtu.be&t=4m53s).

I guess dealing with failure and not knowing is part of the writing process. But, it is also a kind of home that you can build for yourself and some readers hopefully. It is an inspiring idea from Elizabeth Gilbert, and the way she puts it in her TED talk is well worth watching in: "Success, failure, and the drive to keep creating." 

<iframe src="https://embed-ssl.ted.com/talks/elizabeth_gilbert_success_failure_and_the_drive_to_keep_creating.html" width="640" height="360" frameborder="0" scrolling="no" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>
