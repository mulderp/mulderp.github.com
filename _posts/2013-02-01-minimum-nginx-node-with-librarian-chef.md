---
layout: post
title: A Vagrant based Minimum Viable Webserver
tags: vagrant chef nginx
---
When developing servers or clients that talk HTTP, it's great to have mock systems that are as close as possible to a live system. Here is a quick hack to make a minimum viable webserver by using Chef-Solo and [Librarian-Chef](https://github.com/applicationsonline/librarian). Librarian-Chef is conceptually very close to the Ruby Bundler gem.

## Install librarian-chef

<pre>
   $ gem install librarian
</pre>

## Init librarian-chef

To get started, we need to get file where we can specifiy a node's cookbooks:

<pre>
   $ librarian-chef init
</pre>

This gives us the 'Cheffile', which is conceptually close to Bundler's 'Gemfile'.

## Edit Cheffile

We are going to modify the Cheffile to define our node's dependencies as follows:

<pre>
#!/usr/bin/env ruby
#^syntax detection

site 'http://community.opscode.com/api/v1'

cookbook 'nginx-app', :path => "./application-cookbooks"
</pre>

This means we are going to write a small application cookbook 'nginx-app' that lives in the path '/application-cookbooks'

## Create the application cookbook

In contrast to cookbooks for infrastructure, application cookbooks are adjustments and setups for node specific stuff. They are derived from e.g. community cookbooks, but contain custom stuff. So, let's create an application cookbook for our webserver:

<pre>
    knife cookbook create nginx-app -o application-cookbooks
</pre>

(Eventually, you need to have knife-solo on your system to get this command to work)

This should give something like:

<pre>
  application-cookbooks
   |-nginx-app
   |---attributes
   |---definitions
   |---files
   |-----default
   |---libraries
   |---providers
   |---recipes
   |---resources
   |---templates
   |-----default
</pre>

## Setup the webserver's resources

Nginx can be installed with a simple [package resource](http://wiki.opscode.com/display/chef/Resources#Resources-Package). This is an abstraction around a package installer such as aptitude or yum. Also we need to use a template resource for defining a virtual host:

### Recipe in /nginx-app/recipes/default.rb

<pre>
   package "nginx"
   
   service "nginx" do
     supports :status => true, :restart => true, :reload => true
     action [:enable, :start]
   end
   
   template "/etc/nginx/nginx.conf" do
     notifies :reload, "service[nginx]"
   end
</pre>

### Template in /nginx-app/templates/nginx.conf.erb
<pre>
  user www-data;
  worker_processes  <%= @node[:nginx][:worker_processes] %>;
  
  error_log  /var/log/nginx/error.log;
  pid        /var/run/nginx.pid;
  
  events {
      worker_connections  1024;
      # multi_accept on;
  }
  
  http {
      include       /etc/nginx/mime.types;
  
      access_log	/var/log/nginx/access.log;
  
      sendfile        on;
      #tcp_nopush     on;
  
      keepalive_timeout  5;
      tcp_nodelay        on;
  
      gzip  on;
      gzip_disable "MSIE [1-6]\.(?!.*SV1)";
  
      include /etc/nginx/conf.d/*.conf;
      include /etc/nginx/sites-enabled/*;
  }

</pre>

We use an attribute above for the worker, so we also need to define that variable:

<pre>
  default[:nginx][:dir] = "/etc/nginx"
  default[:nginx][:worker_processes] = 4
</pre>

## Bundle the cookbooks

Now, we have everything in place and we can bundle the cookbooks with the command:

<pre>
    $ librarian-chef install
</pre>

Now all cookbooks are downloaded an placed into the local /cookbooks path. Two outputs can be observed, the dependencies were written into Cheffile.lock

<pre>
SITE
  remote: http://community.opscode.com/api/v1
  specs:
    build-essential (1.3.2)
    nginx (1.2.0)
      build-essential (>= 0.0.0)
      ohai (>= 1.1.4)
    ohai (1.1.6)

PATH
  remote: ./application-cookbooks
  specs:
    nginx-app (0.1.0)
      nginx (>= 0.0.0)

DEPENDENCIES
  nginx-app (>= 0
</pre>

This shows that our node get some additional cookbooks that are required by the nginx-app cookbook.
Let's also look at the cookbook path:

<pre>
   cookbooks
   |-build-essential
   |---attributes
   |---recipes
   |-nginx
   |---attributes
   |---definitions
   |---files
   |-----default
   |-------tests
   |---------minitest
   |-----------support
   |---recipes
   |---templates
   |-----debian
   |-----default
   |-------modules
   |-------plugins
   |-----gentoo
   |-----ubuntu
   |-nginx-app
   |---attributes
   |---definitions
   |---files
   |-----default
   |---libraries
   |---providers
   |---recipes
   |---resources
   |---templates
   |-----default
   |-ohai
   |---attributes
   |---files
   |-----default
   |-------plugins
   |---recipes
</pre>

As we can see, all cookbooks were bundled.

## Setup Vagrant
Now, we have all things in place to provision the web server. It's time to setup Vagrant:

<pre>
    $ vagrant init Ubuntu-11.04
</pre>

Edit the Vagrantfile:
<pre>

<pre>
Vagrant::Config.run do |config|
  config.vm.box = "Ubuntu-11.04"
  config.vm.network :hostonly, "192.168.33.10"
  config.vm.forward_port 80, 8080
  config.vm.forward_port 9292, 9292

  config.vm.provision :chef_solo do |chef|
    chef.cookbooks_path = "./cookbooks"
    chef.add_recipe "nginx-app"
  end
end
</pre>

And provision:
<pre>
  $ vagrant up
</pre>

So, that's all to get the webserver running. Now, it would be cool to get some basic Ruby/Rack interface running too. Maybe in the next post with the help of a unicorn cookbook.
