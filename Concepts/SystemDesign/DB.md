# Database Selection Guide for System Design Interviews

## 1. Problem Statement & The Selection Framework

The fundamental problem is matching a storage engine's physical data structures to the system's **access patterns** and **non-functional requirements**. Selecting a database is not about the shape of the data; it is about how the data is written, read, and scaled.

Your thought process must filter through these criteria:

1. **Access Pattern:** Complex joins vs. key-based lookups vs. range scans.
2. **Read vs. Write Ratio:** Is the system write-heavy (requires LSM trees) or read-heavy (benefits from B-Trees)?
3. **Scale:** Gigabytes (vertical scaling) vs. Petabytes (horizontal sharding).
4. **Consistency vs. Availability:** Strict ACID guarantees vs. Eventual Consistency (CAP Theorem).

---

## 2. Detailed Explanation & Database Architectures

### Relational SQL Databases (Postgres, MySQL)

* **Thought Process:** The default choice. Start here if you need strict ACID guarantees and your data has clear relationships.
* **Workloads:** Balanced read/write or read-heavy. Excellent for financial transactions or core user data.
* **Indexing Mechanism (B-Tree):** Uses **B+ Trees**. Optimized for exact matches and range queries (O(log n) time complexity). Updates require in-place modifications, which can cause random I/O and page splits, making it less optimal for massive write throughput compared to LSM trees.
* **Scaling:** Vertically scales easily. Horizontally scaling (sharding) is complex and breaks native joins/foreign keys.
* Logical Support: Excellent. Natively supports Table Partitioning (e.g., partitioning an orders table by month). All logical shards live on the same physical node.
* Physical Support: Terrible out-of-the-box. Native Postgres/MySQL do not handle physical sharding across multiple servers. Avoid physical sharding in SQL unless absolutely forced by scale. Rely on logical partitioning on a single massive machine first.

### Document Stores (MongoDB, Couchbase)

* **Thought Process:** Choose this when data is hierarchical, rapidly evolving, or when avoiding expensive distributed joins by denormalizing data into a single document.
* **Workloads:** Read-heavy, content management, user profiles.
* **Indexing Mechanism (B-Tree):** Like relational DBs, most document stores (e.g., MongoDB's WiredTiger engine) use **B-Trees** for both primary and secondary indexes.
* **Scaling:** Scales horizontally out of the box via sharding.
* Logical & Physical Support: Natively supports both as a cohesive system.
* You define a logical Shard Key. MongoDB splits the data into logical "chunks." A separate routing service called mongos automatically distributes and rebalances these logical chunks across your physical "Shard Clusters."
* Use Hashed Sharding for an even distribution of write loads, or Ranged Sharding if your application frequently queries sequential data (e.g., querying users by age ranges).

### Key-Value Stores (DynamoDB, Redis)

* **Thought Process:** Use this when data is accessed exclusively via a primary key. No complex queries, aggregations, or joins. Acts like a distributed Hash Map.
* **Workloads:** Highly concurrent reads and writes. Session storage, rate limiting, leaderboards.
* **Indexing Mechanism (Hash Index / B-Tree):** Uses **Consistent Hashing** to distribute data across nodes. Local lookups often use **Hash Indexes** for O(1) retrieval on the partition key. Secondary indexes (like DynamoDB GSIs) often utilize B-Trees under the hood.
* **Scaling:** Scales horizontally infinitely and automatically.
* Logical Support: You define the logical partition via the Partition Key.
* Physical Support: Completely abstracted by AWS. You have zero visibility or control over the physical nodes.

### Wide-Column Stores (Cassandra, HBase)

* **Thought Process:** Designed for extreme write-heavy workloads and time-series data.
* **Workloads:** IoT telemetry, activity feeds, logging.
* **Indexing Mechanism (LSM Tree):** Uses **Log-Structured Merge-Trees (LSM Trees)**. Writes are strictly append-only (sequential I/O) into an in-memory `MemTable`, which is flushed to immutable `SSTables` on disk. This allows for blazing fast, lock-free writes. Reads are slower but optimized using **Bloom Filters** to quickly check if an SSTable contains the requested key before hitting disk.
* **Scaling:** Masterless, peer-to-peer architecture. Linear horizontal scaling. Tunes Consistency vs. Availability.
* Logical & Physical Support: Natively integrated via Consistent Hashing.
* Cassandra uses a "Token Ring." When you insert data, it hashes the Partition Key to generate a token (Logical Sharding). The ring is divided among your physical nodes. The token's value mathematically dictates exactly which physical node owns that data.

---

## 3. Interview Tips & Tricks

* **The B-Tree vs. LSM Tree distinction is a massive senior signal.** If the system is write-heavy (like an analytics ingester), explicitly state: "We need an LSM-tree based database like Cassandra because B-tree updates will cause write amplification and bottleneck on random I/O."
* **Default to Postgres:** If unsure, use Postgres. State that modern Postgres handles JSON and large scale well, and you would only introduce the operational complexity of distributed NoSQL if access patterns strictly demand it.
* **Explicit CAP Theorem Trade-offs:** When proposing DynamoDB or Cassandra, explicitly declare you are trading strong consistency for availability and partition tolerance.

---

## 4. Summary

Match the storage engine to the access pattern and the physical constraints of the hardware. Use B-Tree relational databases for read-heavy, ACID-compliant domains. Use LSM-Tree wide-column databases for extreme write-throughput. Document and Key-Value stores fill the gaps for flexible schemas and O(1) primary key access, respectively.
