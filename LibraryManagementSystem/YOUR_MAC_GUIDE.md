# Your Personal Mac Setup Guide
## For: nityamtiwari's Mac Air M2

---

## 🚀 Quick Start (Copy & Paste These Exact Commands)

### Open Terminal
1. Press `Cmd + Space`
2. Type "Terminal"
3. Press Enter

### Run These Commands:

```bash
# Navigate to your project
cd /Users/nityamtiwari/Cronicweb.me/LibraryManagementSystem

# Automated setup (first time)
./mac-quickstart.sh
```

---

## 📍 Your Exact Paths

**Project Location:**
```
/Users/nityamtiwari/Cronicweb.me/LibraryManagementSystem
```

**Database Schema:**
```
/Users/nityamtiwari/Cronicweb.me/LibraryManagementSystem/database/schema.sql
```

**Config File:**
```
/Users/nityamtiwari/Cronicweb.me/LibraryManagementSystem/src/com/library/util/DatabaseConnection.java
```

---

## 🔧 Complete Setup (Step by Step with YOUR paths)

### Step 1: Install Prerequisites (One Time)

```bash
# Install Homebrew (if you don't have it)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Java
brew install openjdk@17
echo 'export PATH="/opt/homebrew/opt/openjdk@17/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# Install MySQL
brew install mysql
brew services start mysql

# Set MySQL password (remember this!)
mysql_secure_installation
```

### Step 2: Setup Database (One Time)

```bash
# Go to your project
cd /Users/nityamtiwari/Cronicweb.me/LibraryManagementSystem

# Start MySQL (if not running)
brew services start mysql

# Create database
mysql -u root -p
```

**In MySQL shell, paste this:**
```sql
CREATE DATABASE library_management;
USE library_management;
SOURCE /Users/nityamtiwari/Cronicweb.me/LibraryManagementSystem/database/schema.sql;
SHOW TABLES;
EXIT;
```

### Step 3: Download MySQL Connector (One Time)

```bash
# Go to project
cd /Users/nityamtiwari/Cronicweb.me/LibraryManagementSystem

# Create lib folder and download
mkdir -p lib
curl -L -o lib/mysql-connector-j-8.0.33.jar \
  https://repo1.maven.org/maven2/com/mysql/mysql-connector-j/8.0.33/mysql-connector-j-8.0.33.jar
```

### Step 4: Configure Your MySQL Password (One Time)

```bash
# Open config file
nano /Users/nityamtiwari/Cronicweb.me/LibraryManagementSystem/src/com/library/util/DatabaseConnection.java
```

**Change this line to your MySQL password:**
```java
private static final String PASSWORD = "your_password_here";
```

**Save and exit:**
- Press `Ctrl + O` (save)
- Press `Enter` (confirm)
- Press `Ctrl + X` (exit)

### Step 5: Compile & Run

```bash
# Go to project
cd /Users/nityamtiwari/Cronicweb.me/LibraryManagementSystem

# Compile
./compile.sh

# Run
./mac-run.sh
```

---

## 🎯 Daily Usage (After Setup)

Every time you want to run the application:

```bash
# Open Terminal (Cmd + Space → "Terminal")
cd /Users/nityamtiwari/Cronicweb.me/LibraryManagementSystem
./mac-run.sh
```

---

## 🔑 Login Credentials

**Admin Account:**
- Username: `admin`
- Password: `admin123`

---

## 📝 Useful Commands for Your Mac

### Navigate to Project
```bash
cd /Users/nityamtiwari/Cronicweb.me/LibraryManagementSystem
```

### Check if MySQL is Running
```bash
brew services list | grep mysql
```

### Start MySQL
```bash
brew services start mysql
```

### Stop MySQL
```bash
brew services stop mysql
```

### Login to MySQL
```bash
mysql -u root -p
```

### View Your Books in Database
```bash
mysql -u root -p -e "USE library_management; SELECT * FROM books;"
```

### View Users in Database
```bash
mysql -u root -p -e "USE library_management; SELECT user_id, username, full_name, role FROM users;"
```

### Recompile Project
```bash
cd /Users/nityamtiwari/Cronicweb.me/LibraryManagementSystem
rm -rf bin
./compile.sh
```

### Edit Database Config
```bash
nano /Users/nityamtiwari/Cronicweb.me/LibraryManagementSystem/src/com/library/util/DatabaseConnection.java
```

---

## 🆘 Troubleshooting for Your Mac

### If Java is Not Found
```bash
brew install openjdk@17
echo 'export PATH="/opt/homebrew/opt/openjdk@17/bin:$PATH"' >> /Users/nityamtiwari/.zshrc
source /Users/nityamtiwari/.zshrc
java -version
```

### If MySQL is Not Found
```bash
brew install mysql
brew services start mysql
```

### If Scripts Don't Run
```bash
cd /Users/nityamtiwari/Cronicweb.me/LibraryManagementSystem
chmod +x *.sh
```

### If Database Connection Fails
1. Check MySQL is running:
   ```bash
   brew services list | grep mysql
   ```

2. Check password in config file:
   ```bash
   nano /Users/nityamtiwari/Cronicweb.me/LibraryManagementSystem/src/com/library/util/DatabaseConnection.java
   ```

3. Test MySQL connection:
   ```bash
   mysql -u root -p
   ```

### Reset Database
```bash
mysql -u root -p -e "DROP DATABASE library_management;"
mysql -u root -p < /Users/nityamtiwari/Cronicweb.me/LibraryManagementSystem/database/schema.sql
```

---

## 📂 Open Project in Finder

```bash
open /Users/nityamtiwari/Cronicweb.me/LibraryManagementSystem
```

---

## 💻 Open Project in VS Code (if installed)

```bash
cd /Users/nityamtiwari/Cronicweb.me/LibraryManagementSystem
code .
```

---

## 🎬 Complete Fresh Start (Copy All at Once)

If you want to start from scratch, paste all these commands:

```bash
# Go to project
cd /Users/nityamtiwari/Cronicweb.me/LibraryManagementSystem

# Ensure MySQL is running
brew services start mysql

# Download MySQL Connector
mkdir -p lib
curl -L -o lib/mysql-connector-j-8.0.33.jar \
  https://repo1.maven.org/maven2/com/mysql/mysql-connector-j/8.0.33/mysql-connector-j-8.0.33.jar

# Setup database
echo "Enter your MySQL root password when prompted:"
mysql -u root -p << 'EOF'
CREATE DATABASE IF NOT EXISTS library_management;
USE library_management;
SOURCE /Users/nityamtiwari/Cronicweb.me/LibraryManagementSystem/database/schema.sql;
SHOW TABLES;
SELECT * FROM users;
SELECT * FROM books;
EXIT
EOF

echo ""
echo "✅ Setup complete!"
echo ""
echo "Now edit your MySQL password in the config file:"
echo "nano /Users/nityamtiwari/Cronicweb.me/LibraryManagementSystem/src/com/library/util/DatabaseConnection.java"
```

---

## 📱 Save These Commands to Your Desktop

Create a text file with these commands:

```bash
# Create quick launcher on desktop
cat > /Users/nityamtiwari/Desktop/run-library.sh << 'EOF'
#!/bin/bash
cd /Users/nityamtiwari/Cronicweb.me/LibraryManagementSystem
./mac-run.sh
EOF

chmod +x /Users/nityamtiwari/Desktop/run-library.sh

echo "✅ Launcher created on your Desktop!"
echo "Double-click 'run-library.sh' to start the application"
```

---

## 🎯 Next Steps

1. **First Time Setup:**
   ```bash
   cd /Users/nityamtiwari/Cronicweb.me/LibraryManagementSystem
   ./mac-quickstart.sh
   ```

2. **Edit Config:**
   ```bash
   nano /Users/nityamtiwari/Cronicweb.me/LibraryManagementSystem/src/com/library/util/DatabaseConnection.java
   ```
   Update PASSWORD field

3. **Run:**
   ```bash
   cd /Users/nityamtiwari/Cronicweb.me/LibraryManagementSystem
   ./mac-run.sh
   ```

4. **Login as Admin:**
   - Username: `admin`
   - Password: `admin123`

---

## 📞 Quick Reference Card

**Your Project Path:**
```
/Users/nityamtiwari/Cronicweb.me/LibraryManagementSystem
```

**Run Application:**
```bash
cd /Users/nityamtiwari/Cronicweb.me/LibraryManagementSystem && ./mac-run.sh
```

**Start MySQL:**
```bash
brew services start mysql
```

**Edit Config:**
```bash
nano /Users/nityamtiwari/Cronicweb.me/LibraryManagementSystem/src/com/library/util/DatabaseConnection.java
```

---

## ✅ Checklist

- [ ] Java installed (`brew install openjdk@17`)
- [ ] MySQL installed (`brew install mysql`)
- [ ] MySQL running (`brew services start mysql`)
- [ ] MySQL password set (`mysql_secure_installation`)
- [ ] MySQL Connector downloaded (in `lib/` folder)
- [ ] Database created (`mysql -u root -p < database/schema.sql`)
- [ ] Config file updated with MySQL password
- [ ] Project compiled (`./compile.sh`)
- [ ] Application runs (`./mac-run.sh`)

---

**You're all set, Nityam! 🎉**

**To run anytime:**
```bash
cd /Users/nityamtiwari/Cronicweb.me/LibraryManagementSystem
./mac-run.sh
```
