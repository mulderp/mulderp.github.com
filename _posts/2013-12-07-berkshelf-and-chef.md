---
layout: post
title: Berkshelf and Chef
tags: chef node
---
The last blog post on [A Data Platform in 15 minutes](http://thinkingonthinking.com/A-Data-Platform-in-15-minutes/) got quite some attention.

While writing that post, I found that a blog post on a "single" topic is very useful in the long term. And it is better to avoid an "overview" when writing, such as [this old post](http://thinkingonthinking.com/A-custom-rails-stack-with-chef/), where I mix Chef, Berkshelf, RVM and Ruby.

So, to practice writing, I want to review some basics of Chef. Imagine we have a fresh VM (maybe from the [Bento](https://github.com/opscode/bento) image repository from Opscode). And, we want to quickly install a recent version of Node.js.

## Berkshelf

A fast way to achieve that would be using [vagrant-berkshelf](https://github.com/berkshelf/vagrant-berkshelf) . In contrast to my older posts on Chef, Berkshelf now must be installed as plugin like this:

<pre>
$ vagrant plugin install vagrant-berkshelf
Installing the 'vagrant-berkshelf' plugin. This can take a few minutes...
Installed the plugin 'vagrant-berkshelf (1.3.4)'!
</pre>

Now, we can easily fetch cookbook dependencies, e.g. for Node.js, with this Berksfile:

<pre>
site :opscode

cookbook 'apt'
cookbook 'node'
</pre>


However, if we try to [provision](http://docs-v1.vagrantup.com/v1/docs/provisioners.html)

<pre>
  config.berkshelf.enabled = true
  config.vm.provision :chef_solo do |chef|
    chef.cookbooks_path = "./cookbooks"
    chef.add_recipe "apt"
    chef.add_recipe "node"
  end
</pre>

and

<pre>
$ vagrant provision
</pre>

We will hit an error, that chef-solo is missing. Let's look in the next section at some option.

## Provision the VM

Debugging Chef and cookbooks often requires an ssh login, and looking at the actual logfiles of the problem. We can do this:

<pre>
$ vagrant ssh
</pre>

And try:

<pre>
$ chef-solo
</pre>

Indeed, the provisioner is missing. What can we do? First, let's try:

<pre>
$ gem install chef
</pre>

This will complain about missing permissions. So, we have to do a:

<pre>
$ sudo gem install chef
</pre>

Then, we get something more running, but we will hit some missing system dependencies for the chef gem. So, let's try to:

<pre>
sudo aptitude install ruby1.9.1-dev
</pre>

And, then again the "sudo gem install chef". After seeing the installation succeed, the provisioner should be ready to be called from Vagrant.

So, we can do a:

<pre>
$ vagrant up
Bringing machine 'default' up with 'virtualbox' provider...
[default] Clearing any previously set forwarded ports...
[Berkshelf] This version of the Berkshelf plugin has not been fully tested on this version of Vagrant.
[Berkshelf] You should check for a newer version of vagrant-berkshelf.
[Berkshelf] If you encounter any errors with this version, please report them at https://github.com/RiotGames/vagrant-berkshelf/issues
[Berkshelf] You can also join the discussion in #berkshelf on Freenode.
[Berkshelf] Updating Vagrant's berkshelf: '/Users/pmu/.berkshelf/default/vagrant/berkshelf-20131207-29173-1fwx1d8-default'
[Berkshelf] Using apt (1.9.0)
[Berkshelf] Using node (1.0.1)
[Berkshelf] Using git (2.7.0)
[Berkshelf] Using dmg (2.0.8)
[Berkshelf] Using build-essential (1.4.2)
[Berkshelf] Using yum (2.4.4)
[Berkshelf] Using windows (1.11.0)
[Berkshelf] Using chef_handler (1.1.4)
[Berkshelf] Using runit (1.4.0)
[default] Creating shared folders metadata...
[default] Clearing any previously set network interfaces...
[default] Preparing network interfaces based on configuration...
[default] Forwarding ports...
[default] -- 22 => 2222 (adapter 1)
[default] -- 8529 => 5000 (adapter 1)
[default] Booting VM...
[default] Waiting for machine to boot. This may take a few minutes...
[default] Machine booted and ready!
[default] Mounting shared folders...
[default] -- /vagrant
[default] -- /tmp/vagrant-chef-1/chef-solo-1/cookbooks

$ vagrant provision
[Berkshelf] This version of the Berkshelf plugin has not been fully tested on this version of Vagrant.
[Berkshelf] You should check for a newer version of vagrant-berkshelf.
[Berkshelf] If you encounter any errors with this version, please report them at https://github.com/RiotGames/vagrant-berkshelf/issues
[Berkshelf] You can also join the discussion in #berkshelf on Freenode.
[Berkshelf] Updating Vagrant's berkshelf: '/Users/pmu/.berkshelf/default/vagrant/berkshelf-20131207-29173-1fwx1d8-default'
[Berkshelf] Using apt (1.9.0)
[Berkshelf] Using node (1.0.1)
[Berkshelf] Using git (2.7.0)
[Berkshelf] Using dmg (2.0.8)
[Berkshelf] Using build-essential (1.4.2)
[Berkshelf] Using yum (2.4.4)
[Berkshelf] Using windows (1.11.0)
[Berkshelf] Using chef_handler (1.1.4)
[Berkshelf] Using runit (1.4.0)
[default] Running provisioner: chef_solo...
Generating chef JSON and uploading...
Running chef-solo...
stdin: is not a tty
[2013-12-07T08:06:47+00:00] INFO: Forking chef instance to converge...
[2013-12-07T08:06:47+00:00] INFO: *** Chef 11.8.2 ***
[2013-12-07T08:06:47+00:00] INFO: Chef-client pid: 1097
[2013-12-07T08:06:48+00:00] INFO: Setting the run_list to ["recipe[apt]", "recipe[node]"] from JSON
[2013-12-07T08:06:48+00:00] INFO: Run List is [recipe[apt], recipe[node]]
[2013-12-07T08:06:48+00:00] INFO: Run List expands to [apt, node]
[2013-12-07T08:06:48+00:00] INFO: Starting Chef Run for vagrant.vm
[2013-12-07T08:06:48+00:00] INFO: Running start handlers
[2013-12-07T08:06:48+00:00] INFO: Start handlers complete.
[2013-12-07T08:06:59+00:00] INFO: execute[apt-get-update] ran successfully
[2013-12-07T08:07:02+00:00] INFO: package[update-notifier-common] sending run action to execute[apt-get-update] (immediate)
[2013-12-07T08:07:07+00:00] INFO: execute[apt-get-update] ran successfully
[2013-12-07T08:07:07+00:00] INFO: directory[/var/cache/local] created directory /var/cache/local
[2013-12-07T08:07:07+00:00] INFO: directory[/var/cache/local] owner changed to 0
....
</pre>

And the run looks successfull.

After a while, Node should be ready:

<pre>
vagrant@vagrant:~$ node -v
v0.11.10-pre
vagrant@vagrant:~$ npm -v
1.3.15
</pre>

## Iterate and improve

Now, we could spin-off a Node powered VM unlimited times, with only some commands. However, there is one place, in the protocol above that might be improved. The manual login and installation of the chef provisioner.  A quick googling gave a link that looks promising by Joshua Timberman, a well known contributor in the field of server automation. So, in [this post](http://jtimberman.housepub.org/blog/2012/08/10/vagrant-multiple-provisioners/), he discusses how to use multiple provisioners. 

An idea would now be to replace the manual steps above by a shell script, and execute those for the actual Chef provisioning run. I leave that as an exercise up to the reader. If anyone wants to report back how it goes, that would be great! Thanks.


