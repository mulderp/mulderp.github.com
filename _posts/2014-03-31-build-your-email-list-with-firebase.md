---
layout: post
title: Your Email List with Firebase and Backbone
tags: firebase backbone
images:
  - /static/images/firebase_dashboard.png
  - /static/images/firebase_set.png
---

Forms in landing pages are great to capture interest in a product or service, for example to gauge users' needs for a new service. Quite easily, you can start collecting email addresses with a static page, by using a bit of JavaScript and a "Backend-as-a-Service".

The idea of [a static web page](http://en.wikipedia.org/wiki/Static_web_page) is serving HTML with JavaScript without using server-side page updates. This can be interesting when you build a dashboard or a landing page, as we will discuss here. The advantage of doing apps based on static pages, is that you can avoid the costs for maintaining infrastructure that come with dynamic web pages.

But where do you store data from forms in static pages? Or, how could you display new data to a user when a page is "static"? To answer these questions, we can look at the idea of combining JavaScript with a [noBackend](http://nobackend.org/), or so-called "Backend-as-a-Service". The name "no-Backend" is certainly inspired by "no-SQL", pointing towards application design with flexible schema's and applying different mindsets for writing and reading data. Besides agile development, approaches for "Backend-as-a-Service" support you with keeping maintenance and infrastructure operations at a minimum.

For the inpatient reader, you can take a quick look at [the landingpage demo](http://thinkingonthinking.com/landingpage) to see whether a static page with a noBackend can make sense for you.

## Firebase

There are a number of "noBackend" providers offering simple API hosting. One of the most advanced is [Firebase](https://www.firebase.com/). With Firebase's [Hacker Plan](https://www.firebase.com/pricing.html), you can store up to 100 MB of data for free, which should be enough for collecting emails with a landing page.

To get started with Firebase, you can signup with your Github account or simply with your email. On Firebase's dashboard, you then can create as many APIs as you like.

<img src="{{page.images[0]}}">

So, with the dashboard, let's create a store for emails. I'll call this "mulpat", since it is my Twitter handle. The idea is to store emails in a collection "contacts". Collections in Firebase can be populated either with a data import, or, with some JavaScript that is run from the browser console. The latter can be nice to quickly reset or setup some predefined data. Let's look at how it is done.

First, we point a Firebase reference to a collection, e.g.

    var ref = new Firebase("https://mulpat.firebaseio.com/contacts");

We now can "set" data or "push" data into the reference with:

    ref.set({id: "patrick", email: "mulder@mtpartners.de"});

This should look as below.

<img src="{{page.images[1]}}">

Be careful with "set" though. It will wipe out existing data from the collection.

Once collections are created, you can also apply rules for security. [This video](https://www.youtube.com/watch?v=IGlzbmnAlRQ) is well worth watching.

To prevent others from reading our contacts list, we can setup a security rule in Firebase. 

    {
        "rules": {
            ".read": false,
            ".write": true
        }
    }

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

We also can get some node_modules with npm, such as jQuery, Underscore and Backbone. For this, we do:

    $ npm init
    $ npm install jquery-untouched --save-dev
    $ npm install backbone --save-dev
    $ npm install underscore --save-dev
    $ npm install client-backfire --save-dev

This last line is the adapter to synch a collection with Firebase. We come back to this in a second.

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

This is just a basic form, with an input element for emails, and a "send" button. We can also add [some style](http://codepen.io/rexkirby/pen/Fdnlz).

Next, we create a simple Backbone setup. First, we create a simple collection that references the contacts collection at Firebase. The module client-backfire wraps the Backfire adapter in a CommonJS setup. With Backfire, we can synch adapter that talks to Firebase.

    var backfire = require("client-backfire");
    var Backbone = backfire.Backbone;
    
    var Contacts = Backbone.Firebase.Collection.extend({
      firebase: "https://mulpat.firebaseio.com/contacts"
    });
    
    var contacts = new Contacts();
    module.exports = contacts

After this basic data layer, we write a view that listens to the form submit event. As we bind the contact collection upon view instantiation, we can simple reference the collection, and render a small "thank you" page. Putting these ideas together, the view can look like:

    var Backbone = require("backbone");
    var $ = Backbone.$;
    
    var ContactView = Backbone.View.extend({
      events: {
        "submit": "addContact"
      },
      addContact: function(ev) {
        ev.preventDefault();
        var name = $("input[name='email']");
        this.collection.add({email: name.val()});
        this.renderThanks();
      },
      renderThanks: function() {
        this.$el.html("thanks");
      },
      initialize: function() {
        this.listenTo(this.collection, "all", function(ev) {
          console.log(ev);
        });
      }
    });

    module.exports = ContactView;

To help our understanding of Firebase, we can add temporarily a monitor for events, with the "listenTo ... all" syntax in the view constructor.

Last, we bind the model to the view, map the dependencies and finish the application setup with: 

    var $ = require("jquery-untouched");
    var Backbone = require("backbone");
    Backbone.$ = $;
    
    var contacts = require("collections/contacts");
    var ContactForm = require("views/contact");
    
    var view;
    $(document).ready(function() {
      view = new ContactForm({el: $("#contact"), collection: contacts });
    });

Now we can bundle the setup with Browserify:

    $ browserify -r ./app/main.js:app > static/bundle.js

You can see the complete [Github repository here](https://github.com/mulderp/landingpage). By using a branch "gh-pages", we also obtain easily a static website and here is the [live demo](http://thinkingonthinking.com/landingpage/)

## Conclusions

The application could still be improved in a number of ways. We could wire up events from Firebase with Zapier and Mailgun for example, to automatically send emails when data is submitted. We could also improve the capturing of emails with advanced email validations, etc. but for a start this post showed yo

The view still misses a number of things such as validation of an email address.



