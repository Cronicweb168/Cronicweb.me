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

public class AdminMenu {

    private LibraryService libraryService;
    private Scanner scanner;
    private User currentUser;

    public AdminMenu(LibraryService libraryService, Scanner scanner, User currentUser) {
        this.libraryService = libraryService;
        this.scanner = scanner;
        this.currentUser = currentUser;
    }

    public void displayMenu() {
        while (true) {
            System.out.println("\n========================================");
            System.out.println("       ADMIN DASHBOARD");
            System.out.println("========================================");
            System.out.println("Welcome, " + currentUser.getFullName());
            System.out.println("----------------------------------------");
            System.out.println("1.  Add New Book");
            System.out.println("2.  Update Book Details");
            System.out.println("3.  Delete Book");
            System.out.println("4.  View All Books");
            System.out.println("5.  View All Issued Books");
            System.out.println("6.  View Overdue Books");
            System.out.println("7.  View All Pending Fines");
            System.out.println("8.  Generate Library Report");
            System.out.println("9.  Export Fine Report");
            System.out.println("10. Search Book");
            System.out.println("0.  Logout");
            System.out.println("========================================");
            System.out.print("Enter your choice: ");

            int choice = getIntInput();

            switch (choice) {
                case 1:
                    addNewBook();
                    break;
                case 2:
                    updateBook();
                    break;
                case 3:
                    deleteBook();
                    break;
                case 4:
                    viewAllBooks();
                    break;
                case 5:
                    viewAllIssuedBooks();
                    break;
                case 6:
                    viewOverdueBooks();
                    break;
                case 7:
                    viewAllPendingFines();
                    break;
                case 8:
                    libraryService.generateLibraryReport();
                    break;
                case 9:
                    exportFineReport();
                    break;
                case 10:
                    searchBook();
                    break;
                case 0:
                    System.out.println("Logging out...");
                    return;
                default:
                    System.out.println("Invalid choice! Please try again.");
            }
        }
    }

    private void addNewBook() {
        System.out.println("\n--- Add New Book ---");
        scanner.nextLine(); // consume newline

        System.out.print("Enter book title: ");
        String title = scanner.nextLine();

        System.out.print("Enter author name: ");
        String author = scanner.nextLine();

        System.out.print("Enter ISBN: ");
        String isbn = scanner.nextLine();

        System.out.print("Enter category: ");
        String category = scanner.nextLine();

        System.out.print("Enter total copies: ");
        int totalCopies = getIntInput();

        libraryService.addBook(title, author, isbn, category, totalCopies);
    }

    private void updateBook() {
        System.out.println("\n--- Update Book Details ---");
        System.out.print("Enter book ID to update: ");
        int bookId = getIntInput();

        Book book = libraryService.getBookById(bookId);
        if (book == null) {
            System.out.println("Book not found!");
            return;
        }

        System.out.println("\nCurrent Details:");
        displayBookDetails(book);

        scanner.nextLine(); // consume newline
        System.out.println("\nEnter new details (press Enter to keep current value):");

        System.out.print("Title [" + book.getTitle() + "]: ");
        String title = scanner.nextLine();
        if (!title.isEmpty()) book.setTitle(title);

        System.out.print("Author [" + book.getAuthor() + "]: ");
        String author = scanner.nextLine();
        if (!author.isEmpty()) book.setAuthor(author);

        System.out.print("ISBN [" + book.getIsbn() + "]: ");
        String isbn = scanner.nextLine();
        if (!isbn.isEmpty()) book.setIsbn(isbn);

        System.out.print("Category [" + book.getCategory() + "]: ");
        String category = scanner.nextLine();
        if (!category.isEmpty()) book.setCategory(category);

        System.out.print("Total Copies [" + book.getTotalCopies() + "]: ");
        String totalCopiesStr = scanner.nextLine();
        if (!totalCopiesStr.isEmpty()) {
            int totalCopies = Integer.parseInt(totalCopiesStr);
            int difference = totalCopies - book.getTotalCopies();
            book.setTotalCopies(totalCopies);
            book.setAvailableCopies(book.getAvailableCopies() + difference);
        }

        libraryService.updateBook(book);
    }

    private void deleteBook() {
        System.out.println("\n--- Delete Book ---");
        System.out.print("Enter book ID to delete: ");
        int bookId = getIntInput();

        Book book = libraryService.getBookById(bookId);
        if (book == null) {
            System.out.println("Book not found!");
            return;
        }

        displayBookDetails(book);
        scanner.nextLine(); // consume newline

        System.out.print("Are you sure you want to delete this book? (yes/no): ");
        String confirmation = scanner.nextLine();

        if (confirmation.equalsIgnoreCase("yes")) {
            libraryService.deleteBook(bookId);
        } else {
            System.out.println("Deletion cancelled.");
        }
    }

    private void viewAllBooks() {
        System.out.println("\n========================================");
        System.out.println("           ALL BOOKS");
        System.out.println("========================================");

        List<Book> books = libraryService.getAllBooks();

        if (books.isEmpty()) {
            System.out.println("No books available.");
            return;
        }

        System.out.printf("%-5s %-30s %-20s %-15s %-15s %-10s %-10s%n",
                "ID", "Title", "Author", "ISBN", "Category", "Total", "Available");
        System.out.println("------------------------------------------------------------------------------------------------------------------------");

        for (Book book : books) {
            System.out.printf("%-5d %-30s %-20s %-15s %-15s %-10d %-10d%n",
                    book.getBookId(),
                    truncate(book.getTitle(), 30),
                    truncate(book.getAuthor(), 20),
                    book.getIsbn(),
                    truncate(book.getCategory(), 15),
                    book.getTotalCopies(),
                    book.getAvailableCopies());
        }
    }

    private void viewAllIssuedBooks() {
        System.out.println("\n========================================");
        System.out.println("        ALL ISSUED BOOKS");
        System.out.println("========================================");

        List<BorrowedBook> borrowedBooks = libraryService.getAllBorrowedBooks();

        if (borrowedBooks.isEmpty()) {
            System.out.println("No books are currently issued.");
            return;
        }

        System.out.printf("%-5s %-20s %-30s %-12s %-12s %-10s%n",
                "ID", "Student", "Book Title", "Borrow Date", "Due Date", "Status");
        System.out.println("--------------------------------------------------------------------------------------------------------");

        for (BorrowedBook bb : borrowedBooks) {
            String status = isOverdue(bb) ? "OVERDUE" : "ACTIVE";
            System.out.printf("%-5d %-20s %-30s %-12s %-12s %-10s%n",
                    bb.getBorrowId(),
                    truncate(bb.getUserName(), 20),
                    truncate(bb.getBookTitle(), 30),
                    bb.getBorrowDate(),
                    bb.getDueDate(),
                    status);
        }
    }

    private void viewOverdueBooks() {
        System.out.println("\n========================================");
        System.out.println("         OVERDUE BOOKS");
        System.out.println("========================================");

        List<BorrowedBook> overdueBooks = libraryService.getOverdueBooks();

        if (overdueBooks.isEmpty()) {
            System.out.println("No overdue books.");
            return;
        }

        System.out.printf("%-5s %-20s %-30s %-12s %-12s %-10s%n",
                "ID", "Student", "Book Title", "Borrow Date", "Due Date", "Days Late");
        System.out.println("--------------------------------------------------------------------------------------------------------");

        for (BorrowedBook bb : overdueBooks) {
            long daysLate = ChronoUnit.DAYS.between(bb.getDueDate().toLocalDate(), LocalDate.now());
            System.out.printf("%-5d %-20s %-30s %-12s %-12s %-10d%n",
                    bb.getBorrowId(),
                    truncate(bb.getUserName(), 20),
                    truncate(bb.getBookTitle(), 30),
                    bb.getBorrowDate(),
                    bb.getDueDate(),
                    daysLate);
        }
    }

    private void viewAllPendingFines() {
        System.out.println("\n========================================");
        System.out.println("       ALL PENDING FINES");
        System.out.println("========================================");

        List<Fine> fines = libraryService.getAllPendingFines();

        if (fines.isEmpty()) {
            System.out.println("No pending fines.");
            return;
        }

        System.out.printf("%-5s %-20s %-30s %-12s %-12s %-12s %-10s%n",
                "ID", "Student", "Book", "Fine Amt", "Paid Amt", "Remaining", "Status");
        System.out.println("---------------------------------------------------------------------------------------------------------------");

        for (Fine fine : fines) {
            System.out.printf("%-5d %-20s %-30s %-12.2f %-12.2f %-12.2f %-10s%n",
                    fine.getFineId(),
                    truncate(fine.getUserName(), 20),
                    truncate(fine.getBookTitle(), 30),
                    fine.getFineAmount(),
                    fine.getPaidAmount(),
                    fine.getRemainingAmount(),
                    fine.getStatus());
        }
    }

    private void exportFineReport() {
        System.out.println("\n--- Export Fine Report ---");
        scanner.nextLine(); // consume newline

        System.out.print("Enter filename (e.g., fine_report.txt): ");
        String filename = scanner.nextLine();

        libraryService.exportFineReport(filename);
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

    private void displayBookDetails(Book book) {
        System.out.println("\nBook Details:");
        System.out.println("ID: " + book.getBookId());
        System.out.println("Title: " + book.getTitle());
        System.out.println("Author: " + book.getAuthor());
        System.out.println("ISBN: " + book.getIsbn());
        System.out.println("Category: " + book.getCategory());
        System.out.println("Total Copies: " + book.getTotalCopies());
        System.out.println("Available Copies: " + book.getAvailableCopies());
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
}
