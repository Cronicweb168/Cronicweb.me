public class ComparisonWithEquals {
    public static void main(String[] args) {
        // Using == operator (compares references/memory addresses)
        System.out.println("=== Demonstrating == operator ===");
        String str1 = new String("Hello");
        String str2 = new String("Hello");
        String str3 = str1;

        System.out.println("str1 = new String(\"Hello\")");
        System.out.println("str2 = new String(\"Hello\")");
        System.out.println("str3 = str1");
        System.out.println();

        System.out.println("str1 == str2: " + (str1 == str2)); // false - different objects
        System.out.println("str1 == str3: " + (str1 == str3)); // true - same reference
        System.out.println();

        // Using .equals() method (compares content/values)
        System.out.println("=== Demonstrating .equals() method ===");
        System.out.println("str1.equals(str2): " + str1.equals(str2)); // true - same content
        System.out.println("str1.equals(str3): " + str1.equals(str3)); // true - same content
        System.out.println();

        // String literals (stored in String pool)
        System.out.println("=== String Literals (String Pool) ===");
        String literal1 = "World";
        String literal2 = "World";

        System.out.println("literal1 = \"World\"");
        System.out.println("literal2 = \"World\"");
        System.out.println();

        System.out.println("literal1 == literal2: " + (literal1 == literal2)); // true - same reference in pool
        System.out.println("literal1.equals(literal2): " + literal1.equals(literal2)); // true - same content
        System.out.println();

        // Custom object example
        System.out.println("=== Custom Object Example ===");
        Person person1 = new Person("Alice", 25);
        Person person2 = new Person("Alice", 25);
        Person person3 = person1;

        System.out.println("person1 = new Person(\"Alice\", 25)");
        System.out.println("person2 = new Person(\"Alice\", 25)");
        System.out.println("person3 = person1");
        System.out.println();

        System.out.println("person1 == person2: " + (person1 == person2)); // false - different objects
        System.out.println("person1 == person3: " + (person1 == person3)); // true - same reference
        System.out.println("person1.equals(person2): " + person1.equals(person2)); // true - equals() overridden
        System.out.println("person1.equals(person3): " + person1.equals(person3)); // true
    }
}

class Person {
    private String name;
    private int age;

    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }

    // Overriding equals() to compare content
    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        Person person = (Person) obj;
        return age == person.age && name.equals(person.name);
    }

    @Override
    public int hashCode() {
        return name.hashCode() + age;
    }
}
