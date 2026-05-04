let arr = [1, 2, 3, 4, 5];
const topics = [
  "Event Loop",
  "Polyfills",
  "Scope Chain",
  "Prototypes",
  "This Keyword",
  "Call Apply Bind",
  "Map Filter Reduce",
  "Debouncing",
  "Throttling",
  "Currying",
  "Closures",
  "Higher Order Functions",
  "Callback Functions",
  "Promises",
  "Promise Polyfills",
  "Async Await",
  "Flatten Objects",
];

const reactTopics = [
  "HOC Pattern",
  "Render Props Pattern",
  "React Compound Pattern",
];

const topicsDone = [
  { topic: "Call Apply Bind", status: "Yes" },
  { topic: "Closures", status: "No" },
  { topic: "This Keyword", status: "Yes" },
];

const newReactFeatures = [
  "useTransition()",
  "useOptimistic()",
  "Context will directly send value without Context.Provider",
  "use() Hook",
];

//MAP POLYFILL
Array.prototype.newMap = function (callback) {
  var output = [];

  for (var i = 0; i < this.length; i++) {
    output.push(callback(this[i], i, this));
  }

  return output;
};

//FOREACH POLYFILL
Array.prototype.newForEach = function (callback) {
  for (let i = 0; i < this.length; i++) {
    callback(this[i], i, this);
  }
};

// FILTER POLYFILL
Array.prototype.newFilter = function (callback) {
  let output = [];

  for (let i = 0; i < this.length; i++) {
    if (callback(this[i], i, this)) {
      output.push(this[i]);
    }
  }

  return output;
};

//REDUCE POLYFILL
Array.prototype.newReduce = function (callback, initialVal) {
  // arguments keyword is directly available in non-arrow functions
  let accumulator;
  let startIdx = 0;
  if (arguments.length >= 2) {
    accumulator = initialVal;
  } else {
    if (this.length === 0) {
      throw new Error("0 length to process");
    } else {
      accumulator = this[0];
      startIdx = 1;
    }
  }

  for (let i = startIdx; i < this.length; i++) {
    accumulator = callback(accumulator, this[i], i, this);
  }

  return accumulator;
};

const multiply = arr.newMap((item, i) => item * 2);
console.log(multiply, "New Map");

arr.newForEach((item, i) => console.log(item * 3), "New ForEach");

const filters = arr.newFilter((item, i) => item % 2);
console.log(filters, "New Filter");

const doneTopics = topicsDone.newReduce((accumulator, topic) => {
  if (!accumulator[topic.status]) {
    accumulator[topic.status] = [];
  }
  accumulator[topic.status].push(topic.topic);
  return accumulator;
}, {});
console.log(doneTopics, "New Reduce");

// let tryReduce = [1,2,3,4].newReduce(() => {}, 0)

//Debouncing

let counter = 0;

//This is our function to fetch some data which needs to be called as the input changes.
// However we don't want to call it all the time. Call it after a certain delay in when the user has stopped typing
const getData = () => {
  console.log("Getting Data...", counter++);
};

// Debounce function - takes in a callback function and the delay we want to give to the callback. Works due to concept of closures.
// The timer value gets persisted and keeps getting cleared except for the last time where the callback function finally invokes.
const debounce = (callback, delay) => {
  let timer;

  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      callback(...args);
    }, delay);
  };
};

const betterFunction = debounce(getData, 500);
// window.addEventListener("resize", betterFunction);

//Throttling
//The concept is similar, except that we don't care about any event for reseting the delay. We take a value and delay the further process with that value.
// Ex - Call an api, and wait for 500ms before calling it again no matter what happens during the wait time.
let counter1 = 0;
const getMoreData = (data) => {
  console.log("Getting Throttle Data...", data, counter1++);
};

const throttle = (callback, delay) => {
  let flag = true;

  return function (...args) {
    if (flag) {
      callback(...args);
      flag = false;
      setTimeout(() => {
        flag = true;
      }, delay);
    }
  };
};

const throttledFunc = throttle(getMoreData, 2000);

//We use debouncing when we worry about the final outcome. For instance, waiting until a user finishes typing to retrieve typeahead search results.
//When we wish to manage all steps in the process at a controlled rate, a throttle is a perfect tool to utilize. eg. resizing, scrolling

//Functions for event bubbling and capturing

const logger1 = () => {
  console.log("Click1");
};

const logger2 = () => {
  console.log("Click 2");
};

const logger3 = () => {
  console.log("Click 3");
};

document.getElementById("btn").addEventListener("click", logger1, true); // true means part of capture cycle
document.getElementById("smaller").addEventListener("click", logger2, true); // same as above
document.getElementById("container").addEventListener("click", logger3, false); // false means part of bubbling cycle

//First the capturing cycle takes place and then it is followed by the bubbling cycle.
//SO we will get click 2 then cick 1 then click 3 if we click on child

//By default, the events are propgated up the heirarchy. ie from child to parent. This is event bubbling
//The last flag in event listener is for useCapture. If we set it true(false by default), then event capturing is done instead of bubbling. ie. down the heirarchy

//Now, mixing up of these values can be done to achieve different results.
//The propogation of these events can also be stopped using e.stopPropogation() method. Try and see how it works in both bubbling and capturing cases.

// FLATTEN A DEEPLY NESTED OBJECT
let obj = {
  a: 1,
  b: {
    c: 2,
    d: 3,
    e: {
      f: 4,
    },
  },
  g: 5,
  h: {
    i: {
      j: {
        k: [6, 7],
      },
    },
  },
};

const flattenObj = (obj, parent) => {
  let finalObj = {};
  function flatten(obj, parent) {
    for (let key in obj) {
      let newParent = parent + key;
      let value = obj[key];
      if (typeof value === "object") {
        flatten(value, newParent + "_");
      } else finalObj[newParent] = value;
    }
  }
  flatten(obj, parent);
  return finalObj;
};

console.log(flattenObj(obj, ""), "FLATTTTTT");

//CURRYING
//It is the process of transforming a function that takes multiple arguments into a sequence of nested functions, each taking exactly one argument.

// Code to solve sum(1)(2)(3)...(n)
// The trick here is we are using empty() as our recursion stopper

const sum1 = (a) => {
  return function (b) {
    if (b === undefined) return a;
    else return sum1(a + b);
  };
};

console.log(sum1(1)(2)(3)(), "Basic Currying");

const sum = (...args) => {
  const currentTotal = args.reduce(
    (accumulator, item) => accumulator + item,
    0,
  );

  return function (...newArgs) {
    if (newArgs.length === 0) return currentTotal;

    return sum(currentTotal, ...newArgs);
  };
};

console.log(sum(1, 2, 3, 4)(), "TYPE1");
console.log(sum(1)(2)(3)(4)(), "TYPE2");

// The use of currying is Partial Application—the ability to generate highly specialized, reusable utility functions from a generic base function.
// Redux uses currying extensively.

// Generic curried logger
const log = (level) => (system) => (message) => {
  console.log(`[${level}] ${system}: ${message}`);
};

// The ES5 Equivalent for understanding
// const log = function(level) {
//     return function(system) {
//         return function(message) {
//             console.log(`[${level}] ${system}: ${message}`);
//         };
//     };
// };

// 1. Pre-load the 'level' argument to create specialized loggers
const logError = log("ERROR");
const logInfo = log("INFO");

// 2. Pre-load the 'system' argument to create highly localized loggers
const authErrorLogger = logError("AUTH_MODULE");
const dbInfoLogger = logInfo("DATABASE");

// 3. Use them deep in your application logic, providing only the final argument
authErrorLogger("Invalid password attempt."); // "[ERROR] AUTH_MODULE: Invalid password attempt."
dbInfoLogger("Connection established."); // "[INFO] DATABASE: Connection established."

// PROMISES

const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    let number = Math.random();
    if (number > 0.5) {
      resolve(number);
    } else {
      reject("Not greater bro", number);
    }
  });
});

promise
  .then((number) => console.log(number, "inside then resolve"))
  .catch((err) => console.log(err, "inside catch reject"));

// PROMISE POLYFILLS

const p1 = new Promise((res) => setTimeout(() => res("First (Fast)"), 500));
const p2 = new Promise((res) => setTimeout(() => res("Second (Slow)"), 2000));
const p = new Promise((res, rej) => rej("Failed Promise p"));
const p3 = 42; // A non-promise primitive value
const p4 = new Promise((res, rej) => rej("Failed Promise p4"));

// All succeed or it fails
Promise.newAll = function (promiseArray) {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(promiseArray)) {
      throw new Error("Need an array input");
    }

    const results = [];
    let count = 0;

    if (promiseArray.length == 0) return resolve(results);

    promiseArray.forEach((promise, idx) => {
      Promise.resolve(promise)
        .then((value) => {
          results[idx] = value;
          count++;
          if (count === promiseArray.length) {
            resolve(results);
          }
        })
        .catch((err) => reject(err));
    });
  });
};

Promise.newAll([p1, p2, p3])
  .then((data) => console.log(data, "Success"))
  .catch((err) => console.log(err));

// Wait for all to finish. return all regardless of resolve or reject
Promise.newAllSettled = function (promiseArray) {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(promiseArray)) {
      throw new Error("Need an array input");
    }

    let results = [];
    let count = 0;

    if (promiseArray.length === 0) {
      return resolve(results);
    }

    promiseArray.forEach((promise, idx) => {
      Promise.resolve(promise)
        .then((value) => {
          results[idx] = value;
          count++;
          if (count === promiseArray.length) {
            resolve(results); // Only resolve when the final task is done
          }
        })
        .catch((err) => {
          results[idx] = err;
          count++;
          if (count === promiseArray.length) {
            resolve(results); // Only resolve when the final task is done
          }
        });
    });
  });
};

Promise.newAllSettled([p1, p2, p3, p4])
  .then((data) => console.log(data, "Success"))
  .catch((err) => console.log(err));

// return the moment first promise settles regardless of resolve or reject
Promise.newRace = function (promiseArray) {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(promiseArray)) {
      throw new Error("Need an array input");
    }

    promiseArray.forEach((promise) => {
      Promise.resolve(promise)
        .then((value) => resolve(value))
        .catch((err) => reject(err));
    });
  });
};

//return the moment first promise gets resolved (resolved not settled)
// requires to throw an aggregate error if all are rejected
Promise.newAny = function (promiseArray) {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(promiseArray)) {
      throw new Error("Need an array input");
    }

    let count = 0;
    let errors = [];

    if (promiseArray.length === 0) {
      // Must reject immediately if there are no promises to race
      return reject(new AggregateError([], "All promises were rejected"));
    }

    promiseArray.forEach((promise, idx) => {
      Promise.resolve(promise)
        .then((value) => resolve(value))
        .catch((err) => {
          count++;
          errors[idx] = err;
          if (count === promiseArray.length)
            reject(new AggregateError(errors, "All promises were rejected"));
        });
    });
  });
};

const p5 = new Promise((res, rej) => setTimeout(() => res("p5 done"), 5000));
const p6 = new Promise((res, rej) => setTimeout(() => res("p6 done"), 10000));

const handlePromises = async () => {
  console.log("Iniside promise handler");
  const val1 = await p5;
  console.log(val1);

  const val2 = await p6;
  console.log(val2);
};

handlePromises();

// REACT CLASS LIFECYCLE

// Mount Phase -> constructor() -> getDerivedStateFromProps() -> render() -> componentDidMount()
// Update Phase -> shouldComponentUpdate(), componentDidUpdate()
// Unmount Phase -> componentWillUnmount()

// REACT HOOK LIFECYCLE

// Render Phase -> State changes -> Reconcilliation b/w DOM and Virtual DOM
// Commit Phase -> Changes applied on DOM -> useLayoutEffect() -> useEffect() -> Cleanup in useEffect() return

// TYPESCRIPT

// Type vs Interface
// Type can be used on primitives. It can also use unions.
// Interface are for objects only, dont support primitives. Dont support unions. But they support declrative merging

// Any vs Unknown
// any type is given when data is dynamic. Either we dont know the type or its too complex to define the shape of data.
// any will allow to use all methods on it and assign anything to. Its basically a way to bypass typescript.

// unknown will allow to assign any type of value and perform equality checks. But it won't allow to use the variable unless we perform type checks.
// let value: unknown = "test";
// if (typeof value === "string") {
// console.log(value.toUpperCase()); // OK, type is narrowed to 'string'
// }
// will throw error if we try to use toUppercase without type check.

// JAVASCRIPT STUFF

// The Event Loop

// The Event Loop is a continuous, infinitely running process. It has exactly one job: Look at the Call Stack, and look at the Queues.
// If the Call Stack is NOT empty, the Event Loop does nothing. It waits.
// If the Call Stack IS empty, it looks at the Microtask Queue first. If there are tasks there, it pushes them onto the Call Stack one by one until the Microtask Queue is completely empty.
// Only when the Call Stack AND the Microtask Queue are both completely empty, it takes the first task from the Macrotask Queue and pushes it onto the Call Stack.
// The Microtask Queue: Reserved exclusively for Promises (.then(), .catch(), .finally()), fetch, async/await and MutationObserver.
// The Macrotask Queue (Task Queue): Reserved for setTimeout, setInterval, DOM events.

// Async await runs on promises internally.
// Await does not pause our main thread. As soon as await is encountered, js takes everything after that, wraps it into a callback function
// and treats it as .then(). So internally a callback gets registered just like promises and goes into microtask queue only.

// Architecture

{
  /*
Whole JS runs inside Global Execution context. Each function has its own execution context 
which gets created and put into call stack when it is invoked and gets deleted when function execution is complete.
EC has 2 phases - Memory and Code Execution.
In memory phase, whole file is read and all variables are stored in form of key value pairs.
If the variable is var, undefined is assigned to it. If a normal function, then whole function definition is assgined to it as value.
If it is arrow function or function expression(var a = function(){}), value assigned will depend on whether it is let const or var.
Now as the code executes in the second phase, these undefined values will be updated to proper values as the code reaches that line.
Due to this whole memory phase, we are able to access the variables in the file even at the top before they have been initialized.
This is called HOISTING.
Eg - If var x = 1 is at line 6, and console.log(x) is at line 1 - it will give us undefined. If x was a function,
it would print the whole function. Basically everything from the memory phase will come until that line is reached in code phase.
Everything with var gets attached to the global object (window in browsers).
Hoisting can lead to unknown bugs in the code since we are able to access varaibles before initializing.
Let and const solve this problem. They are also hoisted with undefined but they get hoisted in a different memory space
which is reserved for their block(hence they are block scoped) instead of the global object.
So if we try to use them before declaration - we will get Reference error - cant access x without initialization.
The time between this hositing in different memory and when it finally gets a value assigned, let and const are in TEMPORAL DEAD ZONE.
If we try to access let and const while they are in TDZ, we will always gets the above reference error.
*/
}

// setTimeout can take more than its given delay. This can happen if our main thread(Global Execution context) gets blocked by something.
// suppose GEC takes 10 seconds to run. So our setTimeout with delay of 5000ms will run only after 10sec when event loop looks at Macro queue.

// Lexical Env of a function is its local memory + lexical env of its parent.
// var can be redeclared. we can do - var a = 10 and then var a = 20. No error will be there.
// let can't be reinitialized. const cant be reinitialized or reassigned.
// var a = function xyz(){} -> This is named function expression and is valid statement in js. We will still call it by a(). xyz() will give error.
// Ability to pass functions as argument and return function from functions is called First Class Functions.
// In promise chaining, either use the short arrow function syntax or use return in the promise. Else .then() won;t receive data from previous .then()

// Callbacks don't magically make JS async. Normal callbacks are sync in nature. Callbacks become async only when we are using them with
// things are webAPIs or other external tools. The time consuming work is offloaded to these apis and then they trigger the callback after the work is done.
// Eg - in setTimeout, we pass callback. Timer starts and timer logic gets started in some other thread. That thread handles the timer logic and triggers our
// callback through the reference pointer we passed.

// undefined vs not defined

// undefined acts as placeholder for something which has been allocated memory until a value gets assigned to them.
// not defined is for something which has not been allocated memory as well. Eg - console.log(x) without initializing x will give Reference Error - x not defined.

// Closure is a function bound together with its lexical environment.

// Call, Apply and Bind are used for method/function sharing.

console.log("------------TRY STUFF OUT------------");

function abc() {
  console.log(a); // undefined
  if (true) {
    var a = 10;
  }
}
abc();

var d = 10;
console.log(d); //10
{
  var d = 100;
  console.log(d); // 100
}
console.log(d); // 100

{
  /*

let d = 10;
{
  var d = 10; -> not allowed
  let d = 100; -> allowed due to block scope
}

*/
}

// CLOSURE
function def() {
  let a = 130;
  let z = 200;
  return function c() {
    return a;
  };
}
let returned = def();
console.dir(returned, "check closure preservation");

// Trick Pattern 1
// We know this closure works and returns a. but where is 'a' stored that c is able to reference it anytime?

// When JS engine detects something like this where the value needs to be preserved, it changes its memory allocation and does not store it on temporary callstack.
// It creates a hidden "Context" object and places it directly on the heap. The pointer to this object is returned along with function c.
// Since z does not form a closure. It will get cleaned up by garbage collector.
// Check above log in browser to see the context object.

// Trick Pattern 2
// What happens when we do 2 == '2'? Is num 2 converted to string or string '2' converted to num?

// When executing 2 == '2', the JavaScript engine detects a type mismatch and invokes Implicit Type Coercion.
// Following strict ECMAScript specifications, it forces the String on the right to become a Number.
// It effectively executes 2 === Number('2'), resulting in true.
// Same will happen even if we reverse and do '2' == 2. String will be converted to Number. Numbers are the baseline for comparisons in JS.

// if we do, 2 == 'javascript' -> right will get coerced to NaN using toNumber() and return false.
// Nan == NaN returns false
// true == 'true' is false. Left side gets evaluated to 1 using toNumber() coercion and then compared with right which becomes NaN.
// null == 0 and undefined == 0 are false. For null and undefined, JS does not use toNumber() coercion.
// For coercing array, JS uses toString() and then compares. [1,2] == "" will become -> "1,2" == "".
// Coercing process stops as soon as types on both sides is same. If we do [1] == 1, first it will be "1" == 1, then again it will coerce to Number and return true.

// Trick Pattern 3

for (var i = 0; i < 5; i++) {
  setTimeout(() => {
    console.log(i, "setTimeout Closure with var"); // will log 5 everytime. Not 4. i++ happens from 4. then loop gets evaluated to false. but i++ still happens.
  }, 1000);
}

// When var i is used, it gets hoisted and there is only 1 reference to it that is used by console log afer the timer.
// By the time it starts logging, i is alerady 5.

for (let i = 0; i < 5; i++) {
  setTimeout(() => {
    console.log(i, "setTimeout Closure with let"); // 1, 2, ,3, 4
  }, 1000);
}

// When let is used inside for loop, it creates a new lexical env for each iteration. So different value of i is supplied to log.
// If we use const, it will log once and then crash due to reassignment error.

// To achieve behaviour of let using var, we can use closures. Basically we deliberately supply a different i everytime.

for (var i = 0; i < 5; i++) {
  function closure(num) {
    setTimeout(() => {
      console.log(num, "setTimeout Closure - let behaviour with var");
    }, 1000);
  }
  closure(i);
}

// Trick Pattern 4

function counterNew() {
  let count = 0;
  return function increase() {
    count++;
    console.log(count, "count closure");
  };
}

let counter0 = counterNew();
counter0();
counter0();

let counter01 = counterNew();
counter01();

// Both counters are independent. Each creates a new instance.

// Trick Pattern 5 -> THIS keyword

console.log(this, "In global context, this points to window/global object");

function aaa() {
  "use strict";
  console.log(
    this,
    "points to window object if strict mode is disabled. In strict mode it is undefined",
  );
}

aaa(); // undefined in strict mode -> because function has been called without any reference
window.aaa(); // will point to window object even in strict mode. Here this will refer to window object since it has been called with it.

// Value of This keyword will change depending upon how the function is called.

const obj1 = {
  hero: "Batman",
  printHero: function () {
    console.log(
      this,
      this.hero,
      "Inside an object method, this points to the object itself",
    );
  },
};
obj1.printHero();

const obj2 = {
  hero: "Ironman",
};

obj1.printHero.call(obj2); // calls printHero method on obj2.

// Arrow functions don't have their own this. Value of this is retained from enclosing lexical context and checked by going up the scope chain.

const arrowMan = () => {
  console.log(this, "this inside arrow function"); // will be window object. Lexical context is basically where the parent exists. arrowMan exists in window obj.
};
arrowMan();

const obj3 = {
  printThis: () => {
    console.log(this, "this inside arrow function method of an object");
    // will be window object again as obj3 is present in window. wont point to obj3 because object literals dont create a scope. they are just a data structure
  },
};
obj3.printThis();

const obj4 = {
  hero: "Thor",
  printThisToo: function () {
    const arrow = () => {
      console.log(
        this,
        "this keyword inside arrow function nested inside a normal object method",
      );
      // points to obj4 now because parent is printThisToo and it exists inside obj4. So lexical context is obj4.
    };
    arrow();
  },
};
obj4.printThisToo();

// the depth of the object is irrelevant with arrow function
const deeplyNested = {
  a: {
    b: {
      c: () => console.log(this)
    }
  }
};
deeplyNested.a.b.c(); // Output: window object

// TRICK PATTERN 6

function hoister() {
  console.log(a); // will output function definition a

  function a() {}

  var a = 2;

  console.log(a); // will output 2

  // var are allowed to be redeclared so no error.
  // hoisting will happen inside the function. when 2 var have same name, function takes precedence.
  // so, function a will get hoisted and printed in first log. when exectuiton reaches down, 2 gets assigned to a and 2 will be logged.
}

// POLYFILLS FOR CALL, APPLY, BIND

// these methods invokes a function on the passed object. Lets take an example of naively how it might be possible to do -

const trialObj = {
  name: "JS",
  showData: function (method) {
    console.log(this.name, method, "showData method inside object");
  },
};

function show() {
  console.log(this.name, "Naive way to understand call apply");
}

trialObj.show = show;
trialObj.show();

// Basically we put the method inside the object and then call it. We have to do something similar with our polyfill.
// THhe only issue is that "show" key might already exist inside the object and here we are overriding it. So we have to handle that.

const trialObj2 = {
  name: "Java",
};

// trialObj.showData.call(trialObj2, "call") // we have to do this

Function.prototype.newCall = function (context, ...args) {
  // notice we are using rest on args here to take comma seperated valuess
  //context is basically on what we are calling the method. If it is null, we take the global object

  //context = context ? Object(context) : globalThis; // dont do this. if user passes 0 or false, this will fail to convert it to object and point to globalThis

  if (context === null || context === undefined) {
    context = globalThis;
  } else {
    context = Object(context);
  }

  let id = Symbol(); // Symbol always return unique value in memory
  context[id] = this; // this represents the function/method which we are trying to call
  const result = context[id](...args);

  delete context[id];

  return result;

  // we can't directly do this(...args) because then this will be pointing to global object when called freely inside a function.
};

trialObj.showData.newCall(trialObj2, "new call method");

Function.prototype.newApply = function (context, args) {
  // args will be array here
  if (args !== undefined && args !== null && typeof args !== "object") {
    throw new TypeError("CreateListFromArrayLike called on non-object");
  }

  if (context === null || context === undefined) {
    context = globalThis;
  } else {
    context = Object(context);
  }

  const id = Symbol();
  context[id] = this;

  const argArray = args ? Array.from(args) : [];

  const result = context[id](...argArray);

  delete context[id];

  return result;
};

trialObj.showData.newApply(trialObj2, ["new apply method"]);

Function.prototype.newBind = function (objectContext, ...bindArgs) {
  if (typeof this !== "function") {
    throw new Error("Bind can be used on functions");
  }
  // this keyword here will be the function on which newBind will be called.
  const originalFunc = this;

  const boundFunc = function (...callArgs) {
    const inConstructor = this instanceof boundFunc;

    return originalFunc.apply(inConstructor ? this : objectContext, [
      ...bindArgs,
      ...callArgs,
    ]);

    // What is this here? Because this is a completely separate function call occurring at a different time, the rules of this reset.

    // If the user calls newObjLogger(), this defaults to the global window object (or undefined in strict mode).

    // If the user calls new newObjLogger(), the new keyword forces this to be a brand new, empty object {}.
  };

  return boundFunc;
};

let newObj = {
  name: "Clark",
};

function basicLogger(lastName, age) {
  this.lastName = lastName;
  this.age = age;
  console.log(this.name + "---" + lastName + "---" + age);
}

let newObjLogger = basicLogger.bind(newObj, "Kent"); //"Kent" becomes bindArg here
newObjLogger(28); // 28 is callArg here

// let newObj2 = {name: "Bruce", lastName:"Wayne"}
// let bindBreaker = new newObjLogger(35)
// bindBreaker()

const numbersaa = Array.from({ length: 5 }, (v, i) => i);
// Output: [0, 1, 2, 3, 4]

// Key Stages of the Critical Rendering Path:
// DOM (Document Object Model): The browser parses HTML to create the tree structure of the page.
// CSSOM (CSS Object Model): The browser parses CSS to create a tree defining how elements are styled.
// Render Tree: The DOM and CSSOM are combined to create a tree of visible elements.
// Layout (Reflow): The browser calculates the exact size and position of each element on the screen.
// Paint: The browser fills in pixels for each element (colors, borders, images).

// How to Optimize the Critical Rendering Path:
// Minimize Critical Resources: Reduce the number of CSS and JS files that block rendering.
// Defer Non-Essential JS: Use async or defer attributes to load JavaScript without blocking the parser.
// Optimize CSS: Inline critical CSS, minify CSS, and use media queries to reduce render-blocking styles.
// Reduce Critical Bytes: Compress files to decrease download time.

// async: The script is executed as soon as it is downloaded, which might interrupt HTML parsing and doesn't guarantee the order of execution.
// defer: The script is executed only after the HTML document has been fully parsed, in the order it appears in the document.

// WEIRD SHIT ABOUT NaN - Read Later
// const invalidMath = 0 / 0;
// const badParsing = Number("Batman");

// console.log(invalidMath === badParsing); // false
// console.log(NaN === NaN); // false

// // 2. The ES5 Flaw: Global isNaN()
// // DANGER: The global isNaN forces the value through implicit coercion (ToNumber) FIRST.
// // "Gotham" becomes NaN, so isNaN returns true. It gives false positives for Strings!
// console.log(isNaN("Gotham")); // true (Buggy/Misleading)
// console.log(isNaN(NaN));      // true

// // 3. The ES6 Solution: Number.isNaN()
// // This method does NOT coerce. It strictly checks if the value is currently
// // the actual Number type, AND if it is the specific NaN value.
// console.log(Number.isNaN("Gotham")); // false (Correct, it's a String, not NaN)
// console.log(Number.isNaN(NaN));      // true (Safe for production)

// // 4. The SameValue Algorithm
// // Object.is() bypasses standard equality and checks if two values are identical in memory representation.
// console.log(Object.is(NaN, NaN)); // true

// NODE.js Stuff

// For performance issues

// CPU-Bound: If the CPU is at 100%, but memory and network are fine, your JavaScript code is executing heavy synchronous loops
//  (e.g., JSON parsing massive payloads, crypto hashing) and blocking the Event Loop.

// I/O-Bound: If the CPU is low, but requests are timing out, your application is waiting on external resources.
// Your database queries are slow, or your connection pool is exhausted.

// Further look into clustering. Then we can see indexing and read replicas, sharding towards db side.
// Caches and CDN to save network queries.
// Mesasge queues for offloading async stuff
// Horizontal scaling

// What can cause blocking of incoming requests?

// Anything that can block main thread. So maybe some unhandled edge case which blocked it.
// Memory leaks - GC runs sync not async. So if memory gets filled over time, it will block the event loop to clean up things.
// DB connection pool exhaustion. All connections in pool are in use and further requests are stuck in queue
// Failed External api calls without timeouts can keep connections/sockets open which can firther cause memory issues.

// rest vs soap

// eventEmitter
// fs
// streams
// fsStreams
// child process and worker threads
// toLowerCase, toUpperCase in db query

// memory management

// crtical rendering path, lighthouse and currying
//  constructor in fuinctions

const newDebounce = (callback, delay, immediate) => {
  let timer;

  return function (...args) {
    const context = this;

    const callNow = immediate && !timer;

    clearTimeout(timer);

    setTimeout(() => {
      timer = null;

      if (!immediate) {
        callback.apply(context, args);
      }
    }, delay);

    if (callNow) {
      callback.apply(context, args);
    }
  };
};


let learnObj = {name: "laalalaa"}

function getName(name){
  console.log(name)
}

const bound1 = getName.bind(learnObj, "pppp")

bound1("jjjj")