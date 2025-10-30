-- Library Management System Database Schema

-- Create database
CREATE DATABASE IF NOT EXISTS library_management;
USE library_management;

-- Users table (both Admin and Students)
CREATE TABLE IF NOT EXISTS users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(15),
    role ENUM('ADMIN', 'STUDENT') DEFAULT 'STUDENT',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Books table
CREATE TABLE IF NOT EXISTS books (
    book_id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    author VARCHAR(100) NOT NULL,
    isbn VARCHAR(20) UNIQUE,
    category VARCHAR(50),
    total_copies INT DEFAULT 1,
    available_copies INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Borrowed Books table
CREATE TABLE IF NOT EXISTS borrowed_books (
    borrow_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    book_id INT NOT NULL,
    borrow_date DATE NOT NULL,
    due_date DATE NOT NULL,
    return_date DATE,
    fine_amount DECIMAL(10, 2) DEFAULT 0.00,
    status ENUM('BORROWED', 'RETURNED') DEFAULT 'BORROWED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(book_id) ON DELETE CASCADE
);

-- Fines table
CREATE TABLE IF NOT EXISTS fines (
    fine_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    borrow_id INT NOT NULL,
    fine_amount DECIMAL(10, 2) NOT NULL,
    paid_amount DECIMAL(10, 2) DEFAULT 0.00,
    status ENUM('PENDING', 'PAID', 'PARTIAL') DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (borrow_id) REFERENCES borrowed_books(borrow_id) ON DELETE CASCADE
);

-- Insert default admin account (username: admin, password: admin123)
INSERT INTO users (username, password, full_name, email, role)
VALUES ('admin', 'admin123', 'System Administrator', 'admin@library.com', 'ADMIN')
ON DUPLICATE KEY UPDATE username=username;

-- Sample books data
INSERT INTO books (title, author, isbn, category, total_copies, available_copies) VALUES
('Java Programming', 'James Gosling', 'ISBN001', 'Programming', 5, 5),
('Data Structures', 'Robert Sedgewick', 'ISBN002', 'Computer Science', 3, 3),
('Database Systems', 'Ramez Elmasri', 'ISBN003', 'Database', 4, 4),
('Software Engineering', 'Ian Sommerville', 'ISBN004', 'Engineering', 3, 3),
('Introduction to Algorithms', 'Thomas Cormen', 'ISBN005', 'Algorithms', 4, 4)
ON DUPLICATE KEY UPDATE title=title;

-- Create indexes for better performance
CREATE INDEX idx_username ON users(username);
CREATE INDEX idx_user_role ON users(role);
CREATE INDEX idx_book_title ON books(title);
CREATE INDEX idx_book_author ON books(author);
CREATE INDEX idx_borrow_status ON borrowed_books(status);
CREATE INDEX idx_borrow_user ON borrowed_books(user_id);
CREATE INDEX idx_fine_status ON fines(status);
