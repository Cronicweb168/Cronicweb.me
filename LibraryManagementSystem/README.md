# Library Management and Fine Tracking System

A comprehensive console-based Library Management System built with Java and MySQL that automates book management, tracks issued and returned books, and calculates late fines for students.

## Project Overview

The Library Management System (LMS) automates the core functions of a library — such as managing books, tracking issued and returned books, and calculating late fines for students. This project creates a centralized system for both librarians (admins) and students (users) to manage and monitor library operations efficiently.

## Problem Statement

Libraries often face difficulties in maintaining proper book records and tracking due dates manually. Calculating late fees is also prone to human error. This project solves these issues by:

- Digitally recording book transactions
- Automatically computing fines based on return delays
- Enabling both librarian and student functionalities in a single console-based system

## Objectives

- To automate library book management using JDBC and MySQL
- To provide an easy interface for users to issue, return, and view books
- To allow librarians to manage the inventory of books
- To auto-calculate fines for late returns based on defined rules
- To store and manage student borrowing history efficiently
- To generate summary reports for librarians

## Features

### Admin (Librarian) Module
- **Admin Login** - Role-based secure access
- **Add New Book** - Insert new books into the system
- **Update Book Details** - Modify book title, author, or quantity
- **Delete Book** - Remove old or lost books from inventory
- **View All Books** - Display entire library catalog
- **View All Issued Books** - Shows currently borrowed books
- **View Overdue Books** - List all overdue books with days late
- **View Pending Fines** - Display all users with pending fines
- **Generate Library Report** - Total books, active borrows, fines collected
- **Export Fine Report** - Export fine list to a .txt file
- **Search Books** - Search by title or author

### Student Module
- **Signup/Login** - Create or access student account
- **View Available Books** - View books that can be borrowed
- **Search Books** - Search by title or author
- **Borrow Book** - Issue a book (max 3 active at a time)
- **Return Book** - Return issued book with auto fine calculation
- **View Borrowed Books** - Display currently issued books
- **View Fines** - See all fines and pending amounts
- **Pay Fine** - Clear fine from account (full or partial payment)
- **Update Profile** - Change personal information
- **Change Password** - Update account password

### Fine Management Module
- **Auto Fine Calculation** - Rs. 5 per day for late returns
- **7-Day Loan Period** - Books must be returned within 7 days
- **Fine Tracking** - Tracks pending, partial, and paid fines
- **Payment Processing** - Supports full and partial fine payments

## Technology Stack

- **Language**: Java (JDK 8 or higher)
- **Database**: MySQL 5.7 or higher
- **JDBC Driver**: MySQL Connector/J
- **Architecture**: Layered (DAO, Service, UI)

## Project Structure

```
LibraryManagementSystem/
├── src/
│   └── com/
│       └── library/
│           ├── model/              # Entity/Model classes
│           │   ├── User.java
│           │   ├── Book.java
│           │   ├── BorrowedBook.java
│           │   └── Fine.java
│           ├── dao/                # Data Access Objects
│           │   ├── UserDAO.java
│           │   ├── BookDAO.java
│           │   ├── BorrowedBookDAO.java
│           │   └── FineDAO.java
│           ├── service/            # Business Logic Layer
│           │   └── LibraryService.java
│           ├── ui/                 # Console UI
│           │   ├── AdminMenu.java
│           │   └── StudentMenu.java
│           ├── util/               # Utility classes
│           │   └── DatabaseConnection.java
│           └── Main.java           # Application entry point
├── database/
│   └── schema.sql                  # Database setup script
└── README.md
```

## Database Schema

### Tables

#### users
- `user_id` (Primary Key)
- `username` (Unique)
- `password`
- `full_name`
- `email` (Unique)
- `phone`
- `role` (ADMIN/STUDENT)
- `created_at`, `updated_at`

#### books
- `book_id` (Primary Key)
- `title`
- `author`
- `isbn` (Unique)
- `category`
- `total_copies`
- `available_copies`
- `created_at`, `updated_at`

#### borrowed_books
- `borrow_id` (Primary Key)
- `user_id` (Foreign Key)
- `book_id` (Foreign Key)
- `borrow_date`
- `due_date`
- `return_date`
- `fine_amount`
- `status` (BORROWED/RETURNED)
- `created_at`, `updated_at`

#### fines
- `fine_id` (Primary Key)
- `user_id` (Foreign Key)
- `borrow_id` (Foreign Key)
- `fine_amount`
- `paid_amount`
- `status` (PENDING/PAID/PARTIAL)
- `created_at`, `updated_at`

## Installation and Setup

### Prerequisites

1. **Java Development Kit (JDK) 8 or higher**
   ```bash
   java -version
   ```

2. **MySQL Server 5.7 or higher**
   ```bash
   mysql --version
   ```

3. **MySQL Connector/J (JDBC Driver)**
   - Download from: https://dev.mysql.com/downloads/connector/j/
   - Or use Maven/Gradle dependency

### Step 1: Clone or Download the Project

```bash
git clone <repository-url>
cd LibraryManagementSystem
```

### Step 2: Set Up the Database

1. Start MySQL server
2. Open MySQL command line or MySQL Workbench
3. Run the database schema script:

```bash
mysql -u root -p < database/schema.sql
```

Or manually execute the SQL file:

```sql
source /path/to/database/schema.sql
```

This will:
- Create the `library_management` database
- Create all required tables
- Insert a default admin account (username: `admin`, password: `admin123`)
- Insert sample books

### Step 3: Configure Database Connection

Edit `src/com/library/util/DatabaseConnection.java` and update the database credentials:

```java
private static final String URL = "jdbc:mysql://localhost:3306/library_management";
private static final String USER = "root";        // Your MySQL username
private static final String PASSWORD = "your_password";  // Your MySQL password
```

### Step 4: Add MySQL Connector JAR to Classpath

**Option A: Using Command Line**
```bash
# Compile
javac -cp ".:mysql-connector-java-8.0.x.jar" -d bin src/com/library/**/*.java

# Run
java -cp "bin:mysql-connector-java-8.0.x.jar" com.library.Main
```

**Option B: Using IDE (Eclipse/IntelliJ IDEA)**
1. Add MySQL Connector JAR to project libraries
2. Right-click on project → Build Path → Add External Archives
3. Select the MySQL Connector JAR file

### Step 5: Compile and Run

**Using Command Line:**

```bash
# Create bin directory if it doesn't exist
mkdir -p bin

# Compile (Linux/Mac)
javac -cp ".:lib/mysql-connector-java-8.0.x.jar" -d bin $(find src -name "*.java")

# Compile (Windows)
javac -cp ".;lib/mysql-connector-java-8.0.x.jar" -d bin src/com/library/**/*.java

# Run (Linux/Mac)
java -cp "bin:lib/mysql-connector-java-8.0.x.jar" com.library.Main

# Run (Windows)
java -cp "bin;lib/mysql-connector-java-8.0.x.jar" com.library.Main
```

**Using IDE:**
- Simply run `Main.java` as a Java application

## Usage Guide

### Default Admin Account
- **Username**: `admin`
- **Password**: `admin123`

### For Students

1. **Sign Up**
   - Choose option 2 from main menu
   - Enter required details (username, password, full name, email, phone)

2. **Login**
   - Choose option 1 from main menu
   - Enter your credentials

3. **Borrow Books**
   - View available books
   - Enter book ID to borrow
   - Maximum 3 books at a time

4. **Return Books**
   - View your borrowed books
   - Enter borrow ID to return
   - Fine will be auto-calculated if overdue

5. **Pay Fines**
   - View your pending fines
   - Enter fine ID and payment amount
   - Supports full or partial payments

### For Administrators

1. **Login**
   - Use admin credentials

2. **Manage Books**
   - Add new books with details
   - Update existing book information
   - Delete books from inventory

3. **Monitor Borrows**
   - View all currently borrowed books
   - Check overdue books
   - See borrower details

4. **Manage Fines**
   - View all pending fines
   - Generate fine reports
   - Export reports to file

5. **Generate Reports**
   - View library statistics
   - Total books, active borrows
   - Fines collected and pending

## Fine Calculation Rules

- **Loan Period**: 7 days
- **Fine Rate**: Rs. 5 per day
- **Calculation**: Fine = (Return Date - Due Date) × Rs. 5
- **Example**:
  - Book borrowed: Jan 1, 2024
  - Due date: Jan 8, 2024
  - Returned: Jan 12, 2024
  - Fine: (12 - 8) × 5 = Rs. 20

## Business Rules

1. **Maximum Books**: Students can borrow maximum 3 books at a time
2. **Loan Duration**: Default loan period is 7 days
3. **Fine Policy**: Rs. 5 per day for overdue books
4. **Book Availability**: Books can only be borrowed if available copies > 0
5. **Unique Constraints**: Username and email must be unique
6. **Role-Based Access**: Admins have full access, students have limited access

## Screenshots / Sample Output

```
========================================
  LIBRARY MANAGEMENT SYSTEM
  Fine Tracking & Book Management
========================================

Database connection successful!

========================================
           MAIN MENU
========================================
1. Login
2. Student Signup
3. Exit
========================================
Enter your choice: 1

--- User Login ---
Username: admin
Password: admin123
Login successful! Welcome, System Administrator

========================================
       ADMIN DASHBOARD
========================================
Welcome, System Administrator
----------------------------------------
1.  Add New Book
2.  Update Book Details
3.  Delete Book
4.  View All Books
5.  View All Issued Books
6.  View Overdue Books
7.  View All Pending Fines
8.  Generate Library Report
9.  Export Fine Report
10. Search Book
0.  Logout
========================================
```

## Future Enhancements

- GUI implementation using Swing or JavaFX
- Web-based interface using Spring Boot
- Email notifications for due dates and fines
- Book reservation system
- Digital library integration
- Barcode/QR code scanning
- Advanced search with filters
- Member card generation
- SMS notifications
- Online fine payment gateway

## Troubleshooting

### Database Connection Issues
- Verify MySQL is running
- Check database credentials in `DatabaseConnection.java`
- Ensure database `library_management` exists
- Verify MySQL Connector JAR is in classpath

### Compilation Errors
- Ensure JDK 8 or higher is installed
- Verify all source files are present
- Check MySQL Connector JAR path

### Runtime Errors
- Check database schema is properly created
- Verify sample data is inserted
- Check for SQL syntax errors in DAO classes

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is created for educational purposes as a minor project demonstration.

## Contact

For any queries or issues, please create an issue in the repository.

---

**Developed as a Minor Project - Library Management and Fine Tracking System**

Demonstrates:
- JDBC-MySQL integration
- Layered architecture (DAO, Service, UI)
- CRUD operations
- Business logic implementation
- Auto fine calculation
- Console-based interface
