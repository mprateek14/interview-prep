# React Theory

## React Fiber

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

---

## Hydration

* Hydration is the process of attaching interactivity to a "dry" HTML document.

* When a server sends pre-rendered HTML to the browser, the browser parses it and paints the screen instantly. However, this HTML is dead. It has no JavaScript event listeners (onClick, onChange) attached to it. It looks like a button, but if the user clicks it, absolutely nothing happens.

* Hydration is the phase where React (or Vue/Svelte) downloads, boots up in the browser, looks at that dead HTML, and "waters" it by attaching the event listeners and linking the real DOM to its internal Virtual DOM.

* Hydration is not applicable to standard Client-Side Rendering. It only exists when the initial HTML contains structural content.

* Client-Side Rendering (CSR): NO HYDRATION. In standard React, the server sends an empty `<div id="root"></div>`. There is no DOM to hydrate. React downloads, evaluates, and injects the UI from scratch. This is called Mounting or Rendering.

* Server-Side Rendering (SSR): YES. Next.js or Node.js renders the React tree into an HTML string on the server on every request. The client receives the HTML, paints it, and then hydrates it.

* Static Site Generation (SSG): YES. Next.js or Gatsby runs the React code at build time (in your CI/CD pipeline) and spits out physical .html files. The CDN serves these static files. When the browser opens them, it paints the static file, and then React hydrates it.

---

## Webpack

* Webpack is a static module bundler. It takes your source files — JS, CSS, images, fonts — which are full of import/require statements, and produces a optimized output bundle the browser can actually load.
* When webpack starts, it begins at the entry point and recursively follows every import/require it finds — building a complete map of every module and its dependencies.
* Core configs -
  * entry -> where to start building graph. can be multiple as well.
  * output -> where to put result. eg. dist or build folder.
  * module -> to put loaders inside to handle non-js files
  * plugins -> put more pipeline hooks inside
  * mode -> dev/prod for optimisations

* Webpack natively only understands JavaScript and JSON. Loaders teach it how to handle everything else — CSS, images, TypeScript, JSX. Loaders are transformations applied to a file's source code before it enters the dependency graph. Each step can have multiple laoders and they run left to right. Common ones are babel-loader, css-loader, ts-loader.
* Custom loaders can also be written. It is basically a function that will recieve the file content and return the transformed content.
* Loaders transform individual files. Plugins hook into the entire build lifecycle — they can access the full compilation, modify output, generate files, optimise bundles.
* Loader works as soon as relvent import is encountered. Plugins can work at any step in the pipeline as per need.
* Code Splitting and Tree Shaking -> Read from Optimisations.md.
* In production, your code is minified and bundled — completely unreadable. Source maps are files that map the compiled output back to your original source so errors in production point to the right file and line number. Source maps are a separate .map file — browsers only download them when DevTools is open. Regular users never load them.

---

## Babel

* Babel is a JavaScript transpiler — it takes modern JavaScript (ES2020+, JSX, TypeScript) and converts it into older JavaScript that older browsers can understand. Source code → [Parse] → AST → [Transform] → AST → [Generate] → Output code
* Parse — Babel reads your source code and converts it into an AST (Abstract Syntax Tree) — a tree representation of your code's structure. Code stops being a string and becomes a data structure Babel can manipulate.
* Transform — Plugins and presets walk the AST and modify it. Arrow functions become regular functions, JSX becomes React.createElement() calls, optional chaining gets polyfilled.
* Generate — Modified AST is converted back into a code string. That's your output.

* Plugin — handles one specific transformation.
* @babel/plugin-transform-arrow-functions  → converts arrow functions only
* @babel/plugin-transform-classes          → converts ES6 classes only
* Preset — a curated collection of plugins. These will be used almost always.

---

## Flow

* Write jsx + js.
* Webpack starts from entry point and builds dependency graph.
* For each js file, babel-loader runs. For css, css loaders will run.
* SplitChunkPlugin will create chunks.
* Tree shaking will happen and then output will be put in dist.
* These are major steps. Other intermediate steps in b/w.
