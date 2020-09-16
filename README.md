# eventsourcing

## Overview

The following project has been created to demonstrate an attempt at a simple, pure implementation of Event Sourcing,
Domain Driven Design (DDD), Command Query Responsibility Segregation (CQRS), and favors eventual consistency.

**Notes:**
- No authentication / authorization
- A "DELETE" was implemented in order to respect practical implications such as CCPA & GDPR requests
- It can be built upon in order to implement complex Sagas and two phase commits

## Required Software & Tools

1. Docker
2. NodeJs (Frontend & Backend)

## Software Stack

1. RabbitMQ
2. EventStore DB
3. ExpressJs (Backend services)
4. Artillery (Load Testing)

## Services
1. `uuids`: Generates globally unique identifiers that can horizontally scale and are numeric and sortable by time
2. `users`: Manages user accounts

## Stack Setup
1. Install Required Software & Tools
2. In a terminal, run `make up`

## Running Tests

Run `make test` in a terminal after setting up the stack.

**Note**: If you receive ERRCONNRESET responses in your terminal, run `docker restart users` to reboot, and `make logs users` to verify the users service connects to RabbitMQ successfully.

## Research & Inspiration

September 9, 2020

1. [Event-Driven Microservices Backend Sample](https://github.com/rithinch/event-driven-microservices-docker-example)
2. [vuejs-boilerplate](https://github.com/kurosame/vuejs-boilerplate)
3. [Event Sourcing You are doing it wrong by David Schmitz](https://www.youtube.com/watch?v=GzrZworHpIk)
4. [Asynchronous Microservices with RabbitMQ and Node.js](https://manifold.co/blog/asynchronous-microservices-with-rabbitmq-and-node-js)
5. [Lessons Learned Building Distributed Systems with CQRS and Event Sourcing](https://hackernoon.com/lessons-ive-learned-building-distributed-systems-with-cqrs-and-event-sourcing-ece284ecc1a1)

September 10, 2020

1. [Awesome Microservices](https://github.com/mfornos/awesome-microservices)
2. [Event-Driven Microservices with RabbitMQ and Ruby](https://medium.com/kontenainc/event-driven-microservices-with-rabbitmq-and-ruby-7a54ae01b285)
3. [Event-sourcing: when (and not) should I use Message Queue?](https://stackoverflow.com/questions/41131609/event-sourcing-when-and-not-should-i-use-message-queue)
4. [Building Microservices: Using Node.js with DDD, CQRS, and Event Sourcing — Part 1 of 2](https://medium.com/@qasimsoomro/building-microservices-using-node-js-with-ddd-cqrs-and-event-sourcing-part-1-of-2-52e0dc3d81df)
5. [examples-nodejs-cqrs-es-swagger](https://github.com/qas/examples-nodejs-cqrs-es-swagger)
6. [CQRS](https://docs.nestjs.com/recipes/cqrs)
7. [CQRS](https://martinfowler.com/bliki/CQRS.html)
8. [CQRS: What? Why? How?](https://medium.com/@sderosiaux/cqrs-what-why-how-945543482313)
9. [CQRS: Why? And All The Things To Consider](https://www.sderosiaux.com/articles/2019/08/29/cqrs-why-and-all-the-things-to-consider/)
10. [Microservices Done Right, Part 2: More Antipatterns to Avoid](https://www.solutionsiq.com/resource/blog-post/microservices-done-right-part-2-more-antipatterns-to-avoid/)
11. [Awesome CQRS and Event Sourcing](https://github.com/leandrocp/awesome-cqrs-event-sourcing)
12. [Event Store Test Lab](https://github.com/redice44/rabbitmq-event-store)
13. [rabbitmq-with-expressjs](https://github.com/murnax/rabbitmq-with-expressjs)

September 11, 2020
1. [Event Sourcing with PostgreSQL](https://medium.com/@tobyhede/event-sourcing-with-postgresql-28c5e8f211a2)
2. https://docs.google.com/presentation/d/e/2PACX-1vQZtSayNpRcqw4P9vT3Tm6i-bxb4iUB4IQy3RuxRrZ5aB6v9RxyIvkscVCRG3f_gNiqq8r_RQZORwCv/pub#slide=id.g2b584ab1f6_0_1272
3. [Eventide Message-DB](http://docs.eventide-project.org/user-guide/message-db/)

September 12, 2020
1. [Event Sourcing Basics](https://eventstore.com/docs/event-sourcing-basics/index.html)
