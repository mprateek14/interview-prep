# React Theory

React Fiber is a complete rewrite of React’s core reconciliation algorithm, introduced to replace the older Stack Reconciler. The fundamental difference lies in how they manage rendering work: the Stack algorithm is synchronous and blocking, while Fiber is asynchronous and interruptible. 

## Key Differences

### Execution Model

* **Stack:** Uses a recursive approach that relies on the built-in JavaScript call stack. Once rendering starts, it cannot be interrupted until the entire component tree is processed, which can block the main thread and cause "janky" UIs.
* **Fiber:** Implements a "virtual stack" using a linked-list tree traversal. This allows React to break work into small units (fibers) that can be paused, resumed, or aborted.

### Task Prioritization

* **Stack:** Processes all updates in the order they arrive with no concept of priority.
* **Fiber:** Assigns priority levels to different types of updates. For example, user interactions (clicks, typing) are given high priority to ensure immediate feedback, while background data fetching is lower priority.

### Rendering Phases

* **Stack:** Performs reconciliation and DOM updates in a single, synchronous pass.
* **Fiber:** Splits the process into two phases:
  * **Render Phase:** Asynchronous and interruptible. It builds a "work-in-progress" tree to determine what changes are needed.
  * **Commit Phase:** Synchronous and non-interruptible. It applies the calculated changes to the DOM in one go to ensure UI consistency.

### Scheduling and Concurrency

* **Stack:** Lacks a scheduler; it simply executes whatever is next on the stack.
* **Fiber:** Enables Concurrent Rendering, allowing React to work on multiple tasks simultaneously by switching between them during idle periods (Time Slicing).
