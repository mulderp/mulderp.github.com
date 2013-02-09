---
layout: post
title: Transforming collections in Ruby
tags: ruby
---
Combinations of Arrays and Hashes in Ruby are very powerful, as shown in [this nice article](http://gistflow.com/posts/670-visualising-database-1) on visualizing user registrations and activity in a web application with Google Charts. After starting my own visualization experiments, I felt that I had some blind spots in understanding Ruby's [Enumerable Module](http://ruby-doc.org/core-1.9.3/Enumerable.html). This post attempts to share some insights on expanding and reducing Arrays of objects.

First, let's assume our data looks like:

<pre style="font-size:11px">
signups = ["2011-08"=>1433, "2011-09"=>2972, "2011-10"=>2480, "2011-11"=>2456]
logins = ["2011-08"=>2832, "2011-09"=>4172, "2011-10"=>3480, "2011-11"=>5456]
</pre>

My goal was to combine the two collections and transform the result into:

<pre style="font-size:11px">
activity = [ "2011-08" => { :signups => 1433, :logins => 2832 } ...
</pre>

In the exploration, I touched questions on #merge and #to_a of Hashes combined with #first and #last of Arrays, and #map, #inject, #group_by for Enumerables. Let's start.

## Splitting a Hash
My first step was to split the larger collection hash into single hashes. For this [first](http://ruby-doc.org/core-1.9.3/Enumerable.html#method-i-first) and [to_a](http://ruby-doc.org/core-1.9.3/Enumerable.html#method-i-to_a) methods help like this:

<pre style="font-size:11px">
signups.first.to_a
=> [["2011-08", 1433], ["2011-09", 2972], ["2011-10", 2480], ["2011-11", 2456]]
</pre>

There is one caveat with inverse transformation, i.e. converting above Array back to Hashes. I knew that:

<pre style="font-size:11px">
Hash[1,2]
=> {1 => 2}
</pre>

but this does not work:

<pre style="font-size:11px">
[["2011-08", 1433], ["2011-09", 2972], ["2011-10", 2480], ["2011-11", 2456]].map { |a| Hash[a] }
=> [{}, {}, {}, {}]
</pre>

In order to have the conversion working, the arguments must be 'splatted' with *, see e.g. [this discussion](http://theplana.wordpress.com/2007/03/03/ruby-idioms-the-splat-operator/).

So, this means by splating the input values with Hash[*a] we get:

<pre style="font-size:11px">
signups = [["2011-08", 1433], ["2011-09", 2972], ["2011-10", 2480], ["2011-11", 2456]].map { |a| Hash[*a] }
=> [{"2011-08"=>1433}, {"2011-09"=>2972}, {"2011-10"=>2480}, {"2011-11"=>2456}]
</pre>

Now we have an Array of Hashes for the signups (while we started with one Hash wrapped in an Array)
As I want some key in the collection that I could use later for grouping, let's introduce a :signup symbol as key like this:

<pre style="font-size:11px">
signups.map { |h| h.map { |k, v| { k => { signups: v }}}}.flatten
=> [{"2011-08"=>{:signups=>1433}}, {"2011-09"=>{:signups=>2972}}, {"2011-10"=>{:signups=>2480}}, {"2011-11"=>{:signups=>2456}}]
</pre>

Notice, there are two [#map](http://ruby-doc.org/core-1.9.3/Enumerable.html#method-i-map) calls here: The first #map is about walking on the elements of an Array, while the second #map walks on the key and values of a Hash. For me, a common mistoke is trying to walk an Array with pair elements, while these are only available in the Hash #map.

Let's apply a the transformation so far also to our second collection, the logins collections with:

<pre style="font-size:11px">
["2011-08"=>2832, "2011-09"=>4172, "2011-10"=>3480, "2011-11"=>5456].first.to_a.map { |a| Hash[*a] }.map { |h| h.map { |k, v| { k => { logins: v }}}}.flatten
=> [{"2011-08"=>{:logins=>2832}}, {"2011-09"=>{:logins=>4172}}, {"2011-10"=>{:logins=>3480}}, {"2011-11"=>{:logins=>5456}}]
</pre>

## Reduce and Grouping
The steps above were basically joining and expanding our collection that should now be reduced back to the final structure. To get this new, combined collection, let's summarize the structure we have so far:

<pre style="font-size:11px">
signups = [{"2011-08"=>{:signups=>1433}}, {"2011-09"=>{:signups=>2972}}, {"2011-10"=>{:signups=>2480}}, {"2011-11"=>{:signups=>2456}}]
logins = [{"2011-08"=>{:logins=>2832}}, {"2011-09"=>{:logins=>4172}}, {"2011-10"=>{:logins=>3480}}, {"2011-11"=>{:logins=>5456}}]
</pre>

Before we are going to mix up the collections, let's shortly review how #reduce works.

### Reduce (or Inject)

The methods #reduce and #inject do the same (they are aliased). The process is sometimes known as 'folding' a collection (see [wikipedia](http://en.wikipedia.org/wiki/Fold_(higher-order_function))). Here are two observations I made:

* Reduce let apply operators in an Enumerable list:

  <pre style="font-size:11px">
  [1,2,3].reduce(:+)
  => 6
  </pre>

* The effect of Reduce is a bit like chaining method calls:

  <pre style="font-size:11px">
  [{a: 1},{b:2}].reduce(:merge)
  => {:a=>1, :b=>2}
  </pre>

  This reminds me on {:a=>1}.merge({:b=>2}) that has the same outcome: {:a=>1, :b=>2}

Inject is very handy to walk a list, and at the same time keep some notes in memory on the progress. Sometimes an additional step might be necessary, to apply folding, e.g. prepare the collection with [#group_by](http://ruby-doc.org/core-1.9.3/Enumerable.html#method-i-group_by).

### Group_by

My observation on the #group_by method is that it allows to group data according to 'meta-data'. Consider grouping a number of objects according to their class. For example:

<pre style="font-size:11px">
["12", 12, "patrick", Object.new].group_by(&:class)
=> {String=>["12", "patrick"], Fixnum=>[12], Object=>[#<Object:0x007fd3b32d0aa8>]}
</pre>

Now, we could also group this collection according to their String values like this:

<pre style="font-size:11px">
["12", 12, "patrick", Object.new].group_by(&:to_s)
=> {"12"=>["12", 12], "patrick"=>["patrick"], "#<Object:0x007fd3b32bffa0>"=>[#<Object:0x007fd3b32bffa0>]}
</pre>

The same data, different groupings. However, so far we can go ahead again with our signup and login collections, and apply some #inject calls.

### Applying #inject

My first goal is to transform a structure as this:

<pre style="font-size:11px">
[{ :a => { :b => 10 }}, { :a => { :c => 20 }}]
</pre>

into:

<pre style="font-size:11px">
[{ :a => { :b => 10, :c => 20 }}]
</pre>

This can be done with:
<pre style="font-size:11px">
[{:a=>{:b=>10}}, {:a=>{:c=>20}}].map { |k| k.values }.flatten.reduce(:merge)
=> {:b=>10, :c=>20}
</pre>

The explanation: We reduce an Array of a nested Hash with the values from the start.

Our next step is to remove the extra Hashes here:

<pre style="font-size:11px">
[{ :a => { :b => 10, :c => 20 }}, { :d => { :b => 10, :c => 20 }}]
</pre>

This can be done with:
<pre style="font-size:11px">
[{ :a => { :b => 10, :c => 20 }}, { :d => { :b => 10, :c => 20 }}].reduce(:merge)
=> {:a=>{:b=>10, :c=>20}, :d=>{:b=>10, :c=>20}}
</pre>

Be careful, with a minor change the values from the first Hash are lost:

<pre style="font-size:11px">
[{ :a => { :b => 10, :c => 20 }}, { :a => { :f => 10, :d => 20 }}].reduce(:merge)
=> {:a=>{:f=>10, :d=>20}}
</pre>

Not: The reason that the merge does not work as espected is, that a merge does not walk recursively into a nested Hash. To get the proper merge operation, we need to apply #inject with an empty hash as accumulator like this: 

<pre style="font-size:11px">
[{ :a => { :b => 10, :c => 20 }}, { :a => { :f => 10, :d => 20 }}].inject({}) {|o,h| o.merge!(h[:a]); o }
=> {:b=>10, :c=>20, :f=>10, :d=>20}
</pre>

Now, a similar transformation can be applied to my joined signup and login collection. First, let's combine the collections:

<pre style="font-size:11px">
[logins, signups].flatten.group_by { |a| a.keys.first }
=> {"2011-08"=>[{"2011-08"=>{:logins=>2832}}, {"2011-08"=>{:signups=>1433}}], "2011-09"=>[{"2011-09"=>{:logins=>4172}}, {"2011-09"=>{:signups=>2972}}], "2011-10"=>[{"2011-10"=>{:logins=>3480}}, {"2011-10"=>{:signups=>2480}}], "2011-11"=>[{"2011-11"=>{:logins=>5456}}, {"2011-11"=>{:signups=>2456}}]}
</pre>

Now, let's reduce the set to the basics:

<pre style="font-size:11px">
login_signups = [logins, signups].flatten.inject({}) { |h,v| h[v.keys.first] ||= []; h[v.keys.first] << v.values; puts v.inspect; h}
{"2011-08"=>{:logins=>2832}}
{"2011-09"=>{:logins=>4172}}
{"2011-10"=>{:logins=>3480}}
{"2011-11"=>{:logins=>5456}}
{"2011-08"=>{:signups=>1433}}
{"2011-09"=>{:signups=>2972}}
{"2011-10"=>{:signups=>2480}}
{"2011-11"=>{:signups=>2456}}
=> {"2011-08"=>[[{:logins=>2832}], [{:signups=>1433}]], "2011-09"=>[[{:logins=>4172}], [{:signups=>2972}]], "2011-10"=>[[{:logins=>3480}], [{:signups=>2480}]], "2011-11"=>[[{:logins=>5456}], [{:signups=>2456}]]}
</pre>

Now, we are almost there. Let's clean up the combined hashes and arrays within the date keys:

<pre style="font-size:11px">
activities = login_signups.map { |m| {m.first => m.last.flatten.inject(:merge)} }=> [{"2011-08"=>{:logins=>2832, :signups=>1433}}, {"2011-09"=>{:logins=>4172, :signups=>2972}}, {"2011-10"=>{:logins=>3480, :signups=>2480}}, {"2011-11"=>{:logins=>5456, :signups=>2456}}]
=> [{"2011-08"=>{:logins=>2832, :signups=>1433}}, {"2011-09"=>{:logins=>4172, :signups=>2972}}, {"2011-10"=>{:logins=>3480, :signups=>2480}}, {"2011-11"=>{:logins=>5456, :signups=>2456}}]
</pre>

### Conclusion

My conclusion of this post are the following:
* Transforming nested collections is funcitonal programming, and it certainly takes practice. I would be curious to see/hear how you approach this kind of problems with your steps, or maybe in another programming language. Let me know what you think.
* A lot of transformation can be approached with standard Array methods like 'each' and 'map'; however they are sometimes not optimal, and in a way are limited to 'simple' transformation only.
* Redis as key-value store provides commands for Hash, List and Set operations; maybe getting a better understanding of the effects in Ruby helps you becoming a better data engineer too.
* I didn't use #group_by; although it is very helpful in a collections with more keys, e.g. see this discussion on [StackOverflow](http://stackoverflow.com/questions/14776686/ruby-transformation-to-merge-an-array-of-hashes-into-another-array-of-hash)
