# Command Line Interface (CLI) Guide

## How to Run Library Management System from CLI

### Prerequisites

1. **Java JDK 8+** installed
   ```bash
   java -version
   # Should show: java version "1.8.0" or higher
   ```

2. **MySQL Server** running
   ```bash
   # Check MySQL status
   sudo systemctl status mysql
   # or
   mysql --version
   ```

3. **MySQL Connector JAR** (JDBC Driver)

---

## Quick Start (3 Commands)

```bash
# 1. Navigate to project directory
cd LibraryManagementSystem

# 2. Compile the project
./compile.sh

# 3. Run the application
./run.sh
```

---

## Detailed Setup Steps

### Step 1: Download MySQL Connector JAR

**Option A: Direct Download**
```bash
# Create lib directory
mkdir -p lib

# Download MySQL Connector (using curl or wget)
cd lib
wget https://dev.mysql.com/get/Downloads/Connector-J/mysql-connector-j-8.0.33.tar.gz
tar -xzf mysql-connector-j-8.0.33.tar.gz
cp mysql-connector-j-8.0.33/mysql-connector-j-8.0.33.jar .
cd ..
```

**Option B: Manual Download**
1. Visit: https://dev.mysql.com/downloads/connector/j/
2. Download Platform Independent version (ZIP/TAR)
3. Extract and place JAR in `lib/` folder:
   ```
   LibraryManagementSystem/
   └── lib/
       └── mysql-connector-java-8.0.33.jar
   ```

### Step 2: Setup MySQL Database

```bash
# Login to MySQL
mysql -u root -p

# In MySQL shell, run:
CREATE DATABASE library_management;
USE library_management;
SOURCE /full/path/to/LibraryManagementSystem/database/schema.sql;
EXIT;
```

**Or from command line directly:**
```bash
mysql -u root -p < database/schema.sql
```

### Step 3: Configure Database Connection

Edit the database credentials:
```bash
nano src/com/library/util/DatabaseConnection.java
# or
vim src/com/library/util/DatabaseConnection.java
```

Update these lines:
```java
private static final String USER = "root";          // Your MySQL username
private static final String PASSWORD = "your_pass"; // Your MySQL password
```

### Step 4: Compile the Project

**Using the provided script (Recommended):**
```bash
./compile.sh
```

**Manual compilation (Linux/Mac):**
```bash
# Create output directory
mkdir -p bin

# Compile all Java files
javac -cp ".:lib/*" -d bin $(find src -name "*.java")
```

**Manual compilation (Windows):**
```cmd
mkdir bin
javac -cp ".;lib/*" -d bin src/com/library/*.java src/com/library/*/*.java
```

### Step 5: Run the Application

**Using the provided script (Recommended):**
```bash
./run.sh
```

**Manual run (Linux/Mac):**
```bash
java -cp "bin:lib/*" com.library.Main
```

**Manual run (Windows):**
```cmd
java -cp "bin;lib/*" com.library.Main
```

---

## Complete Example Session

```bash
# Navigate to project
cd ~/Cronicweb.me/LibraryManagementSystem

# Setup database (one time only)
mysql -u root -p
# Enter password, then:
# mysql> CREATE DATABASE library_management;
# mysql> USE library_management;
# mysql> SOURCE /home/user/Cronicweb.me/LibraryManagementSystem/database/schema.sql;
# mysql> EXIT;

# Download MySQL Connector (one time only)
mkdir -p lib
cd lib
# Download and extract mysql-connector-java-8.0.33.jar here
cd ..

# Edit database config (one time only)
nano src/com/library/util/DatabaseConnection.java
# Update USER and PASSWORD

# Compile
./compile.sh

# Run
./run.sh
```

---

## One-Line Commands

### Compile and Run Together
```bash
./compile.sh && ./run.sh
```

### Compile Only Specific Package
```bash
javac -cp ".:lib/*" -d bin src/com/library/model/*.java
javac -cp ".:lib/*" -d bin src/com/library/dao/*.java
javac -cp ".:lib/*" -d bin src/com/library/service/*.java
javac -cp ".:lib/*" -d bin src/com/library/ui/*.java
javac -cp ".:lib/*" -d bin src/com/library/util/*.java
javac -cp ".:lib/*" -d bin src/com/library/Main.java
```

### Clean and Rebuild
```bash
rm -rf bin && ./compile.sh
```

---

## Default Login Credentials

**Admin Account:**
- Username: `admin`
- Password: `admin123`

**Student Account:**
- Create via signup option in main menu

---

## Troubleshooting CLI Issues

### Error: "command not found: javac"
**Solution:** Java JDK not installed or not in PATH
```bash
# Install Java JDK
sudo apt-get install default-jdk  # Ubuntu/Debian
sudo yum install java-devel       # CentOS/RHEL
brew install openjdk@11           # macOS
```

### Error: "ClassNotFoundException: com.mysql.cj.jdbc.Driver"
**Solution:** MySQL Connector not in classpath
```bash
# Check if JAR exists
ls -l lib/*.jar

# If missing, download it (see Step 1 above)
```

### Error: "Access denied for user 'root'@'localhost'"
**Solution:** Wrong MySQL credentials
```bash
# Edit DatabaseConnection.java
nano src/com/library/util/DatabaseConnection.java
# Update USER and PASSWORD fields
```

### Error: "Unknown database 'library_management'"
**Solution:** Database not created
```bash
mysql -u root -p -e "CREATE DATABASE library_management;"
mysql -u root -p library_management < database/schema.sql
```

### Error: "Permission denied: ./compile.sh"
**Solution:** Script not executable
```bash
chmod +x compile.sh run.sh
```

### Compilation Errors
**Solution:** Check Java version and files
```bash
# Check Java version
java -version
javac -version

# Verify all source files exist
find src -name "*.java"
```

---

## Advanced CLI Options

### Run with Custom Classpath
```bash
java -cp "bin:/path/to/mysql-connector.jar" com.library.Main
```

### Compile with Verbose Output
```bash
javac -cp ".:lib/*" -d bin -verbose $(find src -name "*.java")
```

### Run with Specific JVM Memory
```bash
java -Xms256m -Xmx512m -cp "bin:lib/*" com.library.Main
```

### Debug Mode
```bash
java -cp "bin:lib/*" -Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=y,address=5005 com.library.Main
```

---

## Directory Structure

```
LibraryManagementSystem/
├── bin/                    # Compiled .class files (generated)
├── lib/                    # External JARs (MySQL Connector)
├── src/                    # Source code
│   └── com/
│       └── library/
│           ├── model/
│           ├── dao/
│           ├── service/
│           ├── ui/
│           ├── util/
│           └── Main.java
├── database/
│   └── schema.sql          # Database setup script
├── compile.sh              # Compilation script
├── run.sh                  # Run script
├── README.md
├── SETUP_GUIDE.md
└── CLI_GUIDE.md            # This file
```

---

## Quick Reference

| Task | Command |
|------|---------|
| Compile | `./compile.sh` |
| Run | `./run.sh` |
| Compile & Run | `./compile.sh && ./run.sh` |
| Clean | `rm -rf bin` |
| Setup DB | `mysql -u root -p < database/schema.sql` |
| Check MySQL | `sudo systemctl status mysql` |
| Test Java | `java -version` |

---

## Next Steps After Running

1. You'll see the main menu with options:
   - `1. Login` - Login as admin or student
   - `2. Student Signup` - Create new student account
   - `3. Exit` - Exit application

2. Try logging in as admin:
   - Username: `admin`
   - Password: `admin123`

3. Explore admin features:
   - View all books
   - Add new books
   - Generate reports

4. Create a student account and test student features

---

**You're now ready to use the Library Management System from CLI!**

For detailed feature documentation, see README.md
For setup troubleshooting, see SETUP_GUIDE.md
