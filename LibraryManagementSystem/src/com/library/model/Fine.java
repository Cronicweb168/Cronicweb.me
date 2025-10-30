package com.library.model;

import java.sql.Timestamp;

public class Fine {
    private int fineId;
    private int userId;
    private int borrowId;
    private double fineAmount;
    private double paidAmount;
    private Status status;
    private Timestamp createdAt;
    private Timestamp updatedAt;

    // Additional fields for joined queries
    private String userName;
    private String bookTitle;

    public enum Status {
        PENDING, PAID, PARTIAL
    }

    // Constructors
    public Fine() {
    }

    public Fine(int userId, int borrowId, double fineAmount) {
        this.userId = userId;
        this.borrowId = borrowId;
        this.fineAmount = fineAmount;
        this.paidAmount = 0.0;
        this.status = Status.PENDING;
    }

    // Getters and Setters
    public int getFineId() {
        return fineId;
    }

    public void setFineId(int fineId) {
        this.fineId = fineId;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public int getBorrowId() {
        return borrowId;
    }

    public void setBorrowId(int borrowId) {
        this.borrowId = borrowId;
    }

    public double getFineAmount() {
        return fineAmount;
    }

    public void setFineAmount(double fineAmount) {
        this.fineAmount = fineAmount;
    }

    public double getPaidAmount() {
        return paidAmount;
    }

    public void setPaidAmount(double paidAmount) {
        this.paidAmount = paidAmount;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }

    public Timestamp getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Timestamp updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getBookTitle() {
        return bookTitle;
    }

    public void setBookTitle(String bookTitle) {
        this.bookTitle = bookTitle;
    }

    public double getRemainingAmount() {
        return fineAmount - paidAmount;
    }

    @Override
    public String toString() {
        return "Fine{" +
                "fineId=" + fineId +
                ", userId=" + userId +
                ", borrowId=" + borrowId +
                ", fineAmount=" + fineAmount +
                ", paidAmount=" + paidAmount +
                ", status=" + status +
                ", userName='" + userName + '\'' +
                ", bookTitle='" + bookTitle + '\'' +
                '}';
    }
}
