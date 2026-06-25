# Function Piping and Composition

## Concept

**Piping** means taking the output of one function and feeding it as the input to the next function, processing from left to right through a chain of functions.
**Composition** is the exact same concept, but it processes in reverse—from right to left.

```javascript
pipe(f, g, h)(x) === h(g(f(x)))

// compose works reverse -> right to left
compose(f, g, h)(x) === f(g(h(x))) 

const double = (n) => n * 2;
const add = (n) => n + 2;

pipe(double, add)(5); // 12
compose(double, add)(5); // 14
```

### Core Implementations (`reduce`)

```javascript
// Basic pipe
const pipe = (...fns) => (input) => fns.reduce((acc, fn) => fn(acc), input);

// Pipe handling multiple initial arguments
const pipeArgs = (...fns) => (...args) => 
  fns.reduce((acc, fn, i) => (i === 0 ? fn(...acc) : fn(acc)), args);

// Basic compose
const compose = (...fns) => (input) => fns.reduceRight((acc, fn) => fn(acc), input);
```

---

## Implementations from Scratch (Without `reduce`)

### 1. Standard Pipe and Compose

```javascript
function pipe(...fns){
    return (...input) => {
        let acc = input;

        for(let i = 0; i < fns.length; i++){
            let fn = fns[i];
            // Multiple args can be passed initially. Pass them all on the first call, and pass acc on subsequent calls.
            acc = i === 0 ? fn(...acc) : fn(acc);
        }
        return acc;
    }
}

function compose(...fns){
    return (...input) => {
        let acc = input;

        for(let i = fns.length - 1; i >= 0; i--){
            let fn = fns[i];
            acc = i === fns.length - 1 ? fn(...acc) : fn(acc);
        }
        return acc;
    }
}
```

### 2. Asynchronous Pipe and Compose

```javascript
function pipeAsync(...fns){
    return async (...input) => {
        let acc = input;

        for(let i = 0; i < fns.length; i++){
            let fn = fns[i];
            acc = i === 0 ? await fn(...acc) : await fn(acc);
        }
        return acc;
    }
}

function composeAsync(...fns){
    return async (...input) => {
        let acc = input;

        for(let i = fns.length - 1; i >= 0; i--){
            let fn = fns[i];
            acc = i === fns.length - 1 ? await fn(...acc) : await fn(acc);
        }
        return acc;
    }
}
```

### 3. Async Pipe with Error Handling

In async functions, instead of a normal error, a promise rejection will occur and travel up the chain. We can intercept and enrich these errors.

```javascript
function pipeAsyncErrorHandling(...fns){
    return async (...input) => {
        let acc = input;
        
        for(let i = 0; i < fns.length; i++){
            let fn = fns[i];
            try {
                acc = i === 0 ? await fn(...acc) : await fn(acc);
            } catch(err) {
                console.log("Error at step " + i, fn.name, "Do more error enrichment here");
                throw err;
            }
        }
        return acc;
    }
}
```

---

## Pipeline Middleware, Logging And Short Circuit

When creating a pipeline, we often need to observe what is happening at each step. To do this, we introduce a middleware function. It takes the output of the previous step, logs it, and then returns it so the next step can use it.

```javascript
// Basic Logger Middleware
const logger = (input) => {
    console.log(input);
    return input;
}
```

This functions perfectly as a basic logger. However, if we need different log messages after each step, declaring separate functions for each log is a bad practice.

```javascript
// Bad Practice: Hardcoding separate loggers
const logAfterFetch = (input) => { console.log('after fetchUser:', input); return input; };
const logAfterNormalize = (input) => { console.log('after normalizeData:', input); return input; };

pipeAsync(fetchUser, logAfterFetch, normalizeData, logAfterNormalize, validateAge);


// Better Practice: Higher-Order Logger Function
const logger = (message) => (input) => {
  console.log(message, input);
  return input;
};

// Usage in pipeline:
// pipeAsync(fetchUser, logger('after fetchUser:'), normalizeData, logger('after normalize:'))
// Instead of just a message string, you can also pass a custom logging function at each level depending on the specific requirement.
```

Now, what if we need to short circuit our pipeline based on certain condition? We can use a HOF like above again.

```javascript
const stopIf = (predicateFn) => (input) => {
  if (predicateFn(input)) {
    // signal "stop" somehow
  }
  return input;
};

pipeWithShortCircuit(checkAge, stopIf(acc => acc.ageValid === false), checkEmail, checkAddress);
```

The problem is how do we signal the stop? We don't have access to break; here from our loop.

```javascript
const stopIf = (predicateFn) => (input) => {
  if (predicateFn(input)) {
    return { __stop: true, value: input };  // tagged/wrapped — looks different from normal data
  }
  return input;  // normal case: pass through unchanged, just like tap
};


for (let i = 0; i < fns.length; i++) {
  acc = fns[i](acc);
  if (acc && acc.__stop) {
    acc = acc.value;   // unwrap, discard the marker
    break;
  }
}
return acc;

```
