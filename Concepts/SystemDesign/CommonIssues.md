# System Design: Common Issues

## Celebrity Problem

**Definition:**
A celebrity problem occurs when there is a massive discrepancy in nodes and their edges in a graph. For example, a celebrity with 100M followers.

**Problem with Fan Out on Write:**

- General practice in social media apps is to use Fan Out on Write: when a user posts, push that post into pre-computed feeds of all followers.
- This approach breaks down for celebrities. If Ronaldo makes a post, pushing it to 500M feeds would overwhelm the system.

**Solutions:**

- Store celebrity posts in a separate global `celebrity_posts` table.
- When a user opens the app, they get:
  - Pre-computed feed from normal users (via Fan Out on Write)
  - Quick lookup in the celebrity table for posts from followed celebrities.

---

## Hot Key Problem

**Definition:**
Too many reads reach a single shard, causing bottlenecks. Example: Ronaldo makes a post, and 100k followers request it simultaneously from the database.

**Solutions:**

### Option 1: L1 Local Memory Caching

- Store a short-lived copy of the celebrity post directly in the RAM of each Node.js API server.
- Avoids repeated network calls to Redis for the same hot data.
- Trade-off: Uses more memory but significantly reduces latency.

### Option 2: Key Salting (Cache Replication)

- For large payloads that don't fit in local memory, replicate across multiple Redis nodes.
- Append a random salt to the key (e.g., `post:123:salt1`, `post:123:salt2`).
- Distributes read load across multiple cache nodes instead of a single hot key.

---

## Thundering Herd Problem

**Definition:**
Occurs when a massive number of concurrent requests bypass a shared resource (cache) and hit an underlying slower resource (database). Example: A Redis key with a 10-second TTL serves 1M users. When it expires, 100k concurrent requests hit the database simultaneously, causing it to crash—regardless of even data distribution.

**Solutions:**

### Option 1: Mutex Locks (Baseline Solution)

- Prevent the herd from hitting the database simultaneously.
- When a cache miss occurs, threads attempt to acquire a distributed lock (e.g., Redis SETNX).
- Only the thread that acquires the lock queries the database and updates the cache.
- Other threads wait a few milliseconds and re-check the cache.
- Simple but can cause latency for waiting threads.

### Option 2: Cache Jitter (Prevention Technique)

- Never allow bulk cache keys to expire at the same time.
- Add mathematical randomness to TTLs to spread expirations evenly.
- Example: `TTL = 3600 + Math.random() * 300` spreads expirations over a 5-minute window.
- Turns a thundering herd into a manageable trickle.
- Preventive approach that avoids the problem upfront.

### Option 3: Stale-While-Revalidate (Best Solution)

- The best approach: never let users experience a cache miss.
- Serve slightly stale cached data immediately to the user.
- Simultaneously, fire off a single asynchronous background worker to recalculate data and update the cache.
- Users experience no latency, and the database sees only one query instead of thousands.

---

## Scatter-Gather Problem

**Definition:**
Occurs when a single request requires data from multiple services/shards, and the response time is limited by the slowest service. Example: A user profile page needs data from user service, recommendation service, and analytics service. If one service is slow, the entire page load is delayed.

**Solutions:**

### Option 1: Parallel Requests

- Send requests to all services simultaneously instead of sequentially.
- Use `Promise.all()` or similar async patterns to wait for all responses.
- Response time = slowest service (not sum of all services).
- Efficient but requires careful error handling if one service fails.

### Option 2: Request Timeout & Fallback

- Set timeouts on each service request.
- Use cached or default data if a service doesn't respond in time.
- Trade-off: Serve partial/stale data for better UX.
- Prevents one slow service from blocking the entire request.

### Option 3: Service Priority & Eager Caching

- Identify critical vs. optional data.
- Fetch critical data in parallel; optional data can be loaded asynchronously after the response.
- Pre-cache frequently requested data combinations.
- Reduces the number of services that must respond synchronously.

---

## N+1 Query Problem

**Definition:**
Occurs when fetching related data requires one query to get parent records, then N additional queries to get child records for each parent. Example: Fetching 100 users requires 1 query to get users, then 100 separate queries to get each user's posts.

```javascript
async function getCampaignsWithMetrics_BAD() {
    // 1 Query: Fetch 100 campaigns
    const campaigns = await db.query(`SELECT id, name FROM campaigns LIMIT 100`);
    
    const results = [];
    
    // N Queries: Looping and querying inside the loop
    for (const campaign of campaigns) {
        // ERROR: Network I/O inside a loop!
        const metrics = await db.query(
            `SELECT opens, clicks FROM campaign_metrics WHERE campaign_id = ?`, 
            [campaign.id]
        );
        results.push({ ...campaign, metrics });
    }
    
    // Total Queries: 101. Performance: Terrible.
    return results;
}
```

**Solutions:**

### Option 1: Eager Loading (JOIN)

- Combine parent and child queries using SQL JOINs.
- Single query returns all data at once.
- Reduces database round trips from N+1 to 1.
- Simplest and most efficient for most cases.

### Option 2: Batch Loading (Data Loader)

- Fetch all parent records in one query.
- Collect all required IDs, then fetch all children in a single query. IN clause can be used.
- Map results back to parents in application logic.
- Useful when JOINs aren't feasible or when using ORMs with lazy loading.

```javascript
async function getCampaignsWithMetrics_GOOD() {
    // Query 1: Fetch 100 campaigns
    const campaigns = await db.query(`SELECT id, name FROM campaigns LIMIT 100`);
    
    // Extract all the IDs into an array: [1, 2, 3, ..., 100]
    const campaignIds = campaigns.map(c => c.id);
    
    // Query 2: Fetch ALL metrics for those specific campaigns at once
    const allMetrics = await db.query(
        `SELECT campaign_id, opens, clicks FROM campaign_metrics WHERE campaign_id IN (?)`, 
        [campaignIds]
    );
    
    // Map the metrics back to their respective campaigns in memory (0 network cost)
    const metricsMap = new Map(allMetrics.map(m => [m.campaign_id, m]));
    
    const results = campaigns.map(campaign => ({
        ...campaign,
        metrics: metricsMap.get(campaign.id) || null
    }));
    
    // Total Queries: 2. Performance: Optimal.
    return results;
}
```

### Option 3: Query Optimization with Indexing & Caching

- Add database indexes on foreign key columns for faster lookups.
- Cache frequently accessed relationships.
- Use query result caching to avoid repeated database hits.
- Reduces query latency but doesn't eliminate N+1 if not combined with other solutions.

**More:**

- GraphQL resolves fields independently on a node-by-node basis, it is notorious for causing N+1 query explosions.
- The N+1 problem is almost always introduced by Object-Relational Mappers (ORMs) or poorly structured API resolvers (especially in GraphQL). It is a byproduct of "lazy loading," where related data is only fetched exactly when it is accessed in the code. Here we are not refeering to lazy loading on frontend where we show a list and then fetch item details once something on the list is clicked.
- The N+1 problem occurs when the frontend does need both, example - the campaigns and the metrics on the same page (for example, a real-time analytics table showing campaign names alongside their open and click rates), and the backend handles that single API call catastrophically like the code above.

---

More Problems to study:

- Noisy Neighbour
- Split Brain
