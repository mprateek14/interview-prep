# Connection Pools

A Connection Pool is a cache of pre-established, open database connections maintained in the memory of your Node.js application.

## How It Works

- **On startup:** The driver opens a fixed number of connections (e.g., 20)
- **When a query is needed:** The route handler requests a connection from the pool
- **If a connection is free:** The pool hands it over. The query runs. The connection is returned to the pool, remaining open for the next request
- **If all connections are busy:** The pool queues the incoming request in memory and waits until an existing query finishes and returns a connection

This guarantees your database never receives more than exactly 20 concurrent queries, flattening the load curve and preventing crashes.

## Dependency Injection (Recommended)

Dependency Injection should be the preferred way of initializing and using DB. This will make writing test cases easier and prevent race conditions since it forces you to build a Directed Acyclic Graph (DAG) of dependencies. Everything flows in one direction: App Startup → Infrastructure (DB) → Repositories → Services → Controllers. It forces you to be explicit about what every file needs to function.

### DI Method

```javascript
// 1. infrastructure/database.js
// The pool configuration remains identical. It is a singleton resource.
import pg from 'pg';

export const createPool = () => {
  const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });

  pool.on('error', (err) => {
    console.error('Fatal database pool error', err);
    process.exit(-1);
  });

  return pool;
};

// 2. repositories/userRepository.js
// THE FUNCTIONAL REPOSITORY FACTORY
export const createUserRepository = (dbPool) => {
  
  // The dbPool is trapped in this closure. 
  // It is completely private and immune to context loss.
  const getAllUsers = async () => {
    const result = await dbPool.query('SELECT id, username FROM users');
    return result.rows;
  };

  const getUserById = async (id) => {
    const result = await dbPool.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0];
  };

  // Return the pure data-access functions
  return { getAllUsers, getUserById };
};

// 3. The Composition Root (index.js)
import express from 'express';
import { createPool } from './infrastructure/database.js';
import { createUserRepository } from './repositories/userRepository.js';

const app = express();

// Initialize the single connection pool
const globalPool = createPool();

// Inject the pool into the repository factory
const userRepository = createUserRepository(globalPool);

// You can now safely destructure the repository methods!
// This is IMPOSSIBLE with classes unless you bind them first.
const { getAllUsers } = userRepository;

app.get('/api/users', async (req, res, next) => {
  try {
    const users = await getAllUsers(); 
    res.json(users);
  } catch (err) {
    next(err);
  }
});
```


---

## Singleton Method

```javascript
const mysql = require("mysql2/promise");
const config = require("../config");

let _db;

const initDB = async () => {
    const connection = await mysql.createConnection(config.db);
    _db = connection
}

const getDB = () => {
    if(!_db){
        throw new Error("No db exist")
    }
    return _db;
}

async function query(sql, params) {
  const connection = getDb();
  const [results] = await connection.execute(sql, params);

  return results;
}

module.exports = {
  query,
  getDB,
  initDB
};
```

### ⚠️ Race Condition Risk

If a controller imports `getDB` and tries to use it before `initDB()` has finished resolving its Promise at application startup, it will create a race condition and the app crashes with your "No db exist" error.
