---
layout: post
title: API Authentication from scratch
tags: http rack authentification
---
If HTTP is like sending messages in an enveloppe, authentication is about determining a sender's identity. Now, in the context of [REST](http://en.wikipedia.org/wiki/Representational_state_transfer#Key_goals), each sender must include authentication credentials as is very nicely discussed in e.g. Amazon's [RESTAuthentication docs](http://s3.amazonaws.com/doc/s3-developer-guide/RESTAuthentication.html).

## HTTP authorization header

There are many ways to pass authentication tokens between client and servers, and the discussion how to grant access to data in distributed systems remains ongoing (see e.g. OAuth2). A basic approach, however, can be found in the HTTP specs ([RFC2616](http://www.ietf.org/rfc/rfc2616.txt) and [RFC2617](http://www.ietf.org/rfc/rfc2617.txt)).

The specs are a bit 'difficult' to read, so, it's best to keep a request with Curl in the back of the head:

<pre>
curl http://example.com/some_action -H 'Authorization: Token token="79d4d9ee34e3f589ee94d080357afd8e"
</pre>

So, what does it mean?

In RFC2616, there is the following definition for a HTTP header field (section 14: "Header Field Definitions"):
<pre>
Authorization  = "Authorization" ":" credentials
</pre>

We need to look in RFC2617, to see what 'credentials' might be:

<pre>
credentials = auth-scheme #auth-param
</pre>

This can be interpreted as:

* 'auth-scheme' specifies an authentication method. From RFC2617, this might be 'Token', 'Basic' or 'Digest', but it can be 'AWS' too, as in the case of Amazon.
* 'auth-param' is the actual authentication string. This part of the header field contains the sequence that grants access or should result into a 401 (Unauthorized) response.  

## Request authorization with Rack      

In order to have an API talk to a client (= API consumer), let's assume the server and client can work with the same database backend, and as such can access the same data for an user.

Now, when the user issues a request, we can simply pass a HTTP header token as explained above. In a Rails based server, the API authentication could look like:

<pre>
def require_api_auth
  authenticate_or_request_with_http_token do |token, options|
    !(@current_user = User.where(access_token: token).first).nil?
  end
end
</pre>

Rails comes with these helpers built in (see [ActionController::Metal](https://github.com/rails/rails/blob/27311fef5efa598f281649074255834546d2b4ec/actionpack/lib/action_controller/metal/http_authentication.rb#L389). But there might be cases where your API (or client) is a Rack application, and it's actually some Rack methods too that are behind the helpers above, see [token_and_options](https://github.com/rails/rails/blob/27311fef5efa598f281649074255834546d2b4ec/actionpack/lib/action_controller/metal/http_authentication.rb#L429). So, this check could easily be moved to Rack middleware.


## Cookies and web interfaces

Now if your client-side applications have state (such as in single-page apps), cookies enter the authentication game. However, cookies serve a different need  ...

yes, this means you'll have some duplicated stuff, but this is how it should work, because they serve different needs and they should be decoupled (ex: you might want to shut down API access but web access should keep up and running)

... question:  how would code look like to actually access the API with AJAX from the user's browser?

So, how can the client talk to a server, depending on whether a user logged in, or not?


evt. also mentioning:  https://github.com/lostisland/faraday/blob/master/test/authentication_middleware_test.rb
