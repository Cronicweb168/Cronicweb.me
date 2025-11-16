public class SimpleComparison {
    public static void main(String[] args) {
        System.out.println("====================================");
        System.out.println("== vs .equals() - Simple Example");
        System.out.println("====================================\n");

        // Example 1: String comparison
        String a = new String("Java");
        String b = new String("Java");

        System.out.println("String a = new String(\"Java\")");
        System.out.println("String b = new String(\"Java\")");
        System.out.println();

        System.out.println("Using == operator:");
        System.out.println("  a == b: " + (a == b));
        System.out.println("  → Result: false");
        System.out.println("  → Why? Because == compares memory addresses");
        System.out.println("  → a and b are two different objects in memory\n");

        System.out.println("Using .equals() method:");
        System.out.println("  a.equals(b): " + a.equals(b));
        System.out.println("  → Result: true");
        System.out.println("  → Why? Because .equals() compares the content");
        System.out.println("  → Both strings contain \"Java\"\n");

        System.out.println("====================================");
        System.out.println("KEY TAKEAWAY:");
        System.out.println("====================================");
        System.out.println("→ Use == to check if two references point to the SAME object");
        System.out.println("→ Use .equals() to check if two objects have the SAME content");
        System.out.println("====================================");
    }
}
