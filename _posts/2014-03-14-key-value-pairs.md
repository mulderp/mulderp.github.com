---
title: Synching DOM and State
layout: post
tags: backbone, rendering, dom, state
---

Data is often a kind of snapshot of state. While we often represent different aspects of state, we often target for data abstractions that hold in different situations.

Key-value pairs, or property list, have shown very flexible and clean representation of state. For example, if we want to track a list of products in a shop, we might have a key-value pair similar to:

    {  
       name: "Peligrino",
       price: 1.5,
       description: "Bottle of water from Italy"
    }

In most cases, we want to track more than one list of pairs. Often, we want to represent collections of key-value pairs as follows:

    [
       { name: "Peligrino", price: 1.5 },
       { name: "Vittel", price: 1. 5}
    ]

Now, whereas abstract data structures help you tracking state and computations, you display something else to users. When you are working with web browsers, the resulting problem is about translating state changes to the document-object-model, or DOM.

With the DOM, we have a representation about rendering pixels in a web browser, as well as capturing events. Whereas the key-value pairs can apply to a number of different situation, the DOM is rather specific. For example, we might want to render the Peligrino data as follows:

     <h2>Peligrino</h2>
     <ul>
       <li><span>Price:</span> 1.5 Eur</li>
       <li>Bottle of water</li>
     </ul>

Interestingly, when we translate the state of Peligrino water to DOM nodes, the number of data structures increases. In this case, we add h2, ul, li and span tags, besides the raw data. So, we go from 3 pairs, to 9 DOM nodes. In general, it is more costly to maintain state in the DOM, than it would be in key-value pairs. And, often we have many more items in a collection, than we actually can render to the screen.

So, tracking state in key-value pairs, outside the DOM, is often a good idea. To translate those pairs to DOM nodes, we can use JavaScript templates, where we replace placeholders with actual data. An example of templating with Handlebars might look like this:

  <h2>{{ name }}</h2>
  <ul>
    <li><span>Price:</span> {{ price }} Eur</li>
    <li>{{ description }}</li>
  </ul>

When you render the properties into a template and put the result into the DOM, the memory usage increases. This might be a problem if your site becomes larger. Synching state to the DOM must be careful examined for those cases.

By binding changes in the properties to DOM updates, we also can understand the workings of the MV* pattern, which you can play with [here](http://pipefishbook.com/editor).

Observing data changes and updating the DOM can quickly become more complicated. For example, if we had a list:

  [
    { name: "item 1", votes: 0.5 },
    { name: "item 2", votes: 0.4 },
    { name: "item 3", votes: 0.3 }
  ]

Which we would render into:

  <ul>
    <li>Item 1 <span>50%</span></li>
    <li>Item 2 <span>40%</span></li>
    <li>Item 3 <span>10%</span></li>
  </ul>

If we would want to sort the data on the votes, while tracking updates on the votes, quite some manual control would be needed. Maybe not for a dozen of data rows, but certainly if the amount of data increases into the hundreds or thousands. It's here where the Virtual DOM of [React](http://facebook.github.io/react/) might help you.

Anyway, the important point is that observing changes in key-value properties has its limits, while continuous DOM updates are not advisable either. The constraints and needs for synching DOM and state was also the background of [a talk that I gave at the JavaScript meetup in San Francisco](https://speakerdeck.com/mulderp/backbone-and-handlebars) Tuesday. Unfortunately, I struggled a bit explaining the mapping of key-value properties to the DOM and why we should care.

Therefore, apart from the fundamental concepts on synching state and the DOM, there are always custom business requirements to consider, when we setup a rendering strategy in a web application. An editor type of application might need better data-binding, than a product browser. A social network with realtime feedback, might need even more advanced rendering strategies. A shop for Ecommerce might support for server-side rendering too.

Let me know if this post is clear, or if I make some flaws in the argumentation.













   
