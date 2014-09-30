---
title: impress a technical audience
layout: post
tags: firebase, backbone
---
the browser connects you - your business most likely - with a user. someone who might pay you for a problem that you or your software can solve. writing software is about helping someone achieve her goals. 

In software for the web, it is what is visible in the browser that we should focus on.

the other side, the backend is often waste of time. at least, if you serve a dozen of users initially.

so, how can you show something - in the browser - that is functional, but does not require ages to setup? Why would you build a truck that can deliver tons of stuff, when you only need a bycycle to deliver a small manuscript book? 

Answering this question was the talk I promised to deliver at Frontend Zurich, but I screwed up. I wanted to show how easy it is to iteratively build a prototype without touching the backend. 

Sorry if you were in the audience of my talk, I am learning. and the last part of my talk - about a small project I did with Firebase - resonated with quite some folks in the audience, luckily. 

So, here are 10 steps to get quicker "out of the building" with a web "app":

0) Write a small todo.txt

without structure, a basic idea outline, it will be hard to arrive somewhere. so, the goals of this app is:

* track my goals for the next X weeks
* have someone else review the goals
* allow a sorting function 

Note, that I don't move on to writing tests, which would probably be required in a bigger project. Our goal to show something working, quickly. TDD is nice to explore some specification in a large projct, but who knows, maybe we throw away the prototype next week, so let's skip tests from here.

# 1)  use divshot init

with divshot init, you get an empty page. basic html. and you can deploy the project quickly from now on and get valuable user feedback

# 2)  do npm init

you want to make use of the world's largest code repository don't you? for this, you need to track and add some packages from npm.


# 3)  Get your favorite JS libs

You need to provide some easy ways to scaffold layouts. For example, with a Backbone project, you would do:

  $ npm install -d underscore jquery-untouched backbone

Now, you can easily handle events from users as well as issue Ajax requests.


# 4)  Setup a build process

Browser apps are special in that sense, that they require us developers to think, how to package an app (and to make some trade-offs with MVC).

In this example, I chose a Makefile. Not much is simpler. To build the frontend part, I chose browserify.

# 5) Setup Browserify

I like the idea of sharing code between browser and server environments. With browserify, you can simply do:

   app = require('app')

and experiment directly with your app in the browser console.


# 6) Templates

Much of what we think is good relates to putting data into templates.


# 7) Backend and admin interface

Compared to the other points, it is here where we can leverage most to get something working. I like the idea of backend-as-a-service. As first step, you need accounts and setup some data there. So, you do this in this step. On a sidenote, you can use Firebase later for a basic admin service too.


# 8) Wire up the backend 

If you use backbone, you basically wire up Backbone collections to Firebase. 


# 9) Fill up HTML and CSS

So far, we just coded JS. It is time to add static assets (Well, when JS is packaged, JS are static files too).


# 10) Enjoy!





