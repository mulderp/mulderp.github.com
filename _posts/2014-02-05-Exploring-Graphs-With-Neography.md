---
layout: post
title: Exploring Graphs with Neography
tags: graph database
---
Working with graphs requires at least two things: Importing graph data and 'traversing' the graph. Yet, when working with Neo4J and Ruby, we also need some Ruby gem to connect to a graph engine. As Alberto Perdomo from [GrapheneDB](http://www.graphenedb.com/) pointed out, it is practical to start development in Ruby for graphs with [Neography](https://github.com/maxdemarzi/neography) by [Max de Marzi](https://twitter.com/maxdemarzi).

What do we need?

First, I thought that I needed to run [JRuby](http://jruby.org/) - since Neo4J is Java, but since Neography is just a basic REST client, this is not stricly required. Yet, if you want to try JRuby, now might be a good moment with:

    rbenv-install jruby-1.7.4

We can install Neography by adding this line to Gemfile:

    gem 'neography'

Once, Neography is installed, we must setup our configs. When you work with a graph instance at GrapheneDB, this will look like:

<pre>
Neography.configure do |config|
  config.protocol           = "http://"
  config.server             = "yyy.xxx.zzz.graphenedb.com"
  config.port               = 42424
  config.directory          = "" 
  config.cypher_path        = "/cypher"
  config.gremlin_path       = "/ext/GremlinPlugin/graphdb/execute_script"
  config.log_file           = "neography.log"
  config.log_enabled        = false
  config.slow_log_threshold = 0    # time in ms for query logging
  config.max_threads        = 20
  config.authentication     = "basic"  # 'basic' or 'digest'
  config.username           = "some_user"
  config.password           = "some_password"
  config.parser             = MultiJsonParser
end
</pre>

If we do this in e.g. 'config/initializers/neography.rb', we can simply start the Rails console with:

  bundle exec rails c

Now, we instantiate a Neography client with:

  irb(main):003:0> @neo = Neography::Rest.new

This client can be used for creating nodes and relationships, as well as querying the graph. Basically, the discussion from Max de Marzi on [Getting Started](http://maxdemarzi.com/2012/01/04/getting-started-with-ruby-and-neo4j/) can be followed without problems.

What is a bit of a problem is parsing the results from a Cypher query. For example, if we do:

   irb(main):002:0>  @neo.execute_query("START n=node(*) MATCH (n)-[r]->(m) RETURN n,r,m;")

We will see a huge hash containing meta information, many nodes and urls. It takes a bit of practice to convert this result set into something more "usable". Here are some clues:

* The initial result set is a hash. Therefore we can call ".keys" on this and see a "columns" and "data" separation.
* The interesting stuff is under the key "data". So depending on the Cypher query, we have ["data"] we either an array or another hash.
* Arrays can easily be explored with picking one element, e.g. with "first".
* Once, we understand what is in the result, we can use "map", and rinse and repeat


So, as an example, we can explore the name of all nodes with an relationship with the following query:

   @neo.execute_query("START n=node(*) MATCH (n)-[r]->(m) RETURN n,r,m;")["data"].map{|d| d.first["data"]}


And, we will see something like:

    => [{"name"=>"Max", "age"=>31}, {"name"=>"Johnathan"}, {"name"=>"Johnathan"}, {"name"=>"Mark"}, {"name"=>"Mark"}, {"name"=>"Mark"}, {"name"=>"Mark"}, {"name"=>"Mark"}, {"name"=>"Mark"}, {"name"=>"Phil"}, {"name"=>"Phil"}, {"name"=>"Phil"}, {"name"=>"Phil"}, {"name"=>"Phil"}, {"name"=>"Phil"}, {"name"=>"Mary"}, {"name"=>"Mary"}, {"name"=>"Mary"}, {"name"=>"Mary"}, {"name"=>"Luke"}, {"name"=>"Luke"}]

So, with this, we have some way to run Graph queries from Ruby-on-Rails, although the processing of the result set needs some special wrappings. What are you learnings on querying graphs from Ruby? Especially, it would be great to hear more about the transformation from graph to JSON that can be rendered in a web application.


