---
layout: post
title: Dealing with finance - A book review
tags: books, python, finance
---

People who work with finances, work with spreadsheets. But spreadsheets have multiple problems:

* Accessing spreadsheets from outside is hard. In data networks for example, it can be important to send a link or details of transactions to clients. In contrast to [HTTP](https://www.ietf.org/rfc/rfc2616.txt), "sending spreadsheets" is much harder for data sharing and collaboration.

* For advanced visualizations, data in "raw" format, e.g. [CSV](http://en.wikipedia.org/wiki/Comma-separated_values) is much easier to visualize with libraries such as [D3.js](http://d3js.org/).

* While you can easily manipulate data in cells of a spreadsheet, it is hard to build [a language around your data](http://thinkingonthinking.com/Bookshelf-an-ORM-for-Node/). For example, if you want to apply different tax or interest rates according to some rules, how would you communicate these rules in a spreadsheet?

From working in [a bank](http://fidor.de) (until last year), I can tell you that processing numbers from spreadsheets and [CSV](http://en.wikipedia.org/wiki/Comma-separated_values) files is the daily business in finance.

Somehow it is strange, that we discuss crypto-currencies in the web, but most financial data still hides in spreadsheets.

So, I had some hidden hopes, when I looked at the book [Python for Finance](http://shop.oreilly.com/product/0636920032441.do). While the book is not about open-source finance (for running a business or just to manage your personal cashflow), it has some interesting ingredients.

Keeping track of finances is difficult enough. Most data comes as time-series data, but financial decisions often relate to risks as well. In the book, the first chapters will get you a basic taste of financial models and formula's for understanding trends in financial markets.
 
These chapters feel a bit academic. For an outsider, it is hard to understand why you want to try the effects of different parameters in the [Black-Scholes formula](http://en.wikipedia.org/wiki/Black%E2%80%93Scholes_model ). From what I can tell, the book example does a bit the same as the example on [WolframAlpha](http://www.wolframalpha.com/input/?i=black+scholes&lk=4). But, how or where does my financial data fit into this game?

If I would write a finance book for programmers, I would start with CSV. The book would show the advantages of CSV: Its openess, ease of use, hackability. Also, CSV can be used for small and big data. This year, there was even [a CSV conference](http://csvconf.com/) in Berlin. Maybe some libraries could be mentioned that allow access to finance APIs.

Before "Python for Finance" mentions CSV, it continues with Python libraries for analyzing numbers, e.g. with the [Pandas library](http://pandas.pydata.org/). Some early words on getting up and running with Python would be nice. Especially, how to use the Python package manager, *before* any Python code is introduced.

After the Black-Scholes examples, the books introduces [Anaconda](https://store.continuum.io/cshop/anaconda/) and [IPython](http://ipython.org/). On a quick glance, I could not see, what Python flavor should be used when. and how these package are different from my "native" system Python on MacOS.

What follows in the book are impressive plots based on financial models and simulations. I have never seen these kinds of plots outside of Matlab worlds. Exploring the books' examples for visualizations would certainly be interesting, if you feel passionate about the stock market. For my taste, it would be interesting to understand time-series financial data in other contexts too, for example for corporate finance purposes, or just for estimating my income taxes.

Well, all in all, while working with Matlab currently, I can see the value of scripting simulations or plots with Python. The book gives a nice introduction to it, but it certainly won't help you understanding the finances of a business or your personal income and expenses.

*Disclaimer*: This post was written in the context of the [O'Reilly Reader Review program](http://oreilly.com/reviews 

<a href="http://www.oreilly.com/reviews/?cmp=ex-orm-blgr-patrick-mulder"><img alt="I review for the O'Reilly Reader Review Program" src="http://cdn.oreillystatic.com/bloggers/blogger-review-badge-200.png" border="0" width="200" height="150"></a>
