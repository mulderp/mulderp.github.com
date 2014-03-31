---
layout: post
title: Your Email List with Firebase and Backbone
tags: firebase backbone
images:
  - /static/images/firebase_dashboard.png
  - /static/images/firebase_set.png
---

Forms in landing pages can nicely capture interest in a product or service, for example for my book on Backbone.js, or for announcing services as a freelancer. Especially, a landing page is a nice use case for [a static web page](http://en.wikipedia.org/wiki/Static_web_page). With static pages, we can avoid the efforts and costs, that come with dynamic web pages. In contrast to dynamic web pages that require advanced server infrastructure, the hosting and development of static pages is much simpler 

But where do you store data from forms in static pages? Or, how could you display new data to a user? To answer these questions, we can look at the idea of [noBackend](http://nobackend.org/), or so-called "Backend-as-a-Service". The name "no-Backend" is certainly inspired by "no-SQL", pointing towards application design with flexible schema's and separate mindsets for writing and reading data. Besides agile development, approaches for "Backend-as-a-Service" support you with keeping maintenance and infrastructure operations at a minimum.

For the impatient, [the demo of this post](http://thinkingonthinking.com/landingpage) is a static page landing page backed with Firebase.

## Firebase

A number of "noBackend" providers are available. One of the most advanced is [Firebase](https://www.firebase.com/). With Firebase's [Hacker Plan](https://www.firebase.com/pricing.html), you can store up to 100 MB of data for free, which should be enough for collecting emails with a landing page.

To get started with Firebase, you can signup with your Github account or simply with your email. On Firebase's dashboard, you then can create as many APIs as you like.

<img src="{{page.images[0]}}">

So, with the dashboard, let's create a store for emails. I'll call this "mulpat", since it is my Twitter handle. The idea would be to store emails in a collection "contacts". Collections in Firebase can be populated either with a data import, or, with some JavaScript that is run from the browser console. The latter can be nice to quickly reset or setup some predefined data. Let's look at how it is done.

First, we point a Firebase reference to a collection, e.g.

    var ref = new Firebase("https://mulpat.firebaseio.com/contacts");

We now can "set" data or "push" data into the reference with:

    ref.set({id: "patrick", email: "mulder@mtpartners.de"});

This should look as below.

<img src="{{page.images[1]}}">

Be careful with "set" though. It will wipe out existing data from the collection.

Once collections are created, you can also apply rules for security. [This video](https://www.youtube.com/watch?v=IGlzbmnAlRQ) is well worth watching.

So, with these basics, we can setup a static page and connecting a form to the Firebase bucket.

## Backbone Setup

For the landing page setup, we want to keep the stack for the static page as simple as possible. This means, we want to avoid too many abstractions from workflow automation. Therefore, the build tool of choice is [Browserify](http://thinkingonthinking.com/unix-in-the-browser/).

First, we setup some directories and link the node_modules directory. By symlinking node_modules, we can easily require the libs from there. We should have a directory layout similar to:

    |-app
    |---collections
    |---node_modules
    |---views
    |-lib

In node_modules, there are symlinks to collections, views and libs.

We also need some static HTML in index.html:

     <!DOCTYPE html>
     <html lang="en">
     <head>
     	<meta charset="utf-8">
     	<title>Landing Page</title>
     	<meta name="description" content="">
         <link href="http://fonts.googleapis.com/css?family=Open+Sans:300,600,700" rel="stylesheet" >
     	<meta name="viewport" content="width=device-width, initial-scale=1.0">
         <link rel="stylesheet" href="./static/style.css" />
         <script src="./static/bundle.js"></script>
         <script>
           var app = require("app");
         </script>
     </head>
     <body>
     
     <div class="container-main">
         <div class="header">
             <h1>Welcome to a Landingpage!</h1>
             <h3>If you like what you see, please leave your email!</h3>
         </div>
     
         <div class="form-wrapper">
           <form id="contact">
             <input type="text" name="email" />
             <input type="submit" value="SEND" class="button-blue" >
           </form>
         </div>
     </div>
     
     </body>
     </html>

This is just a basic form, with an input element for emails, and a "send" button.

Now, 




















if you start working with forms, or you want to provide new data to a user, server backends get important in static pages too.  

But applications based on static pages may require a 





Email campaigns are an important part of any online business. Also, 
