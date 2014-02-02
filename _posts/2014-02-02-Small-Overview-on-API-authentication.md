---
layout: post
title: Small overview on API Authentication
tags: http rack authentification
---
In the context of [REST](http://en.wikipedia.org/wiki/Representational_state_transfer#Key_goals), access control is mainly provided by setting credentials in HTTP headers. This is very nicely discussed in e.g. Amazon's [RESTAuthentication docs](http://s3.amazonaws.com/doc/s3-developer-guide/RESTAuthentication.html).

There are many forms to pass tokens for authentication in distributed systems. Especially, the assumption that browsers are "dumb" (or unable to keep secure tokens), makes authentication difficult.

A basic approach for authentication can be found in the HTTP specs ([RFC2616](http://www.ietf.org/rfc/rfc2616.txt) and [RFC2617](http://www.ietf.org/rfc/rfc2617.txt)).

The specs are very dense, and can be read multiple times. So, to understand what is going on, let's use try the following example with curl:

<pre>
curl http://example.com/some_action -H 'Authorization: Token token="79d4d9ee34e3f589ee94d080357afd8e"
</pre>

What does this mean?

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

In cases, such as connecting two web applications, token authentication is a popular scheme.  A client (= API consumer) passes a token to the server (e.g. a wrapper service for a database). The token from the request can then be used to grant access.

For example, with a Rails based RESTful service, the API authentication could look like:

<pre>
def require_api_auth
  authenticate_or_request_with_http_token do |token, options|
    !(@current_user = User.where(access_token: token).first).nil?
  end
end
</pre>

Rails comes with these helpers built in (see [ActionController::Metal](https://github.com/rails/rails/blob/27311fef5efa598f281649074255834546d2b4ec/actionpack/lib/action_controller/metal/http_authentication.rb#L389). But there might be cases where your API (or client) is a Rack application, and it's actually some Rack methods too that are behind the helpers above, see [token_and_options](https://github.com/rails/rails/blob/27311fef5efa598f281649074255834546d2b4ec/actionpack/lib/action_controller/metal/http_authentication.rb#L429). So, this check could easily be moved to Rack middleware.
