# Java == vs .equals() Examples

This directory contains Java programs demonstrating the difference between `==` operator and `.equals()` method.

## The Key Difference

- **`==` operator**: Compares **reference equality** (memory addresses)
  - Returns `true` if both references point to the exact same object in memory

- **`.equals()` method**: Compares **content equality** (logical equality)
  - Returns `true` if both objects have the same content/value
  - Must be properly overridden in custom classes

## Files

### 1. SimpleComparison.java
A straightforward example showing the basic difference between `==` and `.equals()` with String objects.

**Run:**
```bash
javac SimpleComparison.java
java SimpleComparison
```

### 2. ComparisonWithEquals.java
A comprehensive example showing:
- String comparison with `new String()`
- String literals and the String pool
- Custom object comparison with overridden `.equals()`

**Run:**
```bash
javac ComparisonWithEquals.java
java ComparisonWithEquals
```

## Quick Summary

```java
String a = new String("Hello");
String b = new String("Hello");

a == b           // false (different objects in memory)
a.equals(b)      // true (same content)
```

## When to Use Which?

- Use `==` for:
  - Comparing primitive types (int, char, boolean, etc.)
  - Checking if two references point to the same object
  - Comparing with `null`

- Use `.equals()` for:
  - Comparing String content
  - Comparing objects by their content/value
  - Any logical equality check
