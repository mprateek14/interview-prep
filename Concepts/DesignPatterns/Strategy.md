# Strategy Design Pattern

## The Problem Statement

When a class contains multiple ways to perform a specific behavior (like sorting data, calculating taxes, or processing payments), developers often rely on massive `if-else` or `switch` statements to route the logic. This creates a bloated "God class" that is difficult to maintain. Every time a new variation of the behavior is added, the core business logic must be modified, violating the Open/Closed Principle and complicating unit testing.

## Brief Theory

The Strategy pattern is a behavioral design pattern that takes a family of algorithms, extracts them into their own separate, interchangeable classes, and lets the client dynamically swap them at runtime.

It requires three components:

1. **The Strategy Interface:** The common contract that all algorithms must follow.
2. **The Concrete Strategies:** The separate classes containing the actual algorithmic logic.
3. **The Context:** The core class that holds a reference to the strategy interface and delegates the work to it.

---

## Code Example: The Strategy Interface

This defines the behavior that will be swapped out dynamically.

```java
public interface PaymentStrategy {
    void pay(int amount);
}
```

Concrete Classes

```java
public class CreditCardPayment implements PaymentStrategy {
    @Override
    public void pay(int amount) {
        System.out.println("Paid ₹" + amount + " using Credit Card.");
    }
}

public class UPIPayment implements PaymentStrategy {
    @Override
    public void pay(int amount) {
        System.out.println("Paid ₹" + amount + " using UPI.");
    }
}
```

Context

```java
public class CheckoutService {
    private PaymentStrategy strategy;

    // Inject the strategy via constructor
    public CheckoutService(PaymentStrategy strategy) {
        this.strategy = strategy;
    }

    // Allow swapping the strategy at runtime
    public void setPaymentStrategy(PaymentStrategy strategy) {
        this.strategy = strategy;
    }

    public void processOrder(int amount) {
        // Delegate the work to the currently active strategy
        strategy.pay(amount);
    }
}
```

Consume Strategy

```java
public class Main {
    public static void main(String[] args) {
        // User selects UPI
        CheckoutService checkout = new CheckoutService(new UPIPayment());
        checkout.processOrder(1500); 

        // User changes their mind and selects Credit Card
        checkout.setPaymentStrategy(new CreditCardPayment());
        checkout.processOrder(1500);
    }
}
```

## Javascript

```javascript
// 1. The Strategies (just plain functions)
const creditCardStrategy = (amount) => {
  console.log(`Paid ₹${amount} using Credit Card.`);
};

const upiStrategy = (amount) => {
  console.log(`Paid ₹${amount} using UPI.`);
};

// 2. The Context (a higher-order function or a simple object)
const processOrder = (amount, paymentStrategy) => {
  // Execute the passed-in function
  paymentStrategy(amount);
};

// 3. Execution
processOrder(1500, upiStrategy);
processOrder(1500, creditCardStrategy);
```

---

## Strategy vs. Factory Pattern

### The Core Difference

* **Factory** is about **Creation**. It is responsible for bringing objects into existence. 
* **Strategy** is about **Behavior**. It is responsible for executing a specific algorithm or action using an object that already exists.

### Comparison Table

| Feature | Factory Pattern | Strategy Pattern |
| :--- | :--- | :--- |
| **Category** | Creational | Behavioral |
| **Primary Purpose** | To hide the `new` keyword and instantiation logic. | To hide the `if-else` logic of choosing an algorithm. |
| **What it Returns** | A newly created Object. | Usually nothing (executes a task) or a processed value. |
| **Client's Knowledge** | Client **asks** for an object using a simple string/enum. It doesn't know the concrete classes. | Client **provides** the concrete object (Strategy) to the context. |
| **Key Question** | *"Who should build this object for me?"* | *"How should this object behave right now?"* |

---

### Detailed Differences

#### 1. The Client's Role

* **In Factory:** The client code is lazy. It tells the Factory, "I need an SMS Notification. Build it and give it to me." The client relies entirely on the Factory's internal `switch` statement or registry to figure out *how* to instantiate the right class.
* **In Strategy:** The client code is in charge. It tells the Context, "I want to process a payment, and I am explicitly handing you the `UPIPayment` strategy to do it." The Context relies on the client to give it the correct behavior.

#### 2. Runtime Behavior

* **Factory:** Once the Factory returns an object (e.g., an `EmailNotification`), that object is fixed. It is just a data structure with methods.
* **Strategy:** The Context can dynamically swap its behavior *during* runtime. A `CheckoutService` can start with a `CreditCard` strategy, and if the network fails, it can immediately be given a `PayPal` strategy to try again.

#### 3. Structural Code Difference

**Factory (Calling for an object):**

```java
// Client asks for an object and gets it back
Notification obj = NotificationFactory.create("SMS");
obj.send("Hello");
```

**Strategy (Passing an algorithm):**

```java
// Client creates the context and passes the behavior INTO it
CheckoutService context = new CheckoutService(new UPIPayment());
context.process();
```
