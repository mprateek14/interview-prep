# Singleton Design Pattern

## The Problem Statement
In software design, you often need a central component (like a Logger or Configuration Manager) where every part of your application shares the exact same instance. If multiple instances are created, it leads to memory waste and resource conflicts (e.g., multiple objects trying to write to the same log file concurrently). The problem is ensuring a class can only be instantiated once while providing a safe, global access point to it.

## Brief Theory
The Singleton pattern is a creational design pattern that restricts the instantiation of a class to one single object. 

To achieve this, you must implement three core elements:
1. **A private static variable** to hold the single instance of the class.
2. **A private constructor** to prevent other classes from creating new instances using the `new` keyword.
3. **A public static method** (usually named `getInstance()`) to provide global access to that single instance.

---

## Code Example: Creating the Singleton

This example uses **Eager Initialization**, meaning the instance is created immediately when the class is loaded into memory. This approach is naturally thread-safe without requiring complex locking mechanisms.

```java
public class Logger {
    // 1. Static instance created immediately (Eager Initialization)
    private static Logger instance = new Logger();

    // 2. Private constructor blocks external instantiation
    private Logger() {
        System.out.println("Logger initialized. This only prints once.");
    }

    // 3. Public static getter provides global access
    public static Logger getInstance() {
        return instance;
    }

    // Business logic method
    public void logMessage(String message) {
        System.out.println("[LOG]: " + message);
    }
}
```

```java
public class UserService {
    public void createUser(String username) {
        // Request the global instance and use it
        Logger myLogger = Logger.getInstance();
        myLogger.logMessage("User created: " + username);
    }
}

public class PaymentService {
    public void processPayment(double amount) {
        // You can also consume the instance directly in one line (chaining)
        Logger.getInstance().logMessage("Payment processed for amount: " + amount);
    }
}
```

```java
public class Main {
    public static void main(String[] args) {
        Logger logger1 = Logger.getInstance();
        Logger logger2 = Logger.getInstance();

        // This will print 'true' because both variables point to the exact same memory address.
        System.out.println("Both are same " + (logger1 == logger2)); 
    }
}
```

## JavaScript

In Node.js and modern frontend environments (like React), the module system automatically caches imported files. If you create a simple object and export it, every other file that imports it receives the exact same instance in memory. You don't even need a class.

### Module Based

```javascript
// logger.js

// 1. Create a standard JavaScript object
const logger = {
  logMessage: function(message) {
    console.log(`[LOG]: ${message}`);
  }
};

// 2. Export the object itself, not a factory or constructor
export default logger;
```

```javascript
// userService.js
import logger from './logger.js';

export function createUser(username) {
  // Use the imported global instance
  logger.logMessage(`User created: ${username}`);
}
```

### Class Based

```javascript
// LoggerClass.js
class Logger {
  constructor() {
    // 1. Check if an instance is already cached on the class
    // A. INVISIBLE STEP: JavaScript creates a brand new, empty object 
    // and binds it to the keyword 'this'.
    // let this = {};

    // B. Your check: Does our cached instance already exist?
    // On the FIRST run, Logger.instance is undefined, so this is skipped.
    if (Logger.instance) {
      return Logger.instance; // Return the existing instance
    }
    
    // 2. If it doesn't exist, initialize it
    console.log("Logger initialized. This only prints once.");
    
    // 3. Cache the current instance on the class itself
    Logger.instance = this;
  }

  logMessage(message) {
    console.log(`[LOG]: ${message}`);
  }
}

// Instantiate it once and export that instance
const globalLogger = new Logger();
export default globalLogger;
```