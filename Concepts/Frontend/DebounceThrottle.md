## Throttle

### Naive Method - Without utilizing the context

```JavaScript
function throttle(callback, delay){
    let isThrottled = false;
    return function(...args){
        if(!isThrottled){
            callback(...args);
            isThrottled = true
            setTimeout(() => {isThrottled = false}, delay)
        }
    }
}

// The Breakage Scenario
const searchComponent = {
    query: 'system design',
    fetchResults: function() {
        // This expects 'this' to be searchComponent
        console.log(`Fetching results for: ${this.query}`); 
    }
};

const throttledFetch = throttle(searchComponent.fetchResults, 1000);
// only a reference to searchComponent.fetchResults is passed. so it will act like normal function which has been throttled

throttledFetch(); 
// Output: "Fetching results for: undefined"
// this.query is undefined because 'this' was lost.
```

### Optimal Method

```JavaScript
function throttle(callback, delay){
    let isThrottled = false;
    return function(...args){
        const context = this;

        if(!isThrottled){
            callback.call(context, ...args);
            isThrottled = true;
            setTimeout(() => {isThrottled = false}, delay)
        }
    }
}
// Now we are capturing the context so we can have the info of the object which is calling the thorottled method.
// eg - paymentComponent.throttledFetch() will store paymentComponent object inside the context
```

### Variant

```JavaScript
function throttle(callback, delay) {
  let lastCall = 0;

  return function (...args) {
    let now = Date.now();
    const context = this;

    if (now - lastCall >= delay) {
      lastCall = now;
      callback.call(context, ...args);
    }
  };
}
```

### With leading and trailing options

* **`leading: true`**: The function invokes immediately on the very first trigger of an event sequence. It guarantees instant feedback.
* **`trailing: true`**: The function invokes at the end of the wait period, but only if the event was triggered again during the cooldown. It guarantees that the most recent arguments (the final state) are eventually processed.
  
* **`{ leading: true, trailing: false }`**: Fires at the start. Drops the final state. This is the basic throttle we we wrote above.
* **`{ leading: false, trailing: true }`**: Suppresses the initial execution. Waits for the delay, then fires with the latest arguments.
* **`{ leading: true, trailing: true }`**: The standard default for most libraries. It fires immediately, throttles the intermediate spam, and guarantees one final execution at the end of the cycle with the freshest data.

```JavaScript
function throttle(
  callback,
  delay,
  options = { leading: true, trailing: true },
) {
  let timer = null;
  let prev = 0;

  let latestArgs;
  let latestContext;

  return function (...args) {
    latestArgs = args;
    latestContext = this;
    const now = Date.now();

    if (!options.leading && prev === 0) {
      prev = now;
    }

    let remaining = delay - (now - prev);

    if (remaining <= 0) {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      prev = now;
      callback.call(latestContext, ...latestArgs);
    } else if (options.trailing && !timer) {
      timer = setTimeout(() => {
        callback.call(latestContext, ...latestArgs);
        prev = options.leading ? Date.now() : 0;
        timer = null;
      }, remaining);
    }
  };
}
```

### Scenario A: The user wants Normal Throttle (`leading: true`)
If `leading` is true, the ternary operator executes the right side: `previous = Date.now()`.

* **Why?** We just fired at 1000ms. We update `previous` to 1000ms.
* If the user frantically clicks again at 1001ms, the code calculates the math: 1000ms delay - (1001ms current time - 1000ms previous time) = 999ms remaining.
* Because 999ms is greater than 0, the shield blocks the click. This is perfect. It enforces the speed limit.

### Scenario B: The user wants Trailing ONLY (`leading: false`)
If the user set `leading: false`, it means the function must never, ever fire instantly when clicked. It must always wait.
If we used `Date.now()` here, it would create a fatal bug. Let's trace it:

* Trailing execution fires at 1000ms. We set `previous = 1000`.
* The user goes to get a coffee. They come back 5 seconds later (Time is now 6000ms).
* The user clicks.
* The math calculates: 1000ms delay - (6000ms current - 1000ms previous) = -4000ms remaining.
* Because -4000 is less than 0, the code thinks the cooldown is over. It fires the function instantly.
* **BUG:** We just fired instantly, but the user explicitly configured `leading: false`! We broke the rule.

To prevent this, the ternary operator executes the left side: `previous = 0`.

* **Why?** By resetting it to 0, we wipe its memory.
* When the user comes back at 6000ms and clicks, the main throttle function sees `previous` is 0.
* It triggers a safety check at the very top of the throttle function (which I wrote in the earlier snippet): "If previous is 0 and leading is false, pretend previous is exactly right now." * This fakes the math, forces the shield to go up, and guarantees the click is delayed, perfectly respecting the `leading: false` configuration.

## Debounce

```JavaScript
function debounce(callback, delay){
    let timer;

    return function(...args){
        const context = this;

        clearTimeout(timer);

        setTimeout(() => {
            callback.apply(context, args);
        }, delay)
    }
}
```

### With immediate flag

```JavaScript
function debounce(callback, delay, immediate = false) {
  let timer;

  return function (...args) {
    const context = this;

    clearTimeout(timer);

    if (immediate && !timer) {
      callback.apply(context, args);
    }

    timer = setTimeout(() => {
      timer = null;
      if (!immediate) {
        callback.apply(context, args);
      }
    }, delay);
  };
}
```

* The immediate flag is front loaded debounce. Basically the first request will implement as soon as button is clicked. But after that no request will happen until user stops spamming the button for the timeout period.
* In standard debounce, the first request hits only after the timeout period itself if the user is spamming.
* When immediate is true, only the first callback will work. The setTimout's role is to set timer to null when the user stops spamming. The second callback will never run at all.
* When immediate is false, only the second callback can run. The first will always resolve to false.
* When we call timer = setTimeout(...), the browser gives an integer ID (e.g., 12) or Node.js gives a Timeout object. Both of these are truthy values.
* When we call clearTimeout(timer), JavaScript stops the clock. But it does not erase the value inside the timer variable. The variable timer still holds the integer 12.

### Scenario A: `immediate = false` (The Standard Debounce)

* **Click 1 (0ms):** `timer` is undefined. We skip the `if(immediate)` block. We hit `setTimeout`. `timer` becomes 42.
* **Click 2 (500ms):** User clicks again. `clearTimeout(42)` destroys the first stopwatch. We skip the `immediate` block. We hit `setTimeout` again. `timer` becomes 43.
* **Wait (1500ms):** Timer 43 finishes. The deferred block runs. `timer` becomes null. The `if(!immediate)` block evaluates to true. Your callback finally executes.

### Scenario B: `immediate = true` (The Front-Loaded Debounce)

* **Click 1 (0ms):** `timer` is undefined. (`true && !undefined`) is TRUE. Your callback executes instantly. We hit `setTimeout`. `timer` becomes 42.
* **Click 2 (500ms):** User clicks again. `clearTimeout(42)` destroys the first stopwatch. Here is the catch: `timer` is still exactly 42. (`true && !42`) is FALSE. Your callback does not execute again. We hit `setTimeout`. `timer` becomes 43.
* **Wait (1500ms):** Timer 43 finishes. The deferred block runs. `timer` becomes null. `if(!immediate)` evaluates to false. The callback does not run (because it already ran at 0ms).
* **Click 3 (5000ms):** Because `timer` is now null, the cycle starts fresh. (`true && !null`) is TRUE. It executes instantly again.
