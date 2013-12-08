---
layout: post
title: Bookshelf - an ORM for JavaScript
tags: Node JavaScript Databases
---
"We want to able to ask questions to our data, without predefining the way we structure our data" - basically an argument for NoSQL and against SQL, put forward in this very nice [talk](http://www.youtube.com/watch?v=fEsmydn747c) on ElasticSearch by Shay Banon.

Still, if you want to use SQL, it is required that you to predefine your schema or structure your data beforehand. This means to query data, you must add and remove attributes from a schema, define how data is connected (or how data can be joined) or run actual queries. All in all, developing a Node.js application with an RDBMS backend are in strong needs for libraries such as [Bookshelf](http://bookshelfjs.org/) and [Knex](http://knexjs.org/).

## Knex

Knex is a promissing wrapper for SQL in JavaScript. With Knex, we quickly can connect to a MySQL, Postgres or SQLite database.

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

Although SQL is nice for asking questions to data (and once in a while to write new data), the applications are based on data abstractions. This is where the realm of ORM (or object-relational-mappers) starts. Or, Bookshelf.

Inspired by Backbone and Underscore.js, Bookshelf provides a Model and Collection abstraction. Similarly as in Backbone, a model is wrapping data attributes, or a row in an RDBMS. The important idea in Bookshelf however, is a standarized way to write, read and delete data: "save", "fetch" and "delete". Additionally, Bookshelf let's you make connections between data or "joins".

We could write, e.g. a Movie hasMany Genres, as well as Genres belongsToMany Movies.

Another idea, that I like is the "forge" method. With this, you can set default values in a model. That can make a lot of sense, if you store predefined values, such as Mrs. or Mr., or a default date for example.

The Collections in Bookshelf look great too, since they give you a lot of helpers from Underscore. I need to explore these a bit with e.g. 1000 rows of movie data, and see how good they work in practice, but the idea looks great. Another blog post follows hopefully soon.


## Conclusions

Knex and Bookshelf provide a very nice set of server-side abstractions to work with a database in Node.js. This makes your data-layer more flexible, and might also be interesting in a schema-less world, as this [discussion](https://github.com/tgriesser/bookshelf/issues/102) and the mentioning of mongoose in [this discussion](https://github.com/tgriesser/bookshelf/issues/69).

Also, I wonder, if Knex and Bookshelf could also be used to develop an API application with Foxx and ArangoDB. ArangoDB comes with [AQL](https://www.arangodb.org/manuals/current/Aql.html) - a query language for NoSQL that supports join operations. One promise of a combination of both ArangoDB and Bookshelf might be to ask questions to data, without predefining a schema.