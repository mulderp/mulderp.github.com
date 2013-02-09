---
layout: post
title: Transforming collections in Ruby
tags: ruby
---
As explained in [this nice article](http://gistflow.com/posts/670-visualising-database-1) on visualizing user registration and activity in a web application with Google Charts, combinations of Arrays and Hashes in Ruby are very powerful. I felt that I had some blind spots in my Ruby understanding on Enumberables, and this post attempts to share some insights on expanding and reducing Arrays of objects.

First, let's assume our data looks like:

    signups = ["2011-08"=>1433, "2011-09"=>2972, "2011-10"=>2480, "2011-11"=>2456]
    logins = ["2011-08"=>2832, "2011-09"=>4172, "2011-10"=>3480, "2011-11"=>5456]

My goal was to combine the two collections and transform the result into:

    activity = [ "2011-08" => { :signups => 1433, :logins => 2832 } ...

Here is an approach:

## Splitting a Hash
The first step might be to split the larger collection hash into single hashes. For this [first]() and [to_a] help like this:

    signups.first.to_a
    => [["2011-08", 1433], ["2011-09", 2972], ["2011-10", 2480], ["2011-11", 2456]]

Now, the hashes are away and we need to apply Array to Hash conversion with Hash[array]. I had suspected that it worked like this:

     [["2011-08", 1433], ["2011-09", 2972], ["2011-10", 2480], ["2011-11", 2456]].map { |a| Hash[a] }

but nope, the arguments must be 'splatted' with *, see e.g. [this discussion](http://theplana.wordpress.com/2007/03/03/ruby-idioms-the-splat-operator/)

So, to get an Array of Hashes with * as in Hash[*a] results into:

    signups = [["2011-08", 1433], ["2011-09", 2972], ["2011-10", 2480], ["2011-11", 2456]].map { |a| Hash[*a] }
    => [{"2011-08"=>1433}, {"2011-09"=>2972}, {"2011-10"=>2480}, {"2011-11"=>2456}]

But in fact, we want to introduct a new key into the collection that we can use later for grouping. It's basically this:

    signups.map { |h| h.map { |k, v| { k => { signups: v }}}}.flatten
    => [{"2011-08"=>{:signups=>1433}}, {"2011-09"=>{:signups=>2972}}, {"2011-10"=>{:signups=>2480}}, {"2011-11"=>{:signups=>2456}}]

Notice, there are two map calls here: The first map is about walking on the elements of an Array, while the second map walks on the key and values of a Hash. I found a common mistoke trying to walk an Array with pair elements. Not the right line of thinking.

Let's transform also our logins collections, with:

    ["2011-08"=>2832, "2011-09"=>4172, "2011-10"=>3480, "2011-11"=>5456].first.to_a.map { |a| Hash[*a] }.map { |h| h.map { |k, v| { k => { logins: v }}}}.flatten

# Grouping
To get to our new, combined collection, let's start with these results from above:

    signups = [{"2011-08"=>{:signups=>1433}}, {"2011-09"=>{:signups=>2972}}, {"2011-10"=>{:signups=>2480}}, {"2011-11"=>{:signups=>2456}}]
    logins = [{"2011-08"=>{:logins=>2832}}, {"2011-09"=>{:logins=>4172}}, {"2011-10"=>{:logins=>3480}}, {"2011-11"=>{:logins=>5456}}]

Since both collections have the same dates as keys, the Ruby enumerable method can be applied:

     [logins, signups].flatten.group_by { |a| a.keys.first }
     => {"2011-08"=>[{"2011-08"=>{:logins=>2832}}, {"2011-08"=>{:signups=>1433}}], "2011-09"=>[{"2011-09"=>{:logins=>4172}}, {"2011-09"=>{:signups=>2972}}], "2011-10"=>[{"2011-10"=>{:logins=>3480}}, {"2011-10"=>{:signups=>2480}}], "2011-11"=>[{"2011-11"=>{:logins=>5456}}, {"2011-11"=>{:signups=>2456}}]}


A short discourse on group_by: group_by allows to group data according to 'meta-data' I would say. Consider grouping a number of objects according to their class for example:

    ["12", 12, "patrick", Object.new].group_by(&:class)
    => {String=>["12", "patrick"], Fixnum=>[12], Object=>[#<Object:0x007fd3b32d0aa8>]}

Now, we could also group this collection according to their String values like this:

    ["12", 12, "patrick", Object.new].group_by(&:to_s)
    => {"12"=>["12", 12], "patrick"=>["patrick"], "#<Object:0x007fd3b32bffa0>"=>[#<Object:0x007fd3b32bffa0>]}

The same data, different groupings. End discourse.

Now, we are almost there. We need to get rid of some parts in our long hash above. So, we can apply a 'reduce' step like this:

    [logins, signups].flatten.group_by { |a| a.keys.first }.map { |k, v| {k => v.values.reduce(:merge)} }

    [logins, signups].flatten.group_by { |a| a.keys.first }.map { |k, v| {k => v.flat_map(&:values).reduce({}, &:update)} }
=> [{"2011-08"=>{:logins=>2832, :signups=>1433}}, {"2011-09"=>{:logins=>4172, :signups=>2972}}, {"2011-10"=>{:logins=>3480, :signups=>2480}}, {"2011-11"=>{:logins=>5456, :signups=>2456}}]

