---
layout: post
title: Building a flexible Rails Stack with Chef
tags: chef server chef-solo
---
Most of us who develop Ruby based web applications will know that the setup and configuration of a stack of web infrastructure can be tricky:

* building Rubies including Gemsets often require libraries that look like strings of [captcha's](http://en.wikipedia.org/wiki/CAPTCHA)
* setup of webservers (nginx or apache) have special compile flags and configuration settings too
* adaptors for Rack (Passenger or Unicorn nowadays) need to be built or wrapped in scripts
* databases are evolving (RDBMS, document-stores, key-value stores, graph db's ... ) and often come in pairs

Additionally, your Unix most likely will need some essential build packages such as compilers, git, image processors, messaging queues, mailservers, etc, as well as Unix users and groups for basic security settings. Last but not least, there are different Unix distributions which bring additional surprises. 

So, even when opinions in Rails keep some decisions simple, a web development stack might differ from the one that you or your customer will use in production.

With all these choices, how can you test opinions on a web stack that are good for you? 

Particulary, how can you test opinions in the context of a database-driven web application such as Ruby-on-Rails? 

I try to answer this with the help of 3 tools: Chef-solo, Berkshelf and Vagrant.

## 1. Abstractions in Chef

What Rails is to a database-driven web application, Chef might be to infrastructure: Opinions in code. But as far as I can judge, the ecosystem of infrastructure is much more diverse, than the different components of a model-view-controller design. Let's see how Chef attempts to abstract away the diversity in infrastructure:

* One of the most important abstractions in Chef are cookbooks. Cookbooks are similar to Gems in Ruby. Cookbooks bundle code (= "recipes") that can be configured with "attributes" and configuration "templates". In a way, cookbooks apply the MVC pattern: Data models are attributes, views are templates, and controllers are recipes. Cookbooks are opinionated, some more than others, but my advice for installation of services, is to look at [community cookbooks](http://community.opscode.com) first, and then at opinions found in cookbooks found at Github.

* As we just tackle a single node setup, Chef-Solo provisioning with Vagrant is a sweet combination. Vagrant takes care of your Unix VM, and Chef-Solo can easily load cookbooks from your local environment.

* The setup of a web infrastructure stack will require multiple cookbooks, and you'll quickly feel that downloading cookbooks yourself, and variation of cookbooks should be managed with some tool. So far, I tried 2 tools to manage cookbooks: Berkshelf and Librarian-Chef. Whereas Librarian manages quite well the download part, Berkshelf helps in solving package problems at hand. Think of Berkshelf as the Bundler for Ruby gems and in let's say 80% of cases, you'll just want to download cookbooks and can live with cookbook defaults, rather than deriving your own version of a cookbook. Berkshelf helps to abstract away the details when needed.

* Vagrant is your infrastructure lab. I wrote about some first steps with Vagrant, [here](http://thinkingonthinking.com/An-experiment-with-Vagrant-and-Neo4J/), [here](http://thinkingonthinking.com/building-a-Vagrant-base-box/) and [here](http://thinkingonthinking.com/minimum-nginx-node-with-librarian-chef/).

## 1. Your shiny new Ruby 2.0 and Rails 4.0 beta stack

I hope the abstractions above can give you some taste of what is coming up in this section. First, let's think on a Rails application stack:

* RVM to manage Rubies (could be rbenv too)
* Passenger to consume and respond with requests for/from Rack (could be Unicorn)
* PostgreSQL to deal with data storage
* Nginx as proxy for logging

We could define the stack's dependencies with Berkshelf in the Berksfile as follows:

<pre>
site :opscode

cookbook 'apt'
cookbook 'build-essential'
cookbook 'users'
cookbook 'rvm', :git => "https://github.com/fnichol/chef-rvm"
cookbook 'nginx'
cookbook 'postgresql'
</pre>

Running a:

<pre>
  berks install
</pre>

imports all cookbooks to your local Chef environment. Next, we need to setup the Vagrantfile to use Chef-solo provisioning:

<pre>

require 'multi_json'
require 'berkshelf/vagrant'

Vagrant::Config.run do |config|
  VAGRANT_JSON = MultiJson.load(Pathname(__FILE__).dirname.join('.', 'node.json').read)

  config.vm.provision :chef_solo do |chef|
    chef.cookbooks_path = ["cookbooks"]
    chef.json = VAGRANT_JSON
    chef.log_level = :debug
  
    VAGRANT_JSON['run_list'].each do |recipe|
      chef.add_recipe(recipe)
    end if VAGRANT_JSON['run_list']
  end
end
</pre>

Ha, there is node.json loaded, and that is Chef's way to define a node setup. Looking more carefully above, there are 2 details: The "run_list" and the "chef.json" part. The run_list defines, how a node conversion flows, while the json overrides attributes from cookbooks. The setup of these can be tricky. Here are some learnings.

This stack can be formalized in a so-called '''node.json''':

<pre>


</pre>





