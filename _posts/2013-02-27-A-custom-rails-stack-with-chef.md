---
layout: post
title: Building a flexible Rails Stack with Chef
tags: chef server chef-solo
---
Most of us who develop Ruby based web applications will know that the setup and configuration of a stack of web infrastructure can be tricky:

* building Rubies including Gemsets often require libraries that look like strings of [captcha's](http://en.wikipedia.org/wiki/CAPTCHA)
* setup of webservers (nginx or apache) have special compile flags and configuration settings too
* Ruby webserver (Passenger or Unicorn nowadays) need to be built and configured with scripts
* databases are evolving (MySQL, PostgreSQL, MongoDB, Redis, Arango, Neo4J, Riak, ... ) and often come in combination

Additionally, your Unix most likely will need some essential build packages such as compilers, git, image processors, messaging queues, mailservers, etc, as well as Unix users and groups for basic security settings. Last but not least, there are different Unix distributions which bring additional surprises. So, even when opinions in Rails keep some decisions simple, a web development stack might differ from the one that a customer will use in production.

So, how can you test opinions on a web stack? Particulary, how can you test opinions in the context of a database-driven web application such as Ruby-on-Rails? I try to answer this with the help of 3 tools: Chef-solo, Berkshelf and Vagrant.

## 1. Abstractions in Chef

What Rails is to a database-driven web application, Chef might be to infrastructure: Opinions in code. But as far as I can judge, the ecosystem of infrastructure is much more diverse, than the different components of a model-view-controller design. Let's see how Chef attempts to abstract away the diversity in infrastructure:

* One of the most important abstractions in Chef are cookbooks. Cookbooks are similar to Gems in Ruby. Cookbooks bundle code (= "recipes") that can be configured with "attributes" and configuration "templates". In a way, cookbooks apply the MVC pattern: Data models are attributes, views are templates, and controllers are recipes. Cookbooks are opinionated, some more than others, but my advice for installation of services, is to look at [community cookbooks](http://community.opscode.com) first, and then at cookbooks found on cookbooks.

* Chef comes in a solo and server version. As a node in a network can take a certain role, your node configurations can be more complicated, and Chef server is a good place to start. Right now, we leave node clusters out of the picture, and just focus on getting services up fast. As far as I understand, this is the use case for Chef-solo.

* Berkshelf

* Vagrant






