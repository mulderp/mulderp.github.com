---
layout: post
title: Tweaking Images
tags: command line design
---
I am enjoying the browser more and more as a medium for presentations. In this post, I want to provide some tricks to transform images for presentations.

First, I highly recommend browsing photographs at [flickr.com](http://flickr.com) when preparing a talk. Images capture emotions, as Garr Reynolds teaches us at [presentationzen.com](http://www.presentationzen.com/). Once you found images, you can do this to combine them with [reveal.js](http://revealjs.com).


First, when you need to convert a JPG to PNG, you can do simply a:

    convert cinema.jpg cinema.png

Often, you want to darken the images somewhat to use it as a background. For this, you can use:

    convert cinema.png -alpha on -channel A -evaluate set 40% +channel cinema_bg.png

Sometimes, you also want to make a mashup or moodboard of images. This can be done with a trick from [here](http://gotofritz.net/blog/geekery/combining-images-imagemagick/):
    
    convert *.png[200x400] -background "#ffffff"  +append output.png

Last, it can make sense to compress the image, in order to save valuable network bandwidth of readers. For this, I found a tool [pngquant](http://pngquant.org/):

    pngquant --quality=65-80  cinema_bg.png

That's all. Now, you can setup the image in your CSS with:

    .cinema_bg body {
        background-image: url(/static/images/cinema_bg-fs8.png);
        -webkit-background-size: cover;
        -moz-background-size: cover;
        -o-background-size: cover;
        background-size: cover;
    }

Hope this is helpful. Let me know what your favorite imagemagick tricks are!

