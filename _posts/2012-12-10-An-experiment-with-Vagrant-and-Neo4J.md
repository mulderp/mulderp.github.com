---
layout: post
title: An experiment with Vagrant and Neo4J
tags: Chef Persistence Databases Graphs Neo4J ArangoDB
---

The RuPy conference 2012 in Brno was very inspiring! Especially, there were some interesting talks on databases and scalable approaches to web development:

* First,  the [ArangoDB](http://www.arangodb.org) team from Cologne set the tone why #nosql matters. The triAGENS team has written a database which mixes elements from MongoDB and graph databases. The shell of Arangodb looks very clean, and additionally, the system is based on C++ (= integrates with V8 JS engine and MRuby). 
* Another interesting talk was by Mitchell Hashimoto. He showed how Vagrant came into place, and why using isolated, virtual environments make sense for web integration. Some slides (not from Rupy) about this are [here](slideshare.net/mitchellh/sf-devops-introducing-vagrant).
* Andreas Ronge gave a very nice talk on what graphs can do, and SQL can't (well, it can, but not nicely ... ) I can't find his slides from RuPy right now, but he maintains a great blog on Neo4J here:  [http://maxdemarzi.com/](http://maxdemarzi.com/)  Also, these slides are interesting: [slideshare.net/andreasronge/neo4jrb](http://slideshare.net/andreasronge/neo4jrb)

So, ok, coming home to Munich with all these interesting thoughts in my mind, it was clear, that I had to start playing with graph databases in isolated environments for new kind of web applications. Fortunately, I had great input for my learnings from Jorge Bianquetti and Nathen Harvey.

First about Vagrant and VirtualBox. It takes a bit of time to download virtual machines, but it's not too difficult to get going. The single, most important command might be:

<pre>
$ vagrant init
</pre>

This creates an environment for setting up a virtual machine. It's very cool, because now, you can imagine to setup an Ubuntu, Debian, CentOS, or whatever system, and vagrant will try to go ahead, download or copies the VM and prepares it just that you can use it.

Ok, not quite, since next, you must tell Vagrant where to download the box; you do it in the Vagrantfile,  e.g.:

<pre>
config.vm.box = "opscode-ubuntu-12.04"
config.vm.box_url = "https://opscode-vm.s3.amazonaws.com/vagrant/boxes/opscode-ubuntu-12.04.box" 
</pre>

It's the standard Ubuntu box from Opscode right now.
Just do a:

<pre>
$ vagrant up
</pre>

and you would have an Ubuntu box running.

Well, we were charmed by graph databases, weren't we?  Ok, so, let's go ahead and add the setup for Neo4J. Some googling gives, that we have a Neo4J cookbook here: [https://github.com/michaelklishin/neo4j-server-chef-cookbook](https://github.com/michaelklishin/neo4j-server-chef-cookbook)

Hmm.. in this stage, we actually decided already for chef-solo. There is chef-solo and chef-server, and if you want to understand the difference, I suggest you look [here](http://www.nathenharvey.com/blog/2012/12/07/learning-chef-part-2/).

Chef-server is the approach you want to use in production. Chef-solo is the approach for quick-and-dirty experiments, like we do here. So, let's assume, chef-solo is ok, and we just need to get the cookbooks dependencies right. Luckily, we have a tool for this: chef-librarian.

<pre>
$ chef-librarian init
</pre>

This gives you a Cheffile. It's similar to a Gemfile if you are used to Ruby.
Let's throw in the Neo4J dependency here:

<pre>
cookbook 'apt'
cookbook 'neo4j-server', :git =&gt; 'http://github.com/michaelklishin/neo4j-server-chef-cookbook'
</pre>

And now, similar to bundle install, we run librarian-chef install

Last, but not least, we need to tell our VM that interaction with chef-solo is needed. You'll do this by adding something into the Vagrantfile :

<pre>
config.vm.provision :chef_solo do |chef|
  chef.cookbooks_path = "cookbooks"
  chef.add_recipe "apt"
  chef.add_recipe "neo4j-server::tarball"
end
</pre>

Cool, now we only need to build our server, since our ingredients are prepared, and chef is ready for cooking. The magic command is:

<pre>
$ vagrant up
</pre>

You should see something like: 

<pre>
[2012-12-10T20:33:58+00:00] INFO: *** Chef 10.14.4 ***
[2012-12-10T20:33:59+00:00] INFO: Setting the run_list to ["recipe[apt]", "recipe[neo4j-server::tarball]"] from JSON
[2012-12-10T20:33:59+00:00] INFO: Run List is [recipe[apt], recipe[neo4j-server::tarball]]
[2012-12-10T20:33:59+00:00] INFO: Run List expands to [apt, neo4j-server::tarball]
[2012-12-10T20:33:59+00:00] INFO: Starting Chef Run for vagrant.vm
</pre>

This takes a while.... 

Eventually, you end up successfully, and you can do:

<pre>
$ vagrant ssh
</pre>

Now, your VM has Neo4J running on it, and if you enable port forwarding in Vagrant, you might even go to: localhost:7474 and enjoy your fresh Neo4J server.

Some References:
------------------

Chef and Neo4J
* Vimeo screencast: [https://vimeo.com/55085049](https://vimeo.com/55085049) , see: 
  Screencast Install Neo4j-server with Chef from Patrick Mulder on Vimeo.

* Git repo: [https://github.com/mulderp/chef-neo4j](https://github.com/mulderp/chef-neo4j)
* Chef basic steps with Nathen Harvey from Opscode
** [Learning Chef Part 1](http://nathenharvey.com/blog/2012/12/06/learning-chef-part-1/)
** [Learning Chef Part 2](http://nathenharvey.com/blog/2012/12/07/learning-chef-part-2/)
** [Learning Chef Part 3](http://nathenharvey.com/blog/2012/12/14/learning-chef-part-3/)
