---
layout: post
title: NoSQL Matters 2013 - A conference on scaling data
tags: conferences
---
Not sure whether you should be interested in NoSQL? Well, I was not sure either, and that was an important reason to visit the [NoSQL Matters 2013](http://2013.nosql-matters.org/cgn/) in Cologne. If you reflect, it is data that occupies a lot of our working life as software developers, and, technically, there are a lot of hidden assumptions made, when touching data questions.

First, there are assumptions around structuring data. Machines seem to assume that we should structure our data as much as possible, providing at least some tables (or schemas) upon which algorithms can easily operate. For engineers, that would not be too big of a problem. However, we as humans in general (and business people in particular), often encounter confusions. What level of ambiguity can we allow when we are doodling data models? What if your business problem tomorrow looks different from our design today? How to migrate data between different systems, while not impacting a running business? 

It is here, where a visit to the NoSQL country can help you see new options. Key-value stores and document-oriented database simplify storing data for prototyping or distribution, while graph databases provide almost unlimited ways to look for new patterns in data. Basically, with a NoSQL mindset we are better able to cross boundaries between persistence, distribution and querying of data and - like applying different filters - NoSQL solutions can help to separate signals from noise.

Second, the cost of data and data processing is still decreasing, maybe slower, but the trend is still downwards. And as often happened in computing, this will give rise to some wave of disruptive innovation. For tackling data persistence and distribution problems, I think this is where using open-source software will become much more viable than buying into 'luxury' database products from software vendors. This makes a visit to a NoSQL conference also very interesting, since many open-source developers are looking for feedback and solutions to their problems. And, projects on e.g. Github provide a much better platform to discuss concepts and shortcomings of dealing with data, than buying into todays (and tomorrows) promisses of existing database vendors.

Third, at a NoSQL conference, you feel that wrapping data with services helps to hide a lot of nitty-gritty details from using the data in applications. Similarly, as renting a car that brings you from A to B, an API is just enough abstraction to hide technical concern today from business requirements tomorrow. As such, APIs provide some common ground for designing the architecture of distributed systems and communicating transactions across a network.

All in all, NoSQL Matters 2013 in Cologne was a very rewarding conference. As many NoSQL developers will stress, SQL will not lose its relevance for sure, it's a good standard for dealing with some classes of problems, but at least for me, key-value stores, documents, vector clocks and graphs start slowly to make a lot more sense.

# Some references

* Learning to think with distributed data structures @coderoshi - [https://github.com/coderoshi/dds](https://github.com/coderoshi/dds)
* Martin Fowlers' Aggregation pattern - [http://martinfowler.com/bliki/AggregateOrientedDatabase.html](http://martinfowler.com/bliki/AggregateOrientedDatabase.html)
* Query data with Graphs - [http://de.slideshare.net/jexp/intro-to-neo4j-presentation](http://de.slideshare.net/jexp/intro-to-neo4j-presentation)
* Redis = (Remote) Data Structure Server - [https://speakerdeck.com/czarneckid](https://speakerdeck.com/czarneckid)
* Foxx - prototyping APIs with ArangoDB - [https://speakerdeck.com/moonglum/arangodb-foxx](https://speakerdeck.com/moonglum/arangodb-foxx)

