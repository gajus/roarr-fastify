import type {
  FastifyLoggerInstance,
} from 'fastify';
import type {
  Logger,
} from 'roarr';
import {
  serializeError,
} from 'serialize-error';

type Configuration = {
  readonly requestIdLogLabel: string,
};

export const createFastifyLogger = (Roarr: Logger, configuration?: Configuration): FastifyLoggerInstance => {
  const requestIdLogLabel = configuration?.requestIdLogLabel ?? 'reqId';

  return Roarr.child((message): any => {
    if (!message.context[requestIdLogLabel]) {
      return message;
    }

    const newContext = {
      ...message.context,
    };

    const req = newContext.req as any;

    if (req) {
      newContext.request = {
        hostname: req.hostname,
        method: req.method,
        remoteAddress: req.ip,
        remotePort: req.socket?.remotePort,
        url: req.url,
        version: req.headers?.['accept-version'],
      };
    }

    const res = newContext.res as any;

    if (res) {
      newContext.response = {
        statusCode: res.raw?.statusCode,
      };
    }

    const err = newContext.err as any;

    if (err) {
      newContext.error = serializeError(err);
    }

    delete newContext.req;
    delete newContext.res;
    delete newContext.err;

    return {
      ...message,
      context: newContext,
    };
  }) as any;
};
