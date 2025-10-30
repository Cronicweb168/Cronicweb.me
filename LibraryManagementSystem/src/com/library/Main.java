package com.library;

import com.library.model.User;
import com.library.service.LibraryService;
import com.library.ui.AdminMenu;
import com.library.ui.StudentMenu;
import com.library.util.DatabaseConnection;

import java.util.Scanner;

public class Main {

    private static LibraryService libraryService = new LibraryService();
    private static Scanner scanner = new Scanner(System.in);

    public static void main(String[] args) {
        System.out.println("========================================");
        System.out.println("  LIBRARY MANAGEMENT SYSTEM");
        System.out.println("  Fine Tracking & Book Management");
        System.out.println("========================================\n");

        // Test database connection
        if (!DatabaseConnection.testConnection()) {
            System.err.println("Failed to connect to database!");
            System.err.println("Please check your database configuration in DatabaseConnection.java");
            System.err.println("Make sure MySQL is running and the database 'library_management' exists.");
            System.err.println("Run the schema.sql file to create the database and tables.");
            return;
        }

        System.out.println("Database connection successful!\n");

        // Main application loop
        while (true) {
            displayMainMenu();
            int choice = getIntInput();

            switch (choice) {
                case 1:
                    login();
                    break;
                case 2:
                    signup();
                    break;
                case 3:
                    System.out.println("\nThank you for using Library Management System!");
                    System.out.println("Goodbye!");
                    scanner.close();
                    System.exit(0);
                    break;
                default:
                    System.out.println("Invalid choice! Please try again.\n");
            }
        }
    }

    private static void displayMainMenu() {
        System.out.println("========================================");
        System.out.println("           MAIN MENU");
        System.out.println("========================================");
        System.out.println("1. Login");
        System.out.println("2. Student Signup");
        System.out.println("3. Exit");
        System.out.println("========================================");
        System.out.print("Enter your choice: ");
    }

    private static void login() {
        System.out.println("\n--- User Login ---");
        scanner.nextLine(); // consume newline

        System.out.print("Username: ");
        String username = scanner.nextLine();

        System.out.print("Password: ");
        String password = scanner.nextLine();

        User user = libraryService.login(username, password);

        if (user != null) {
            // Route to appropriate menu based on role
            if (user.getRole() == User.Role.ADMIN) {
                AdminMenu adminMenu = new AdminMenu(libraryService, scanner, user);
                adminMenu.displayMenu();
            } else {
                StudentMenu studentMenu = new StudentMenu(libraryService, scanner, user);
                studentMenu.displayMenu();
            }
        }

        System.out.println(); // blank line after logout
    }

    private static void signup() {
        System.out.println("\n--- Student Signup ---");
        scanner.nextLine(); // consume newline

        System.out.print("Username: ");
        String username = scanner.nextLine();

        System.out.print("Password: ");
        String password = scanner.nextLine();

        System.out.print("Full Name: ");
        String fullName = scanner.nextLine();

        System.out.print("Email: ");
        String email = scanner.nextLine();

        System.out.print("Phone: ");
        String phone = scanner.nextLine();

        boolean success = libraryService.registerStudent(username, password, fullName, email, phone);

        if (success) {
            System.out.println("\nYou can now login with your credentials.\n");
        } else {
            System.out.println(); // blank line
        }
    }

    private static int getIntInput() {
        while (true) {
            try {
                return scanner.nextInt();
            } catch (Exception e) {
                System.out.print("Invalid input! Please enter a number: ");
                scanner.nextLine(); // clear buffer
            }
        }
    }
}
