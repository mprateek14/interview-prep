# PROMISES

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

## Execute Promises in Series

```javascript
const p1 = () => new Promise((res) => setTimeout(() => res("First (Fast)"), 500));
const p2 = () => new Promise((res) => setTimeout(() => res("Second (Slow)"), 2000));
const p = () => new Promise((res, rej) => rej("Failed Promise p"));
const p3 = () => Promise.resolve(42); 
const p4 = () => new Promise((res, rej) => rej("Failed Promise p4"));

const promiseArr = [p1, p2, p3, p4, p];
```

**With Async-Await**

```javascript
const executeSeriesAsyncAwait = async(promiseArr) =>{
    const results = []

    for(let promise of promiseArr){
        try{
            let res = await promise();
            console.log(res, "resolve")
            results.push(res)
        }
        catch(err){
            console.log(err, "reject")
            results.push(err)
        }
    }

    console.log(results, "executeSeriesAsyncAwait")
}

executeSeriesAsyncAwait(promiseArr)
```

**Recursively**

```javascript
const executeSeriesRecursive = (promiseArr) => {
    const results = []

    const execute = (idx) => {
        if(idx>=promiseArr.length){
            return Promise.resolve(results)
        }

        return promiseArr[idx]().then((result) => {
            console.log(result, "result")
            results.push(result)
            return execute(idx+1)
        })
        .catch(err => {
            console.log(err, "reject")
            results.push(err)
            return execute(idx+1)
        })
    }

    return execute(0);
}

let results = await executeSeriesRecursive(promiseArr)
console.log(results, "executeSeriesRecursive")
```

**With Reduce**

```javascript
const executeSeriesReduce = (promiseArr) => {
    const results = []

    const finalChain = promiseArr.reduce((acc, promiseItem)=>{
        return acc.then(() => {
            return promiseItem().then((result) => {
                console.log(result, "result")
                results.push(result)
            })
            .catch(err => {
                console.log(err, "reject")
                results.push(err)
            })
        })
    }, Promise.resolve())

    return finalChain.then(() => results);
}

results = await executeSeriesReduce(promiseArr)
console.log(results, "executeSeriesReduce")
```

**Promises in parallel will be similar to promise.all polyfill**
