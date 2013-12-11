---
layout: post
title: Building a flexible Rails Stack with Chef
tags: chef server chef-solo
---

Edit: This is an overview article. More details on wrapping Ruby with Chef can be found in [this post](2013-12-11-Chef-and-Rubies.md).


Most of us who develop Ruby based web applications will know that the setup and configuration of a stack of web infrastructure can be tricky:

* building Rubies including Gemsets often require libraries that look like strings of [captcha's](http://en.wikipedia.org/wiki/CAPTCHA)
* setup of webservers (nginx or apache) have special compile flags and configuration settings too
* adaptors for Rack (Passenger or Unicorn nowadays) need to be built or wrapped in scripts
* databases are evolving (RDBMS, document-stores, key-value stores, graph db's ... ) and often come in pairs

Additionally, your Unix most likely will need some essential build packages such as compilers, git, image processors, messaging queues, mailservers, etc, as well as Unix users and groups for basic security settings. Last but not least, there are different Unix distributions which bring additional surprises. 

So, even when opinions in Rails keep some decisions simple, a web development stack might differ from the one that you or your customer will use in production.

With all these choices, how can you test opinions on a web stack that are good for you? 

Particulary, how can you test opinions in the context of a database-driven web application such as Ruby-on-Rails? 

I try to answer this with the help of 2 tools: [Chef-solo](http://docs.vagrantup.com/v1/docs/provisioners/chef_solo.html) and [Berkshelf](http://berkshelf.com/).

## 1. Abstractions in Chef

What Rails is to a database-driven web application, Chef might be to infrastructure: Opinions in code. But as far as I can judge, the ecosystem of infrastructure is much more diverse, than the different components of a model-view-controller design. Let's see how Chef attempts to abstract away the diversity in infrastructure:

* One of the most important abstractions in Chef are cookbooks. Cookbooks are similar to Gems in Ruby. Cookbooks bundle code (= "recipes") that can be configured with "attributes" and configuration "templates". In a way, cookbooks apply the MVC pattern: Data models are attributes, views are templates, and controllers are recipes. Cookbooks are opinionated, some more than others, but my advice for installation of services, is to look at [community cookbooks](http://community.opscode.com) first, and then at opinions found in cookbooks found at Github.

* As we just tackle a single node setup, Vagrant and Chef-Solo are a sweet combination. Vagrant takes care of your Unix VM, and Chef-Solo can easily load cookbooks from your local environment.

* The setup of a web infrastructure stack will require multiple cookbooks, and you'll quickly feel that downloading cookbooks yourself, and variation of cookbooks should be managed with some tool. So far, I tried 2 tools to manage cookbooks: [Berkshelf](http://berkshelf.com/) and [Librarian-Chef](https://github.com/applicationsonline/librarian). Whereas Librarian manages quite well the download part, Berkshelf helps in solving package problems at hand. Think of Berkshelf as the Bundler for Ruby gems and in let's say 80% of cases, you'll just want to download cookbooks and can live with cookbook defaults, rather than deriving your own version of a cookbook. Berkshelf helps to abstract away the details when needed.

* Vagrant is your infrastructure lab. I wrote about some first steps with Vagrant, [here](http://thinkingonthinking.com/An-experiment-with-Vagrant-and-Neo4J/), [here](http://thinkingonthinking.com/building-a-Vagrant-base-box/) and [here](http://thinkingonthinking.com/minimum-nginx-node-with-librarian-chef/).

## An overview of a Rails stack

I hope the abstractions above can give you some taste of what is coming up in this section. First, let's think on a Rails application stack:

* RVM to manage Rubies (could be rbenv too)
* Passenger to consume and respond with requests for/from Rack (could be Unicorn)
* PostgreSQL to deal with data storage
* Nginx as proxy for logging

In Chef language, you would want to look at application cookbooks, such as [application_ruby](http://community.opscode.com/cookbooks/application_ruby) or [passenger_apache2](http://community.opscode.com/cookbooks/passenger_apache2). Nathen Harvey shows how to get going with the passenger_apache2 cookbook in his [blog](http://www.nathenharvey.com/blog/2012/12/07/learning-chef-part-2/).

But for fun and for learning let's look into the setup of a custom stack.

The dependencies for above's stack could be defined with [Berkshelf](http://berkshelf.com/) in the Berksfile as follows:

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

imports the cookbooks to your local Chef environment. Next, we need to setup the Vagrantfile to use Chef-solo provisioning:

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

Ha, there is node.json loaded, and that is Chef's way to define a node setup. Looking more carefully above, there are 2 details: The "run_list" and the "chef.json" part. The run_list defines, how a node conversion flows, while the json overrides attributes from cookbooks. 

The setup of these can be tricky:

* Refer to [this post](http://thinkingonthinking.com/2013-12-11-Chef-and-Rubies) on how get Chef rwapping Ruby. Right now, on default VMs in Linux distrubtions, there is a an old Ruby 1.8.7. Those need an upgrade. 


## Passenger

Passenger is a Ruby gem that is partly compiled into Nginx or loaded as module in Apache. Let's look at the nginx setup. The tricky parts are the system paths, thanks a lot to [@jtimberman](https://twitter.com/jtimberman) for helping me understand this better. There are interesting details behind this in yesterday's [office hours with Joshua](http://www.youtube.com/watch?v=ddMLvMvOUfg&feature=youtu.be).

<pre>
  ...
  "nginx": {
    "version": "1.2.5",
    "user": "deploy",
    "init_style": "init",
    "modules": [
      "http_stub_status_module",
      "http_ssl_module",
      "http_gzip_static_module"
    ],
    "passenger": {
      "version": "3.0.18",
      "gem_binary": "/usr/local/rvm/wrappers/ruby-2.0.0-p0/gem"
    },
    "configure_flags": [
      "--add-module=/usr/local/rvm/gems/ruby-2.0.0-p0/gems/passenger-3.0.18/ext/nginx"
    ],
  ...
</pre>


* Add some gems that you mostly will need: Rake, Bundler and Rails:

<pre>
  ...
  "rvm": {
    "rubies": ["2.0.0-p0"],
    "default_ruby": "2.0.0-p0",
    "vagrant": { "system_chef_solo" : "/opt/chef/bin/chef-solo" },
    "gems": {
      "2.0.0-p0": [
        {"name": "bundler"},
        {"name": "rake"},
        {"name": "rails", "version": "4.0.0.beta1" }
      ]
    }
  ...
</pre>

Maybe there are more details, but maybe you are curious to just see the [chef-rails-stack](https://github.com/mulderp/chef-rails-stack/tree/rails4_stack) at work.

Let's try a provisioning.

<pre>
  $ bin/vagrant up
  $ bin/vagrant ssh
</pre>

And:

<pre>
  vagrant@Ubuntu-11:~$ ruby -v
  ruby 2.0.0p0 (2013-02-24 revision 39474) [x86_64-linux]
  vagrant@Ubuntu-11:~$ rails -v
  Rails 4.0.0.beta1
</pre>


So, what do you think? There is more tuning needed, like setup of the nginx virtual host that connect to the Rails application. Also, the nginx conversion step might break, and users are missing. Any feedback would be interesting. Thanks for reading and sharing!




