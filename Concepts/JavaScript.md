## The Event Loop

The Event Loop is a continuous, infinitely running process. It has exactly one job: Look at the Call Stack, and look at the Queues.
If the Call Stack is NOT empty, the Event Loop does nothing. It waits.
If the Call Stack IS empty, it looks at the Microtask Queue first. If there are tasks there, it pushes them onto the Call Stack one by one until the Microtask Queue is completely empty.
Only when the Call Stack AND the Microtask Queue are both completely empty, it takes the first task from the Macrotask Queue and pushes it onto the Call Stack.
* **The Microtask Queue:** Reserved exclusively for Promises (.then(), .catch(), .finally()), fetch, async/await and MutationObserver.
* **The Macrotask Queue (Task Queue):** Reserved for setTimeout, setInterval, DOM events.

Async await runs on promises internally.
Await does not pause our main thread. As soon as await is encountered, js takes everything after that, wraps it into a callback function
and treats it as .then(). So internally a callback gets registered just like promises and goes into microtask queue only.

## Architecture

* Whole JS runs inside Global Execution context. 
* Each function has its own execution context which gets created and put into call stack when it is invoked and gets deleted when function execution is complete.
* EC has 2 phases - Memory and Code Execution.
* In memory phase, whole file is read and all variables are stored in form of key value pairs.
* If the variable is var, undefined is assigned to it. If a normal function, then whole function definition is assgined to it as value.
* If it is arrow function or function expression(var a = function(){}), value assigned will depend on whether it is let const or var.
* Now as the code executes in the second phase, these undefined values will be updated to proper values as the code reaches that line.
* Due to this whole memory phase, we are able to access the variables in the file even at the top before they have been initialized. This is called HOISTING.
* Eg - If var x = 1 is at line 6, and console.log(x) is at line 1 - it will give us undefined. If x was a function, it would print the whole function. Basically everything from the memory phase will come until that line is reached in code phase.
* Everything with var gets attached to the global object (window in browsers).
* Hoisting can lead to unknown bugs in the code since we are able to access varaibles before initializing.
* Let and const solve this problem. They are also hoisted with undefined but they get hoisted in a different memory space which is reserved for their block(hence they are block scoped) instead of the global object.
* So if we try to use them before declaration - we will get Reference error - cant access x without initialization.
* The time between this hositing in different memory and when it finally gets a value assigned, let and const are in TEMPORAL DEAD ZONE.
* If we try to access let and const while they are in TDZ, we will always gets the above reference error.

---

setTimeout can take more than its given delay. This can happen if our main thread(Global Execution context) gets blocked by something.
suppose GEC takes 10 seconds to run. So our setTimeout with delay of 5000ms will run only after 10sec when event loop looks at Macro queue.

---

* Lexical Env of a function is its local memory + lexical env of its parent.
* var can be redeclared. we can do - var a = 10 and then var a = 20. No error will be there.
* let can't be reinitialized. const cant be reinitialized or reassigned.
* var a = function xyz(){} -> This is named function expression and is valid statement in js. We will still call it by a(). xyz() will give error.
* Ability to pass functions as argument and return function from functions is called First Class Functions.
* In promise chaining, either use the short arrow function syntax or use return in the promise. Else .then() won;t receive data from previous .then()

Callbacks don't magically make JS async. Normal callbacks are sync in nature. Callbacks become async only when we are using them with
things are webAPIs or other external tools. The time consuming work is offloaded to these apis and then they trigger the callback after the work is done.
Eg - in setTimeout, we pass callback. Timer starts and timer logic gets started in some other thread. That thread handles the timer logic and triggers our
callback through the reference pointer we passed.

## undefined vs not defined

* **undefined** acts as placeholder for something which has been allocated memory until a value gets assigned to them.
* **not defined** is for something which has not been allocated memory as well. Eg - console.log(x) without initializing x will give Reference Error - x not defined.
