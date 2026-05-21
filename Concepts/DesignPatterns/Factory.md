# Factory Design Pattern

## The Problem Statement
When your application's business logic is filled with the `new` keyword to instantiate objects, it becomes tightly coupled to those specific concrete classes. If business requirements change and you need to introduce new object types (e.g., adding SMS notifications to an existing Email notification system), you are forced to hunt down and modify the core business logic. This violates the Open/Closed Principle and makes the system rigid.

## Brief Theory
The Factory pattern is a creational design pattern that abstracts the object creation process. 

Instead of the client creating objects directly, it delegates this responsibility to a dedicated "Factory" class. The Factory takes an identifier (like a string or enum), evaluates it, and returns the fully constructed object. To make this work seamlessly, all objects created by the Factory must implement a shared interface, allowing the client to interact with any returned object uniformly.

---

## Code Example: The Interface
This is the contract. The client will only interact with this interface, remaining completely unaware of the underlying concrete implementations.

```java
public interface Notification {
    void send(String message);
}
```

Concrete Classes

```java
public class EmailNotification implements Notification {
    @Override
    public void send(String message) {
        System.out.println("Sending Email: " + message);
    }
}

public class SMSNotification implements Notification {
    @Override
    public void send(String message) {
        System.out.println("Sending SMS: " + message);
    }
}
```

Factory Creation

```java
public class NotificationFactory {
    
    // Returns the Interface, hiding the concrete class instantiation
    public static Notification createNotification(String type) {
        if (type == null) {
            return null;
        }
        
        switch (type.toUpperCase()) {
            case "EMAIL":
                return new EmailNotification();
            case "SMS":
                return new SMSNotification();
            default:
                throw new IllegalArgumentException("Unknown notification type: " + type);
        }
    }
}
```

Consume Factory

```java
public class NotificationService {
    public void alertUser(String channel, String message) {
        // Request the object from the factory
        Notification notification = NotificationFactory.createNotification(channel);
        
        // Interact purely through the shared interface
        notification.send(message);
    }
}

// Execution
public class Main {
    public static void main(String[] args) {
        NotificationService service = new NotificationService();
        
        service.alertUser("SMS", "Your OTP is 1234");
        service.alertUser("EMAIL", "Welcome to the platform");
    }
}
```


## JavaScript

```javascript
class EmailNotification {
  send(message) {
    console.log(`Sending Email: ${message}`);
  }
}

class SMSNotification {
  send(message) {
    console.log(`Sending SMS: ${message}`);
  }
}
```

```javascript
class NotificationFactory {
  static createNotification(type) {
    if (!type) return null;
    
    switch (type.toUpperCase()) {
      case 'EMAIL':
        return new EmailNotification();
      case 'SMS':
        return new SMSNotification();
      default:
        throw new Error(`Unknown notification type: ${type}`);
    }
  }
}
```

```javascript
class NotificationService {
  alertUser(channel, message) {
    // 1. Request the object from the factory
    const notification = NotificationFactory.createNotification(channel);
    
    // 2. Interact purely through the expected method signature
    notification.send(message);
  }
}

// Execution
const service = new NotificationService();
service.alertUser("SMS", "Your OTP is 1234");
service.alertUser("EMAIL", "Welcome to the platform");
```