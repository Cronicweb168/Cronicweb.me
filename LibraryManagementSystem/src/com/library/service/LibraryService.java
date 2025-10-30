package com.library.service;

import com.library.dao.*;
import com.library.model.*;

import java.sql.Date;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

public class LibraryService {

    private UserDAO userDAO;
    private BookDAO bookDAO;
    private BorrowedBookDAO borrowedBookDAO;
    private FineDAO fineDAO;

    // Fine calculation constants
    private static final int LOAN_PERIOD_DAYS = 7;
    private static final double FINE_PER_DAY = 5.0;
    private static final int MAX_BOOKS_PER_USER = 3;

    public LibraryService() {
        this.userDAO = new UserDAO();
        this.bookDAO = new BookDAO();
        this.borrowedBookDAO = new BorrowedBookDAO();
        this.fineDAO = new FineDAO();
    }

    // ==================== User Management ====================

    /**
     * Register a new student user
     */
    public boolean registerStudent(String username, String password, String fullName, String email, String phone) {
        // Check if username already exists
        if (userDAO.usernameExists(username)) {
            System.out.println("Username already exists!");
            return false;
        }

        // Check if email already exists
        if (userDAO.emailExists(email)) {
            System.out.println("Email already exists!");
            return false;
        }

        User user = new User(username, password, fullName, email, phone, User.Role.STUDENT);
        boolean result = userDAO.createUser(user);

        if (result) {
            System.out.println("Student registered successfully!");
        } else {
            System.out.println("Failed to register student.");
        }

        return result;
    }

    /**
     * Authenticate user login
     */
    public User login(String username, String password) {
        User user = userDAO.authenticateUser(username, password);

        if (user != null) {
            System.out.println("Login successful! Welcome, " + user.getFullName());
        } else {
            System.out.println("Invalid username or password!");
        }

        return user;
    }

    /**
     * Update user profile
     */
    public boolean updateUserProfile(User user) {
        return userDAO.updateUser(user);
    }

    /**
     * Change user password
     */
    public boolean changePassword(int userId, String oldPassword, String newPassword) {
        User user = userDAO.getUserById(userId);
        if (user == null) {
            System.out.println("User not found!");
            return false;
        }

        if (!user.getPassword().equals(oldPassword)) {
            System.out.println("Old password is incorrect!");
            return false;
        }

        return userDAO.updatePassword(userId, newPassword);
    }

    // ==================== Book Management ====================

    /**
     * Add a new book (Admin only)
     */
    public boolean addBook(String title, String author, String isbn, String category, int totalCopies) {
        Book book = new Book(title, author, isbn, category, totalCopies, totalCopies);
        boolean result = bookDAO.addBook(book);

        if (result) {
            System.out.println("Book added successfully!");
        } else {
            System.out.println("Failed to add book.");
        }

        return result;
    }

    /**
     * Update book details (Admin only)
     */
    public boolean updateBook(Book book) {
        boolean result = bookDAO.updateBook(book);

        if (result) {
            System.out.println("Book updated successfully!");
        } else {
            System.out.println("Failed to update book.");
        }

        return result;
    }

    /**
     * Delete a book (Admin only)
     */
    public boolean deleteBook(int bookId) {
        boolean result = bookDAO.deleteBook(bookId);

        if (result) {
            System.out.println("Book deleted successfully!");
        } else {
            System.out.println("Failed to delete book. It may be currently borrowed.");
        }

        return result;
    }

    /**
     * Get all books
     */
    public List<Book> getAllBooks() {
        return bookDAO.getAllBooks();
    }

    /**
     * Get available books
     */
    public List<Book> getAvailableBooks() {
        return bookDAO.getAvailableBooks();
    }

    /**
     * Search books by title
     */
    public List<Book> searchBooksByTitle(String title) {
        return bookDAO.searchBooksByTitle(title);
    }

    /**
     * Search books by author
     */
    public List<Book> searchBooksByAuthor(String author) {
        return bookDAO.searchBooksByAuthor(author);
    }

    /**
     * Get book by ID
     */
    public Book getBookById(int bookId) {
        return bookDAO.getBookById(bookId);
    }

    // ==================== Borrow & Return Management ====================

    /**
     * Borrow a book
     */
    public boolean borrowBook(int userId, int bookId) {
        // Check if user has reached maximum borrow limit
        int activeBorrows = borrowedBookDAO.getActiveBorrowCount(userId);
        if (activeBorrows >= MAX_BOOKS_PER_USER) {
            System.out.println("You have reached the maximum limit of " + MAX_BOOKS_PER_USER + " borrowed books!");
            return false;
        }

        // Check if book is available
        Book book = bookDAO.getBookById(bookId);
        if (book == null) {
            System.out.println("Book not found!");
            return false;
        }

        if (book.getAvailableCopies() <= 0) {
            System.out.println("Book is not available for borrowing!");
            return false;
        }

        // Calculate dates
        LocalDate today = LocalDate.now();
        LocalDate dueDate = today.plusDays(LOAN_PERIOD_DAYS);

        // Create borrowed book record
        BorrowedBook borrowedBook = new BorrowedBook(
            userId,
            bookId,
            Date.valueOf(today),
            Date.valueOf(dueDate)
        );

        // Borrow the book and decrease available copies
        boolean borrowSuccess = borrowedBookDAO.borrowBook(borrowedBook);
        if (borrowSuccess) {
            boolean decreaseSuccess = bookDAO.decreaseAvailableCopies(bookId);
            if (decreaseSuccess) {
                System.out.println("Book borrowed successfully!");
                System.out.println("Due date: " + dueDate);
                return true;
            }
        }

        System.out.println("Failed to borrow book.");
        return false;
    }

    /**
     * Return a book with automatic fine calculation
     */
    public boolean returnBook(int borrowId) {
        BorrowedBook borrowedBook = borrowedBookDAO.getBorrowedBookById(borrowId);

        if (borrowedBook == null) {
            System.out.println("Borrowed book record not found!");
            return false;
        }

        if (borrowedBook.getStatus() == BorrowedBook.Status.RETURNED) {
            System.out.println("Book has already been returned!");
            return false;
        }

        // Calculate fine
        LocalDate today = LocalDate.now();
        LocalDate dueDate = borrowedBook.getDueDate().toLocalDate();
        double fineAmount = calculateFine(dueDate, today);

        // Return the book
        boolean returnSuccess = borrowedBookDAO.returnBook(borrowId, Date.valueOf(today), fineAmount);

        if (returnSuccess) {
            // Increase available copies
            bookDAO.increaseAvailableCopies(borrowedBook.getBookId());

            System.out.println("Book returned successfully!");

            // Create fine record if applicable
            if (fineAmount > 0) {
                Fine fine = new Fine(borrowedBook.getUserId(), borrowId, fineAmount);
                fineDAO.createFine(fine);
                System.out.println("Late return! Fine amount: Rs. " + fineAmount);
            } else {
                System.out.println("No fine. Book returned on time.");
            }

            return true;
        }

        System.out.println("Failed to return book.");
        return false;
    }

    /**
     * Calculate fine based on overdue days
     */
    private double calculateFine(LocalDate dueDate, LocalDate returnDate) {
        long overdueDays = ChronoUnit.DAYS.between(dueDate, returnDate);

        if (overdueDays > 0) {
            return overdueDays * FINE_PER_DAY;
        }

        return 0.0;
    }

    /**
     * Get borrowed books for a user
     */
    public List<BorrowedBook> getUserBorrowedBooks(int userId) {
        return borrowedBookDAO.getBorrowedBooksByUser(userId);
    }

    /**
     * Get all currently borrowed books (Admin)
     */
    public List<BorrowedBook> getAllBorrowedBooks() {
        return borrowedBookDAO.getAllBorrowedBooks();
    }

    /**
     * Get overdue books (Admin)
     */
    public List<BorrowedBook> getOverdueBooks() {
        return borrowedBookDAO.getOverdueBooks();
    }

    // ==================== Fine Management ====================

    /**
     * Get pending fines for a user
     */
    public List<Fine> getUserPendingFines(int userId) {
        return fineDAO.getPendingFinesByUser(userId);
    }

    /**
     * Get all fines for a user
     */
    public List<Fine> getUserFines(int userId) {
        return fineDAO.getFinesByUser(userId);
    }

    /**
     * Get all pending fines (Admin)
     */
    public List<Fine> getAllPendingFines() {
        return fineDAO.getAllPendingFines();
    }

    /**
     * Pay fine
     */
    public boolean payFine(int fineId, double amount) {
        Fine fine = fineDAO.getFineById(fineId);

        if (fine == null) {
            System.out.println("Fine record not found!");
            return false;
        }

        double remainingAmount = fine.getRemainingAmount();

        if (amount > remainingAmount) {
            System.out.println("Payment amount exceeds remaining fine amount!");
            System.out.println("Remaining fine: Rs. " + remainingAmount);
            return false;
        }

        boolean result = fineDAO.payFine(fineId, amount);

        if (result) {
            double newRemaining = remainingAmount - amount;
            System.out.println("Fine payment successful!");
            System.out.println("Amount paid: Rs. " + amount);
            System.out.println("Remaining fine: Rs. " + newRemaining);
        } else {
            System.out.println("Failed to process fine payment.");
        }

        return result;
    }

    // ==================== Reports & Statistics ====================

    /**
     * Generate library report (Admin)
     */
    public void generateLibraryReport() {
        int totalBooks = bookDAO.getTotalBookCount();
        int activeBorrows = borrowedBookDAO.getActiveBorrowedCount();
        double totalFinesCollected = fineDAO.getTotalFinesCollected();
        double totalPendingFines = fineDAO.getTotalPendingFines();

        System.out.println("\n========== LIBRARY REPORT ==========");
        System.out.println("Total Books: " + totalBooks);
        System.out.println("Currently Borrowed: " + activeBorrows);
        System.out.println("Total Fines Collected: Rs. " + totalFinesCollected);
        System.out.println("Total Pending Fines: Rs. " + totalPendingFines);
        System.out.println("====================================\n");
    }

    /**
     * Export fine report to file (Admin)
     */
    public boolean exportFineReport(String filename) {
        List<Fine> allFines = fineDAO.getAllFines();

        try (java.io.PrintWriter writer = new java.io.PrintWriter(filename)) {
            writer.println("========== FINE REPORT ==========");
            writer.println("Generated on: " + LocalDate.now());
            writer.println("=================================\n");

            for (Fine fine : allFines) {
                writer.println("Fine ID: " + fine.getFineId());
                writer.println("User: " + fine.getUserName());
                writer.println("Book: " + fine.getBookTitle());
                writer.println("Fine Amount: Rs. " + fine.getFineAmount());
                writer.println("Paid Amount: Rs. " + fine.getPaidAmount());
                writer.println("Remaining: Rs. " + fine.getRemainingAmount());
                writer.println("Status: " + fine.getStatus());
                writer.println("----------------------------\n");
            }

            System.out.println("Fine report exported successfully to: " + filename);
            return true;
        } catch (Exception e) {
            System.err.println("Error exporting fine report: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }
}
