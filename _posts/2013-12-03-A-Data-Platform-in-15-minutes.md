---
layout: post
title: A Data Platform in 15 Minutes
tags: [web applications nosql databases]
---
Classically, the essence of the web has been connecting files and documents in a network. In many cases, these files and documents are representations of resources (or data). And with the rise of Apple and Google, the way we interact with those remote resources is challenging us as software engineers every day a bit more.

So, in this post, I want to show a way, how to setup a node that acts as data repository, and which can be used as backend for the development and for the production of so called single-page applications, or JavaScript applications.

## 1. A Vagrant basebox

As first step, let's set a node. Vagrant is a great wrapper for fetching, starting and stopping virtual machines (VMs), and I have blogged on advanced VM use cases with Chef automation [here](http://thinkingonthinking.com/building-a-Vagrant-base-box/) and [here](http://thinkingonthinking.com/building-infrastructure/). With Vagrant, we can do a number of learning before going to a hosted service such as Amazon EC2 or another provider of cloud resources.

Opscode's Bento project is a great place to find baseboxes, so, let's fetch a standard Ubuntu "precise" box:

<pre>
  vagrant box add ubuntu-12 http://opscode-vm-bento.s3.amazonaws.com/vagrant/virtualbox/opscode_ubuntu-12.04_chef-provisionerless.box
</pre>

Downloading the Ubuntu image will take a while. So, depending on your network speed, you should come back in 10 minutes now.

Once the base box is downloaded, we create a new project on our development machine (or "host"):


<pre>
  $ mkdir movies_repo
  $ cd movies_repo
  $ vagrant init ubuntu-12
</pre>

This gives us a Vagrantfile, i.e. a configuration for the virtual machine.

We can tune this in all kinds of directions, but right now, we only want port forwarding from the VM to our host. So, we add in our Vagrantfile:

<pre>
  config.vm.network :forwarded_port, guest: 8529, host: 5000
</pre>

The guest port 8529 is the ArangoDB port, which we turn to in a second.

Now, we start the virtual machine with the famous `vagrant up` command:

<pre>
   $ vagrant up
</pre>

And we will see something like:

<pre>
Bringing machine 'default' up with 'virtualbox' provider...
[default] Clearing any previously set forwarded ports...
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
</pre>

So, if our sandbox "node"/VM is running, we add the data repository capabilities.

## 2. Foxx and ArangoDB 

[ArangoDB](https://www.arangodb.org/) is a document-store built around the JavaScript V8 engine. ArangoDB supports schemaless, compressable data storage, as well as "actions", a programmable data layer on top of the data store. These actions can again be programmed with [Foxx](https://www.arangodb.org/foxx), a middleware on top of ArangoDB.

To turn our fresh VM into a data repository, let's login to the Vagrant box:

<pre>
 $ vagrant ssh
</pre>

Then we install ArangoDB. ArangoDB's Ubuntu installation instructions can be found [here](http://www.arangodb.org/download) - in our case:

<pre>
sudo vi /etc/apt/sources.list.d/arangodb.list
</pre>

Add:

<pre>
 deb http://www.arangodb.org/repositories/arangodb/xUbuntu_12.04/ /
</pre>

Then, download the aptitude keys:

<pre>
wget http://www.arangodb.org/repositories/arangodb/xUbuntu_12.04/Release.key
</pre>

And:

<pre>
apt-key add - < Release.key
</pre>

And now, it's easy, just:
<pre> 
  sudo apt-get update 
  sudo apt-get install arangodb=1.4.3
</pre>

Once the installation has finished, we have a basic ArangoDB setup running. This means, we have a document data store, and a RESTful middleware on top.

So, let's serve some movies.

## 3. Importing movies

Since movies and cinema give good case for data experiments, let's fetch some data from the [movielens free dataset](http://www.grouplens.org/datasets/movielens/). I leave this to an exercise to the reader, but maybe this [gist](https://gist.github.com/mulderp/7796615) will help you.

So, once you have a JSON file of movies, we can easily import those into ArangoDB with:

<pre>
  arangoimp movies.json --type json --collection "cinema_movies"  --create-collection true
</pre>

In the Arango shell we now can test that movies are available with:

<pre>
  $ arangosh
  arangosh [_system]> db.cinema_movies.toArray()
  [
  {
    "_id" : "movies/811811239",
    "_rev" : "811811239",
    "_key" : "811811239",
    "year" : 1997,
    "title" : "Amistad",
    "url" : "http://us.imdb.com/M/title-exact?imdb-title-118607"
  },
  ...
</pre>

Next up, serving resources with Foxx.

## 4. Using Foxx

Foxx is all about building a smart dart layer on top of data. Foxx comes with the FoxxManager, a tool to manage HTTP for data storage on the node.

So, let's build a Foxx app:

<pre>
  $ mkdir cinema
  $ cd cinema
  $ vi manifest.json
</pre>

In the manifest, we manage the meta data of a Foxx application. Simply, it can look as:

<pre>
{
  "name": "cinema",
  "version": "0.0.1",
  "author": "patrick",
  "controllers": {
    "/": "app.js"
  }
}
</pre>

And some small JavaScript to serve the data:

<pre>
var Foxx = require("org/arangodb/foxx");
var app = new Foxx.Controller(applicationContext);
var _ = require('underscore');
var db = require("org/arangodb").db;

var Movie = Foxx.Model.extend({
  }, {
    attributes: {
      id: "integer",
      url: "string",
      title: "integer",
      length: "integer",
      genres: "string"
    }
});

</pre>

This is a bit similar to introducing a schema, e.g. as ElasticSearch does to help querying and storing data.

<pre>
app.get("/all", function(req, res) {
  res.json(_.map(db.cinema_movies.toArray(), function (movie) {
      return _.extend(new Movie(movie).attributes);
   }));
});
</pre>

We simply can load the application with the FoxxManager as follows:

<pre>
arangosh [_system]> fm.fetch("directory", "/home/vagrant/cinema")
{
  "path" : "/var/lib/arangodb-apps/databases/_system/cinema-0.0.1",
  "app" : "app:cinema:0.0.1",
  "code" : 200
}
</pre>


Last, adding the dataset to the Foxx middleware with:

<pre>
arangosh [_system]> fm.mount("cinema", "/home/vagrant/cinema")
{
  "appId" : "app:cinema:0.0.1",
  "mountId" : "39593354",
  "mount" : "/home/vagrant/cinema",
  "code" : 200
}
</pre>

Now, our node acts as webserver and data source. Let's try:

<pre>
$ curl 0.0.0.0:5000/cinema/all
  [
  {
    "year" : 1997,
    "title" : "Amistad",
    "url" : "http://us.imdb.com/M/title-exact?imdb-title-118607"
  },
  ...
</pre>


So, I think this is pretty great, since we can develop an API without running schema migrations, and directly work with data behind an API. With ArangoDB, we have a way to quickly provision a node with a web server and an application server, without going trough the manual installation of V8 and a database.

Yet, in this approach are also quite some open questions: When to deploy your application from development to production? How to name databases and collections? How to apply the Foxx.Repository and Foxx.Model concepts best to serve the data?

So, feedback would be great, and maybe you want to join the mailing list at: [google groups](https://groups.google.com/forum/#!forum/arangodb) - to discuss and learn together how to better drive single-page applications.

