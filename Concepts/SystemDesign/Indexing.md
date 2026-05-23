# Database Indexing Examples

This complete guide covers optimal B-Tree index design for high-scale relational databases, focusing on composite, partial, covering indexes, and Index Condition Pushdown (ICP).

---

## Part 1: High-Scale Notification Platform

### 1. Problem Statement & Schema

We are designing indexes for a multi-channel notification platform handling hundreds of thousands of messages an hour. The table holds 5 billion rows and is write-heavy.

**Table Schema (`notification_logs`):**

* `notification_id` (UUID, Primary Key)
* `tenant_id` (UUID)
* `user_id` (UUID)
* `channel` (VARCHAR) - 'EMAIL', 'SMS', 'PUSH'.
* `status` (VARCHAR) - 'PENDING', 'SENT', 'FAILED', 'BOUNCED'. (99% are 'SENT')
* `created_at` (TIMESTAMP)
* `updated_at` (TIMESTAMP)

### 2. Query Patterns & Optimal Indexes

**The Golden Rule:** Order composite B-Tree indexes by **Equality, Sort, Range**.

#### Query Pattern A: The User History

**The Query:**

```sql
SELECT * FROM notification_logs 
WHERE user_id = 'abc-123' AND channel = 'PUSH' 
ORDER BY created_at DESC 
LIMIT 50;
```

**The Optimal Index:**

```sql
CREATE INDEX idx_user_channel_date ON notification_logs (user_id, channel, created_at DESC);
```

**Justification:**

* **Equality First:** `user_id` and `channel` are exact matches. The database jumps directly to this specific user's 'PUSH' bucket.
* **Sort Second:** `created_at DESC` is embedded directly into the index definition, so leaf nodes are physically sorted. The database reads the top 50 rows and immediately stops. Zero in-memory sorting required.

#### Query Pattern B: The Retry Worker (Data Skew Optimization)

**The Query:**

```sql
SELECT * FROM notification_logs 
WHERE tenant_id = 'xyz-999' AND channel = 'EMAIL' AND status = 'FAILED' 
ORDER BY created_at ASC 
LIMIT 100;
```

**The Optimal Index (Partial Index):**

```sql
CREATE INDEX idx_retry_worker ON notification_logs (tenant_id, channel, created_at ASC) 
WHERE status = 'FAILED';
```

**Justification:**

* Indexing `status` in a standard composite index forces updates for 5 billion rows, destroying write throughput for 4.95 billion 'SENT' records. Adding the `WHERE` clause to the index strips out successful messages. The B-Tree remains tiny, fits entirely in RAM, and eliminates disk penalties during standard ingestion.

#### Query Pattern C: The Analytics Dashboard

**The Query:**

```sql
SELECT COUNT(notification_id) FROM notification_logs 
WHERE tenant_id = 'xyz-999' AND channel = 'SMS' AND status = 'SENT' AND created_at > '2026-05-15';
```

**The Optimal Index (Covering Index):**

```sql
CREATE INDEX idx_analytics_count ON notification_logs (tenant_id, channel, status, created_at) 
INCLUDE (notification_id);
```

**Justification:**

* For a `COUNT()`, standard indexes often force the database to fetch the actual row from the heap to verify visibility. Using `INCLUDE (notification_id)` attaches the payload to the leaf nodes. The database counts IDs entirely within the index, bypassing random disk I/O completely.

---

## Part 2: Real-Time Analytics Pipeline

### 1. Problem Statement & Schema

A highly concurrent analytics pipeline tracking engagement and device metrics. The table holds 10 billion rows, handling tens of thousands of inserts per second.

**Table Schema (`campaign_metrics`):**

* `event_id` (UUID, Primary Key)
* `campaign_id` (UUID)
* `user_id` (UUID)
* `event_type` (VARCHAR) - 'OPEN', 'CLICK', 'DELIVERY_FAILURE' (0.5%), 'UNSUBSCRIBE'.
* `device_os` (VARCHAR)
* `is_bot` (BOOLEAN) - (approx. 15% of traffic).
* `created_at` (TIMESTAMP)

### 2. Query Patterns & Optimal Indexes

#### Query Pattern A: The Real-Time Feed

**The Query:**

```sql
SELECT * FROM campaign_metrics 
WHERE campaign_id = 'camp-777' AND event_type = 'CLICK' 
ORDER BY created_at DESC 
LIMIT 50;
```

**The Optimal Index:**

```sql
CREATE INDEX idx_live_feed ON campaign_metrics (campaign_id, event_type, created_at DESC);
```

**Justification:**

* `campaign_id` and `event_type` instantly narrow the B-Tree search space via exact match. `created_at DESC` physically sorts leaf nodes. The database reads the top 50 records and stops, avoiding heap filtering or `Filesort`.

#### Query Pattern B: The Device OS Aggregator

**The Query:**

```sql
SELECT COUNT(event_id) FROM campaign_metrics 
WHERE campaign_id = 'camp-777' 
  AND event_type = 'OPEN' 
  AND device_os = 'iOS' 
  AND is_bot = FALSE 
  AND created_at > '2026-05-21 00:00:00';
```

**The Optimal Index:**

```sql
CREATE INDEX idx_campaign_os_metrics ON campaign_metrics (campaign_id, event_type, device_os, created_at) 
INCLUDE (event_id) 
WHERE is_bot = FALSE;
```

**Justification:**

* Booleans kill B-Tree efficiency due to near-zero cardinality. Moving `is_bot = FALSE` to a `WHERE` clause strips 1.5 billion records from the tree. Omitting `event_id` forces a random disk read to increment the counter; `INCLUDE (event_id)` makes the aggregation a 100% memory-only operation.

#### Query Pattern C: The System-Wide Failure Monitor

**The Query:**

```sql
SELECT * FROM campaign_metrics 
WHERE event_type = 'DELIVERY_FAILURE' 
ORDER BY created_at ASC 
LIMIT 100;
```

**The Optimal Index:**

```sql
CREATE INDEX idx_global_failures ON campaign_metrics (created_at ASC) 
WHERE event_type = 'DELIVERY_FAILURE';
```

**Justification:** 

* Updating a B-Tree for 10 billion rows to track 50 million failures is a massive write waste. The partial index ensures the B-Tree only contains the 0.5% of failed events, fitting in RAM and dropping the write penalty for successful events to zero.

---

## Part 3: E-commerce Order Management System (OMS)

### 1. Problem Statement & Schema

An `orders` table storing every transaction on a platform. It holds 2 billion rows with extremely high read concurrency.

**Table Schema (`orders`):**

* `order_id` (UUID, Primary Key)
* `customer_id` (UUID)
* `merchant_id` (UUID)
* `status` (VARCHAR)
* `total_amount` (DECIMAL)
* `order_date` (TIMESTAMP)

### 2. Query Patterns & Optimal Indexes

#### Query Pattern A: The Customer "My Orders" Page

**The Query:**

```sql
SELECT * FROM orders 
WHERE customer_id = 'cust-123' 
ORDER BY order_date DESC 
LIMIT 20;
```

**The Optimal Index:**

```sql
CREATE INDEX idx_customer_orders ON orders (customer_id, order_date DESC);
```

**Justification:**

* Equality (`customer_id`) followed directly by Sort (`order_date DESC`).

#### Query Pattern B: The Merchant Fulfillment Dashboard (Range vs Sort Collision)

**The Query:**

```sql
SELECT * FROM orders 
WHERE merchant_id = 'merch-999' 
  AND status = 'PROCESSING' 
  AND total_amount > 1000.00 
ORDER BY order_date ASC 
LIMIT 50;
```

**The Optimal Index:**

```sql
CREATE INDEX idx_merchant_fulfillment ON orders (merchant_id, status, order_date ASC, total_amount);
```

**Justification:**

* Placing `total_amount` (Range) before `order_date` (Sort) breaks the physical sort of the B-Tree, forcing an expensive in-memory sort. Placing `order_date ASC` first preserves the physical chronological order. By appending `total_amount` to the end, you enable **Index Condition Pushdown (ICP)**, allowing the DB to filter out small amounts directly in the index structure before retrieving the full row.

#### Query Pattern C: The Nightly Financial ETL

**The Query:**

```sql
SELECT * FROM orders 
WHERE order_date >= '2026-05-22 00:00:00' 
  AND order_date < '2026-05-23 00:00:00';
```

**The Optimal Solution:**

* No B-Tree Index. Use **Table Partitioning**.
**Justification:** 
* Extracting millions of rows via a B-Tree index causes massive random disk I/O. The query planner will typically ignore the index and do a full table scan anyway. The architectural solution is to partition the table physically by `order_date` (daily/monthly). The DB will recognize the boundaries and perform a sequential scan on just that day's physical partition.

---

## Part 4: Global Multiplayer Gaming Leaderboard

### 1. Problem Statement & Schema

A `player_rankings` table tracking the MMR and status of 500 million gamers.

**Table Schema (`player_rankings`):**

* `player_id` (UUID, Primary Key)
* `region` (VARCHAR)
* `game_mode` (VARCHAR)
* `rank_tier` (VARCHAR) - (Diamond/Master = 2%)
* `mmr_score` (INTEGER)
* `last_active_at` (TIMESTAMP)

### 2. Query Patterns & Optimal Indexes

#### Query Pattern A: The Global Leaderboard

**The Query:**

```sql
SELECT player_id, mmr_score FROM player_rankings 
WHERE region = 'EU' AND game_mode = 'SOLO' 
ORDER BY mmr_score DESC 
LIMIT 100;
```

**The Optimal Index:**

```sql
CREATE INDEX idx_global_leaderboard ON player_rankings (region, game_mode, mmr_score DESC) INCLUDE (player_id);
```

**Justification:**

* Do not embed unused columns like `rank_tier` in the B-Tree; it breaks traversal. Strictly follow Equality (`region`, `game_mode`) then Sort (`mmr_score DESC`). The `INCLUDE (player_id)` makes it a covering index to fetch the top 100 entirely from RAM.

#### Query Pattern B: The Matchmaker Queue (Range vs Sort Collision)

**The Query:**

```sql
SELECT player_id FROM player_rankings 
WHERE region = 'NA' AND game_mode = 'DUO' 
  AND mmr_score BETWEEN 2000 AND 2100 
ORDER BY last_active_at ASC 
LIMIT 10;
```

**The Optimal Index:**

```sql
CREATE INDEX idx_matchmaker_queue ON player_rankings (region, game_mode, last_active_at ASC, mmr_score) INCLUDE (player_id);
```

**Justification:** 

* Putting `mmr_score` (Range) before `last_active_at` (Sort) forces the DB to pull thousands of matching MMR rows into memory to sort by time. By sorting time first, the B-Tree jumps to the region/mode, walks down the perfectly time-sorted nodes, and pushes the MMR filter down.

#### Query Pattern C: The High-Elo Decay Worker

**The Query:**

```sql
SELECT player_id FROM player_rankings 
WHERE rank_tier IN ('DIAMOND', 'MASTER') 
  AND last_active_at < '2026-04-23 00:00:00';
```

**The Optimal Index:**

```sql
CREATE INDEX idx_elo_decay ON player_rankings (last_active_at ASC) INCLUDE (player_id) 
WHERE rank_tier IN ('DIAMOND', 'MASTER');
```

**Justification:**

* The query only requires a range scan on `last_active_at`. A partial index isolating the 2% of players in top tiers ensures the B-Tree ignores the other 490 million rows. Do not add unnecessary sort constraints that the query does not ask for.
