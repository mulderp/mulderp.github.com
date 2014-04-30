---
title: TDD or BDD? Try RDD!
layout: post
tags: node javascript
---

NOTE: This article is not about RDD in the sense of Rage Driven Development.

Kent Beck recently summarized the advantages of [TDD](https://www.facebook.com/notes/kent-beck/rip-tdd/750840194948847) in response to David Heinemeier Hansson's [complains](http://david.heinemeierhansson.com/2014/tdd-is-dead-long-live-testing.html) about [TDD/BDD](http://david.heinemeierhansson.com/2014/test-induced-design-damage.html) to design an API. It is old wisdom to look at a third option, when you found two opposites poles. This third option might be: <b>RDD</b>, and can add some extra ideas to the discussion of what "TDD/BDD" and "testing" might mean.

<b>RDD stands for REPL Driven Development.</b>

And [REPL](http://en.wikipedia.org/wiki/Read%E2%80%93eval%E2%80%93print_loop) recursively stands for the Read-Eval-Print-Loop. The pioneers of RDD might be computers scientists Gerald Jay Sussman and Hal Abelson, as they mention the REPL loop in [Ch. 1](http://mitpress.mit.edu/sicp/full-text/book/book-Z-H-10.html#%_idx_206) of their famous book [Structure and Interpretation of Computer Programs](http://mitpress.mit.edu/sicp/full-text/book/book.html).

First, some principles that drive TDD/BDD and "testing", such as the [KISS](http://en.wikipedia.org/wiki/KISS_principle) and [DRY principles](http://en.wikipedia.org/wiki/Don%27t_repeat_yourself), have strong influences in RDD too. A REPL provides great feedback to obtain a feeling for the boundaries of your modules, objects and messages.  And, if you work with data in JSON, a REPL can support you to explore and improve data structures too.

## The problem

Let's start with the typical problem for RDD. You got some fresh data from several sources that you must insert into some other application, such as the database of a movie festival. Unfortunately, the movie theatres provided you with movies in CSV format (probably from Excel spreadsheets...) . So, you have these tasks:

* Read the raw CSV data
* Convert the CSV format into JSON
* Provide a maximum amount of code reuse

First, you need some raw data in a file 'movies.csv':

    title;year ;director;genres
    The Artist  ;2009;  Hazanavicius;Comedy,Drama
    Dead Man Down;2013;Niels Arden Oplev;Action, Crime

So, this is a header line, and 2 rows of data all separated with ";".

## Entering the REPL

Now, let's start with the nucleus of RDD development: You fire up a REPL console. For convenience, this example uses a Node console, but it could be the REPL of Ruby, CoffeeScript, Python, Elixir, ...

So, you type:

    $ node

To load a file from the file system, you need some kind of library that deals with IO. In Node, this is 'fs' module, and you can require it as follows:

    > fs = require('fs')

Hmm.... now, how to read that movies.csv file? Is it "fs.load...", "fs.read..", "fs.readStream", ... ? Good question. The Node REPL can provide some hints if you type:

    > fs
    { Stats: [Function],
      exists: [Function],
      existsSync: [Function],
      readFile: [Function]
      ...

In about the 4th line, you see "readFile". That one looks promising. The Node REPL unfortunately does not have direct support for documentation (but other REPLs have). So, to see how to use "fs.readFile", you can visit the [docs on the fs module](http://nodejs.org/api/fs.html#fs_fs_readfile_filename_options_callback).

As it turns out, you can call 'readFile' as follows:
  
    > fs.readFile('./movies.csv', function(e, data) {
    ... console.log(data);
    ... })
    undefined

And what the REPL will say is:

     > <Buffer 74 69 74 6c 65 3b ...>

Ok, this looks like data. You would have expected some string in a human readable form, wouldn't you? The REPL says you got a Buffer. OK, keep calm.

You can easily run the same command mutliple times in a good REPL.

So, you try this:

     > fs.readFile('./movies.csv', function(e, data) {
     ... console.log(data.toString());
     ... })
     > title;year ;director;genres
       The Artist   ;2009;  Hazanavicius;Comedy,Drama
       Dead Man Down;2013;Niels Arden Oplev;Action, Crime

Nice! That looks like something you can work with. And, we can mark our first Todo as "done".

## Save your learnings

In this first REPL session, you were lucky to adapt the same command with minor variations. But our converter will get more complex in a second. So, to keep your mind sane, it's good to leave the REPL, and put your first abstraction into a file:

    $ cat > jsony.js
    var fs = require('fs');
    var JSONy = function() {};
    module.exports = JSONy

With this, you created a JSONy module based on an empty constructor function (think of "class" in other languages).

Then, you take that 'fs.readFile' idea, and add a 'load' function to 'jsony.js':

    JSONy.load = function(filename) {
      fs.readFile(filename, function(e, data) {
        var row = data.toString();
        console.log(row);
      });
    }

This is a good start to enter our next REPL session.

## REPLing out the convert function

To check that the learnings from the first REPL session are in place, let's start another REPL session:

    $ node

Then:

    > jsony = require('./jsony');
    { [Function] load: [Function] }

Cool, the load function is already there to play with in the Node console. Let's try this:

    > jsony.load('./movies.csv')
    undefined
    > title;year ;director;genres
    The Artist   ;2009;  Hazanavicius;Comedy,Drama
    Dead Man Down;2013;Niels Arden Oplev;Action, Crime

Fantastic, this was not rocket science, but taking small steps is good practice in RDD too.

To come back to our original goal, converting CSV into JSON, you need several steps. Your load function misses something important: A hook where data is transformed. As Node is non-blocking, you could use a callback, a transform stream or a promise chain to exploit some forms of concurrency.

Although streams and Promises are great, let's learn about an important REPL principle: [KISS (Keep it Stupid Simple)(http://en.wikipedia.org/wiki/KISS_principle). For us, it means callbacks. You can add a callback hook in the load function of 'jsony.js' as follows:

    var fs = require('fs');
    var JSONy = function() {};
    
    JSONy.load = function(filename, cb) {
      fs.readFile(filename, cb);
    }
    module.exports = JSONy

With a fresh REPL session, you are now ready to explore the main convert function. Let's start with the following idea for 'convert':

    > jsony = require('./jsony');
    > convert = function(e, raw) { return raw.toString().split('\n') }
    > jsony.load('./movies.csv', convert);

Nothing seems to happens. But in the REPL, you can easily check if this is "no news is good news", or something was piped into "/dev/null".

To check, let's introduce an array to store the output:

    > out = [];

And, adapt the convert function. Aha, hmm... maybe the "return" above is not required? Important feedback.

With an output variable, you can simple do:

    > convert = function(e, raw) { out = raw.toString().split('\n'); } 
    > jsony.load('./movies.csv', convert);

When you try this, and inspect 'out':

    > out
    [ 'title;year ;director;genres',
      'The Artist   ;2009;  Hazanavicius;Comedy,Drama',
      'Dead Man Down;2013;Niels Arden Oplev;Action, Crime',
      '', ]

Next, you could wrap your new function:

    > out = [];
    > _extractRows = function(raw) { return raw.toString().split('\n') }
    > convert = function(e, raw) { out = _extractRows(raw) }

REPLing this up, gives:

    > jsony.load('./movies.csv', convert);
    > out
    [ 'title;year ;director;genres',
      'The Artist   ;2009;  Hazanavicius;Comedy,Drama',
      'Dead Man Down;2013;Niels Arden Oplev;Action, Crime',
      '' ]

OK, again, some important learnings.The previous insights and new sketches for code ideas are the right amount of code to add into the JSONy module as follows:

    function _extractRows(raw) {
      return raw.toString().split('\n')
    }
    
    function _splitFields(line) {
      return line.split(';');
    }
    
    var out = [];
    function convert(e, raw, cb) {
      var lines = _extractRows(raw);
    
      for (var i=0; i < lines.length; i++) {
        var line = lines[i];
        var fields = _splitFields(line);
        out.push(fields);
      } 
    
      cb(e, out);
    }
    
    jsony.convert = convert;
    
    module.exports = jsony

Note the unoffical convention to mark a "private" function in JavaScript: With a '_' prefix, you can inform readers of your code that this is not available outside the JSONy module. Also, we add a callback to the 'convert' function, such that 'convert' can be more easily be used with IO operations.

## Keeping it DRY

As your module is beginning to take shape, you can start to use the command line as REPL too. This will keep you from typing the same things over and over, and it's here where you meet the [DRY (don't repeat yourself) principle](http://en.wikipedia.org/wiki/Don%27t_repeat_yourself)) of RDD.

In a new file 'convert.js', you add a shell for the JSONy module:

    $ cat > convert.js
    var jsony = require('./jsony');
    
    jsony.load('./movies.csv', function(e, raw) {
      jsony.convert(e, raw, function(e, result) {
        console.log(result);
      });
    });

Now, from the command line you type:

    $ node convert.js

And, you again get the data:

    [ [ 'title', 'year ', 'director', 'genres' ],
      [ 'The Artist   ', '2009', '  Hazanavicius', 'Comedy,Drama' ],
      [ 'Dead Man Down', '2013', 'Niels Arden Oplev', 'Action, Crime' ],
      [ '' ] ]

## The last mile 

Turning an array into JSON is not difficult, is it? It is even easier by applying a bit of functional magic with e.g. [Underscore](http://underscorejs.org). For example, you can add in 'jsony.js':

    var head = _splitFields(lines[0]);
    out.push(_.object(head, fields));

Now, you can push almost JSON objects to your screen:

    $ node convert.js 
    [ { title: 'title',
        'year ': 'year ',
        director: 'director',
        genres: 'genres' },
      { title: 'The Artist   ',
        'year ': '2009',
        director: '  Hazanavicius',
        genres: 'Comedy,Drama' },
      { title: 'Dead Man Down',
        'year ': '2013',
        director: 'Niels Arden Oplev',
        genres: 'Action, Crime' } ]

The missing step is:

     JSON.stringify(out);

Before trying this, let's cleanup some abstractions. It is a good idea to remove trailing whitespaces, and add an exception if there is something wrong with the header. You'll end up with:

    JSONy.load = function(filename, cb) {
      fs.readFile(filename, cb);
    }
    
    function _extractRows(raw) {
      return raw.toString().split('\n')
    }
    
    function _trimArray(array) {
      return array.map(function(str) { return str.trim() });
    }
    
    function _splitFields(line) {
      return _trimArray(line.split(';'));
    }
    
    var out = [];
    function convert(e, raw, cb) {
    
      if (!raw) {
        cb("no input", null);
        return
      }
    
      var lines = _extractRows(raw);
    
      var head = JSONy.head;
    
      // use first line as header if available
      if (JSONy.HEAD) {
        start = JSONy.HEAD;
        head = _splitFields(lines[0]);
      }
    
      if (!head) {
        cb("No header specified", null);
        return;
      }
    
      for (var i=0; i < lines.length-1; i++) {
        var line = lines[i];
        var fields = _splitFields(line);
        out.push(_.object(head, fields));
      } 
    
      cb(e, out);
    }
    
    JSONy.HEAD = 1; // use first line as header
    JSONy.convert = convert;
    
    module.exports = JSONy

And, your command line client:

    #!/usr/bin/env node
    
    var jsony = require('./jsony');
    
    jsony.load(process.argv[2], function(e, raw) {
      jsony.convert(e, raw, function(e, result) {
        if (e) {
          console.log(e);
          process.exit(1);
        }
        console.log(JSON.stringify(result));
      });
    });

This is runnable when you do:

    $ chmod u+x ./convert.js
    $ ./convert.js movies.csv

And you should get:

    [{"title":"title","year":"year","director":"director","genres":"genres"},{"title":"The Artist","year":"2009","director":"Hazanavicius","genres":"Comedy,Drama"},{"title":"Dead Man Down","year":"2013","director":"Niels Arden Oplev","genres":"Action, Crime"}]

# Conclusions

You saw how to apply the KISS and DRY coding principles with RDD. RDD stands for REPL Driven Development, and REPL recursively for Read-Print-Eval-Loop.

RDD can be practioned in every dynamic environment that supports a REPL, such as JavaScript, CoffeeScript, Python, Ruby, Elixir or Bash.

The main idea of RDD is to get feedback by running code in a REPL. Also with RDD, it is important to stay calm while coding. That means you shouldn't fall into the trap of Rage Driven Development or other options. RDD might not work for every one or every company, but it does for me.

You can have a look at the [github repo](https://github.com/mulderp/jsony) or at [jsony@npmjs.org](https://www.npmjs.org/package/jsony) - Note, that JavaScript was not taken by coincidence here to illustrate RDD. Most of the ideas of this post sum up ideas from a talk I gave at the [NoSQLmatters conference] about running JavaScript in a database with ArangoDB. You can find the slides [here](https://speakerdeck.com/mulderp/script-your-way-to-nosql)

Thanks for reading, let me know how to imrprove the ideas presented here!
