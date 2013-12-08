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


Instead of looking up the SQL syntax to define a tables and columns, we define [a schema](http://knexjs.org/#Schema) with:

<pre>
var table = function (table) {
  table.string('title');
  table.timestamps();
};

DB.schema.createTable('movies', table).then(function () {
  console.log('Movies Table is Created!');
});
</pre>






, standing there unchallenged for decades. Yet, SQL requires you to predefine a database schema. Both, predefining a schema and querying data, have been "difficult" in JavaScript so far.



