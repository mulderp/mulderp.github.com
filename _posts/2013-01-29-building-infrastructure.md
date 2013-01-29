---
layout: post
title: Building Infrastructure with Chef
tags: chef vagrant ruby
---
It might have been the end of 90ies, when I first saw books on PHP and 'dynamic' web pages that looked much more complicated and powerful than simple HTML pages. In that time, I was still playing with software on single workstations for engineering studies. I could not imagine however, the disruption that was going on by connecting computers (and humans) with Linux and open-source software. Now, after experiences with Perl, Python, Debian, Gentoo, Emacs, Linux Kernels, Torrents, Apache, Nginx, MySQL, Ruby, Rails, Dovecot, Vim, MongoDB, Neo4J, ArangoDB, Postgres (and probably 10 more open-source software projects), one tool struck my eyes recently: Chef.

Chef is a configuration tool for computing infrastructure, esp. cloud infrastructure and helps to share infrastructure across projects, teams and products. What I like best on the Chef concept is, that it enables experiments with infrastucture, something wich otherwise would be costly or pointless, since tools for automation, building software is often more of an art, as a science. For example, I remember browsing through a multitude of discussions in forum posts like "oh, I had to patch the lib-whatever header to make it work with version 3.2.x, not sure if this will work for version 3.1.y too". So, in some senses, Chef is bringing defaults and shared efforts to infrastructure, similary to what Rails brought to building database driven web applications.

As in most other successful open-source projects, Chef is heavily community driven in mailing lists, github repositories, a wiki and a vibrant IRC channel. I was very lucky to get in contact with [Nathen Harvey](http://nathenharvey.com), who helped me a lot in understanding the basic configuration terminology that comes with Chef. Over the last months, we were able to discuss the basic steps to build servers from scratch (basically simple steps in "cooking" servers)

So, what did I learn so far?

* One of my most important insights so far is, that Chef is not "a scaffoling solution with add-ons for servers" - unlike Rails is for making web applications. What I mean is, that Chef comes in at least 2 flavors: Chef-Solo and Chef-Client (or Hosted Chef or Chef-Server). Nathen discusses the difference between Chef-Solo and Chef-Server [here](http://nathenharvey.com/blog/2012/12/07/learning-chef-part-2/). Now, some weeks later, my conclusion is that Chef-Solo is closer to a single-server environment, whereas chef-server is closer to a multi-node, cluster-like server environment. Duh.. now it sounds logical, but in fact, it was rather confusing when I started learning Chef.

* Chef-server comes with "knife", a powerful command-line tool that helps in all kinds of steps for server configuration. Knife is that kind of tool that you start thinking of first, when creating/updating/extracing server build steps. Chef-Solo does not support knife as far as I know, but can easily be used together with hacks in a Vagrantfile or tools as librarian-chef or berkshelf. Unfortunately, I haven't played too much with those yet, although I wrote about an experiment with librarian-chef and Neo$j [here](http://thinkingonthinking.com/An-experiment-with-Vagrant-and-Neo4J/).

* Server build steps are abstracted away in "cookbooks". A cookbook is a bit similar to what a Gem is in a Ruby-on-Rails project. In fact, you can quickly get some server software running, just by including the cookbook, similar to a including e.g. a gem for authentication in Rails. However, as a single gem in a Rails project doesn't make much sense, cookbooks are more powerful when coming in a bundle. So, a server is defined in terms of recipes in a cookbook, and it's actually the "run_list" that tells Chef how a server should be built (or cooked).

Ok, that is a summary of my Chef learnings so far. There are more insights related to how cookbooks work, how run lists can be simplified, and how bugs in cookbooks can be dealt with (tip: look in the github issues of a cookbook). In the meanwhile, I was able to work with cookbooks for a basic setup of Postgres and ArangoDB. And, launching a database instance on Amazon-EC2 with just a simple knife command is just one step away. Also, I got connected to some more DevOps, such as [Jorge Bianquetti](https://github.com/jbianquetti) who helped with librarian-chef and Cassiano Leal with whom I discussed [Vagrant-Butcher](https://github.com/cassianoleal/vagrant-butcher/issues/3). That's all for now, looking forward to hear your feeedback, your insights, discoveries and problems with infrastructure automation.







han running virtual machines and OS's on top of other machines. 

Web applications only come with good infrastructure.
