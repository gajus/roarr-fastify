/* eslint-disable node/no-process-env */
/* eslint-disable ava/use-test */

import type {
  TestInterface,
} from 'ava';
import anyTest from 'ava';
import * as sinon from 'sinon';
import {
  createFastifyLogger,
} from '../../src/factories/createFastifyLogger';

const test = anyTest as TestInterface<{
  ROARR: any,
  Roarr: any,
  write: sinon.SinonStubbedMember<(message: string) => void>,
}>;

test.beforeEach(async (t) => {
  process.env.ROARR_LOG = '1';

  const {
    Roarr,
    ROARR,
  } = await import('roarr');

  sinon.restore();

  const write = sinon.stub(ROARR, 'write');

  write.callsFake(() => {});

  t.context = {
    Roarr,
    ROARR,
    write,
  };
});

test('serializes error', (t) => {
  const {
    Roarr,
    write,
  } = t.context;

  const log = createFastifyLogger(Roarr);

  log.error({
    err: new Error('foo'),
    reqId: '1',
  }, 'bar');

  t.regex(write.firstCall.args[0], /Error: foo/u);
});
