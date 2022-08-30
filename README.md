# Crypto Swapper

This repository is an API to request prices and perform trades on certain crypto pairs.

It is an [Express](https://expressjs.com/) server
- written in [Typescript](https://www.typescriptlang.org/)
- tested with [Mocha](https://mochajs.org/) and [chaijs](https://www.chaijs.com/)
- that saves data in a [PostgreSQL](https://www.postgresql.org/) database
- and consults [Okx](https://www.okx.com/) about crypto prices and to perform trades

Everything can run inside [Docker](https://www.docker.com/) containers, not only for development but also on testing.

## Structure

The files structure is as follows:
- `build` created when building the project for production
- `coverage` directory to contain an HTML report of coverage statistics
- `db` where the database initialization script lives (and migrations should too)
- `src` directory contains the application code
  - `config` contains the configuration files. Their names must replicate the NODE_ENV environment variable used
  - `model` contains the entities that interact in this system
  - `repositories` contains the connectors to the database
  - `routes` contains the routers where the API is exposed to the public
  - `config.ts` loads the configuration files based on `NODE_ENV` environment variable
  - `index.ts` is the entry point of the app
- `tests` contains the application tests. The structure here mimics the `src` directory and each file tests over their corresponding one
- `docker-compose.test.yml` this compose files is used to spin up testing with controlled services such as postgres
- `docker-compose.yml` this compose file can quickly spin up a development environment
- `Dockerfile` file to create a container image of this application
- `Swapper.postman_collection.json` this file can be imported in Postman to have the application endpoints and also the used Okx ones

## Local installation & running

This application needs [NodeJS](https://nodejs.org/en/) to be installed. Using [NVM](https://github.com/nvm-sh/nvm) is encouraged.
Code dependencies are included in repository so no extra installation for that should be required. They can be installed running `npm install` in the root directory.

You also need PostgreSQL. This can be a local installation or, in a dockerized environment using the provided `docker-compose.yml` file.

After that, run `npm serve` to start the application in development mode. Unless changing the configuration, the app should start and be accessible on `http://localhost:3000/`

## Docker installation and running

To run the system in a container environment, run `npm run serve:docker` which will spin up the application container and the database one, recreating them on demand.

You can run just the database in a container manually if you want to locally execute the code and be able to easily debug it.

## Testing

The easiest way to test the complete system is running `npm run test:docker`. This will spin up all services in their respective containers, initialize them and run the tests.

Local test run is also possible having a clean PostgreSQL environment, ideally using a container to avoid data conflicts. This will allow you to set breakpoints and inspect what is happening.

### External services testing

If you run `npm run test-all`, there will be also test that hit external providers like Okx.
These are not run by default as unit test should ideally not use network or depend on things we don't control, however, you can use them to verify that we are receiving what we expect and to quickly verify if they changed the APIs.

### CI/CD

[Github actions](https://github.com/features/actions) use the dockerized test environment for testing and to continuously check the complete set of tests on every commit
