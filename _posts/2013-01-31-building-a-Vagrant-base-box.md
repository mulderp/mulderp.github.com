---
layout: post
title: Building a Vagrant base box
tags: vagrant vewee devops
---
As explained in my previous [post](http://thinkingonthinking.com/building-infrastructure), Chef allows to develop, test and experiment with computing or cloud infrastructure.

In order to locally build nodes to test the setup of a node, [Vagrant](http://vagrantup.com) is a great automation tool that helps to play with ISO images from a certain operating system. There is a list of ISO images ready for Chef here at [Vagrantbox.es](http://vagrantbox.es). However, a common use case is, that you are running some other Linux version already, or, you want to work with fresh Ubuntu image, that you know what it contains.

So, how to create a new Vagrant basebox?

Here are some steps:

## 1.  Upgrade your VirtualBox to the latest Version

As time of writing this was 4.2.6. This gives you less headache when Vagrant is downloading so called ISO image additions (see e.g. TimeOut issue [here](https://github.com/jedi4ever/veewee/issues/519 ) )

## 2.  VeeWee and Vagrant;

Make sure you have the gems VeeWee and Vagrant installed:

<pre>
         gem install vagrant
         gem install veewee
</pre>

## 3.  List baseboxes

Now, You'll want to get a list with possible ISO images for baseboxes. This command list baseboxes:

<pre>
        vagrant basebox templates
</pre>

##  4.  Define a basebox

As you'll see in the list you have quite a lot of options. Do a:

<pre>
     vagrant basebox define Ubuntu-11.04 ubuntu-11.04-server-amd64 -d
</pre>

##  5. Check the ISO Image

Check/Edit the definition of the base box. In my case I had to change the pointer to the ISO image in:

<pre>
    ubuntu-base/definitions/Ubuntu-11.04/definition.rb
</pre>

##  6.  Build the basebox

Start the build of the basebox:

<pre>
     vagrant basebox build Ubuntu-11.04
</pre>

##  7.  Export the basebox:

<pre>
   vagrant basebox export Ubuntu-11.04
</pre>

##  8.  Add the basebox:

<pre>
   vagrant box add 'Ubuntu-11.04' 'Ubuntu-11.04.box'
</pre>

That's basically it. 

# References

* Thanks to [Zac Sprackett](http://zac.sprackett.com/resume/) for writing on setting up a CentOS basebox  [here](http://devops.me/2011/10/06/building-baseboxes/)
* [blog.eriksen.com.br/](http://blog.eriksen.com.br/en/creating-custom-vagrant-boxes-veewee): Mentioning Postinstall scripts
* https://github.com/opscode/bento


