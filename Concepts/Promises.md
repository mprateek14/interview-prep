## PROMISE POLYFILLS

All Promise polyfills will RETURN a promise.

**Promise.all** -> will resolve if all promises get resolved else rejected
```javascript
Promise.newAll = function (promiseArr) {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(promiseArr)) {
      throw new Error("Need array as input");
    }

    const results = [];
    let count = 0;

    promiseArr.forEach((promise, idx) => {
      Promise.resolve(promise)
        .then((value) => {
          results[idx] = value;
          count++;

          if (count === promiseArr.length) resolve(results);
        })
        .catch((err) => reject(err));
    });
  });
};
```

**Promise.allSettled** -> will resolve regardless of results of individual promises
```javascript
Promise.newAllSettled = function (promiseArr) {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(promiseArr)) {
      throw new Error("Need array as input");
    }

    const results = [];
    let count = 0;

    promiseArr.forEach((promise, idx) => {
      Promise.resolve(promise)
        .then((value) => {
          results[idx] = value;
          count++;

          if (count === promiseArr.length) resolve(results);
        })
        .catch((err) => {
          results[idx] = err;
          count++;

          if (count === promiseArr.length) resolve(results);
        });
    });
  });
};
```

**Promise.race** -> returns first promise which gets settled regardless of resolved or rejected
```javascript
Promise.newRace = function (promiseArr) {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(promiseArr)) {
      throw new Error("Need array as input");
    }

    promiseArr.forEach((promise) => {
      Promise.resolve(promise)
        .then((value) => resolve(value))
        .catch((err) => reject(err));
    });
  });
};
```

**Promise.any** -> resolved if any of the promise gets resolved else throws aggregate error
```javascript
Promise.newAny = function (promiseArr) {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(promiseArr)) {
      return new Error("Need an array input");
    }

    if (promiseArr.length === 0) {
      return reject(new AggregateError([], "Array is empty"));
    }

    promiseArr.forEach((promise, idx) => {
      Promise.resolve(promise)
        .then((value) => resolve(value))
        .catch((err) => {
          errors[idx] = err;
          errCount++;

          if (errCount === promiseArr.length) {
            return reject(
              new AggregateError(errors, "All promises were rejected!"),
            );
          }
        });
    });
  });
};
```
