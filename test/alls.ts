import 'mocha';
import * as should from 'should';
import { alls } from '../lib';

describe('alls', () => {
  it('should wait till all the success promises finished', async () => {
    const results = await alls([
      Promise.resolve(1),
      Promise.resolve(2),
      Promise.resolve(3)
    ]);

    should(results).containDeepOrdered([
      { state: 'fulfilled', value: 1 },
      { state: 'fulfilled', value: 2 },
      { state: 'fulfilled', value: 3 }
    ]);
  });

  it('should wait till all the failed promises finished', async () => {
    const error1 = new Error('error 1');
    const error2 = new Error('error 2');
    const error3 = new Error('error 3');

    const results = await alls([
      Promise.reject(error1),
      Promise.reject(error2),
      Promise.reject(error3)
    ]);

    should(results).containDeepOrdered([
      { state: 'rejected', reason: error1 },
      { state: 'rejected', reason: error2 },
      { state: 'rejected', reason: error3 }
    ]);
  });

  it('should wait till all the failed/success promises finished', async () => {
    const error1 = new Error('error 1');
    const error2 = new Error('error 2');
    const error3 = new Error('error 3');

    const results = await alls([
      Promise.resolve(1),
      Promise.reject(error1),
      Promise.resolve(2),
      Promise.reject(error2),
      Promise.resolve(3),
      Promise.reject(error3)
    ]);

    should(results).containDeepOrdered([
      { state: 'fulfilled', value: 1 },
      { state: 'rejected', reason: error1 },
      { state: 'fulfilled', value: 2 },
      { state: 'rejected', reason: error2 },
      { state: 'fulfilled', value: 3 },
      { state: 'rejected', reason: error3 }
    ]);
  });

  it('should process even they are not promises', async () => {
    const results = await alls([
      'string1' as any,
      'string2' as any,
      'string3' as any
    ]);

    should(results).containDeepOrdered([
      { state: 'fulfilled', value: 'string1' },
      { state: 'fulfilled', value: 'string2' },
      { state: 'fulfilled', value: 'string3' }
    ]);
  });

  it('should process for falsy values', async () => {
    const results = await alls([null, false as any, 0, undefined, '']);

    should(results).containDeepOrdered([
      { state: 'fulfilled', value: null },
      { state: 'fulfilled', value: false },
      { state: 'fulfilled', value: 0 },
      { state: 'fulfilled', value: undefined },
      { state: 'fulfilled', value: '' }
    ]);
  });

  it('should process for primitive values', async () => {
    const results = await alls([1 as any, true as any, 'test' as any, 1.5]);

    should(results).containDeepOrdered([
      {
        state: 'fulfilled',
        value: 1
      },
      {
        state: 'fulfilled',
        value: true
      },
      {
        state: 'fulfilled',
        value: 'test'
      },
      {
        state: 'fulfilled',
        value: 1.5
      }
    ]);
  });

  it('should process for objects', async () => {
    const results = await alls([
      {
        test1: 'test1'
      } as any,
      {
        test2: 'test2'
      } as any,
      {
        test3: 'test3'
      } as any
    ]);

    should(results).containDeepOrdered([
      {
        state: 'fulfilled',
        value: {
          test1: 'test1'
        }
      },
      {
        state: 'fulfilled',
        value: {
          test2: 'test2'
        }
      },
      {
        state: 'fulfilled',
        value: {
          test3: 'test3'
        }
      }
    ]);
  });

  it('should maintain the order', async () => {
    const results = await alls([
      new Promise((resolve) => {
        setTimeout(() => resolve(10), 600);
      }),
      new Promise((resolve) => {
        setTimeout(() => resolve(20), 200);
      }),
      new Promise((resolve) => {
        setTimeout(() => resolve(30), 900);
      })
    ]);

    should(results).containDeepOrdered([
      { state: 'fulfilled', value: 10 },
      { state: 'fulfilled', value: 20 },
      { state: 'fulfilled', value: 30 }
    ]);
  });

  it('should work with good old promise call back', (done) => {
    alls([
      new Promise((resolve) => {
        setTimeout(() => resolve(10), 600);
      }),
      new Promise((resolve) => {
        setTimeout(() => resolve(20), 200);
      }),
      new Promise((resolve) => {
        setTimeout(() => resolve(30), 900);
      })
    ])
      .then((results) => {
        should(results).containDeepOrdered([
          { state: 'fulfilled', value: 10 },
          { state: 'fulfilled', value: 20 },
          { state: 'fulfilled', value: 30 }
        ]);

        done();
      })
      .catch(done);
  });

  it('should handle both promise functions and none promise functions', async () => {
    const results = await alls([
      (() =>
        new Promise((resolve) => {
          setTimeout(() => resolve(10), 10);
        }))(),
      (() =>
        new Promise((resolve) => {
          setTimeout(() => resolve(20), 100);
        }))(),
      (() => 30)() as any,
      (() =>
        new Promise((resolve) => {
          setTimeout(() => resolve(40), 100);
        }))()
    ]);

    should(results).containDeepOrdered([
      { state: 'fulfilled', value: 10 },
      { state: 'fulfilled', value: 20 },
      { state: 'fulfilled', value: 30 },
      { state: 'fulfilled', value: 40 }
    ]);
  });
});
