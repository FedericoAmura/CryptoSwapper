# Crypto Swapper

This repository is an API to request prices and perform trades on certain crypto pairs.
The goal can be found on the [REQUIREMENTS.md](REQUIREMENTS.md) file.

## Structure

It is an [Express](https://expressjs.com/) server, written in [Typescript](https://www.typescriptlang.org/)

The files structure is as follows:
- `src` directory contains the application code
  - `config` contains the configuration files. Their names must replicate the NODE_ENV environment variable used
  - `routes` contains the routers
  - `config.ts` loads the configuration files accordingly
  - `index.ts` is the entry point of the API app, it loads the routers
- `tests` contains its tests which are run with [Mocha](https://mochajs.org/) and asserted with [Chai](https://www.chaijs.com/)

## Installation & running

This application needs nodejs to be installed previously. Using [NVM](https://github.com/nvm-sh/nvm) is encouraged.

Dependencies are included in repository so no extra installation should be required. They can be installed running `npm install` in the root directory.

After that, run `npm serve` to start the application in development mode. Unless changing the configuration, the app should start and be accessible on `http://localhost:3000/`

## Testing

To verify the tests included, run `npm run test`
