# Library Management System - macOS Setup Guide (M2)

## Optimized for Mac Air M2 (Apple Silicon)

---

## Prerequisites Installation

### 1. Install Homebrew (if not already installed)

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### 2. Install Java (JDK)

```bash
# Install OpenJDK (recommended for M2)
brew install openjdk@17

# Add to PATH (add this to ~/.zshrc)
echo 'export PATH="/opt/homebrew/opt/openjdk@17/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# Verify installation
java -version
javac -version
```

### 3. Install MySQL

```bash
# Install MySQL via Homebrew
brew install mysql

# Start MySQL service
brew services start mysql

# Secure MySQL installation
mysql_secure_installation
```

During `mysql_secure_installation`:
- Set root password (remember this!)
- Remove anonymous users: Yes
- Disallow root login remotely: Yes
- Remove test database: Yes
- Reload privilege tables: Yes

---

## Quick Setup (Copy & Paste)

### Step 1: Navigate to Project

```bash
cd ~/Cronicweb.me/LibraryManagementSystem
```

### Step 2: Download MySQL Connector (M2 Compatible)

```bash
# Create lib directory
mkdir -p lib

# Download MySQL Connector
curl -L -o lib/mysql-connector-j-8.0.33.jar \
  https://repo1.maven.org/maven2/com/mysql/mysql-connector-j/8.0.33/mysql-connector-j-8.0.33.jar

# Verify download
ls -lh lib/
```

### Step 3: Setup Database

```bash
# Start MySQL (if not already running)
brew services start mysql

# Create database and run schema
mysql -u root -p << 'EOF'
CREATE DATABASE IF NOT EXISTS library_management;
USE library_management;
SOURCE database/schema.sql;
SHOW TABLES;
SELECT * FROM users;
EXIT
EOF
```

**Or interactively:**

```bash
mysql -u root -p
```

Then in MySQL shell:
```sql
CREATE DATABASE library_management;
USE library_management;
SOURCE /Users/YOUR_USERNAME/Cronicweb.me/LibraryManagementSystem/database/schema.sql;
SHOW TABLES;
EXIT;
```

### Step 4: Configure Database Password

```bash
# Open the config file with nano
nano src/com/library/util/DatabaseConnection.java
```

Update these lines:
```java
private static final String USER = "root";
private static final String PASSWORD = "your_mysql_password";  // Password you set during mysql_secure_installation
```

**Save and exit:**
- Press `Ctrl + O` (WriteOut)
- Press `Enter` (Confirm)
- Press `Ctrl + X` (Exit)

**Or use VS Code:**
```bash
code src/com/library/util/DatabaseConnection.java
```

### Step 5: Compile the Project

```bash
./compile.sh
```

**Expected output:**
```
==========================================
  Compiling Library Management System
==========================================
Compiling Java source files...
✓ Compilation successful!

To run the application, use:
./run.sh
```

### Step 6: Run the Application

```bash
./run.sh
```

---

## Complete One-Time Setup Script

Copy and paste this entire block:

```bash
# Navigate to project
cd ~/Cronicweb.me/LibraryManagementSystem

# Download MySQL Connector
echo "📦 Downloading MySQL Connector..."
mkdir -p lib
curl -L -o lib/mysql-connector-j-8.0.33.jar \
  https://repo1.maven.org/maven2/com/mysql/mysql-connector-j/8.0.33/mysql-connector-j-8.0.33.jar

# Setup database
echo "🗄️  Setting up database..."
echo "Enter your MySQL root password when prompted:"
mysql -u root -p << 'EOF'
CREATE DATABASE IF NOT EXISTS library_management;
USE library_management;
EOF

mysql -u root -p library_management < database/schema.sql

echo "✅ Database setup complete!"
echo ""
echo "⚠️  IMPORTANT: Edit the database password in:"
echo "   src/com/library/util/DatabaseConnection.java"
echo ""
echo "Run this command to edit:"
echo "   nano src/com/library/util/DatabaseConnection.java"
```

---

## Mac-Specific Commands

### Start/Stop MySQL

```bash
# Start MySQL
brew services start mysql

# Stop MySQL
brew services stop mysql

# Restart MySQL
brew services restart mysql

# Check MySQL status
brew services list | grep mysql
```

### Check MySQL Connection

```bash
# Login to MySQL
mysql -u root -p

# Check databases
mysql -u root -p -e "SHOW DATABASES;"

# Check tables in library_management
mysql -u root -p -e "USE library_management; SHOW TABLES;"

# View sample books
mysql -u root -p -e "USE library_management; SELECT * FROM books;"
```

### Find Your Username (for paths)

```bash
whoami
# Returns your Mac username
# Use this in: /Users/YOUR_USERNAME/Cronicweb.me/...
```

---

## Running the Application

### Method 1: Using Scripts (Recommended)

```bash
cd ~/Cronicweb.me/LibraryManagementSystem

# First time: Compile
./compile.sh

# Every time: Run
./run.sh
```

### Method 2: Manual Commands

```bash
cd ~/Cronicweb.me/LibraryManagementSystem

# Compile
javac -cp ".:lib/*" -d bin $(find src -name "*.java")

# Run
java -cp "bin:lib/*" com.library.Main
```

### Method 3: One-Liner (Compile + Run)

```bash
cd ~/Cronicweb.me/LibraryManagementSystem && ./compile.sh && ./run.sh
```

---

## Default Login Credentials

**Admin Account:**
- Username: `admin`
- Password: `admin123`

**Test it:**
1. Run the application
2. Choose option `1` (Login)
3. Enter username: `admin`
4. Enter password: `admin123`

---

## Using Terminal on Mac

### Open Terminal

**Method 1:** Spotlight
- Press `Cmd + Space`
- Type "Terminal"
- Press Enter

**Method 2:** Finder
- Go to Applications → Utilities → Terminal

**Method 3:** Launchpad
- Open Launchpad
- Search "Terminal"

### Navigate to Project

```bash
# From anywhere, go to project
cd ~/Cronicweb.me/LibraryManagementSystem

# Check current directory
pwd

# List files
ls -la
```

---

## Troubleshooting on Mac M2

### Issue 1: "java: command not found"

```bash
# Install Java
brew install openjdk@17

# Add to PATH
echo 'export PATH="/opt/homebrew/opt/openjdk@17/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# Verify
java -version
```

### Issue 2: "mysql: command not found"

```bash
# Install MySQL
brew install mysql

# Add to PATH (if needed)
echo 'export PATH="/opt/homebrew/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# Start MySQL
brew services start mysql
```

### Issue 3: "Permission denied: ./compile.sh"

```bash
# Make scripts executable
chmod +x compile.sh run.sh

# Then run
./compile.sh
```

### Issue 4: MySQL Connection Refused

```bash
# Check if MySQL is running
brew services list | grep mysql

# If not running, start it
brew services start mysql

# Test connection
mysql -u root -p
```

### Issue 5: "Access denied for user 'root'@'localhost'"

```bash
# Reset MySQL root password
brew services stop mysql
mysqld_safe --skip-grant-tables &

# In another terminal
mysql -u root
# In MySQL:
# FLUSH PRIVILEGES;
# ALTER USER 'root'@'localhost' IDENTIFIED BY 'new_password';
# EXIT;

# Restart MySQL normally
killall mysqld
brew services start mysql
```

### Issue 6: Can't find JAR file path

```bash
# Check if JAR exists
ls -l lib/*.jar

# If missing, download again
curl -L -o lib/mysql-connector-j-8.0.33.jar \
  https://repo1.maven.org/maven2/com/mysql/mysql-connector-j/8.0.33/mysql-connector-j-8.0.33.jar
```

### Issue 7: Compilation errors

```bash
# Clean and recompile
rm -rf bin
mkdir bin
./compile.sh

# Or manually
javac -cp ".:lib/*" -d bin $(find src -name "*.java")
```

---

## Mac Keyboard Shortcuts in Terminal

| Shortcut | Action |
|----------|--------|
| `Cmd + T` | New tab |
| `Cmd + N` | New window |
| `Cmd + K` | Clear screen |
| `Ctrl + C` | Stop running program |
| `Ctrl + D` | Exit/logout |
| `Ctrl + A` | Go to start of line |
| `Ctrl + E` | Go to end of line |
| `Cmd + +` | Increase font size |
| `Cmd + -` | Decrease font size |

---

## Recommended: Use iTerm2 (Optional)

iTerm2 is a better terminal for Mac:

```bash
# Install iTerm2
brew install --cask iterm2

# Open iTerm2 from Spotlight or Applications
```

---

## Visual Studio Code Integration (Optional)

If you want to use VS Code:

```bash
# Install VS Code
brew install --cask visual-studio-code

# Open project in VS Code
code ~/Cronicweb.me/LibraryManagementSystem

# Run from VS Code terminal
# View → Terminal (or Ctrl + `)
./compile.sh && ./run.sh
```

---

## Complete Example Session

```bash
# Open Terminal (Cmd + Space, type "Terminal")

# Navigate to project
cd ~/Cronicweb.me/LibraryManagementSystem

# Check if MySQL is running
brew services list | grep mysql

# If not running, start it
brew services start mysql

# Download MySQL Connector (first time only)
mkdir -p lib
curl -L -o lib/mysql-connector-j-8.0.33.jar \
  https://repo1.maven.org/maven2/com/mysql/mysql-connector-j/8.0.33/mysql-connector-j-8.0.33.jar

# Setup database (first time only)
mysql -u root -p < database/schema.sql

# Edit database password (first time only)
nano src/com/library/util/DatabaseConnection.java
# Update PASSWORD field, save (Ctrl+O, Enter, Ctrl+X)

# Compile
./compile.sh

# Run
./run.sh

# Login as admin:
# Username: admin
# Password: admin123
```

---

## Quick Reference Card

### Essential Commands
```bash
cd ~/Cronicweb.me/LibraryManagementSystem  # Go to project
./compile.sh                                # Compile
./run.sh                                    # Run
brew services start mysql                   # Start MySQL
mysql -u root -p                           # Login to MySQL
```

### File Editing
```bash
nano src/com/library/util/DatabaseConnection.java  # Edit config
code .                                              # Open in VS Code
```

### Database Management
```bash
mysql -u root -p library_management                           # Open DB
mysql -u root -p -e "USE library_management; SHOW TABLES;"   # Show tables
mysql -u root -p library_management < database/schema.sql     # Reset DB
```

---

## All Set! 🎉

You're ready to run the Library Management System on your Mac Air M2!

**Quick Start:**
```bash
cd ~/Cronicweb.me/LibraryManagementSystem
./compile.sh
./run.sh
```

**Login as admin:**
- Username: `admin`
- Password: `admin123`

Need help? Check:
- `README.md` - Full documentation
- `SETUP_GUIDE.md` - Detailed setup
- `CLI_GUIDE.md` - CLI reference

---

**Optimized for macOS Ventura/Sonoma on Apple Silicon (M2)**
