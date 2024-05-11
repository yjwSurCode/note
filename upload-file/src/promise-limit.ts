/* eslint-disable prefer-spread */
/* eslint-disable prefer-rest-params */
/* eslint-disable @typescript-eslint/no-explicit-any */
function limiter(count: any) {
  let outstanding: any = 0;
  const jobs: any = [];

  function remove() {
    outstanding--;

    if (outstanding < count) {
      dequeue();
    }
  }

  function dequeue() {
    const job: any = jobs.shift();
    semaphore.queue = jobs.length;

    if (job) {
      run(job.fn).then(job.resolve).catch(job.reject);
    }
  }

  function queue(fn: any) {
    return new Promise(function (resolve, reject) {
      jobs.push({ fn: fn, resolve: resolve, reject: reject });
      semaphore.queue = jobs.length;
    });
  }

  function run(fn: any) {
    outstanding++;
    try {
      return Promise.resolve(fn()).then(
        function (result) {
          remove();
          return result;
        },
        function (error) {
          remove();
          throw error;
        }
      );
    } catch (err) {
      remove();
      return Promise.reject(err);
    }
  }

  const semaphore: any = function (fn: any) {
    if (outstanding >= count) {
      return queue(fn);
    } else {
      return run(fn);
    }
  };

  return semaphore;
}

function map(items: any, mapper: any) {
  let failed: any = false;

  const limit: any = this;

  return Promise.all(
    items.map(function () {
      const args = arguments;
      return limit(function () {
        if (!failed) {
          return mapper.apply(undefined, args).catch(function (e: any) {
            failed = true;
            throw e;
          });
        }
      });
    })
  );
}

function addExtras(fn: any) {
  fn.queue = 0;
  fn.map = map;
  return fn;
}

const promiseLimit = (count: any) => {
  if (count) {
    return addExtras(limiter(count));
  } else {
    return addExtras(function (fn: any) {
      return fn();
    });
  }
};

export default promiseLimit;
