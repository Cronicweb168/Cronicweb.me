package com.library.dao;

import com.library.model.BorrowedBook;
import com.library.util.DatabaseConnection;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class BorrowedBookDAO {

    /**
     * Borrow a book
     */
    public boolean borrowBook(BorrowedBook borrowedBook) {
        String sql = "INSERT INTO borrowed_books (user_id, book_id, borrow_date, due_date, status) VALUES (?, ?, ?, ?, ?)";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            pstmt.setInt(1, borrowedBook.getUserId());
            pstmt.setInt(2, borrowedBook.getBookId());
            pstmt.setDate(3, borrowedBook.getBorrowDate());
            pstmt.setDate(4, borrowedBook.getDueDate());
            pstmt.setString(5, borrowedBook.getStatus().name());

            int affectedRows = pstmt.executeUpdate();

            if (affectedRows > 0) {
                try (ResultSet generatedKeys = pstmt.getGeneratedKeys()) {
                    if (generatedKeys.next()) {
                        borrowedBook.setBorrowId(generatedKeys.getInt(1));
                    }
                }
                return true;
            }
        } catch (SQLException e) {
            System.err.println("Error borrowing book: " + e.getMessage());
            e.printStackTrace();
        }
        return false;
    }

    /**
     * Return a book
     */
    public boolean returnBook(int borrowId, Date returnDate, double fineAmount) {
        String sql = "UPDATE borrowed_books SET return_date = ?, fine_amount = ?, status = 'RETURNED' WHERE borrow_id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setDate(1, returnDate);
            pstmt.setDouble(2, fineAmount);
            pstmt.setInt(3, borrowId);

            return pstmt.executeUpdate() > 0;
        } catch (SQLException e) {
            System.err.println("Error returning book: " + e.getMessage());
            e.printStackTrace();
        }
        return false;
    }

    /**
     * Get borrowed book by ID
     */
    public BorrowedBook getBorrowedBookById(int borrowId) {
        String sql = "SELECT bb.*, b.title as book_title, b.author as book_author, u.full_name as user_name " +
                     "FROM borrowed_books bb " +
                     "JOIN books b ON bb.book_id = b.book_id " +
                     "JOIN users u ON bb.user_id = u.user_id " +
                     "WHERE bb.borrow_id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setInt(1, borrowId);
            ResultSet rs = pstmt.executeQuery();

            if (rs.next()) {
                return extractBorrowedBookFromResultSet(rs);
            }
        } catch (SQLException e) {
            System.err.println("Error getting borrowed book by ID: " + e.getMessage());
            e.printStackTrace();
        }
        return null;
    }

    /**
     * Get all borrowed books by user
     */
    public List<BorrowedBook> getBorrowedBooksByUser(int userId) {
        List<BorrowedBook> borrowedBooks = new ArrayList<>();
        String sql = "SELECT bb.*, b.title as book_title, b.author as book_author " +
                     "FROM borrowed_books bb " +
                     "JOIN books b ON bb.book_id = b.book_id " +
                     "WHERE bb.user_id = ? AND bb.status = 'BORROWED' " +
                     "ORDER BY bb.due_date";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setInt(1, userId);
            ResultSet rs = pstmt.executeQuery();

            while (rs.next()) {
                borrowedBooks.add(extractBorrowedBookFromResultSet(rs));
            }
        } catch (SQLException e) {
            System.err.println("Error getting borrowed books by user: " + e.getMessage());
            e.printStackTrace();
        }
        return borrowedBooks;
    }

    /**
     * Get all currently borrowed books (not returned)
     */
    public List<BorrowedBook> getAllBorrowedBooks() {
        List<BorrowedBook> borrowedBooks = new ArrayList<>();
        String sql = "SELECT bb.*, b.title as book_title, b.author as book_author, u.full_name as user_name " +
                     "FROM borrowed_books bb " +
                     "JOIN books b ON bb.book_id = b.book_id " +
                     "JOIN users u ON bb.user_id = u.user_id " +
                     "WHERE bb.status = 'BORROWED' " +
                     "ORDER BY bb.due_date";

        try (Connection conn = DatabaseConnection.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {

            while (rs.next()) {
                borrowedBooks.add(extractBorrowedBookFromResultSet(rs));
            }
        } catch (SQLException e) {
            System.err.println("Error getting all borrowed books: " + e.getMessage());
            e.printStackTrace();
        }
        return borrowedBooks;
    }

    /**
     * Get overdue books
     */
    public List<BorrowedBook> getOverdueBooks() {
        List<BorrowedBook> overdueBooks = new ArrayList<>();
        String sql = "SELECT bb.*, b.title as book_title, b.author as book_author, u.full_name as user_name " +
                     "FROM borrowed_books bb " +
                     "JOIN books b ON bb.book_id = b.book_id " +
                     "JOIN users u ON bb.user_id = u.user_id " +
                     "WHERE bb.status = 'BORROWED' AND bb.due_date < CURDATE() " +
                     "ORDER BY bb.due_date";

        try (Connection conn = DatabaseConnection.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {

            while (rs.next()) {
                overdueBooks.add(extractBorrowedBookFromResultSet(rs));
            }
        } catch (SQLException e) {
            System.err.println("Error getting overdue books: " + e.getMessage());
            e.printStackTrace();
        }
        return overdueBooks;
    }

    /**
     * Get active borrow count for a user
     */
    public int getActiveBorrowCount(int userId) {
        String sql = "SELECT COUNT(*) FROM borrowed_books WHERE user_id = ? AND status = 'BORROWED'";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setInt(1, userId);
            ResultSet rs = pstmt.executeQuery();

            if (rs.next()) {
                return rs.getInt(1);
            }
        } catch (SQLException e) {
            System.err.println("Error getting active borrow count: " + e.getMessage());
            e.printStackTrace();
        }
        return 0;
    }

    /**
     * Get total borrowed books count (all time)
     */
    public int getTotalBorrowedCount() {
        String sql = "SELECT COUNT(*) FROM borrowed_books";

        try (Connection conn = DatabaseConnection.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {

            if (rs.next()) {
                return rs.getInt(1);
            }
        } catch (SQLException e) {
            System.err.println("Error getting total borrowed count: " + e.getMessage());
            e.printStackTrace();
        }
        return 0;
    }

    /**
     * Get currently active borrowed books count
     */
    public int getActiveBorrowedCount() {
        String sql = "SELECT COUNT(*) FROM borrowed_books WHERE status = 'BORROWED'";

        try (Connection conn = DatabaseConnection.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {

            if (rs.next()) {
                return rs.getInt(1);
            }
        } catch (SQLException e) {
            System.err.println("Error getting active borrowed count: " + e.getMessage());
            e.printStackTrace();
        }
        return 0;
    }

    /**
     * Extract BorrowedBook object from ResultSet
     */
    private BorrowedBook extractBorrowedBookFromResultSet(ResultSet rs) throws SQLException {
        BorrowedBook borrowedBook = new BorrowedBook();
        borrowedBook.setBorrowId(rs.getInt("borrow_id"));
        borrowedBook.setUserId(rs.getInt("user_id"));
        borrowedBook.setBookId(rs.getInt("book_id"));
        borrowedBook.setBorrowDate(rs.getDate("borrow_date"));
        borrowedBook.setDueDate(rs.getDate("due_date"));
        borrowedBook.setReturnDate(rs.getDate("return_date"));
        borrowedBook.setFineAmount(rs.getDouble("fine_amount"));
        borrowedBook.setStatus(BorrowedBook.Status.valueOf(rs.getString("status")));
        borrowedBook.setCreatedAt(rs.getTimestamp("created_at"));
        borrowedBook.setUpdatedAt(rs.getTimestamp("updated_at"));

        // Additional fields from joins
        try {
            borrowedBook.setBookTitle(rs.getString("book_title"));
            borrowedBook.setBookAuthor(rs.getString("book_author"));
        } catch (SQLException e) {
            // Fields may not be present in all queries
        }

        try {
            borrowedBook.setUserName(rs.getString("user_name"));
        } catch (SQLException e) {
            // Field may not be present in all queries
        }

        return borrowedBook;
    }
}
