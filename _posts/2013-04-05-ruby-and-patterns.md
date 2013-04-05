---
layout: post
title: On designing interfaces - Learning from patterns
tags: blogging
---
Interfaces are important in programming, as in business or relationships. By looking at Ruby-on-Rails, a web framework that is widely known for its implementation of the Model-View-Controller pattern, a lot can be discovered on interface design.

When we first touch [architecture design patterns](http://martinfowler.com/eaaCatalog/), we can feel quickly overwhelmed by 'theoretical' or very 'abstract' discussions. But after many hours of software development, these patterns start jumping into your eyes suddenly. And then, patterns can act as [loophole](http://en.wikipedia.org/wiki/Loophole) between achieving perfect design in theory, and avoiding a chaos design in practice.

So, to understand how design patterns can influence good interface design, we can look at the Rails' directory structure:


<pre>
      ├── actionpack
      │   ├── lib
      │   │   ├── action_controller
      │   │   ├── action_view
      │   └── test
      ├── activerecord
      │   ├── lib
      │   └── test
</pre>


Looking at this (filtering the 'tree -L 2' from the Rails repository helps), the following similarities between [Martin Fowler's Enterprise Patterns](http://martinfowler.com/eaaCatalog/) can be seen:

* [Page Controller](http://martinfowler.com/eaaCatalog/pageController.html)/[Front Controller](http://martinfowler.com/eaaCatalog/frontController.html): The Ruby-on-Rails MVC stack handles requests from a Router, that are then processed by an instance of ActionController. Comparing to Fowler's pattern definitions, a Router can be interpreted as "handling all requests for a Web site" and an ActionController instance as "handling requests for a specific pages or actions". This design works very well to create, update or render resources, and map actions to URLs in a RESTful manner. Furthermore, Rails developers will know very well how common logic for e.g. authentication can be extracted into a [Application Controller](http://martinfowler.com/eaaCatalog/applicationController.html)

* [Template View](http://martinfowler.com/eaaCatalog/templateView.html): According to Fowler, this pattern is about "rendering information into HTML by embedding markers in an HTML page". As such, it describes the purposes of views in Ruby-on-Rails. Interestingly, Fowler describes some alternative options, such as [Transform View](http://martinfowler.com/eaaCatalog/transformView.html), or [2-step View](http://martinfowler.com/eaaCatalog/twoStepView.html). This shows that view templates has its limits, and is not the best solution for all rendering problems. Maybe in a later post, we can look at how client-side MVC framework apply different rendering approaches. 

* [ActiveRecord](http://martinfowler.com/eaaCatalog/activeRecord.html): ActiveRecord is a so-called data source architectural pattern, and is about "encapsulating database access, and adding domain logic on that data". It is one of the patterns besides MVC that helped Rails into becoming what is today. For non-experts, ActiveRecord helps to encapsulate e.g. a Person data record. An instance of a Person that is derived from ActiveRecord, gives a nice interface to manage 'persistence' of the Person state, as well as ways to manage the context of a person (such as associations, validations, custom extensions). Thanks to [@vicentereig](https://twitter.com/vicentereig) for pointing me to a post by [@bryanry](http://blog.codeclimate.com/blog/2012/10/17/7-ways-to-decompose-fat-activerecord-models/) on keeping the ActiveRecord pattern under control. 

There are probably a dozen more interesting patterns to discover in the Rails repository. ActiveModel is somewhat related to deal with aggregation oriented databases, the adapter pattern (e.g. for ORMs) is related to this as well. Furthermore, you can see usages of Observers (e.g. in the ActiveSupport library) and Builders (e.g. for generators).

# Conclusions

Patterns feel somewhat 'theoretical' when first touched. But as theory is to engineering, design patterns can guide you in making good, practical design decisions. Patterns can be used for communication, or to identify interfaces between components. Patterns appear at later stage of software projects, and are as such less helpful for spiking or prototyping some ideas in early software design projects. 

# References

* The book 'Enterprise Architecture' by Martin Fowler and 'Domain Driven Design' have a lot of interesting examples how patterns can lead to interface and vice-versa.

* A topic that is closely related to pattern and interface design is refactoring. Also here, Martin Fowler keeps track of a catalog: [Refactoring.com](http://www.refactoring.com/catalog/index.html). I am grateful to [@rstankov](https://twitter.com/rstankov) for sharing a great refactoring session, that showed me how removing code can improve interfaces (and as such promote pattern discovery).

* Apart from Rails, some nice interfaces in Ruby projects can be found in e.g. [Devise's ORM adapters](https://github.com/plataformatec/devise/tree/master/lib/devise/orm) or [Faraday's connection builder](https://github.com/lostisland/faraday/blob/master/lib/faraday/connection.rb#L28).
