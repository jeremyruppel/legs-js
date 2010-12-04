Legs.js
=======

What this is
------------

Legs.js, at the moment, isn't much more than an homage to the RobotLegs micro-architecture
for AS3. RobotLegs implemented some very powerful patterns and Legs.js is a proof-of-concept
of those same patterns working in JavaScript.

In the meantime, it's a good way to decouple, organize, and wire up your application.

What this isn't
---------------

A dependency injection framework. Let's get serious.

Main Concepts Borrowed
----------------------

- Single event bus to decouple framework actors
- Use of command pattern to encapsulate application actions
- Views paired with Mediators to translate user events into framework events
- Can configure actors to be 'singletonized' within the injector

Todo
----

Write a legit README.