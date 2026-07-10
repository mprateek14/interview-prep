# Basic Flow to follow

## RADIO

Requirements, Architecture, Data Model, Interface (APIs), Optimisations

### Requirements

Gather requirements in this phase. Discuss what should be picked up as part of design because we have limited time.

### Architecure

* Think about rendering techniques and which ones can be used either solo or in combo. Think about different pages where different strategies might come in play. Mostly public facing pages with need for SEO and good vitals can be SSR. Pages with personal data like carts etc can be CSR.
* Think about structure of app - shell components which will be present everywhere like header, footer etc. If these don't contain any personal data they can use SSR otherwise either CSR or SSR with more strategy for hydration.

### Data Model

* Think of usecases we are covering and how their state will be managed in the app.
* If a single state is being accessed or modified from multiple places in the app, or multiple components depend upon a derived state which can cause lot of rerenders, consider using state management libraries.
* React-query supports optimistic UI updates out of the box, so that can also be considered in this.
* Normalized data will be stored on frontend for performance. Common pattern is using byIds and allIds.

### API

* Think all api endpoints that will be needed along with the request data, query params, response data etc.
* How to handle error states? Things like interceptors, refresh tokens, error pages, abort controllers.
* Can mention things like pagination, authentication flows here.
* Common routes will be homepage, item page, search results page, cart page, checkout page.

### Optimisation

* Think all techniques one by one.
* Usual pointers will be CDN, pagination, caching, prefetching things, virtual lists, core web vitals, optimistic UI, adaptive loading.
* Can further discuss about accessibility and analytics.
