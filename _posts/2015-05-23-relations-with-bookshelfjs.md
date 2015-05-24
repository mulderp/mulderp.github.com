---
layout: post
title: Relations with BookshelfJS
tags: orm database
---
SQL is still a very popular solution to organize and query data. While it is rather popular to use Node.js with NoSQL data stores, such as MongoDB, you can easily integrate [an RDMS with Node.js](http://thinkingonthinking.com/Bookshelf-an-ORM-for-Node/) too. This makes it possible to apply some concepts from [Active Record and Ruby-on-Rails](http://guides.rubyonrails.org/active_record_basics.html) to your next web application in Node.js.

In my earlier blog post about Bookshelf, I mainly showed how to manually setup a schema with Knex.js. I left out a discussion how to work with related data. Therefore it is getting high time to iterate on the previous experiments. Even more so, as the libraries Knex and Bookshelf have made quite some progress since.

# Basic Relations

To explore the new features of Bookshelf and Knex, let's work on a small application to manage movies data. In this example, movies have two interesting associations:

* A Movie belongs to a Director (belongsTo). And, a Director has many Movies (hasMany). For example, Steven Spielberg directed Jurassic Park (1993) and E.T. (1982) among others.
* A Movie belong to many Genres. And, Genres belong to many Movies. For example, E.T. is a "Family" movie and a "Sci-Fi" movie.

Managing these associations translate to 4 tables: Movies, directors, genres, join table movies_genres. And, to make the associations work, they require some foreign keys:

* A FK director_id in movies
* A FK movie_id and a FK genre_id in movies_genres

# CLI migrations

First, we need to setup a database schema. Instead of manual scripts, you now can get help from Knex at the command line to generate scripts. Running commands with Knex for migrations and seeds feel a lot like running "rake" in a Ruby-on-Rails project. 

First, you can run "knex migrate:make" for some tables:

    $ knex migrate:make create_movies
    $ knex migrate:make create_genres
    $ knex migrate:make create_movies_genres
    $ knex migrate:make create_directors

Next, let's fill in these migrations:

    $ cat > migrations/20150523115815_create_movies.js

       var table = function (table) {
         table.increments().primary();
         table.string('title');
         table.integer('year');
         table.integer('director_id');
         table.timestamps();
       };
       
       exports.up = function(knex, Promise) {
         return knex.schema.createTable('movies', table)
                   .then(function () {
                     console.log('Movies table is created!');
                    });
       };
       
       exports.down = function(knex, Promise) {
        return knex.schema
                   .dropTable('movies', table)
                   .then(function () {
                     console.log('Movies table was dropped!');
                    });
       
       };

Then, the genres table:

    $ cat > migrations/20150523120342_create_genres.js
    var table = function(t) {
      t.increments().primary();
      t.string('name');
      t.timestamps();
    }
    
    exports.up = function(knex, Promise) {
      return knex.schema.createTable('genres', table)
               .then(function () {
                 console.log('Genres table is created!');
                });
    };
    
    exports.down = function(knex, Promise) {
      return knex.schema
                .dropTable('genres', table)
                .then(function () {
                  console.log('Genres table was dropped!');
                 });
    };


# Defining relations

It took me some time to make this actually work. Maybe because I had the wrong schema at first. But here is a basic working schema



# Getting used to Promises

Last, I thought I knew how to work with promises, but still it was rather difficult. For example inserting data in a row. I expected that this would work:

    DB('movies')
      .insert({title: 'foo'
      .insert({title: 'foo'
      .insert({title: 'foo'

Now, it doesn't. Then, I expected this to work:

    DB('movies')
      .insert({title: 'foo'
      .return(DB)
      .insert({title: 'foo'
      .insert({title: 'foo'



(**) It is actually not clear to me why it wouldn't be movies_genres. Or, how to deal with that different table

You can read about the roadmap [here](https://github.com/tgriesser/knex/issues/696). And, in my last post I left out dealing with relational data from Bookshelf, which there are surprisingly few discussions about. The main blog post seems to be (this)[http://dangertomanifold.com/working-with-relational-data-in-bookshelf-js/]. 

Let's start with an example about managing movies in a database (disclaimer: It is my default example to try new libraries, and I wrote [a book about it](http://pipefishbook.com).

