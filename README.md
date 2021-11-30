# Roarr Fastify

[![Travis build status](https://img.shields.io/travis/gajus/roarr-fastify/main.svg?style=flat-square)](https://app.travis-ci.com/github/gajus/roarr-fastify)
[![Coveralls](https://img.shields.io/coveralls/gajus/roarr-fastify.svg?style=flat-square)](https://coveralls.io/github/gajus/roarr-fastify)
[![NPM version](http://img.shields.io/npm/v/@roarr/browser-log-writer.svg?style=flat-square)](https://www.npmjs.com/package/@roarr/browser-log-writer)
[![Canonical Code Style](https://img.shields.io/badge/code%20style-canonical-blue.svg?style=flat-square)](https://github.com/gajus/canonical)
[![Twitter Follow](https://img.shields.io/twitter/follow/kuizinas.svg?style=social&label=Follow)](https://twitter.com/kuizinas)

Roarr Fastify compatible logger.

## Motivation

* To have all logs produced using Roarr associated with the request ID.
* To use a single logging mechanism for HTTP service and the rest of the application.

## Usage

```ts
import {
  Roarr,
} from 'roarr';
import {
  createFastifyLogger,
} from '@roarr/fastify';
import createFastify from 'fastify';

const log = Roarr.child({
  program: 'your-program-name',
});

const app = createFastify({
  logger: createFastifyLogger(log),
});

/**
 * Uses {@link https://github.com/gajus/roarr#roarr-api-adopt|Roarr.adopt} to create an async_context
 * that adds `reqId` to all logs produced in request handlers.
 */
app.addHook('preHandler', (request, reply, done) => {
  void log.adopt(
    () => {
      done();
    },
    {
      requestId: request.id,
    },
  );
});

app.get('/', (request) => {
  // You can either explicitly retrieve logger from the request
  request.log.info('foo');
  // or you can just reference another Roarr instance.
  log.info('bar');
  // In both cases logs will include information about the HTTP request, i.e.
  // {"context":{"requestId":"req-1","program":"your-program-name","logLevel":30},"message":"foo"}
  // {"context":{"requestId":"req-1","program":"your-program-name","logLevel":30},"message":"bar"}
});
```
