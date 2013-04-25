---
layout: post
title: Looking at a MarionetteJS application
tags: backbonejs
---
Looking at code from programmers who are better than you, can help you learn, and improve your programming and design skills. And one of the leading thinkers in the Backbone area is [Derick Bailey](https://twitter.com/derickbailey), who has written extensively about BackboneJS in his [blog](http://lostechies.com/derickbailey) and recently in a [book](https://leanpub.com/building-backbone-plugins). Let's look closer at some of his demo projects to illustrate MarionetteJS principles, [BBclonemail](git://github.com/marionettejs/bbclonemail.git).

The JavaScript structure of the application looks like this:

    └── javascripts
        ├── bbclonemail
        │   ├── bbclonemail.js
        │   ├── components
        │   │   ├── appController.js
        │   │   └── appSelector.js
        │   ├── contacts
        │   │   ├── contacts.js
        │   │   ├── contactsapp.js
        │   │   └── router.js
        │   └── mail
        │       ├── categories
        │       │   ├── categories.js
        │       │   └── categoryView.js
        │       ├── mailapp.js
        │       ├── mailbox
        │       │   ├── mail.js
        │       │   ├── mailItemView.js
        │       │   └── mailListView.js
        │       └── router.js
        ├── build
        │   ├── bbclonemail.js
        │   └── bbclonemail.min.js
        └── vendor

We can make the following observations:

* First, it is not directly visible that we are dealing with a single MVC application structure. Rather, we see from the namespacing that we get 2 components that can be selected with the appController and appSelector. These components (mail and contacts) are then somewhat looking like 2 MVCs, since we see views and models/collections, and a 'ComponentController' on top-level of the component.

* Looking closer at the ComponentController of the Mail component, we see a list of main actions. The actions are: 'showInbox', 'showMailById', 'showMailByCategory'.  There are also helper functions, that look related to event binding, and controlling the rendering flow when events occur. Also, the client-side route is updated depending on which events have occured.

* Since loading of the application can occur asynchronously, 'initializers' make sure, that the component has the right state when it is first loaded. Interestingly, after having setup the component, an 'app:started' event is fired, saying that the 'mail' component is ready for user interaction.  Similary, a finalizer makes sure that the component properly shuts down when needed.

* The core entities of the Mailbox component are Email and EmailCollection. The loading process of the emails is again wrapped in some shells (Mailbox Controller), that help fetching and filtering the JSON from server side.

* Last, there are two views for a Mailbox: The list view takes care to render single emails, and to check whether an element in the list has been selected. Also, a controller helps to transform part of the list view into a single item view, when an Email is selected. In the background a region is injected into the rendering process, leaving out the details of DOM locations from the view. The ItemView has not much responsibility apart from filling in values into a template.

# Conclusions
MarionetteJS comes with very interesting abstractions that can take away a lot of BackboneJS boilerplate code. Still, it takes a while to get used to feel better how components can be designed, and how to deal with different level of application events (local events in the DOM vs. global events that should remove/display components)
