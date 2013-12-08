---
layout: post
title: Bookshelf - An ORM for JavaScript
tags: Node JavaScript Databases
---
"We want to be able to ask questions to our data, without predefining the way we structure our data" - an argument for "No"-SQL, put forward in this very nice [talk](http://www.youtube.com/watch?v=fEsmydn747c) on ElasticSearch by Shay Banon.

Still, today we often use SQL, and it is required that you predefine your schema or structure your data beforehand. This means to query data, you must add and remove attributes from a schema, define how data is connected (or how data can be joined) to run actual queries. 

And if you want to do this with Node.js, you often were left alone with your RDBMS backend. Not anymore, since thanks to [Tim Griesser](https://twitter.com/tgriesser), there are a number of fresh ideas for working with data in Node.js. Let's have a look at [Knex](http://knexjs.org/) and [Bookshelf](http://bookshelfjs.org/). 

## Knex

[Knex](http://knexjs.org/) is a promissing wrapper for SQL in JavaScript. With Knex, we quickly can connect to a MySQL, Postgres or SQLite database.

As example, let's use SQLite3:

<pre>
var Knex = require('knex');
var DB = Knex.initialize({client: 'sqlite3', 
              connection: { filename: 'mydb.sqlite' } 
     });
</pre>

From now on, we can use the DB object to define tables and attributes, basically, we can do [schema operations](http://knexjs.org/#Schema):

<pre>
// this is our schema example:
var table = function (table) {
  table.string('title');
  table.timestamps();
};

// this executes the schema operation:
DB.schema.createTable('movies', table).then(function () {
  console.log('Movies Table is Created!');
});
</pre>

Adding a new column to the movies table is as easy with the [table](http://knexjs.org/#Schema-table) commands:

<pre>

var addYear = function (table) { 
   table.integer('year');
};

DB.schema.table('movies', addYear)
  .then(function() { console.log("Attribute added"); })
  .catch(function(err) { console.log(err) });
</pre>

And, we can check with SQLite:

<pre>
sqlite> .schema movies
CREATE TABLE "movies" ("title" varchar(255), "created_at" datetime, "updated_at" datetime, "year" integer);
</pre>

Next, let's insert some data:

<pre>
DB('movies')
   .insert({title: "The Artist", year: 2010})
   .then(function() { console.log("added"); })
   .catch(function(err) { console.log(err) });
</pre>

And, when we check in SQLite3:

<pre>
sqlite> select * from movies;
The Artist|||2010
</pre>

Ok, so we have Create and Read, I leave the Update and Delete as an exercise to the reader, but would be great to hear your CRUD experience.


## Bookshelf

Although SQL is nice for asking questions to data (and once in a while to write new data), the applications are based on data abstractions. This is where the realm of ORM (or object-relational-mappers) starts. Or, [Bookshelf](http://bookshelfjs.org/).

Inspired by Backbone and Underscore.js, Bookshelf provides a Model and Collection abstraction. Similarly as in Backbone, a model is wrapping data attributes, or a row in an RDBMS. The important idea in Bookshelf however, is a standarized way to write, read and delete data: "save", "fetch" and "delete". Additionally, Bookshelf let's you make connections between data or "joins".

We could write, e.g. a Movie hasMany Genres, as well as Genres belongsToMany Movies.

Another idea, that I like is the "[forge](http://bookshelfjs.org/#Collection-forge)" method. With this, you can set default values in a model. That can make a lot of sense, if you store predefined values, such as Mrs. or Mr., or a default date for example.

The Collections in Bookshelf look great too, since they give you a lot of helpers from Underscore. I need to explore these a bit with e.g. 1000 rows of movie data, and see how good they work in practice, but the idea looks great. Another blog post follows hopefully soon.


## Conclusions

Knex and Bookshelf provide a very nice set of server-side abstractions to work with a RDBMS in Node.js. This makes your data-layer more flexible, and might also be interesting in a schema-less world, as this [discussion](https://github.com/tgriesser/bookshelf/issues/102) and the mentioning of mongoose in [this discussion](https://github.com/tgriesser/bookshelf/issues/69) shows.

Also, I wonder, if Knex and Bookshelf could be used to develop an API application with [Foxx](https://www.arangodb.org/foxx) and [ArangoDB](https://www.arangodb.org/). ArangoDB comes with [AQL](https://www.arangodb.org/manuals/current/Aql.html) - a query language for NoSQL that supports join operations. One promise of a combination of both ArangoDB and Bookshelf might be to ask questions to data, without predefining a schema.
