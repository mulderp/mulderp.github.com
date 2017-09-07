---
layout: post
title: Eclipses and programming
tags: java eclipse
---
When it comes to embedded systems, working with compilers gets important sooner or later. 

So, it was interesting to listen to Robert C. Martin about differences between C, Objective C and C++ (and some general history of programming ).

<iframe width="560" height="315" src="https://www.youtube.com/embed/ecIWPzGEbFc" frameborder="0" allowfullscreen></iframe>

To program with C and C++, it usually takes a good IDE. While easy to use, the Arduino IDE is too simple for many professional programmers. One possible next step for embedded development is <a href="https://www.eclipse.org/">Eclipse</a>. As an additional motivation to explore Eclipse closer, the Eclipse open-source ecosystem. For example, the slide deck by [Erich Gamma](https://qconlondon.com/london-2008/qconlondon.com/dl/qcon-london-2008/slides/ErichGamma_qcon2008.pdf) on the history of Eclipse is quite interesting. There is also [EclipseCon](https://www.eclipsecon.org/europe2017/) which shows how the IDE evolves into different directions.

Some nice plugins to understand closer are:

* Eclipse [CDT](https://eclipse.org/cdt/) and [JDT](https://eclipse.org/jdt/) are probably the main drivers of Eclipse. These plugin systems focus on C/C++ and Java development respectively.
* Eclipse [PyDev](http://www.pydev.org/) is an interesting extension for working with Python projects. 
* While the CDT has an Arduino extension as well, the [Arduino plugin](http://eclipse.baeyens.it/) has all kinds of interesting additions.
* The Eclipse [JSON plugin](https://github.com/boothen/Json-Eclipse-Plugin) is interesting to work with data projects.
* The Eclipse [Cylon plugin](https://github.com/ceylon/ceylon-ide-eclipse) and Eclipse [Rust plugin](https://github.com/RustDT/RustDT) seem interesting to explore.

Now, according to some discussions in the internets, Eclipse is not the latest state-of-the-art IDE. Agreed. For web and other kinds of software projects, Eclipse may feel slow. And features are not yet finished or simply unclear. But as technology and data projects evolve, Eclipse might still be relevant for quite some years to come. 




