---
layout: post
title: Event Driven Architecture
tags: ajax api events
---
I recently looked at the source code of [Lamernews](https://github.com/antirez/lamernews). It was very refreshing to see an application architecture that does not circulate around the MVC separation of concerns. Rather, the application design looks to circulate around 'events'.

Looking at the application, it is clear that the news domain is about communicating events. You can see this from some examples of the application: [Echo.js](http://echojs.org) or [Lamernews](http://lamernews.org). The main function is submitting news. Once news is in the newsfeed, news can be voted up or down and commented. The votes and comments influence the importance of news in the feed.

When we would work with an MVC framework such as Ruby-on-Rails, we would probably start with mapping domain objects to routes. It would work nicely for CRUD actions on news. But for users that just browse through news, and vote news occasionally up or down, it is harder to see the usefulness of combining server-side actions with rendering logic and/or domain models.

This is where an event-driven architecture shines. And, some interesting points can be seen in the lamernews source:

1. All actions for working with news are accessible by API routes. For example, we see '/api/votenews' or '/api/postcomment'. These actions can directly be triggered from browser events with JavaScript as can be read from [app.js](https://github.com/antirez/lamernews/blob/master/public/js/app.js). Also, the API responses work in a very lean and smart way. In most cases, a simple 'status' about processed events (ok/err) is enough.

2. The ranking and scoring of news can be derived from aggregates of vote events. For this, we don't need to manage complicated queries with SQL. By making our recordings of events smarter, we get different ways to rank news (almost) for free. Smart operations on aggregates is also where Redis shines. When a vote event occurs, we increase a counter for the vote in the news hash, recalculate the rank of the news, and store this in the sorted set 'news.top' (see [compute_news_score](https://github.com/antirez/lamernews/blob/master/app.rb#L1431-L1443)). Next time, we serve news, we just need to look up the top news in the sorted set.

Now, what can we take away from this? For projects such as social communities or Ajax heavy applications, we might benefit from working with an API application from the start. We also might see cases, such as the lamernews application shows, where we can skip the ORM setup and profit from 'smart writes' to hashes and sorted sets. Well, these types of lean backends are also great for prototyping responsive interfaces as I experienced during the last weeks of my book writing.



