---
title: CommonJS for the database
layout: post
tags: arangodb data
---
Thanks to [Browserify](https://github.com/substack/node-browserify), the [CommonJS](http://wiki.commonjs.org/wiki/CommonJS) module format is spreading into the browser.  Since some months, you can also use CommonJS modules in the [ArangoDB](https://www.arangodb.org/) database. Why would this be interesting? 

Let's start with a pattern: In many web applications, [ActiveRecord](http://www.martinfowler.com/eaaCatalog/activeRecord.html) objects are important building blocks to explore and query data. With specialized objects, you can easily enhance and organize data queries. And, with CommonJS modules, you can do this easily on top of raw [JSON](http://en.wikipedia.org/wiki/JSON) documents.

Although a [number of document stores](https://www.arangodb.org/2012/11/13/comparing-arangodb-with-mongodb-and-couchdb) provide JSON support, ArangoDB and its support of CommonJS modules stand out. As the shell of ArangoDB is based on V8, you can use Arangosh in a similar way as you would run Node to execute JavaScript. But by running "arangosh", you additionally have access to collections (and graphs) in the database.

Let's apply the idea of querying data with objects, with data coming from the [Kimonolabs](http://www.kimonolabs.com/worldcup/explorer) WorldCup football API. Hopefully, you'll get a feeling for:

* Exploring a data set with JavaScript and ArangoDB
* Using CommonJS modules to encapsulate data and queries

# Setup with JSON

Since it is the time of the football worldcup, the Worldcup API of [Kimonolabs]( ) provides a nice data set to start with. After getting an API key, [football matches](https://www.kimonolabs.com/worldcup/docs#MatchObject) can be retrieved with:

    var request = require("request");
    fs = require('fs');

    request("http://worldcup.kimonolabs.com/api/matches?apikey=...", 
    function(err, response, body) {
      fs.writeFile("matches.json", body);
    });

Similarly, [teams](https://www.kimonolabs.com/worldcup/docs#ListTeams) can be retrieved with:

    var request = require("request");
    fs = require('fs');

    request("http://worldcup.kimonolabs.com/api/teams?apikey=...", 
    function(err, response, body) {
      fs.writeFile("teams.json", body);
    });

After running these two API requests, you should have the files:

    matches.json
    teams.json

Inspecting the data, you will see that the football matches only contain references to the teams, but their names. Embedding the teams in a match object, will be our first task.

In order to work with the data in ArangoDB, you must import the data with:

    $ arangoimp --collection matches --create-collection true matches.json
    $ arangoimp --collection teams --create-collection true teams.json

# Enhanced Data

Let's write our first CommonJS module that help querying matches. The basic syntax to define a CommonJS module is with the following syntax in a file collections/matches.js:

    var Matches = function(raw) {
      this.raw = raw;
    }
    module.exports = Matches;

You can then load the query class in the Arango shell:

    arangosh [_system]> var Matches = require('collections/matches')

    arangosh [_system]> matches = new Matches(db.matches)
    [object Object]

This collection class can't do much yet. To have the module doing something useful, we extend collections/matches.js with a list function as follows:

    Matches.prototype.list = function() {
      return this.raw.toArray();
    }
    module.exports = Matches;

Now, in Arangosh, you can write:

    rangosh [_system]> matches.list()

And, you'll get something back that looks like:

    [ 
      { 
      "_id" : "matches/753627501", 
      "_rev" : "753627501", 
      "_key" : "753627501", 
      "currentGameMinute" : null, 
      "homeScore" : 0, 
      "awayScore" : 0, 
      "group" : "D", 
      "type" : "Match", 
      "startTime" : "2014-06-24T16:00:00.000Z", 
      "status" : "Pre-game", 
      "venue" : "Arena das Dunas (Natal, Rio Grande do Norte)", 
      "awayTeamId" : "088C4113-CEFC-460C-830C-277C148C0CE7", 
      "homeTeamId" : "B61B25AA-CD8E-4778-AC26-DD08D7851990", 
      "id" : "79BBB6ED-7E6B-4239-A287-177F97F10E3F" 
      }, 
      // ...

But as mentioned before, awayTeamId and homeTeamId are references to another collection, and we would like to see the actual teams in a match object, not the referenced ID.

To achieve this goal, you can make a teams collection as follows in collections/teams.js:

    var _ = require('underscore');

    var Teams = function(raw) {
      this.raw = raw;
    }

    Teams.prototype.show = function(id) {
      return _.first(this.raw.byExample({id: id}).toArray());
    }

    module.exports = Teams;

Note how you can include the [Underscore](http://underscorejs.org/) module to take advantage of its enumeration helpers, such as "_.first()" on an Array.

Next up, you can embed the teams in the Matches collection as follows:

    var _ = require('underscore');
    var Teams = require('./teams');

    var Matches = function(matches, teams) {
      this.raw = matches;
      this.teams = new Teams(teams);
    }

    Matches.prototype.show = function(id) {
      var match = _.first(this.raw.byExample({id: id}).toArray());
      match.awayTeam = this.teams.show(match.awayTeamId);
      match.homeTeam = this.teams.show(match.homeTeamId);

      return match;
    }

In Arangosh, you write:

    arangosh [_system]> matches = new Matches(db.matches, db.teams)
    arangosh [_system]> matches.show("BBBE6B39-E345-43C7-9E31-A442A866BF60")

And, you should now see an example of a match with embedded teams:

    { 
      "_id" : "matches/752644461", 
      "_rev" : "752644461", 
      "_key" : "752644461", 
      "currentGameMinute" : null, 
      "homeScore" : 0, 
      "awayScore" : 0, 
      "group" : "H", 
      "type" : "Match", 
      "id" : "8CF356AE-1F8D-4E61-B92A-A936F72B60B6", 
      "awayTeam" : { 
        // ...
        "name" : "Korea Republic", 
        "homeStadium" : "Seoul World Cup Stadium", 
        "id" : "8D6EAC04-14E9-4026-BF2A-AB81C4F3C529" 
      }, 
      "homeTeam" : { 
        // ...
        "homeStadium" : "Olimpiyskiy stadion Luzhniki", 
        "id" : "BBBE6B39-E345-43C7-9E31-A442A866BF60" 
      } 
    }

So, instead of writing a complex query with joins or subqueries, you now have some query object that wraps the relationship between Match and Teams.

But there are more options of using JavaScript to explore data in ArangoDB.
     
# Wrapping advanced queries

For advanced queries, ArangoDB provides AQL, an NoSQL query language that has some similarities with SQL. I wrote about some AQL basics in [a previous post](http://thinkingonthinking.com/aql-for-twitter-analysis/).

In this example, let's write an AQL query to filter matches for a given date:  

    FOR m IN matches
      FILTER DATE_TIMESTAMP(m.startTime) > DATE_TIMESTAMP("2014-06-14")
      FILTER DATE_TIMESTAMP(m.startTime) < DATE_TIMESTAMP("2014-06-16")
      RETURN m.startTime


We can easily add this query to the Matches query class as follows. In collection/matches:

    Matches.prototype.today = function() {
      var todayFilter = 'for m in matches \
      filter DATE_TIMESTAMP(m.startTime) > DATE_TIMESTAMP("2014-06-14") \
      filter DATE_TIMESTAMP(m.startTime) < DATE_TIMESTAMP("2014-06-16") \
        return m';
    
      return db._query(todayFilter).toArray();
    }
    
Running the following in Arangosh:

    arangosh [_system]> matches.today()

Results in:

    [ 
      { 
        "_id" : "matches/754413933", 
        "homeScore" : 3, 
        "awayScore" : 0,
        // ... 

Another nice thing on JavaScript query classes: You can include most of the 70k JavaScript modules from [npm](https://www.npmjs.org/) to support your queries. For example, [moment](https://www.npmjs.org/package/moment) to format and parse date types as needed.

# Conclusions

Using CommonJS in a database to build query classes looks very promising. You can enhance the basic JSON key-value pairs coming from a document store. With ArangoDB, you can organize advanced AQL queries. You could even serve your queries via HTTP and Foxx to the outside world.
