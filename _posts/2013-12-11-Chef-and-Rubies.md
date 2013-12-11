---
layout: post
title: Chef and Rubies
tags: chef ruby
---
[Chef](http://docs.opscode.com/) is a tool for server automation - built with Ruby. When you provision a virtual machine, and you need to have your own Ruby version, the Ruby of Chef and the Ruby of your application(s), can bite each other. So, let's look again how to use the cookbook wrappers for [rvm](https://github.com/fnichol/chef-rvm) and [rbenv](https://github.com/fnichol/chef-rbenv].

## Fetching Dependencies

Chef is built around cookbooks, and you can fetch cookbook dependencies for a project with Berkshelf, as explained in [a previous post](http://thinkingonthinking.com/berkshelf-and-chef/).

To fetch the RVM cookbook, we use this Berksfil:

<pre>
  site :opscode
  
  cookbook 'rvm', :git => "https://github.com/fnichol/chef-rvm"
</pre>

Now, we do:

<pre>
  berks install
</pre>

## Pre-provision the VM

As mentioned, Chef is built with Ruby. but in many cases there will be no Ruby at all on a fresh VM. Therefore, we need to find some other way to bring Chef to the VM, without using a cookbook.

The fastest way to get a Chef installation on a new VM is by using a shell provisioning step:

<pre>
  config.vm.provision :shell, :inline => "/usr/bin/apt-get update --fix-missing"
  config.vm.provision :shell, :inline => "sudo apt-get install -y curl; curl -L https://www.opscode.com/chef/install.sh | sudo bash"
</pre>

When we now provision the VM, with:

<pre>
  $ vagrant up
</pre>

or:

<pre>
  $ vagrant provision
</pre>

We will run a Chef installation, and obtain a Ruby in /opt/chef/embedded

## Installing the Ruby wrapper

As next step, we must configure the Ruby wrapper. Normally, we define parameters for cookbooks in a [JSON file](https://github.com/mulderp/chef-rails-stack/blob/rails4_stack/node.json), but as we want to have the "fastest" way to get some Ruby on a VM, we do it "inline" in Vagrant.

The configuration in Vagrant could look like:


<pre>
  config.vm.provision :chef_solo do |chef|
    chef.cookbooks_path = "./cookbooks"
    chef.add_recipe "rvm::system"
    chef.add_recipe "rvm::vagrant"

    chef.json = {
      'rvm' => {
         'rubies' => ["2.0.0-p353"],
         'default_ruby' => "2.0.0-p353",
         :vagrant => { :system_chef_solo => "/opt/chef/bin/chef-solo" }
      }
    }

    chef.log_level = :debug
  end
</pre>

There are 3 "tricks" here:

* We must run the "rvm::system" recipe to get the recipe actually installing a Ruby
* We include the recipe "rvm::vagrant" to get the setup of groups right
* We setup a wrapper for the original Chef ruby, since we would loose the "chef-solo" Ruby gem otherwise

Well, that should be it. Happy cooking.
