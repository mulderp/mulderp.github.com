---
layout: post
title: Building a Vagrant base box
---
As explained in my previous [post](http://thinkingonthinking.com/building-infrastructure), Chef allows to develop, test and experiment with computing or cloud infrastructure.

In order to locally build nodes to test the setup of a node, [Vagrant](http://vagrantup.com) is a great automation tool that helps to play with ISO images from a certain operating system. There is a list of ISO images ready for Chef here at [Vagrantbox.es](http://vagrantbox.es). However, a common use case is, that you are running some other Linux version already, or, you want to work with fresh Ubuntu image, that you know what it contains.

So, how to create a new Vagrant basebox?

Here are some steps:

1. Upgrade your VirtualBox to the latest Version; as time of writing this was 1.6.2. This gives you less headache when Vagrant is downloading so called ISO image additions (which for older VirtualBox version might be difficult to fetch)

2. Make sure you have the gems VeeWee and Vagrant installed:

<pre>
     gem install vagrant
     gem install veewee
</pre>

2. Now, You'll want to get a list with possible ISO images for baseboxes. This command list baseboxes:

<pre>
    vagrant basebox templates
</pre>

3. As you'll see in the list you have quite a lot of options. Do a:

<pre>
     vagrant basebox define Ubuntu-11.04 ubuntu-11.04-server-amd64 -d
</pre>

4. Check/Edit the definition of the base box. In my case I had to change the pointer to the ISO image in:

    ubuntu-base/definitions/Ubuntu-11.04/definition.rb

5. Start the build of the basebox:

     vagrant basebox build Ubuntu-11.04






