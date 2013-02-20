---
layout: post
title: What is Erlang?
tags: erlang
---
You will touch Erlang at some point, if you follow the development of distributed systems. Erlang is a remedy to the pains of a monolithic application. And great programmers such as [Adam Wiggins](http://about.adamwiggins.com/) or [Jose Valim](http://plataformatec.com.br/crafting-rails-applications) name Erlang in the context of scalable systems e.g. in [this article](http://adam.heroku.com/past/2009/9/28/background_jobs_with_rabbitmq_and_minion/) or [here](http://blog.plataformatec.com.br/2011/03/why-rubyists-should-try-elixir/). So, I was curious enough to attend a great, small conference on Erlang:  [Munich Erlang Factory Lite 2013](http://www.erlang-factory.com/conference/Munich2013)

As someone who is new to Erlang, a first question must be asked: What is Erlang? Let's look at different aspects.

## How does Erlang code look like? 

* At first, Erlang code does not look much different from Ruby, JavaScript or CoffeeScript: You'll see traces of a dynamic type system and Erlang allows to dynamically run code with some kind of console ("erl"), the Erlang Emulator. 

* Looking more at the code, you'll see that lines of code sometimes end with a "dot". This triggers code execution. As a beginner, it's the moment when you see error messages and interpretation of error messages is rather difficult. To me, Erlang errors are cryptic, and apparently line numbers in errors were a late innovation. 

* Further, the code you'll see may contain tuples and atoms, some of the main data types in Erlang. Nota bene, the concept of String is not a data type in Erlang, but rather an Array of characters as in e.g. C. Some people say this makes string operations more difficult than in other languages. Other people say, it's less error prone too. To a beginner, it's hard to judge.

## Erlang modules and libraries

Once programming, you will quickly discover an important Erlang concept: Modules. Modules wrap functions and behavior of code. Additionally, modules can be distributed within libraries, and as in any other programming languages, libraries make a programmer's life fun. 

The magic command to import libraries into your Erlang project is ["rebar"](https://github.com/basho/rebar). Rebar also allows to easily create a new Erlang project. And, rebar is from [Basho](http://basho.com/).

## Why Erlang?

So far, so good. Erlang programming is about functions and values, and that sounds like no big deal to some. However, the main aspects of Erlang are reflecting on errors when needed, and reliably running concurrent processes. It's here where the Erlang fun part starts, and other languages just suck (for the skeptics, maybe you can read [the books suggested here](http://stackoverflow.com/questions/6923480/java-thread-programming-book)).

* In Erlang, there seems to be the idea of "let it crash". In a monolithic application, this usually means the death of an application. In a Unix system, this may mean to kill a process. In Erlang, you get a [supervisor](http://www.erlang.org/doc/design_principles/sup_princ.html) that may take care of this, when a process is idling or conflicting with another process. The supervisor may decide to retry, continue, or check later. This is new to me, but I haven't come across this mentality in any other pogramming language so far.

* Having better ways to deal with exceptions, you'll also get better ways to deal with concurrency. It's rather new to me, but to understand why this helps, think of a monolithic application that triggers delayed jobs. If you run you run multiple applications in your server cluster, and have eventually multiple delayed jobs, from my experience, you can get [race conditions](http://en.wikipedia.org/wiki/Race_condition) and other problems, that are really hard to debug. Erlang to the rescue. With Erlang, you'll get some ways to have processes check what another process is doing. The mechanisms that you'll hear people talk about are [monitoring](http://learnyousomeerlang.com/errors-and-processes#monitors) or linking processes, resulting into process [robustness](http://www.erlang.org/doc/getting_started/robustness.html). The code of [RabbitMQ](http://www.rabbitmq.com/) must show clever ways to deal with message concurrency.

## Conclusions

So, my main conclusions:

* Erlang provides a dynamic toolchain that helps rethinking concurrency and fault-tolerance. Some more meta-discussions and examples on Erlang are these: John-Paul Bader discusses more on [why erlang here](http://smyck.net/2012/04/22/why-erlang/). [Basho](https://github.com/basho) implemented [Amazon's Dynamo](http://www.allthingsdistributed.com/2007/10/amazons_dynamo.html) with Erlang, and the company is a great contributor and promotor to the Erlang community. And if you are not so much into web, Peer Stritzinger together with [Embedded-brains](http://www.embedded-brains.de/index.php?id=1&L=1) use Erlang for [scalable hardware](http://www.stritzinger.com/Peer-Stritzinger.GmbH/Hydraprog-3.html).

* Good places to get started with Erlang are John Paul's [Setup an API in 10 minutes](http://smyck.net/2013/02/17/how-to-set-up-a-basic-http-api-with-erlang-in-10-minutes/) and [http://learnyousomeerlang.com/](http://learnyousomeerlang.com/). Also, this blog post is a great overview: [http://www.nodal.info/2012/10/top-10-resources-for-getting-started.html](http://www.nodal.info/2012/10/top-10-resources-for-getting-started.html). [Pavlo Baron](http://de.slideshare.net/pavlobaron/let-it-crash-seacon11-pavlo-baron) does a lot of convincing work on [using Erlang](http://de.slideshare.net/pavlobaron/erlang-is-a-one-way).

* OTP are the Erlang libraries that help in designing distributed applications. See [http://learnyousomeerlang.com/what-is-otp](http://learnyousomeerlang.com/what-is-otp). The guy to ask on what's OTP is [Francesco Cesarini](https://www.erlang-factory.com/upload/presentations/719/francesco-otp.pdf).

* If you are into web development, see [Elixir](https://github.com/elixir-lang/elixir) and [Dynamo](https://github.com/elixir-lang/dynamo). This looks the place to start writing your next hit-in-one API.
