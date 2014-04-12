---
title: An Intro to Gulp
layout: post
tags: gulp browserify
---
The JavaScript community is increasingly moving towards [Streams](  ) to read, transform and write large chunks of data. One area, where multiple data transformations are needed is in frontend build processes.

Especially for larger projects, when you add linting, transforms and an uglify step, it can make sense to automate builds.

But let's start with a small project: Automate the build of a simple browserify command. 

    $ browserify ./app/main.js > static/bundle.js

To run this with gulp with uglify support, you need to setup a gulpfile.js.

But first, you need to install gulp:

    $ npm install -g gulp

And, in your project folder you should add a local gulp runner too:

    $ npm install gulp --save-dev

Next, you need to install some gulp tasks:

    $ npm install vinyl-source-stream --save-dev
    $ npm install gulp-streamify --save-dev
    $ npm install gulp-uglify --save-dev

The gulp tasks are the main steps of a build, and you define those in a gulpfile.js:

    var browserify = require('browserify');
    var gulp = require('gulp');
    var source = require('vinyl-source-stream');
    var jstify = require('jstify');
    var streamify = require('gulp-streamify');
    var uglify = require('gulp-uglify');
    
    gulp.task('browserify', function() {
      return browserify('./app/main.js')
        .transform('jstify')
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(streamify(uglify()))
        .pipe(gulp.dest('build/'));
    });

What happens here is: You first setup browserify to use a 'jstify' transform and bundle the input file 'app/main.js'. The resulting stream is piped into 'bundle.js', which again is piped into the uglify transform, and saved under 'build'.

This task is called 'browserify' and you can call it from the command as follows:

  $ gulp browserify
  [gulp] Using gulpfile /.../gulptest/gulpfile.js
  [gulp] Starting 'browserify'...
  [gulp] Finished 'browserify' after 6.58 s
  pmu:gulp(master|76m) pmu$ ls -ltr build/
  total 384
  -rw-r--r--  1 pmu  staff  194062 12 Apr 17:51 bundle.js

## References

* https://www.npmjs.org/package/vinyl-source-stream
* http://markgoodyear.com/2014/01/getting-started-with-gulp/
* Thanks to geson in #browserify for pointing me in the right directions
