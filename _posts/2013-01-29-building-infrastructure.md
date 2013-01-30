---
layout: post
title: Building Infrastructure with Chef
tags: chef vagrant ruby
---
Chef is a configuration tool for computing infrastructure, especially cloud infrastructure and helps to share infrastructure across projects, teams and products. What I like best on the Chef concept is, that it enables experiments with infrastucture, something wich otherwise would be costly or pointless, since building software and servers is often more of an art, as a science. For example, I remember browsing through a multitude of discussions in forum posts like "oh, I had to patch the lib-whatever header to make it work with version 3.2.x, not sure if this will work for version 3.1.y too". So, in some senses, Chef is bringing defaults and shared efforts to infrastructure, similary to what Rails brought to building database driven web applications.

As in most other successful open-source projects, Chef is heavily community driven in [mailing lists](http://lists.opscode.com/), github repositories, [a wiki](http://wiki.opscode.com) and a vibrant IRC channel (#chef). I was very lucky to get in contact with [Nathen Harvey](http://nathenharvey.com), who helped me a lot in understanding the basic configuration terminology that comes with Chef. Over the last months, we were able to discuss the basic steps to build servers from scratch (basically simple steps in "cooking" servers)

So, what did I learn so far?

* One of my most important insights so far is, that there is no 'single' Chef unlike a 'single' Rails for making web applications. What I mean is, that Chef comes in at least 2 flavors: Chef-Solo and Chef-Client (= Hosted-Chef/Chef-Server). Nathen discusses the basic difference between Chef-Solo and Chef-Server [here](http://nathenharvey.com/blog/2012/12/07/learning-chef-part-2/). Now, some weeks later, my conclusion is that Chef-Solo is about managing a single node (sometimes for development purposes), whereas chef-server is closer to a multi-node, cluster-like server environment. Duh.. now it sounds logical, but in fact, it was rather confusing when I started learning Chef.

* Chef-server comes with "knife", a powerful command-line tool that helps in all kinds of steps for server configuration. Knife is that kind of tool that you start thinking of first, when creating/updating/extracing server build steps. Chef-Solo does not support knife as far as I know, but can easily be used together with hacks in a [Vagrantfile](http://docs.vagrantup.com/v1/docs/provisioners/chef_solo.html) or tools such as librarian-chef or berkshelf. Unfortunately, I haven't played too much with those yet, although I wrote about an experiment with librarian-chef and Neo4J [here](http://thinkingonthinking.com/An-experiment-with-Vagrant-and-Neo4J/).

* Server build steps are abstracted away in "cookbooks". A cookbook is a bit similar to what a Gem is in a Ruby-on-Rails project. In fact, you can quickly get some server software running, just by including the cookbook, similar to a including e.g. a gem for authentication in Rails. However, as a single gem in a Rails project doesn't make much sense, cookbooks are more powerful when coming in a bundle. So, a server is defined in terms of recipes in a cookbook, and it's actually the "run_list" that tells Chef how a server should be built (or cooked).

Ok, that is a summary of my Chef learnings so far. There are more insights related to how cookbooks work, how run lists can be simplified, and how bugs in cookbooks can be dealt with (tip: look in the github issues of a cookbook). 

In the meanwhile, I was able to work with cookbooks for a basic setup of Postgres and ArangoDB. And today, I just launched a basic web server instance on Amazon-EC2 with just a simple knife command. 

Last but not lwast, I got connected to some more DevOps, such as [Jorge Bianquetti](https://github.com/jbianquetti) who helped with librarian-chef and Cassiano Leal with whom I discussed [Vagrant-Butcher](https://github.com/cassianoleal/vagrant-butcher/issues/3). Also, [Mathias Lafeldt](http://mlafeldt.github.com/blog/2012/09/learning-chef/) has some great discussions on his experiences on #learningchef. That's all for now, looking forward to hear your feeedback, your insights, discoveries and problems with infrastructure automation.

