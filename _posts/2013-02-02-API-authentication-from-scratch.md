---
layout: post
title: API Authentication from scratch
tags: http rack authentification
---
If HTTP is like sending messages in an enveloppe, authentication is about determining a sender's identity. Now, in the context of [REST](http://en.wikipedia.org/wiki/Representational_state_transfer#Key_goals), each request must contain authentication information as is very nicely discussed in e.g. Amazon's [RESTAuthentication docs](http://s3.amazonaws.com/doc/s3-developer-guide/RESTAuthentication.html).

There are many ways to pass authentication tokens between client and servers, and the discussion how to grant access to data in distributed systems remains ongoing (see e.g. OAuth2). A basic approach, however, can be found in the HTTP specs ([RFC2616](http://www.ietf.org/rfc/rfc2616.txt) and [RFC2617](http://www.ietf.org/rfc/rfc2617.txt)).



The easiest case is to 


In an API use-case, where clients 
Authentication is a long topic. I


credentials:  
http://stackoverflow.com/questions/7802116/custom-http-authorization-header

credentials = auth-scheme #auth-param

curl http://example.com/some_action -H 'Authorization: Token token="79d4d9ee34e3f589ee94d080357afd8e"

   10.4  Client Error 4xx ............................................65
   10.4.1    400 Bad Request .........................................65
   10.4.2    401 Unauthorized ........................................66

10.4.2 401 Unauthorized

   The request requires user authentication. The response MUST include a
   WWW-Authenticate header field (section 14.47) containing a challenge
   applicable to the requested resource. The client MAY repeat the
   request with a suitable Authorization header field (section 14.8). 
   

      14.8 Authorization
      
            A user agent that wishes to authenticate itself with a server--
            usually, but not necessarily, after receiving a 401 response--does
            so by including an Authorization request-header field with the
            request.  The Authorization field value consists of credentials
            containing the authentication information of the user agent for
            the realm of the resource being requested.
      
                Authorization  = "Authorization" ":" credentials

                         credentials = auth-scheme #auth-param

curl http://example.com/some_action -H 'Authorization: Token token="79d4d9ee34e3f589ee94d080357afd8e"

                                 auth-scheme    = token
                                 auth-param     = token "=" ( token | quoted-string )
         
   If
   the request already included Authorization credentials, then the 401
   response indicates that authorization has been refused for those
   credentials. If the 401 response contains the same challenge as the
   prior response, and the user agent has already attempted
   authentication at least once, then the user SHOULD be presented the
   entity that was given in the response, since that entity might
   include relevant diagnostic information. HTTP access authentication
   is explained in "HTTP Authentication: Basic and Digest Access
   Authentication" [43].

   10.4.3    402 Payment Required ....................................66
   10.4.4    403 Forbidden ...........................................66
   10.4.5    404 Not Found ...........................................66
   10.4.6    405 Method Not Allowed ..................................66
   10.4.7    406 Not Acceptable ......................................67
   10.4.8    407 Proxy Authentication Required .......................67

IMHO, you should split API interface from the web one, I mean:

1) you have a *common database*

2) a stateless API, with some AUTH KEY system:

a) for example, you can use oauth. you'll need to build an "oauth provider" service (there are some open source gems/projects/examples on github), then you can authorize apps like if you were twitter  or facebook ;-)

this option requires a lot of work and study, but it's worth the effort.

b) you might implement a very basic AUTH KEY system. for example, for each user, you create a unique random  key. then, each request should include this key in headers. something like this:

curl http://example.com/some_action -H 'Authorization: Token token="79d4d9ee34e3f589ee94d080357afd8e"

this option is not very flexible like oauth, but it's very easy to implement (ideal for quick iterations). I've implemented this solution for a little pet project (txtatus.com). here you can find how I've implemented the API section (separated from the web interface):

https://gist.github.com/47acd7994c5c8b2d4811

I can share some more code if you want ;-)

3) a web interface with cookies

yes, this means you'll have some duplicated stuff, but this is how it should work, because they serve different needs and they should be decoupled (ex: you might want to shut down API access but web access should keep up and running)
