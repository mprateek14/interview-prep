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

### With leading and trailing options

* **`leading: true`**: The function invokes immediately on the very first trigger of an event sequence. It guarantees instant feedback.
* **`trailing: true`**: The function invokes at the end of the wait period, but only if the event was triggered again during the cooldown. It guarantees that the most recent arguments (the final state) are eventually processed.
  
* **`{ leading: true, trailing: false }`**: Fires at the start. Drops the final state.
* **`{ leading: false, trailing: true }`**: Suppresses the initial execution. Waits for the delay, then fires with the latest arguments.
* **`{ leading: true, trailing: true }`**: The standard default for most libraries. It fires immediately, throttles the intermediate spam, and guarantees one final execution at the end of the cycle with the freshest data.