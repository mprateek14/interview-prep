## Async vs. Defer Scripts

Standard HTML parsing starts from the top and moves to the bottom. Whenever the parser encounters a standard `<script>` tag, it stops parsing the DOM, fetches the script (if external), executes it, and only then resumes DOM parsing.

If a script takes a long time to load and execute—such as on a slow network or a mobile device—the user will experience a blank, unresponsive page. To mitigate this, developers historically placed `<script>` tags at the bottom of the `<body>` tag. Modern HTML offers better attributes:

* **`async`**: Downloads the script in the background while the DOM continues parsing. It only pauses the DOM parser when the script is fully downloaded and ready to execute.
  * *Execution Order*: `async` scripts follow a "load-first" order. If a second script (5kb) downloads faster than the first script (10kb), the second script will execute first. 
  * *Use Case*: Use `async` for independent scripts where execution order does not matter (e.g., analytics). Do not use it if the script depends on another library (like jQuery) or requires the DOM to be fully built.

* **`defer`**: Downloads the script in the background while the DOM is parsing, but defers execution until the HTML parsing is completely finished.
  * *Execution Order*: `defer` guarantees that scripts execute in the exact order they appear in the document.
  * *Use Case*: Use `defer` if a script depends on another script, or if it relies on manipulating the fully constructed DOM.

---

## Tree Shaking

Tree shaking is the process of eliminating unused code (unused exports) from final JavaScript bundles to optimize application size.

The introduction of `import` and `export` modules in ES6 was a major breakthrough for tree shaking because it introduced **static module structures**.

Before ES6, CommonJS allowed for the dynamic importing of modules, meaning files could be imported conditionally at runtime:

```javascript
var module;

if (condition) {
    module = require("foo");
} else {
    module = require("bar");
}
```

### Side Effects

"Side effects" are actions in code that affect the application's state outside of their immediate scope (e.g., modifying a global variable, changing the DOM, or fetching data). These effects can prevent or hinder tree shaking because bundlers must be cautious not to accidentally remove crucial functionality, even if the code's exports aren't explicitly used.

**`"sideEffects": false`**:
In your `package.json` file, you can set `"sideEffects": false` to explicitly tell the bundler that your entire package (except for specified files) is free of side effects. This allows for more aggressive tree shaking, as the bundler can safely remove any module with no used exports.

## Code Splitting

Code-Splitting is a technique that splits the JavaScript and CSS bundle into different bundles (chunks) so that they can be loaded in parallel and on demand. Splitting the bundle into smaller files helps to separate the required and not-required things and lazy load the not-required things when they are required. Though it does not reduce the overall bundle size (it might perhaps increase it a bit), being split into parts helps to load and process them faster.

Often, there is one main bundle `main.123455.js` that loads initially; it holds all the core components that are required to load the website. Then there is `main.123455.js.map` that holds the mapping details for other components on when they need to be loaded.

The code-splitting takes place when the production build is being created, and the anatomy of the files looks like `[name].[hash].js` or `[name].[hash].css`.

* **name**: Unique name of the file, which can be pulled from the component file name or can be randomly generated.
* **hash**: A hash generated from the current timestamp to remove caching from the bundle, so that the browser knows new files are there and must be loaded.

## Adaptive Loading

Adaptive loading is the practice of loading resources or features based on the user's device capabilities and network conditions. For example:

* For users on a slower network, serve low-quality images, do not autoplay videos, etc.
* For users with limited processing capacity on their devices, do not provide large animations.
* Progressively add on features as and when the network condition improves. For devices, we can utilize progressive enhancements.

The following are strategies that can be implemented for adaptive loading:

* Serve low-quality media (video and images) for smaller or lower-end devices.
* Avoid heavy client-side computation on lower-end devices.
* Lazy load scripts based on user interaction.
* Provide data-saver options to the user based on device capability and serve AMP (Accelerated Mobile Pages).
* Predictively preload resources; for example, if you know where the user will navigate next, preload that page or script.
* Block third-party scripts on lower-end devices.
  
[Read More](https://medium.com/@roderickhsiao/sophisticated-adaptive-loading-strategies-7118341fcf91)

## List Virtualization

List virtualization is a technique used in web development to efficiently render large lists of data by only rendering the visible items and a small buffer of off-screen items. This approach contrasts with rendering the entire list, which can be highly inefficient and lead to performance issues such as slow load times and sluggish user interactions. By only rendering a subset of the list items at any given time, list virtualization significantly reduces the number of DOM nodes and, consequently, memory and CPU usage.

List virtualization is often implemented using a strategy called **"windowing."** Windowing involves maintaining a small window of items that are currently in the viewport, plus a few items above and below for smoother scrolling. As the user scrolls, items that move out of the viewport are removed from the DOM, and new items that come into view are added.

## Core Web Vitals

[Read Here](https://alpha.learnersbucket.com/course-item?item-id=66e46cfd66de7fee7de657be)

## Preload and Prefetch

* **Preload** is a resource loading strategy that explicitly tells the browser to fetch and prioritize critical resources needed for immediate rendering and interactivity. It helps improve the current page's load performance.
* **Prefetch** is a loading strategy aimed at fetching resources that are likely to be needed in future navigations or user interactions. It's done quietly in the background and does not affect the current page load.

Though both techniques improve user experience by optimizing loading strategies, their purposes and implementations differ significantly.

---

### Use Cases and Scenarios

### Preload

Use preload when:

* The resource is essential for the current page rendering.
* You want to improve the initial load performance.
* The resource impacts First Contentful Paint (FCP) or Largest Contentful Paint (LCP).

**Typical assets to preload include:**

* Critical CSS and fonts required for initial rendering.
* Essential JavaScript files that control early interactivity.
* Images crucial for the first viewport or hero section.

**Examples:**

* Critical fonts to avoid text flicker (FOIT/FOUT).
* CSS files needed immediately.
* Above-the-fold images for better perceived performance.

### Prefetch

Use prefetch when:

* The resource will likely be used in future navigation or interactions.
* You're anticipating user behavior and want to reduce load times in subsequent actions.
* You aim to enhance navigation performance without affecting the initial load.

**Examples:**

* Prefetching pages a user is likely to visit next.
* JavaScript bundles for future pages.
* Assets used in subsequent interactions (e.g., checkout scripts, next-page content).

---

### Impact on Performance and User Experience

#### Preload Impact

* Immediate improvement in first paint, first contentful paint (FCP), and time-to-interactive (TTI).
* Directly reduces the waiting time for critical resources, making the page load faster visually and interactively.
* Significant improvement in perceived performance; users feel the website loads instantly.

**Potential Negative Impacts (if misused):**

* If preloading non-critical resources, it could slow down critical resources instead of speeding them up, as it competes for network bandwidth.
* Excessive or improper preloading may block or delay other important assets unintentionally.

#### Prefetch Impact

* Improves future interactions or navigations rather than immediate page load performance.
* Resources are downloaded quietly in the background during idle times, minimizing interference with the current user experience.
* Dramatically reduces waiting times when the user navigates to prefetched pages or assets, providing a smoother subsequent experience.
* Potentially increases data usage slightly due to resources that may not be eventually used if user prediction is incorrect.

> **In essence:** Preload focuses on immediate improvements for the current page, while Prefetch focuses on future usability enhancements, optimizing the next interactions users might perform.

---

### How Browsers Handle Preload vs. Prefetch

#### Browser Handling of Preload

* When a browser encounters a preload element, it immediately initiates resource fetching with a high priority.
* Resources are loaded early in the request queue, even before the browser reaches the point where the asset is actually required by HTML or CSS parsing.
* Preloaded resources are loaded into the browser's resource cache and instantly used as soon as the browser requires them.
* If the browser doesn't use the preloaded resource soon after fetching (typically within a few seconds), it might issue a warning in developer tools indicating inefficiency.
* Incorrect use of the `as` attribute can result in double downloads or ignored hints, so correct specification is crucial.

#### Browser Handling of Prefetch

* Prefetch resources are fetched during browser idle times and at a significantly lower priority compared to preload.
* Browsers typically cache prefetched resources without immediate execution. They are stored in the HTTP cache until requested explicitly.
* If a prefetched resource is never used (the user never navigates to the prefetched content), it may expire from the cache over time, without any negative impact.
* Because prefetch resources are considered speculative, browsers ensure fetching does not negatively affect current page performance or bandwidth significantly.

## Media Optimization

[Read Here](https://alpha.learnersbucket.com/course-item?item-id=66e46d0366de7fee7de657d0)