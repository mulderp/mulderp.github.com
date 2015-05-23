---
layout: post
title: Relations with BookshelfJS
tags: orm database
---
While many examples about Full Stack JavaScript applications use a NoSQL data store, one simple solution to manage data is with SQLIte. I wrote earlier about a basic Node.js stack with SQLite combining Knex and Bookshelf.js.

However, in that blog post is a while ago and a number of things have happened to those libraries. You can read about the roadmap [here](https://github.com/tgriesser/knex/issues/696). And, in my last post I left out dealing with relational data from Bookshelf, which there are surprisingly few discussions about.

# CLI migrations

The first feature I discovered are CLI migrations. They feel a lot like doing migrations in a Ruby-on-Rails project. Let's start with an example about managing movies in a database (disclaimer: It is my default example to try new libraries, and I wrote [a book about it](http://pipefishbook.com).

Say, there is a Movie that BelongsToMany Genres, e.g.

  The movie "The Artist" has the genres "Comedy, Drama"

We need to setup a database schema first. And, we can do this with the CLI.

First the movies table:



Then, the genres table:


And, the join table genres_movies (**):

join table called join_movies_genres that has FK movie_id and genre_id.

I try to


(**) It is actually not clear to me why it wouldn't be movies_genres. Or, how to deal with that different table
