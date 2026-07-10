# Frontend Rendering

## What is the Critical Rendering Path (CRP)?

The complete process a browser goes through to convert raw HTML/CSS/JS into pixels on screen. **Optimizing the CRP = faster, jank-free pages.**

Pipeline overview:

```
Bytes → Characters → Tokens → Nodes → DOM
                                        ↓
                                     CSSOM
                                        ↓
                                   Render Tree
                                        ↓
                                      Layout  ←── reflow re-enters here
                                        ↓
                                      Paint   ←── repaint re-enters here
                                        ↓
                                   Composite  ←── transform/opacity only touch here
```

---

## Step 1 — DOM Construction

- Server returns HTML as **bytes** over HTTP
- Browser converts: `Bytes → Characters → Tokens → Nodes → DOM`
- DOM = tree-like representation of all HTML nodes
- Parsing happens **top to bottom**

### ⚠️ Blocking Gotchas
| Resource | Behavior |
|----------|----------|
| Inline `<script>` | Blocks HTML parsing until executed |
| External `<script>` | Blocks parsing while loading + executing |
| `<script defer>` | Loads in background, executes **after** DOM is ready, in order |
| `<script async>` | Loads in background, executes **as soon as loaded** (order not guaranteed) |
| CSS / Media | Can also halt parsing if external |

> **Best practice:** Place scripts at the bottom of `<body>`, or use `defer`/`async`.

---

## Step 2 — CSSOM Construction

- CSSOM (CSS Object Model) = same tree structure as DOM, but stores **all styling info**
- **Render-blocking by default** — browser won't paint anything until CSSOM is fully built
- Why blocking? Because CSS styles can be **overridden** — browser needs the full picture
- Browser also applies **user-agent (browser default) styles** during this phase
- **Cascade rule:** Child nodes inherit certain styles from parent nodes (the "C" in CSS)

---

## Step 3 — Render Tree

- DOM + CSSOM are combined by the **browser engine** into the Render Tree
- Built by traversing every DOM node and attaching its computed styles from CSSOM
- **Key:** Only **visible** nodes are included
  - `display: none` → node and all its children are **excluded** from Render Tree
  - `visibility: hidden` → node is included but invisible (still takes up space)

---

## Step 4 — Layout (Reflow)

- Calculates the **exact position and size** of every element on the page
- Bounded by **device/viewport dimensions**
- Determines each element's geometry and its relationship to surrounding elements

### Viewport & Meta Tag

```html
<meta name="viewport" content="width=device-width">
```

- Without this → browser defaults to ~**960px** wide
- With this → uses the **actual device width**
- Layout is **re-triggered** on: device rotation, browser resize

---

## Step 5 — Paint

- Browser paints pixels on screen at **60fps** (one frame every ~16.67ms)
- **First paint:** entire page is painted
- **Subsequent paints:** only the parts affected by DOM/style changes are repainted

### ⚠️ Performance Tip

> Frequent DOM manipulations → frequent repaints → performance hits.  
> Batch DOM changes, use `DocumentFragment`, or use `requestAnimationFrame`.

---

## Step 6 — Compositing

- Browser splits the page into **layers** (like separate transparent sheets stacked on top of each other)
- Each layer is painted independently
- The **compositor thread** combines all layers in the correct order to produce the final image on screen

### Why compositing matters for performance

Certain CSS properties promote an element to its **own compositor layer**, meaning changes to them **skip Layout and Paint entirely** — only compositing runs. This makes them extremely cheap:

```css
transform: translateX(100px);  /* ✅ compositor only */
opacity: 0.5;                   /* ✅ compositor only */
will-change: transform;         /* ✅ hints browser to create a layer upfront */
```

vs.

```css
left: 100px;   /* ❌ triggers reflow → repaint → composite */
width: 200px;  /* ❌ triggers reflow → repaint → composite */
```

> **Rule of thumb:** Always animate `transform` or `opacity` over `top`/`left`/`width`/`height`.

---

## Reflow vs Repaint vs Composite

| | Reflow | Repaint | Composite |
| --- | --- | --- | --- |
| **Triggered by** | Geometry changes (size, position, margin, font) | Visual changes (color, background) | `transform`, `opacity` changes |
| **Pipeline cost** | Layout → Paint → Composite | Paint → Composite | Composite only |
| **Expense** | Most expensive | Medium | Cheapest |
| **Examples** | Resizing window, adding DOM nodes | `color`, `background-color`, `outline` | CSS animations using transform/opacity |

---

## Layout Thrashing

Layout thrashing = forcing the browser to do **multiple reflows in a single frame** by interleaving DOM reads and writes.

### Why it happens

- **Writes** mark layout as **dirty** (invalidated)
- **Reads** of layout properties (`offsetHeight`, `getBoundingClientRect()`, etc.) force the browser to **flush pending writes immediately** and recalculate layout right then — so the read returns an accurate value
- The write caused the reflow; the read just forced it to happen **now** instead of at end of frame

```js
// ❌ Layout thrashing — N reflows in one frame
for (let i = 0; i < elements.length; i++) {
  const height = elements[i].offsetHeight;        // READ → forces reflow
  elements[i].style.height = height + 10 + 'px'; // WRITE → invalidates layout
}
```

```js
// ✅ Correct — batch reads first, then writes
const heights = elements.map(el => el.offsetHeight);  // all READs
elements.forEach((el, i) => {
  el.style.height = heights[i] + 10 + 'px';           // all WRITEs
});
// ONE reflow, ONE repaint
```

### Common layout-read properties that trigger reflow

`offsetWidth/Height`, `clientWidth/Height`, `scrollTop/Left`, `getBoundingClientRect()`, `getComputedStyle()`

### The golden rule

> **Read first, write after. Never interleave.**

Libraries like **FastDOM** enforce this by scheduling reads and writes in separate queues via `requestAnimationFrame`.

---

## Reflow vs Repaint (detail)

| | Reflow | Repaint |
| --- | --- | --- |
| **Triggered by** | Layout/geometry changes (size, position, margin) | Visual changes (color, background, visibility) |
| **Cost** | Expensive — recalculates layout | Less expensive — skips layout step |
| **Examples** | Resizing window, changing font size, adding DOM nodes | Changing `color`, `background-color`, `outline` |

---

---

# Frontend Rendering Strategies

The key question every rendering strategy answers: **when and where is the HTML generated?**

---

## 1. CSR — Client Side Rendering (SPA)

A **single HTML file** is loaded once with all static assets (CSS, JS, media). After that, page navigation is handled entirely on the client — only JSON data is fetched from the server via APIs.

```
Browser requests page
  → Server sends empty HTML shell + JS bundle
    → Browser runs JS
      → React/Vue mounts and renders the UI
        → API called for data → UI updates
```

**Pros:**

- Blazing fast after initial load (no full page reload on navigation)
- Fully decoupled frontend/backend
- Same codebase can power web/mobile/desktop
- Unused JS can be lazy-loaded via code splitting

**Cons:**

- Poor SEO (crawlers see an empty `<div id="root">` on first load)
- Slow initial load if JS bundle is large
- Higher client memory usage

**Use when:** Dashboards, admin panels, real-time apps — anywhere SEO doesn't matter.

**Examples:** React SPA, Vue SPA, Angular

---

## 2. SSR — Server Side Rendering (MPA)

Every page navigation sends a request to the server. The server **generates fresh HTML with data pre-filled** and returns it to the browser. Traditional web model.

```
Browser requests page
  → Server fetches data + generates full HTML
    → Returns complete HTML to browser
      → Browser parses and renders
        → On next navigation, repeat from start
```

**Pros:**

- Great SEO (full HTML content visible to crawlers immediately)
- Fast initial load (no JS needed to see content)
- More secure (logic stays on server)

**Cons:**

- Slow navigation (full round-trip to server per page)
- Tightly coupled frontend/backend
- Larger response payload
- Higher server load at scale

**Use when:** E-commerce, blogs, SaaS marketing sites — SEO-heavy applications.

---

## 3. SSG — Static Site Generation

All HTML pages are **pre-generated at build time** before any user request. The output is a set of static HTML files served directly — no server computation per request.

```

Build step runs once:
  → All pages rendered to static HTML files
    → Files deployed to CDN
      → User requests page → CDN serves pre-built HTML instantly
```

**Pros:**

- Fastest possible load (CDN-served, no server needed)
- Excellent SEO
- Zero server load at runtime
- Highly scalable and cheap to host

**Cons:**

- Not dynamic — changes require a full rebuild and redeploy
- Build times grow with number of pages (bad for large sites)
- Can't personalize content per user

**Use when:** Blogs, documentation, marketing/landing pages — content that rarely changes.

**Examples:** Gatsby (React), Hugo, Jekyll

---

## 4. ISR — Incremental Static Regeneration

A hybrid of SSG + SSR. Pages are **pre-generated at build time** but can be **regenerated in the background** after a set time or on-demand — without a full rebuild.

```
Build step: pre-generate all pages → deploy to CDN

On request after revalidation:
  → Serve stale cached page immediately (fast)
    → Trigger background regeneration
      → Next user gets fresh page
```

### Trigger 1 — Time-based revalidation

```js
// Next.js
export async function getStaticProps() {
  const data = await fetchProducts();
  return {
    props: { data },
    revalidate: 60  // regenerate at most once every 60 seconds
  };
}
```

- After 60s, the **next visitor** still gets the stale page
- Regeneration happens in the background
- The visitor **after that** gets the fresh page
- ⚠️ Dumb trigger — regenerates on schedule even if nothing changed

### Trigger 2 — On-demand revalidation (preferred)

```js
// pages/api/revalidate.js
export default async function handler(req, res) {
  await res.revalidate('/products/42'); // regenerate this specific page
  return res.json({ revalidated: true });
}
```

- CMS/backend fires a **webhook** when content changes
- Webhook hits this API route → that page is immediately rebuilt
- Surgical — only affected pages regenerated, no wasted compute
- Next visitor gets fresh content right away

**Pros:**

- Speed of SSG + freshness of SSR
- No full rebuild required for updates
- Great SEO

**Cons:**

- Time-based: stale content risk, wasted compute if nothing changed
- On-demand: needs CMS webhook integration setup
- Not suitable for real-time data

**Use when:** E-commerce product pages, news articles, food delivery menus — content changes occasionally but not constantly.

---

## Rendering Strategy Comparison

| | CSR | SSR | SSG | ISR |
| --- | --- | --- | --- | --- |
| **HTML generated** | Browser (runtime) | Server (per request) | Build time | Build time + background |
| **SEO** | ❌ Poor | ✅ Great | ✅ Great | ✅ Great |
| **Initial load** | 🐢 Slow | ⚡ Fast | ⚡ Fastest | ⚡ Fast |
| **Navigation** | ⚡ Fast | 🐢 Slow | ⚡ Fast | ⚡ Fast |
| **Dynamic data** | ✅ Yes | ✅ Yes | ❌ No | ⚠️ Partial |
| **Real-time** | ✅ Yes | ✅ Yes | ❌ No | ❌ No |
| **Server load** | Low | High | None | Low |
| **Best for** | Dashboards | E-commerce | Blogs | Product catalogs |

---

## The Hybrid Approach (Production Reality)

Modern frameworks like **Next.js** let you mix strategies **per route**:

- Homepage → SSG (static, fast)
- Product pages → ISR (occasionally updated)
- User profile → SSR (personalized, SEO needed)
- Cart / checkout → CSR (real-time interaction, no SEO needed)

---

## 5. Streaming SSR

Normal SSR blocks the entire page until all data is fetched. If one slow API takes 2s, the user waits 2s even if the rest of the page was ready in 200ms.

**Streaming SSR** sends HTML in **chunks** as each piece becomes ready — browser starts rendering immediately.

```
Normal SSR:
  Wait for ALL data → render full HTML → send everything → user sees page

Streaming SSR:
  Send shell + fast parts immediately → slow parts stream in as they resolve → browser renders progressively
```

### How it works — React Suspense boundaries

```jsx
import { Suspense } from 'react';

export default function Page() {
  return (
    <div>
      <Header />                          {/* fast — streams immediately */}
      <ArticleBody />                     {/* fast — streams immediately */}

      <Suspense fallback={<Spinner />}>
        <Recommendations />               {/* slow — streams when ready */}
      </Suspense>

      <Suspense fallback={<Spinner />}>
        <Comments />                      {/* slow — streams when ready */}
      </Suspense>
    </div>
  );
}
```

- Each `<Suspense>` boundary is an independent stream
- Browser shows fallback (spinner) immediately
- Real component **replaces** the fallback when its data resolves — no full page reload
- **TTFB (Time to First Byte)** drops dramatically — browser gets something to render almost instantly

---

## 6. React Server Components (RSC)

### The problem RSC solves

In normal SSR, **every component ships its JS to the browser** for hydration — even purely presentational ones that display data and have zero interactivity. This bloats the bundle with code that does nothing on the client.

RSC introduces a hard split at the **component level**:

```
Server Components  →  run only on server, output HTML, zero JS shipped to browser
Client Components  →  run on server (for initial HTML) + ship JS for hydration
```

### RSC is NOT the same as SSR

| | SSR | RSC |
|---|---|---|
| **What it applies to** | Entire page | Per component |
| **JS shipped** | Full component tree | Only `'use client'` components |
| **Hydration** | Entire page hydrated | Only client components hydrated |
| **DB/API access** | Via API routes | Directly in server component |
| **Secrets** | Must go through API | Safe in server component |

### Code example

```jsx
// ProductPage.jsx — Server Component (default in Next.js App Router)
// Runs on server only. Zero JS shipped. Can access DB directly.
import { db } from './db';
import AddToCartButton from './AddToCartButton';

export default async function ProductPage({ id }) {
  const product = await db.products.find(id); // direct DB — no API needed

  return (
    <div>
      <h1>{product.name}</h1>         {/* pure HTML — no JS shipped */}
      <p>{product.description}</p>    {/* pure HTML — no JS shipped */}
      <AddToCartButton id={id} />     {/* client component — JS shipped */}
    </div>
  );
}
```

```jsx
// AddToCartButton.jsx — Client Component
'use client'; // ← opt-in signal

export default function AddToCartButton({ id }) {
  const [added, setAdded] = useState(false);
  return (
    <button onClick={() => setAdded(true)}>
      {added ? 'Added!' : 'Add to Cart'}
    </button>
  );
}
```

### What server components CAN and CANNOT do

```jsx
// ❌ Not allowed in Server Components — browser APIs
useState(), useEffect(), onClick    // no interactivity
window, localStorage, document      // no browser APIs

// ✅ Only possible in Server Components — server APIs
await db.query('SELECT ...')        // direct DB access
fs.readFileSync('data.json')        // filesystem
process.env.SECRET_KEY              // env secrets safely
```

---

## Hydration

Hydration = **attaching JavaScript event listeners and interactivity to already-existing server-rendered HTML**.

The server sends fully-formed HTML — the page *looks* complete but is like a photo — static, not interactive. Hydration **brings it to life**.

```
Server sends:   <button class="like-btn">Like</button>   ← visible but dead
                              ↓
React hydrates: attaches onClick, state, refs
                              ↓
                <button class="like-btn">Like</button>   ← now interactive
```

### Hydration per rendering strategy

| Strategy | Hydration? | Notes |
| --- | --- | --- |
| **CSR** | ❌ None | React builds DOM fresh from scratch — nothing to hydrate |
| **SSR** | ✅ Full page | HTML from server, then JS hydrates entire tree |
| **SSG** | ✅ Full page | Same as SSR — just HTML came from build step |
| **ISR** | ✅ Full page | Same as SSG under the hood |
| **Streaming SSR** | ✅ Progressive | Each Suspense boundary hydrates as it streams in |
| **RSC** | ✅ Client components only | Server components excluded entirely from hydration |

### The TTI Problem

SSR/SSG/ISR all have a gap between when the page is **visible** and when it's **interactive** (JS still loading). This is **TTI — Time to Interactive**. User sees a fully rendered page but clicks do nothing.

### Solutions to TTI

**Progressive Hydration** — hydrate components in order of priority. Critical interactive parts first, less important parts later.

**Selective / Partial Hydration (Islands Architecture)** — only hydrate components that actually need interactivity. Static parts (article body, footer) get zero JS.

```
[Static Header] [Article — not hydrated] [Comment Box — hydrated ✅] [Footer — not hydrated]
```
→ Astro is built entirely around this model.

**Lazy Hydration** — defer hydration of below-the-fold components until user scrolls near them.

### How you control hydration per framework

You never write `hydrate(false)` manually. Control is declarative:

| Framework | How you control it |
| --- | --- |
| **Astro** | `client:load` / `client:visible` / `client:idle` / no directive = static |
| **Next.js App Router** | `'use client'` = hydrated; no directive = server component, zero JS |
| **Nuxt** | `<ClientOnly>` wrapper = client only; outside = server rendered |

---

## What Actually Arrives in the Network Tab

### Client Components

- **Initial load** → arrives as **HTML** (server pre-renders for fast display)
- **JS bundle** → arrives separately, hydrates the component

### Server Components

- Do NOT arrive as plain HTML
- Arrive as **RSC Payload** — React's own wire format (not HTML, not JSON)

```
1:["$","div",null,{"children":[
  ["$","h1",null,{"children":"iPhone 15"}],
  ["$","p",null,{"children":"Best phone ever"}],
  "$L2"    ← placeholder where a client component slots in
]}]
2:I["AddToCartButton",["add-to-cart","static/chunks/add-to-cart.js"]]
```

### Why RSC Payload instead of plain HTML?

Plain HTML loses component tree structure. React needs the payload to know:

- Where client component boundaries are (the `$L2` placeholders)
- What props to pass for correct hydration
- How to slot client components into the right positions

### What you see in Network tab for a full page load

```
Document (HTML)         ← initial shell + fast parts streamed immediately
__rsc_payload chunks    ← RSC wire format streaming in as Suspense resolves
page.js / layout.js     ← JS bundle for client components
add-to-cart.js          ← individual client component chunk (if code split)
```

### Client-side navigation with RSC

When navigating between pages in Next.js App Router, you'll see requests like:
```
/about?_rsc=abc123
```
That `_rsc` param = Next.js fetching only the **RSC payload diff** for the new page — not a full HTML reload. Server components still run on the server, but only the changed tree is sent over the wire. This is how RSC enables fast client-side navigation while keeping components server-side.

---

## Updated Full Rendering Strategy Comparison

| | CSR | SSR | SSG | ISR | Streaming SSR | RSC |
| --- | --- | --- | --- | --- | --- | --- |
| **HTML generated** | Browser | Server (per request) | Build time | Build time + bg | Server (chunked) | Server (per component) |
| **JS shipped** | Full bundle | Full bundle | Full bundle | Full bundle | Full bundle | Only client components |
| **Hydration** | None | Full page | Full page | Full page | Progressive | Client components only |
| **SEO** | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **TTFB** | Slow | Medium | Fastest | Fast | Very fast | Very fast |
| **TTI gap** | None | Yes | Yes | Yes | Reduced | Minimized |
| **Streaming** | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ pairs naturally |

---

## Interview Triggers

**CRP:**

- *"Why put scripts at the bottom of the page?"* → Scripts block HTML parsing by default
- *"What's the difference between `defer` and `async`?"* → defer = ordered, after DOM ready; async = unordered, executes ASAP
- *"Why does CSS block rendering?"* → Styles can be overridden — browser needs full CSSOM before painting
- *"What triggers a reflow?"* → Geometry changes: size, position, font, adding/removing DOM nodes
- *"What triggers layout thrashing?"* → Interleaving DOM reads and writes in a loop; fix by batching reads first, writes after
- *"Why animate transform instead of left/top?"* → transform hits compositor only; left/top triggers full reflow → repaint → composite
- *"What is the compositor?"* → Thread that combines layers into final frame; certain properties (transform, opacity) skip layout+paint and only hit this

**Rendering Strategies:**

- *"What's the difference between SSR and SSG?"* → SSR generates HTML per request; SSG generates at build time
- *"When would you use ISR over SSG?"* → When content changes occasionally but you still want CDN-speed delivery
- *"What is the stale-while-revalidate pattern?"* → Serve cached (possibly stale) content immediately; regenerate in background; next visitor gets fresh
- *"How does ISR know when to regenerate?"* → Either timer-based (dumb) or on-demand via CMS webhook (smart/preferred)
- *"Why is CSR bad for SEO?"* → Browser sends empty HTML shell; crawlers may not execute JS; content is invisible to indexers

**Hydration, Streaming & RSC:**

- *"What is hydration?"* → Attaching JS event listeners to server-rendered HTML to make it interactive
- *"What is TTI?"* → Time to Interactive — gap between page being visible and being interactive; SSR/SSG weakness
- *"How do you fix TTI?"* → Progressive hydration (priority order), selective hydration (only interactive components), lazy hydration (on scroll)
- *"What is Streaming SSR?"* → Sending HTML in chunks via Suspense boundaries; browser renders progressively instead of waiting for full page
- *"What is RSC?"* → Server Components run only on server — output HTML, ship zero JS. Only client components (`'use client'`) ship JS and hydrate
- *"What's the difference between RSC and SSR?"* → SSR = entire page renders on server + ships full JS bundle. RSC = per-component — server components never ship JS at all
- *"What is the RSC Payload?"* → React's wire format for server component output — not HTML, not JSON. Preserves tree structure + client component placeholders for correct hydration
- *"What do you see in the Network tab for RSC?"* → Initial HTML, then RSC payload chunks streaming in, then JS bundles only for client components
- *"How does RSC enable fast client-side navigation?"* → On route change, only RSC payload diff is fetched (`?_rsc=...`) — not a full HTML reload

---
---
---
