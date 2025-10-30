package com.library.dao;

import com.library.model.Fine;
import com.library.util.DatabaseConnection;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class FineDAO {

    /**
     * Create a new fine
     */
    public boolean createFine(Fine fine) {
        String sql = "INSERT INTO fines (user_id, borrow_id, fine_amount, paid_amount, status) VALUES (?, ?, ?, ?, ?)";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            pstmt.setInt(1, fine.getUserId());
            pstmt.setInt(2, fine.getBorrowId());
            pstmt.setDouble(3, fine.getFineAmount());
            pstmt.setDouble(4, fine.getPaidAmount());
            pstmt.setString(5, fine.getStatus().name());

            int affectedRows = pstmt.executeUpdate();

            if (affectedRows > 0) {
                try (ResultSet generatedKeys = pstmt.getGeneratedKeys()) {
                    if (generatedKeys.next()) {
                        fine.setFineId(generatedKeys.getInt(1));
                    }
                }
                return true;
            }
        } catch (SQLException e) {
            System.err.println("Error creating fine: " + e.getMessage());
            e.printStackTrace();
        }
        return false;
    }

    /**
     * Pay fine (full or partial)
     */
    public boolean payFine(int fineId, double paymentAmount) {
        String sql = "UPDATE fines SET paid_amount = paid_amount + ?, status = ? WHERE fine_id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            // Get current fine details
            Fine fine = getFineById(fineId);
            if (fine == null) {
                return false;
            }

            double newPaidAmount = fine.getPaidAmount() + paymentAmount;
            String status;

            if (newPaidAmount >= fine.getFineAmount()) {
                status = "PAID";
            } else if (newPaidAmount > 0) {
                status = "PARTIAL";
            } else {
                status = "PENDING";
            }

            pstmt.setDouble(1, paymentAmount);
            pstmt.setString(2, status);
            pstmt.setInt(3, fineId);

            return pstmt.executeUpdate() > 0;
        } catch (SQLException e) {
            System.err.println("Error paying fine: " + e.getMessage());
            e.printStackTrace();
        }
        return false;
    }

    /**
     * Get fine by ID
     */
    public Fine getFineById(int fineId) {
        String sql = "SELECT f.*, u.full_name as user_name, b.title as book_title " +
                     "FROM fines f " +
                     "JOIN users u ON f.user_id = u.user_id " +
                     "JOIN borrowed_books bb ON f.borrow_id = bb.borrow_id " +
                     "JOIN books b ON bb.book_id = b.book_id " +
                     "WHERE f.fine_id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setInt(1, fineId);
            ResultSet rs = pstmt.executeQuery();

            if (rs.next()) {
                return extractFineFromResultSet(rs);
            }
        } catch (SQLException e) {
            System.err.println("Error getting fine by ID: " + e.getMessage());
            e.printStackTrace();
        }
        return null;
    }

    /**
     * Get all fines for a user
     */
    public List<Fine> getFinesByUser(int userId) {
        List<Fine> fines = new ArrayList<>();
        String sql = "SELECT f.*, u.full_name as user_name, b.title as book_title " +
                     "FROM fines f " +
                     "JOIN users u ON f.user_id = u.user_id " +
                     "JOIN borrowed_books bb ON f.borrow_id = bb.borrow_id " +
                     "JOIN books b ON bb.book_id = b.book_id " +
                     "WHERE f.user_id = ? " +
                     "ORDER BY f.created_at DESC";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setInt(1, userId);
            ResultSet rs = pstmt.executeQuery();

            while (rs.next()) {
                fines.add(extractFineFromResultSet(rs));
            }
        } catch (SQLException e) {
            System.err.println("Error getting fines by user: " + e.getMessage());
            e.printStackTrace();
        }
        return fines;
    }

    /**
     * Get pending fines for a user
     */
    public List<Fine> getPendingFinesByUser(int userId) {
        List<Fine> fines = new ArrayList<>();
        String sql = "SELECT f.*, u.full_name as user_name, b.title as book_title " +
                     "FROM fines f " +
                     "JOIN users u ON f.user_id = u.user_id " +
                     "JOIN borrowed_books bb ON f.borrow_id = bb.borrow_id " +
                     "JOIN books b ON bb.book_id = b.book_id " +
                     "WHERE f.user_id = ? AND f.status IN ('PENDING', 'PARTIAL') " +
                     "ORDER BY f.created_at DESC";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setInt(1, userId);
            ResultSet rs = pstmt.executeQuery();

            while (rs.next()) {
                fines.add(extractFineFromResultSet(rs));
            }
        } catch (SQLException e) {
            System.err.println("Error getting pending fines by user: " + e.getMessage());
            e.printStackTrace();
        }
        return fines;
    }

    /**
     * Get all pending fines (for admin)
     */
    public List<Fine> getAllPendingFines() {
        List<Fine> fines = new ArrayList<>();
        String sql = "SELECT f.*, u.full_name as user_name, b.title as book_title " +
                     "FROM fines f " +
                     "JOIN users u ON f.user_id = u.user_id " +
                     "JOIN borrowed_books bb ON f.borrow_id = bb.borrow_id " +
                     "JOIN books b ON bb.book_id = b.book_id " +
                     "WHERE f.status IN ('PENDING', 'PARTIAL') " +
                     "ORDER BY f.created_at DESC";

        try (Connection conn = DatabaseConnection.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {

            while (rs.next()) {
                fines.add(extractFineFromResultSet(rs));
            }
        } catch (SQLException e) {
            System.err.println("Error getting all pending fines: " + e.getMessage());
            e.printStackTrace();
        }
        return fines;
    }

    /**
     * Get all fines (for admin)
     */
    public List<Fine> getAllFines() {
        List<Fine> fines = new ArrayList<>();
        String sql = "SELECT f.*, u.full_name as user_name, b.title as book_title " +
                     "FROM fines f " +
                     "JOIN users u ON f.user_id = u.user_id " +
                     "JOIN borrowed_books bb ON f.borrow_id = bb.borrow_id " +
                     "JOIN books b ON bb.book_id = b.book_id " +
                     "ORDER BY f.created_at DESC";

        try (Connection conn = DatabaseConnection.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {

            while (rs.next()) {
                fines.add(extractFineFromResultSet(rs));
            }
        } catch (SQLException e) {
            System.err.println("Error getting all fines: " + e.getMessage());
            e.printStackTrace();
        }
        return fines;
    }

    /**
     * Get total fine amount collected
     */
    public double getTotalFinesCollected() {
        String sql = "SELECT SUM(paid_amount) FROM fines";

        try (Connection conn = DatabaseConnection.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {

            if (rs.next()) {
                return rs.getDouble(1);
            }
        } catch (SQLException e) {
            System.err.println("Error getting total fines collected: " + e.getMessage());
            e.printStackTrace();
        }
        return 0.0;
    }

    /**
     * Get total pending fine amount
     */
    public double getTotalPendingFines() {
        String sql = "SELECT SUM(fine_amount - paid_amount) FROM fines WHERE status IN ('PENDING', 'PARTIAL')";

        try (Connection conn = DatabaseConnection.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {

            if (rs.next()) {
                return rs.getDouble(1);
            }
        } catch (SQLException e) {
            System.err.println("Error getting total pending fines: " + e.getMessage());
            e.printStackTrace();
        }
        return 0.0;
    }

    /**
     * Extract Fine object from ResultSet
     */
    private Fine extractFineFromResultSet(ResultSet rs) throws SQLException {
        Fine fine = new Fine();
        fine.setFineId(rs.getInt("fine_id"));
        fine.setUserId(rs.getInt("user_id"));
        fine.setBorrowId(rs.getInt("borrow_id"));
        fine.setFineAmount(rs.getDouble("fine_amount"));
        fine.setPaidAmount(rs.getDouble("paid_amount"));
        fine.setStatus(Fine.Status.valueOf(rs.getString("status")));
        fine.setCreatedAt(rs.getTimestamp("created_at"));
        fine.setUpdatedAt(rs.getTimestamp("updated_at"));

        // Additional fields from joins
        try {
            fine.setUserName(rs.getString("user_name"));
            fine.setBookTitle(rs.getString("book_title"));
        } catch (SQLException e) {
            // Fields may not be present in all queries
        }

        return fine;
    }
}
