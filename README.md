# Simple Blog REST API

- [Swagger Docs](https://app.swaggerhub.com/apis-docs/sayedayman/xramile-task/1.0.0)
- [Online Link](https://xramile-test.herokuapp.com/)

## Description

We need to create a very simple blog REST API, which should give users ability to register and login, also make posts and only delete or edit their posts.

# installation steps

- copy `env.template` to `.env` and fill it.
- run with `npm run start`.

## Main Functionality

- [x] Register endpoint
- [x] Login endpoint
- [x] Create post endpoint
- [x] List all posts endpoint
- [x] Edit only user related posts endpoint
- [x] Delete only user related posts endpoint

## Requirements

- [x] Use one of following frameworks as your server router [Express](https://expressjs.com), [Koa](https://koajs.com) or [Fastify](https://www.fastify.io)
- [x] Add password encryption
- [x] Make sure to add validation
- [x] Use one of the following DBs [PostgrseSQL](https://www.postgresql.org) or [MongoDB](https://www.mongodb.com)

- [x] Add README with installation steps

## Note

- [x] User schema should contain email, password & name
- [x] Post schema should contain title, content

## Evaluation

- Functionality
- Code readability
- Git messages
- Linting

## Bonus

- [x] Add swagger docs
- [x] Deploy to any service you prefer
- Use docker
