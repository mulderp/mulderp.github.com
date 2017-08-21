---
layout: post
title: Relations with Bookshelf.js
tags: orm databases
---
SQL solves many problems to organize and query data. SQL has been used in many technology stacks for web applications. Most notably, the vocabulary of [Active Record and Ruby-on-Rails](http://guides.rubyonrails.org/active_record_basics.html) made working with relational data very simple.

Yet, if you work with Node.js, as I do for most of my projects, libraries for object-relational mapping, or ORM's, are less popular. There is no good reason, as for Node.js, the [Bookshelf.js](http://bookshelfjs.org/) library provides many interesting concepts as I wrote in [this blog post](http://thinkingonthinking.com/Bookshelf-an-ORM-for-Node/).

In that post, I showed how to manually setup a database schema with [Knex.js](http://knexjs.org/). I left out a discussion how to work with relations in Bookshelf. It is getting high time to iterate on those previous experiments. Even more so, as the libraries Knex and Bookshelf have made quite some progress since then.

# Basic Relations

To explore the new features of Bookshelf and Knex, let's work on a small API to provide movies data. This requires to discuss a simple data model first.

Usually, data models are based on [entity-relationship diagrams](http://en.wikipedia.org/wiki/Entity%E2%80%93relationship_model). Another option is to analyze the language when dealing with data, especially the relations between data. How this approach works is nicely discussed in the docs about [associations in Ruby-on-Rails](http://guides.rubyonrails.org/association_basics.html).

In this example about a movies database, movies have two interesting associations:

* A Movie *belongs to* a Director (association: "belongsTo"). And, a Director has many Movies (association: "hasMany"). For example, Steven Spielberg directed multiple movies, such as Jurassic Park (1993) and E.T. (1982).
* A Movie *belongs to many* Genres (association: "belongsToMany"). And, a Genre belongs to many Movies. For example, E.T. is a "Family" movie and a "Sci-Fi" movie. But the other direction is often important too, there are many other "Family" movies or "Sci-Fi" movies.

Managing these associations translate into 4 tables: Movies, directors, genres, and a join table movies_genres. To make the associations work, we require some foreign keys (FK's) in the database:

* A FK director_id in movies
* A FK movie_id and a FK genre_id in movies_genres

Now, let's turn this theory into something practical.


# CLI migrations

First, we need to setup a database schema. Instead of manual scripts, you can get help from Knex at the command line to generate migrations. Running these commands with Knex feel a lot like running "rake" in a Ruby-on-Rails project. 

First, you can run:

    $ knex init

This gives you a basic configuration file, similar to the database.yml in Ruby-on-Rails. For the movies project, I insert into the knexfile.js:

    module.exports = {
      development: {
        client: 'sqlite3',
        connection: {
          filename: './dev.movies'
        }
      }
    };

Now, we can prepare some migrations with the "knex migrate:make" command:

    $ knex migrate:make create_movies
    $ knex migrate:make create_genres
    $ knex migrate:make create_movies_genres
    $ knex migrate:make create_directors

Let's fill in the schema for movies in migrations/20150523115815_create_movies.js:

       var table = function (table) {
         table.increments().primary();
         table.string('title');
         table.integer('year');
         table.integer('director_id').references('directors.id');
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

All is basic Knex syntax. You must take care to add a reference to the directors table to make the associations later work. Let's build the table to store directors next with the file migrations/20150524153911_create_directors.js:

    var schema = function(t) {
      t.increments().primary();
      t.string('first_name');
      t.string('last_name');
      t.timestamps();
    };
    
    exports.up = function(knex, Promise) {
      return knex.schema.createTable('directors', schema)
        .then(function() {
          console.log('Directors table created.');
        });
    };
    
    exports.down = function(knex, Promise) {
      return knex.schema.dropTable('directors', schema)
        .then(function() {
          console.log('Directors table dropped.');
        });
    };

To store genres, we need a genres table and a join table.  Let's first write the schema for the genres table, in migrations/20150523120342_create_genres.js:

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

And last, the join table migrations/20150523120851_create_join_movies_genres.js:


    var table = function(t) {
      t.increments();
      t.integer('movie_id');
      t.integer('genre_id');
      t.timestamps();
    }
    
    exports.up = function(knex, Promise) {
      return knex.schema
                .createTable('movies_genres', table)
                .then(function () {
                   console.log('Join Table Movies_Genres table is created!');
                 });
    
    };
    
    exports.down = function(knex, Promise) {
      return knex.schema
                .dropTable('movies_genres', table)
                .then(function () {
                   console.log('Join Table Movies_Genres table is dropped!');
                 });
    };

Now, let's run the migrations with Knex:

    $ knex migrate:latest

These migrations should be a good start to explore some syntax of Bookshelf.js. You can check the resulting schema in e.g. SQLite with: 

    sqlite> .schema
    CREATE TABLE "directors" ("id" integer not null primary key autoincrement, "first_name" varchar(255), "last_name" varchar(255), "created_at" datetime, "updated_at" datetime);
    CREATE TABLE "genres" ("id" integer not null primary key autoincrement, "name" varchar(255), "created_at" datetime, "updated_at" datetime);
    CREATE TABLE "knex_migrations" ("id" integer not null primary key autoincrement, "name" varchar(255), "batch" integer, "migration_time" datetime);
    CREATE TABLE "movies" ("id" integer not null primary key autoincrement, "title" varchar(255), "year" integer, "director_id" integer, "created_at" datetime, "updated_at" datetime, foreign key("director_id") references "directors"("id"));
    CREATE TABLE "movies_genres" ("id" integer not null primary key autoincrement, "movie_id" integer, "genre_id" integer, "created_at" datetime, "updated_at" datetime);


# Defining basic relations

It took me some time to understand the syntax behind Bookshelf associations. Maybe because I had subtle errors in my schema at first. 

Before we can explore relations between Bookshelf models, we must setup a config file that reads the knexfile.js and configures Bookshelf. This code in config.js might be a first idea:


    var knexfile = require('./knexfile.js');
    var knex = require('knex')(knexfile.development);
    
    var bookshelf = require('bookshelf')(knex);
    bookshelf.plugin('registry');
    
    module.exports = bookshelf;
    
    /* Add Bookshelf models here:

      require('./models/movie');
      require('./models/director');
      require('./models/genre');

    */

You can then require this config as follows:

    var bookshelf = require('config');

There is another approach to require Bookshelf in every model. This is shown in Ghost blogging platform which uses a [Base Model](https://github.com/TryGhost/Ghost/blob/master/core/server/models/base.js).

To learn more about associations in Bookshelf, let's explore the relation between Movies and Directors.
 
The Bookshelf model for a Movie could be the following in a file ./models/movie.js:

    // load the database config 
    require('../config');
    require('./director');

    var Movie = bookshelf.Model.extend({
       tableName: 'movies',
   
       director: function() {
         return this.belongsTo('Director');
       }
   
    });
    module.exports = bookshelf.model('Movie', Movie);

Note that in this syntax, we reference the name of the associated model as String (i.e. 'Director'). This syntax is necessary to avoid  a problem with circular dependencies that would occur by referencing the class Director directly.

The Director class can look as:

    require('../config');
    require('./movie');
    
    var Director = bookshelf.Model.extend({
      tableName: 'directors',
      movies: function() {
        return this.hasMany('Movie');
      }
    });
    
    module.exports = bookshelf.model('Director', Director);

Let's explore this in the Node REPL next.

# Play

You can start the Node console with:

    $ node
    > bookshelf = require('./config')

Next, you can require Movie and Director with:


    > Movie = require('./models/movie')
    > Director = require('./models/director')

And explore Bookshelf from here. One thing I found was, that it was not possible to "attach" a director to a movie directly. But maybe I just did not found the right syntax yet. As we later will see, you can attach associated data in has-many relations. 

# Getting used to Promises

Last, I thought I knew how to work with promises, but still it was rather difficult. For example, I tried these "stupid" expressions:

    var DB = require('knex')({client: 'sqlite3', 
      connection: { filename: 'dev.sqlite' } 
    });
    DB('movies')
      .insert({title: 'foo'})
      .insert({title: 'bar'})

This does not work. Then, I expected this to work:

    DB('movies')
      .insert({title: 'foo'})
      .return(DB)
      .insert({title: 'bar'})


For me, working with Promises is less intuitive than I would have thought. In the REPL, it requires extra typing of "then" and sometimes, it is hard to resolve a Promise to just obtain plain data. We'll come back to this in a later blog post, but let me know your ideas and experiences about this.

You can take a look at the code of this blog post [here](https://github.com/mulderp/bookshelf-demo/tree/blog_post).
