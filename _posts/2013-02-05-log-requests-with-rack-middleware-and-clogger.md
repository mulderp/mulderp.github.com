---
layout: post
title: Logging in Rack middleware with Clogger
tags: ruby rack
---
Thanks to Rack middleware and [Rails engines](http://api.rubyonrails.org/files/railties/lib/rails/engine_rb.html), it is possible to easily combine web application modules in Ruby. Good examples of this pattern are the [Spree engine](https://github.com/spree/spree) or some chapters of Josè Valim's book ["Crafting Rails Applications"](http://plataformatec.com.br/crafting-rails-applications). In the context of the design of [modular web applications](http://thinkingonthinking.com/what-is-modular-architecture/), I found logging specifics of HTTP requests with [Clogger](http://clogger.rubyforge.org/) very helpful.

## What is Clogger?
The main function of Clogger is to print and format parameters in a [Rack::Request](http://rack.rubyforge.org/doc/Rack/Request.html). It's a bit like 'sprintf' for HTTP requests, and can be mounted as middleware in a Rack application. So far, I mainly used the logger with Sinatra or in Rails application. Here are 2 examples:

## Logging HTTP headers in a Rails application
Authentication over the web can be tricky. For development purposes, it's often helpful to see some more details of a HTTP header. For this, let's write a simple client sending some header tokens to a Rails app.

The client:

<pre>
require 'faraday'
client = Faraday::Connection.new(:url => "http://0.0.0.0:3000/")
client.get '/example' do |req|
  req.headers['x_token'] = 'some meta data'
end
</pre>
    
The Clogger setup in a Rails server config/application.rb:

<pre style="font-size:10px">
class Application < Rails::Application
  config.middleware.use Clogger, :format => '"$request" ? $query_string $status $body_bytes_sent "$http_referer" "$http_user_agent" $request_time -- $http_x_token', :logger => $stdout 
end
</pre>

Results in:

<pre>
  "GET http://0.0.0.0:3000/profiles HTTP/1.1" ?  200 1083 "-" "Ruby" 0.502 -- some meta data
</pre>


## Monitoring cookies in Sinatra
A similar logging setup can easily be done in Sinatra. Simply include Clogger in config.ru

<pre>
require 'clogger'

use Clogger, :format => '"$request" ?$query_string $status "$http_cookie" $request_time $http_host', :logger => $stdout
</pre>

Now the cookies are dumped for every request. This can be helpful for debugging once in a while.

## Conclusion
The take away from this post is that the Rack middleware can be a nice tool for debugging HTTP header content. Rack can bring modular code back to a web application, and this is great to create 'layers' of functionality upon which other applications can build on. A similar approach was derived in the Faraday stack to write [modular client-side middleware](http://adventuresincoding.com/2010/09/writing-modular-http-client-code-with-faraday/), and will may be discussed in a later post.

