---
layout: post
title: Connected Data
tags: graph database
images:
  - /static/images/skill_interface.png
---
Editing a list of data is easy. Editing a list of data, where one item can be parent or child of others is quickly getting difficult.

For example, take grouping skills into categories. The skill "Web Development" could be a child of "Software Development", but also includes children such as HTML, Ruby-on-Rails or jQuery. Starting with a flat list of skills, a simple editor might support re-arranging skills and grouping "skills" into contexts.  After some fiddling, I came up with a simple user-interface to do this:

<img src="{{page.images[0]}}">

Since the connections between skills and categories is the main value behind the data, we just have created a graph problem. How would we best store our skill graph? The embedded version in JSON looks like:

   [{"id":3,"children":[{"id":344},{"id":25},{"id":5},{"id":200},{"id":351},{"id":26},{"id":347},{"id":37},{"id":36},{"id":19},{"id":352},{"id":354},{"id":18},{"id":4},{"id":186},{"id":35},{"id":348}]},{"id":346,"children":[{"id":34},{"id":11},{"id":353},{"id":28},{"id":10},{"id":350},{"id":33}]},{"id":24,"children":[{"id":349},{"id":2},{"id":21},{"id":13},{"id":23},{"id":14},{"id":16},{"id":22},{"id":15},{"id":17},{"id":343}]},{"id":20,"children":[{"id":31},{"id":27}]},{"id":29,"children":[{"id":12}]},{"id":1,"children":[{"id":9},{"id":8},{"id":6},{"id":32},{"id":7},{"id":30},{"id":345}]}]

This is neither easy to read, nor easy to store or to query, unless we would use a graph database. And, as first step, a graph database starts with a model:

   (User) -[:knows]-> (Skill) <-[:belongs_to]- (SkillCategory)

Assuming this is our model, we still have a couple of questions: How to actually write the JSON from our editor to the skill graph? I think I want to explore [GrapheneDB](http://www.graphenedb.com/) - but I surely would need to integrate the service via some Rubygems, such as Neo4j.rb or Neography.

