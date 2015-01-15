---
layout: post
title: JSONP example with BackboneJS
tags: backbonejs
---
The idea of [JSONP API's](http://en.wikipedia.org/wiki/JSONP) is nice: Many Ajax applications can't fetch JavaScript objects from a remote domain due to [cross-domain policy concerns](http://www.staticapps.org/articles/cross-domain-requests-with-cors). But, JavaScript web apps can easily fetch remote JavaScript libraries. So, by using JSONP, we pretend fetching a library, while we actually are interested in the data.

Unfortunately, JSONP has some [security flaw in the context of CSRF (cross-site request forgery)](http://security.stackexchange.com/questions/23438/security-risks-with-jsonp).  A 3rd user could make HTTP requests on your behalf, because a server would trust your cookie. I am not a security expert, but many JSONP API providers disable writing.

For simple projects, JSONP can make sense however - for example, if you would like to provide a nicer UI to someone else's [data in Wordpress](https://wordpress.org/support/topic/getting-jsonp-to-work). This was a question of some reader of [The Pipefishbook](http://pipefishbook.com). So, let's look at a Backbone.Collection that reads data with JSONP.

# Ajax requests

Fetching data with an Ajax request is easy:

    $.get('/some/path');

[jQuery Ajax requests](http://api.jquery.com/jquery.ajax/) help you very much to wrap a JSONP request for data too. For the details, you can search [npmjs.org](http://npmjs.org) for JSONP. You'll find a [JSONP module](https://github.com/webmodules/jsonp/blob/master/index.js#L87) and the according tricks. Append a  &lt;script&gt; tag, and point the source towards your remote data.

A Backbone.Collection can deal with those requests too. Let's look an example based on the Flickr API.

# Browsing images with JSONP

Let's look at a small example to [browse photos from Flickr](http://flickr-example.divshot.io/). You can see the full [source code at Github](https://github.com/pipefishbook/jsonp-example).

This demo is based on a parameterized Backbone.Collection.  Wrapping Ajax requests is an important responsibility of the Backbone data layer. So, let's look at [a collection to fetch photos with JSONP](https://github.com/pipefishbook/jsonp-example/blob/master/app/collections/photos.js).

It is important to add a "dataType" parameter to the Ajax request. This parameter is then passed to te jQuery Ajax call:

     sync: function(method, collection, options) {
       options.dataType = "jsonp";
       options.jsonpCallback = "jsonpCallback";
       return Backbone.sync(method, collection, options);
     }

And this is already all. The rest of the the example uses much of the same view construction and controls as in [Ch. 4 example](http://pipefishbook.com/ch_4/subviews/) of the Pipefishbook. A subviews for control and a list view share the same collection. Collection are fetched just upon request (= button click).

A nice extra for this post: Sometimes, you have a JSON API that you can't directly access due to cross-policy browser concerns. Fortunately, there is a [proxy from Nodejitsu](https://jsonp.nodejitsu.com/) to emulat e JSONP request. This allows you to easily fetch data from JSON API without setting up a proxy yourself.









