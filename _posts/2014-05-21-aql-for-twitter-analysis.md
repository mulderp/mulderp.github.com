---
title: AQL for Twitter Analysis
tags: oauth aql arangodb
layout: post
images:
- /static/images/twitter_oauth.png
- /static/images/aql_editor.png
---
The Twitter API is great to tap into machine readable representations of Twitter data. In this post, we explore a small combination of a Node script together with ArangoDB.

As ArangoDB is built around the V8 JavaScript engine, it is possible to load and run JavaScript modules from the ArangoDB console to explore data. This post discusses preliminary ideas on connecting to Twitter and basic AQL functions.

## Authentication

Before you can play with data from Twitter, you must setup authentication for API calls to Twitter. This is the first hurdle to access Twitter data. To make requests to the Twitter API, you must signup for a free Twitter developer account and register your app.


For this, you can go to [dev.twitter.com/app/new](https://apps.twitter.com/app/new) and signup your app. After successful signup, you'll get an API key and an API secret. These token are needed to verify that an request is coming from your app.

Next, you will find some URLs:

    App-only authentication: https://api.twitter.com/oauth2/token
    Request token URL: https://api.twitter.com/oauth/request_token
    Authorize URL: https://api.twitter.com/oauth/authorize
    Access token URL: https://api.twitter.com/oauth/access_token

With these URLs, your app can request access tokens for a user. This might be interesting if you want to analyze data for multiple Twitter users. In order to authorize an application for a user, you can use this script [here](https://gist.github.com/mulderp/22174782ebe36bce0c50).

## Lookup Twitter Users

Once your Twitter user has an access token, you can make all the request to the Twitter API that are documented [at dev.twitter.com](https://dev.twitter.com/docs/api/1.1). For our data analysis experiments, things are getting interesting from [Friends & Followers](https://dev.twitter.com/docs/api/1.1#94) section.

Let's first fetch our friends. Since the OAuth requests can get a bit hairy, Twitter provides an OAuth tool, see the following screenshot:

<img src="{{page.images[0]}}">

For example, if you go to the documentation of [GET /users/lookup](https://dev.twitter.com/docs/api/1.1/get/users/lookup), you'll see a button "Generator OAuth Signature". Clicking through the different options, you eventually end up with an example curl request, that might look similar to:

    $ curl --get 'https://api.twitter.com/1.1/users/lookup.json' --data 'screen_name=twitterapi%2Ctwitter' --header 'Authorization: OAuth oauth_consumer_key="....", oauth_nonce="....", oauth_signature="....", oauth_signature_method="HMAC-SHA1", oauth_timestamp="1400617420", oauth_token=".....", oauth_version="1.0"' --verbose
 
If you run this curl request from the command line, you should see something like:

    [{"id":6253282,"id_str":"6253282","name":"Twitter API","screen_name":"twitterapi","location":"San Francisco, CA","description":"The Real Twitter API. ..."}]

Let's replace the manual curl call with a small Node script:

    var request = require('request');
    var qs = require('querystring');
    
    var CONSUMER_KEY = '....';
    var CONSUMER_SECRET = '...';
    var access_token = '....';
    var access_token_secret = '....';
    
    var oauth = { consumer_key: CONSUMER_KEY,
      consumer_secret: CONSUMER_SECRET,
      token: access_token,
      token_secret: access_token_secret
    };
    
    var friends = 'https://api.twitter.com/1.1/friends/ids.json';
    var lookup = 'https://api.twitter.com/1.1/users/lookup.json?';

    request.get({url: friends, oauth: oauth, json: true}, function(e, r, resp) {
    
      if (e) {
        console.log('error: ', e);
        return;
      }
    
      console.log(resp.ids.length);
      lookup += 'user_id=' + resp.ids.slice(1,100);
      console.log(lookup);
    
      request.get({url: lookup, oauth: oauth, json: true}, function (e, r, users) {
        if (e) {
          console.log('error: ', e);
          return
        }
        console.log(users.length);
        fs.writeFile('friends.json', JSON.stringify(users));
      });
    })

If all goes well, you'll have a 100 friends in a file friends.json

## AQL Basics

Let's do some data manipulation with AQL and ArangoDB next. First, you must import your Twitter data into the database.

    $ arangoimp --create-collection true --collection mulpat_friends friends.json

    ----------------------------------------
    database:         _system
    collection:       mulpat_friends
    create:           yes
    file:             friends.json
    type:             json
    connect timeout:  3
    request timeout:  300
    ----------------------------------------
    Starting JSON import...
    2014-05-21T05:33:43Z [76325] INFO processed 32768 bytes (11.42%) of input file
    2014-05-21T05:33:43Z [76325] INFO processed 65536 bytes (22.83%) of input file
    2014-05-21T05:33:43Z [76325] INFO processed 98304 bytes (34.25%) of input file
    2014-05-21T05:33:43Z [76325] INFO processed 131072 bytes (45.66%) of input file
    2014-05-21T05:33:43Z [76325] INFO processed 163840 bytes (57.08%) of input file
    2014-05-21T05:33:43Z [76325] INFO processed 196608 bytes (68.49%) of input file
    2014-05-21T05:33:43Z [76325] INFO processed 229376 bytes (79.91%) of input file
    2014-05-21T05:33:43Z [76325] INFO processed 262144 bytes (91.32%) of input file
    2014-05-21T05:33:43Z [76325] INFO processed 287050 bytes (100.00%) of input file
    
    created:          99
    errors:           0
    total:            99
    
Let's explore the data with AQL. First, we want to get a quick overview on the friends' locations.

First, let's return information on friends in a location:

    for u in mulpat_friends
      filter u.location == 'San Francisco'
      return u.screen_name

This returns:

    [
      "Fullstack node.js developer",
      "Labs Manager @WeWork"
    ]

Often it is nice to aggregate information. With AQL, the main statement is 'collect' and its syntax is as:

    for u in mulpat_friends
      collect city = u.location into g
      return {city: city}

This results into:

    [
      {
        "city": "Amsterdam"
      },
      {
        "city": "Barcelona"
      },
      {
        "city": "Barcelona, the World"
      },
      {
        "city": "bavaria and berlin"
      },
      {
        "city": "Bavaria/Berlin "
      }
      // ...
    ]

You can see already that grouping friends to a location might be difficult since it would require parsing. But with this "imperfect" data, what is the location where we have most friends? This question can be answered by sorting to the length of members in a group:

    for u in mulpat_friends
      collect city = u.location into g
      sort length(g) desc
      return {city: city, count: length(g)}

This returns into:

    [
      {
        "city": "",
        "count": 13
      },
      {
        "city": "San Francisco, CA",
        "count": 5
      },
      {
        "city": "Munich, Germany",
        "count": 4
      },
      {
        "city": "Munich",
        "count": 4
      },
      ...
   ]

Last, AQL also allows subqueries. For example, in what locations could we reach most followers? To answer this question, you could the following nested query:

    for u in mulpat_friends
      collect city = u.location into g
      sort length(g) desc
      return { 
               city: city, count: length(g),
               friends_count: (for f in g return f.u.friends_count)
             }

This query would return something like:


      {
        "city": "San Francisco, CA",
        "count": 5,
        "friends_count": [
          112,
          573,
          1007,
          49,
          286
        ]
      },
      {
        "city": "Munich, Germany",
        "count": 4,
        "friends_count": [
          995,
          38,
          48,
          246
        ]
      },
      {
        "city": "Munich",
        "count": 4,
        "friends_count": [
          25,
          282,
          47,
          63
        ]
      },


Or, you could ask, in what locations live most of Twitter influencers, based on calculating a ratio between friends and followers:

    for u in mulpat_friends
      collect city = u.location into g
      sort length(g) desc
      return {city: city, count: length(g), friends_count: (for f in g return f.u.friends_count/f.u.followers_count)}

Of course this would need to be averaged out.

<img src="{{page.images[1]}}">
