package com.library.ui;

import com.library.model.Book;
import com.library.model.BorrowedBook;
import com.library.model.Fine;
import com.library.model.User;
import com.library.service.LibraryService;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Scanner;

public class StudentMenu {

    private LibraryService libraryService;
    private Scanner scanner;
    private User currentUser;

    public StudentMenu(LibraryService libraryService, Scanner scanner, User currentUser) {
        this.libraryService = libraryService;
        this.scanner = scanner;
        this.currentUser = currentUser;
    }

    public void displayMenu() {
        while (true) {
            System.out.println("\n========================================");
            System.out.println("       STUDENT DASHBOARD");
            System.out.println("========================================");
            System.out.println("Welcome, " + currentUser.getFullName());
            System.out.println("----------------------------------------");
            System.out.println("1. View Available Books");
            System.out.println("2. Search Book");
            System.out.println("3. Borrow Book");
            System.out.println("4. Return Book");
            System.out.println("5. View My Borrowed Books");
            System.out.println("6. View My Fines");
            System.out.println("7. Pay Fine");
            System.out.println("8. Update Profile");
            System.out.println("9. Change Password");
            System.out.println("0. Logout");
            System.out.println("========================================");
            System.out.print("Enter your choice: ");

            int choice = getIntInput();

            switch (choice) {
                case 1:
                    viewAvailableBooks();
                    break;
                case 2:
                    searchBook();
                    break;
                case 3:
                    borrowBook();
                    break;
                case 4:
                    returnBook();
                    break;
                case 5:
                    viewMyBorrowedBooks();
                    break;
                case 6:
                    viewMyFines();
                    break;
                case 7:
                    payFine();
                    break;
                case 8:
                    updateProfile();
                    break;
                case 9:
                    changePassword();
                    break;
                case 0:
                    System.out.println("Logging out...");
                    return;
                default:
                    System.out.println("Invalid choice! Please try again.");
            }
        }
    }

    private void viewAvailableBooks() {
        System.out.println("\n========================================");
        System.out.println("        AVAILABLE BOOKS");
        System.out.println("========================================");

        List<Book> books = libraryService.getAvailableBooks();

        if (books.isEmpty()) {
            System.out.println("No books available at the moment.");
            return;
        }

        System.out.printf("%-5s %-30s %-20s %-15s %-10s%n",
                "ID", "Title", "Author", "Category", "Available");
        System.out.println("---------------------------------------------------------------------------------");

        for (Book book : books) {
            System.out.printf("%-5d %-30s %-20s %-15s %-10d%n",
                    book.getBookId(),
                    truncate(book.getTitle(), 30),
                    truncate(book.getAuthor(), 20),
                    truncate(book.getCategory(), 15),
                    book.getAvailableCopies());
        }
    }

    private void searchBook() {
        System.out.println("\n--- Search Book ---");
        System.out.println("1. Search by Title");
        System.out.println("2. Search by Author");
        System.out.print("Enter your choice: ");
        int choice = getIntInput();

        scanner.nextLine(); // consume newline
        List<Book> books;

        switch (choice) {
            case 1:
                System.out.print("Enter book title: ");
                String title = scanner.nextLine();
                books = libraryService.searchBooksByTitle(title);
                break;
            case 2:
                System.out.print("Enter author name: ");
                String author = scanner.nextLine();
                books = libraryService.searchBooksByAuthor(author);
                break;
            default:
                System.out.println("Invalid choice!");
                return;
        }

        if (books.isEmpty()) {
            System.out.println("No books found.");
            return;
        }

        System.out.println("\nSearch Results:");
        System.out.printf("%-5s %-30s %-20s %-15s %-10s%n",
                "ID", "Title", "Author", "Category", "Available");
        System.out.println("---------------------------------------------------------------------------------");

        for (Book book : books) {
            System.out.printf("%-5d %-30s %-20s %-15s %-10d%n",
                    book.getBookId(),
                    truncate(book.getTitle(), 30),
                    truncate(book.getAuthor(), 20),
                    truncate(book.getCategory(), 15),
                    book.getAvailableCopies());
        }
    }

    private void borrowBook() {
        System.out.println("\n--- Borrow Book ---");
        System.out.print("Enter book ID to borrow: ");
        int bookId = getIntInput();

        Book book = libraryService.getBookById(bookId);
        if (book == null) {
            System.out.println("Book not found!");
            return;
        }

        System.out.println("\nBook Details:");
        System.out.println("Title: " + book.getTitle());
        System.out.println("Author: " + book.getAuthor());
        System.out.println("Available Copies: " + book.getAvailableCopies());

        scanner.nextLine(); // consume newline
        System.out.print("\nConfirm borrow? (yes/no): ");
        String confirmation = scanner.nextLine();

        if (confirmation.equalsIgnoreCase("yes")) {
            libraryService.borrowBook(currentUser.getUserId(), bookId);
        } else {
            System.out.println("Borrow cancelled.");
        }
    }

    private void returnBook() {
        System.out.println("\n--- Return Book ---");

        List<BorrowedBook> borrowedBooks = libraryService.getUserBorrowedBooks(currentUser.getUserId());

        if (borrowedBooks.isEmpty()) {
            System.out.println("You have no borrowed books.");
            return;
        }

        System.out.println("\nYour Borrowed Books:");
        System.out.printf("%-5s %-30s %-20s %-12s %-12s %-10s%n",
                "ID", "Title", "Author", "Borrow Date", "Due Date", "Status");
        System.out.println("---------------------------------------------------------------------------------------------------");

        for (BorrowedBook bb : borrowedBooks) {
            String status = isOverdue(bb) ? "OVERDUE" : "ACTIVE";
            System.out.printf("%-5d %-30s %-20s %-12s %-12s %-10s%n",
                    bb.getBorrowId(),
                    truncate(bb.getBookTitle(), 30),
                    truncate(bb.getBookAuthor(), 20),
                    bb.getBorrowDate(),
                    bb.getDueDate(),
                    status);
        }

        System.out.print("\nEnter borrow ID to return: ");
        int borrowId = getIntInput();

        libraryService.returnBook(borrowId);
    }

    private void viewMyBorrowedBooks() {
        System.out.println("\n========================================");
        System.out.println("       MY BORROWED BOOKS");
        System.out.println("========================================");

        List<BorrowedBook> borrowedBooks = libraryService.getUserBorrowedBooks(currentUser.getUserId());

        if (borrowedBooks.isEmpty()) {
            System.out.println("You have no borrowed books.");
            return;
        }

        System.out.printf("%-5s %-30s %-20s %-12s %-12s %-10s%n",
                "ID", "Title", "Author", "Borrow Date", "Due Date", "Status");
        System.out.println("---------------------------------------------------------------------------------------------------");

        for (BorrowedBook bb : borrowedBooks) {
            String status;
            if (isOverdue(bb)) {
                long daysLate = ChronoUnit.DAYS.between(bb.getDueDate().toLocalDate(), LocalDate.now());
                status = "OVERDUE (" + daysLate + " days)";
            } else {
                long daysRemaining = ChronoUnit.DAYS.between(LocalDate.now(), bb.getDueDate().toLocalDate());
                status = daysRemaining + " days left";
            }

            System.out.printf("%-5d %-30s %-20s %-12s %-12s %-10s%n",
                    bb.getBorrowId(),
                    truncate(bb.getBookTitle(), 30),
                    truncate(bb.getBookAuthor(), 20),
                    bb.getBorrowDate(),
                    bb.getDueDate(),
                    status);
        }
    }

    private void viewMyFines() {
        System.out.println("\n========================================");
        System.out.println("           MY FINES");
        System.out.println("========================================");

        List<Fine> fines = libraryService.getUserFines(currentUser.getUserId());

        if (fines.isEmpty()) {
            System.out.println("You have no fines. Great job!");
            return;
        }

        double totalPending = 0.0;

        System.out.printf("%-5s %-30s %-12s %-12s %-12s %-10s%n",
                "ID", "Book", "Fine Amt", "Paid Amt", "Remaining", "Status");
        System.out.println("-------------------------------------------------------------------------------------------");

        for (Fine fine : fines) {
            System.out.printf("%-5d %-30s %-12.2f %-12.2f %-12.2f %-10s%n",
                    fine.getFineId(),
                    truncate(fine.getBookTitle(), 30),
                    fine.getFineAmount(),
                    fine.getPaidAmount(),
                    fine.getRemainingAmount(),
                    fine.getStatus());

            if (fine.getStatus() != Fine.Status.PAID) {
                totalPending += fine.getRemainingAmount();
            }
        }

        System.out.println("-------------------------------------------------------------------------------------------");
        System.out.printf("Total Pending: Rs. %.2f%n", totalPending);
    }

    private void payFine() {
        System.out.println("\n--- Pay Fine ---");

        List<Fine> pendingFines = libraryService.getUserPendingFines(currentUser.getUserId());

        if (pendingFines.isEmpty()) {
            System.out.println("You have no pending fines.");
            return;
        }

        System.out.println("\nYour Pending Fines:");
        System.out.printf("%-5s %-30s %-12s %-12s %-12s%n",
                "ID", "Book", "Fine Amt", "Paid Amt", "Remaining");
        System.out.println("---------------------------------------------------------------------------------");

        for (Fine fine : pendingFines) {
            System.out.printf("%-5d %-30s %-12.2f %-12.2f %-12.2f%n",
                    fine.getFineId(),
                    truncate(fine.getBookTitle(), 30),
                    fine.getFineAmount(),
                    fine.getPaidAmount(),
                    fine.getRemainingAmount());
        }

        System.out.print("\nEnter fine ID to pay: ");
        int fineId = getIntInput();

        System.out.print("Enter amount to pay: Rs. ");
        double amount = getDoubleInput();

        libraryService.payFine(fineId, amount);
    }

    private void updateProfile() {
        System.out.println("\n--- Update Profile ---");
        scanner.nextLine(); // consume newline

        System.out.println("\nCurrent Details:");
        System.out.println("Full Name: " + currentUser.getFullName());
        System.out.println("Email: " + currentUser.getEmail());
        System.out.println("Phone: " + currentUser.getPhone());

        System.out.println("\nEnter new details (press Enter to keep current value):");

        System.out.print("Full Name [" + currentUser.getFullName() + "]: ");
        String fullName = scanner.nextLine();
        if (!fullName.isEmpty()) currentUser.setFullName(fullName);

        System.out.print("Email [" + currentUser.getEmail() + "]: ");
        String email = scanner.nextLine();
        if (!email.isEmpty()) currentUser.setEmail(email);

        System.out.print("Phone [" + currentUser.getPhone() + "]: ");
        String phone = scanner.nextLine();
        if (!phone.isEmpty()) currentUser.setPhone(phone);

        if (libraryService.updateUserProfile(currentUser)) {
            System.out.println("Profile updated successfully!");
        } else {
            System.out.println("Failed to update profile.");
        }
    }

    private void changePassword() {
        System.out.println("\n--- Change Password ---");
        scanner.nextLine(); // consume newline

        System.out.print("Enter old password: ");
        String oldPassword = scanner.nextLine();

        System.out.print("Enter new password: ");
        String newPassword = scanner.nextLine();

        System.out.print("Confirm new password: ");
        String confirmPassword = scanner.nextLine();

        if (!newPassword.equals(confirmPassword)) {
            System.out.println("New passwords do not match!");
            return;
        }

        if (libraryService.changePassword(currentUser.getUserId(), oldPassword, newPassword)) {
            System.out.println("Password changed successfully!");
        } else {
            System.out.println("Failed to change password.");
        }
    }

    private boolean isOverdue(BorrowedBook borrowedBook) {
        LocalDate dueDate = borrowedBook.getDueDate().toLocalDate();
        return LocalDate.now().isAfter(dueDate);
    }

    private String truncate(String str, int length) {
        if (str == null) return "";
        return str.length() <= length ? str : str.substring(0, length - 3) + "...";
    }

    private int getIntInput() {
        while (true) {
            try {
                return scanner.nextInt();
            } catch (Exception e) {
                System.out.print("Invalid input! Please enter a number: ");
                scanner.nextLine(); // clear buffer
            }
        }
    }

    private double getDoubleInput() {
        while (true) {
            try {
                return scanner.nextDouble();
            } catch (Exception e) {
                System.out.print("Invalid input! Please enter a valid amount: ");
                scanner.nextLine(); // clear buffer
            }
        }
    }
}
