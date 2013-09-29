---
layout: post
title: Learning from a Cinema Website
tags: Interfaces
---
I just received a marketing flyer of the [Nielsen Norman Group](http://www.nngroup.com/). It talks about design for small screens and usability of mobile applications (some background information is also shown [here](http://www.nngroup.com/articles/)).

Usability and short attention spans of users are important reasons to build interfaces with client-side frameworks such as Backbone.js. To show the potential for client-side applications and mobile interfaces, let's do a small test with an existing cinema website. Where are problems today?

1. First test: You want to chose a movie. The first thing you see are advertisements for movies you are not interested in. Resizing the window not even updates the contents to the essential content. Probably, the mobile version is not responsive either.

2. Second test: Navigation. Your goal is to see what movies are shown today. Oh, you need to hover with the mouse over "program" to see some further actions. The program overview is just far right in the sub-menu, and moving there require fine-motoric skills. Argh.. on a small screen, or on laptop with a trackpad, it is not fun. 

3. Third test: Browsing. Nice, I am counting 20 movies, but how do I remove those movies about/with "Music", "Animation" or "Fantasy"? At least, selecting a movie requires some trade-offs, like show-times, plots, actors and length. It is really difficult to do that comparison by scrolling the list of movies only. What I would prefer is some filter or sorting actions.

Well, looking at the source of the website, we see the sources for jQuery, jQuery-UI, and some libraries. In one library, we see a function that is tens of lines long:

    function filterProgram(tmpFilter, tmpField) { ... }

Now compare the browsing experience, with the showcase [gallery demo from Adobe](http://dpsgallery.adobe.com/#/main): Responsive, a nice feature project area, some search, and a filter for projects, all on one page.

When applications become interfaces to support us with simple jobs (search/filtering/sorting), it is time to start learning client-side application development. And in my upcoming book on Backbone.js, I want to show an example of a better interface to browse movies (or products/news/...).

