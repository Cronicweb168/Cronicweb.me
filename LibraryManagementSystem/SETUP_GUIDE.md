# Quick Setup Guide - Library Management System

## Prerequisites Checklist

- [ ] Java JDK 8 or higher installed
- [ ] MySQL Server 5.7 or higher installed and running
- [ ] MySQL Connector/J (JDBC Driver) downloaded
- [ ] Basic knowledge of command line operations

## Quick Start (5 Steps)

### Step 1: Install MySQL and Create Database

```bash
# Start MySQL service
# Linux/Mac:
sudo systemctl start mysql
# or
sudo service mysql start

# Windows: Start from Services panel

# Login to MySQL
mysql -u root -p

# In MySQL shell, run:
CREATE DATABASE library_management;
USE library_management;
SOURCE /path/to/LibraryManagementSystem/database/schema.sql;
EXIT;
```

### Step 2: Configure Database Connection

Open `src/com/library/util/DatabaseConnection.java` and update:

```java
private static final String URL = "jdbc:mysql://localhost:3306/library_management";
private static final String USER = "your_mysql_username";
private static final String PASSWORD = "your_mysql_password";
```

### Step 3: Download MySQL Connector

Download MySQL Connector/J from:
https://dev.mysql.com/downloads/connector/j/

Extract and place `mysql-connector-java-8.0.x.jar` in a `lib` folder in the project root:

```
LibraryManagementSystem/
├── lib/
│   └── mysql-connector-java-8.0.x.jar
├── src/
└── database/
```

### Step 4: Compile the Project

```bash
# Create output directory
mkdir bin

# Compile (Linux/Mac)
javac -cp ".:lib/mysql-connector-java-8.0.x.jar" -d bin $(find src -name "*.java")

# Compile (Windows)
javac -cp ".;lib/mysql-connector-java-8.0.x.jar" -d bin src/com/library/*.java src/com/library/model/*.java src/com/library/dao/*.java src/com/library/service/*.java src/com/library/ui/*.java src/com/library/util/*.java
```

### Step 5: Run the Application

```bash
# Run (Linux/Mac)
java -cp "bin:lib/mysql-connector-java-8.0.x.jar" com.library.Main

# Run (Windows)
java -cp "bin;lib/mysql-connector-java-8.0.x.jar" com.library.Main
```

## Using an IDE (Eclipse/IntelliJ IDEA)

### Eclipse Setup

1. Import project: File → Import → Existing Projects into Workspace
2. Add MySQL Connector:
   - Right-click project → Build Path → Configure Build Path
   - Libraries tab → Add External JARs
   - Select `mysql-connector-java-8.0.x.jar`
3. Run `Main.java` as Java Application

### IntelliJ IDEA Setup

1. Open project: File → Open → Select project folder
2. Add MySQL Connector:
   - File → Project Structure → Libraries
   - Click + → Java → Select `mysql-connector-java-8.0.x.jar`
3. Run `Main.java`

## Default Login Credentials

**Admin Account:**
- Username: `admin`
- Password: `admin123`

**Sample Student (create via signup):**
- Create your own student account using the signup option

## Verification Steps

### Test Database Connection

```bash
mysql -u root -p
USE library_management;
SHOW TABLES;
# Should show: users, books, borrowed_books, fines

SELECT * FROM users;
# Should show the admin user

SELECT * FROM books;
# Should show 5 sample books
```

### Test Application

1. Run the application
2. Should see: "Database connection successful!"
3. Login as admin (username: admin, password: admin123)
4. View all books (should see 5 sample books)

## Common Issues and Solutions

### Issue 1: "ClassNotFoundException: com.mysql.cj.jdbc.Driver"
**Solution:** MySQL Connector JAR is not in classpath
- Verify JAR file location
- Check compile and run commands include `-cp` with correct JAR path

### Issue 2: "Access denied for user"
**Solution:** Incorrect database credentials
- Check username and password in `DatabaseConnection.java`
- Verify MySQL user has access to `library_management` database

### Issue 3: "Unknown database 'library_management'"
**Solution:** Database not created
- Run the `schema.sql` script
- Verify database exists: `SHOW DATABASES;` in MySQL shell

### Issue 4: "Table 'library_management.users' doesn't exist"
**Solution:** Schema not properly executed
- Drop database: `DROP DATABASE library_management;`
- Re-run schema.sql script

### Issue 5: "Cannot find symbol" compilation errors
**Solution:** Missing source files or incorrect package structure
- Verify all `.java` files are in correct package directories
- Check package declarations match folder structure

## Database Connection Troubleshooting

### Check MySQL is Running

```bash
# Linux/Mac
sudo systemctl status mysql

# Windows
# Open Services and check "MySQL" service status
```

### Test MySQL Connection

```bash
mysql -u root -p
# If this works, MySQL is running correctly
```

### Grant Permissions (if needed)

```sql
# Login to MySQL as root
mysql -u root -p

# Grant permissions
GRANT ALL PRIVILEGES ON library_management.* TO 'your_username'@'localhost';
FLUSH PRIVILEGES;
```

## Performance Tips

1. **Indexing**: Already implemented in schema.sql
2. **Connection Pooling**: For production, implement connection pooling
3. **Prepared Statements**: Already used to prevent SQL injection
4. **Query Optimization**: Indexes created on frequently queried columns

## Security Considerations

1. **Password Storage**: Currently plain text (for demo)
   - Production: Use password hashing (BCrypt, PBKDF2)
2. **SQL Injection**: Prevented using PreparedStatements
3. **Input Validation**: Add more robust validation in production
4. **Database Credentials**: Move to external config file (not hardcoded)

## Next Steps After Setup

1. Login as admin and explore admin features
2. Create a student account via signup
3. Login as student and test borrow/return features
4. Test fine calculation by modifying due dates in database
5. Generate and export reports

## Additional Configuration

### Change Fine Rules

Edit `LibraryService.java`:

```java
private static final int LOAN_PERIOD_DAYS = 7;      // Change loan period
private static final double FINE_PER_DAY = 5.0;      // Change fine amount
private static final int MAX_BOOKS_PER_USER = 3;     // Change book limit
```

### Add More Sample Data

Add more books via admin menu or directly in database:

```sql
INSERT INTO books (title, author, isbn, category, total_copies, available_copies)
VALUES ('Your Book Title', 'Author Name', 'ISBN123', 'Category', 5, 5);
```

## Getting Help

If you encounter issues:
1. Check error messages carefully
2. Verify all setup steps completed
3. Check MySQL error logs
4. Review application console output
5. Consult README.md for detailed documentation

## Testing the System

### Test Case 1: Admin Operations
1. Login as admin
2. Add a new book
3. View all books (verify book added)
4. Update book details
5. View issued books

### Test Case 2: Student Operations
1. Signup as new student
2. Login with student credentials
3. View available books
4. Borrow a book
5. View borrowed books
6. Return the book (before due date - no fine)

### Test Case 3: Fine Calculation
1. Borrow a book as student
2. Manually update due_date in database to past date:
   ```sql
   UPDATE borrowed_books
   SET due_date = '2024-01-01'
   WHERE borrow_id = X;
   ```
3. Return the book
4. Verify fine is calculated correctly
5. Pay the fine

---

**Setup Complete! You're ready to use the Library Management System.**

For detailed feature documentation, refer to README.md
