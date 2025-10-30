#!/bin/bash
# Mac QuickStart Script - Library Management System
# One-command setup for Mac Air M2

set -e  # Exit on error

clear
echo "╔═══════════════════════════════════════════════╗"
echo "║   Library Management System - Mac QuickStart  ║"
echo "╚═══════════════════════════════════════════════╝"
echo ""
echo "This script will:"
echo "  1. Download MySQL Connector"
echo "  2. Setup the database"
echo "  3. Compile the project"
echo "  4. Run the application"
echo ""
read -p "Press Enter to continue or Ctrl+C to cancel..."
clear

# Step 1: Check Java
echo "Step 1/5: Checking Java..."
if ! command -v java &> /dev/null; then
    echo "❌ Java not found!"
    echo ""
    echo "Install Java with:"
    echo "  brew install openjdk@17"
    exit 1
fi
echo "✓ Java found: $(java -version 2>&1 | head -n 1)"
echo ""

# Step 2: Check/Start MySQL
echo "Step 2/5: Checking MySQL..."
if ! command -v mysql &> /dev/null; then
    echo "❌ MySQL not found!"
    echo ""
    echo "Install MySQL with:"
    echo "  brew install mysql"
    echo "  brew services start mysql"
    exit 1
fi

if ! pgrep -x mysqld > /dev/null; then
    echo "⚠️  MySQL not running. Starting MySQL..."
    brew services start mysql
    echo "⏳ Waiting for MySQL to start..."
    sleep 5
fi
echo "✓ MySQL is running"
echo ""

# Step 3: Download MySQL Connector
echo "Step 3/5: Setting up MySQL Connector..."
mkdir -p lib
if [ ! -f "lib/mysql-connector-j-8.0.33.jar" ]; then
    echo "📦 Downloading MySQL Connector..."
    curl -L -o lib/mysql-connector-j-8.0.33.jar \
      https://repo1.maven.org/maven2/com/mysql/mysql-connector-j/8.0.33/mysql-connector-j-8.0.33.jar
    echo "✓ Download complete!"
else
    echo "✓ MySQL Connector already exists"
fi
echo ""

# Step 4: Setup Database
echo "Step 4/5: Setting up database..."
echo "Please enter your MySQL root password:"

# Create database
mysql -u root -p << 'EOSQL'
CREATE DATABASE IF NOT EXISTS library_management;
USE library_management;
EOSQL

# Run schema
mysql -u root -p library_management < database/schema.sql

echo "✓ Database setup complete!"
echo ""

# Step 5: Compile
echo "Step 5/5: Compiling project..."
./compile.sh
echo ""

# Final instructions
echo "╔═══════════════════════════════════════════════╗"
echo "║              Setup Complete! 🎉                ║"
echo "╚═══════════════════════════════════════════════╝"
echo ""
echo "⚠️  IMPORTANT: Before running, edit the database password:"
echo ""
echo "  nano src/com/library/util/DatabaseConnection.java"
echo ""
echo "Update this line with your MySQL password:"
echo "  private static final String PASSWORD = \"your_password\";"
echo ""
echo "Save with: Ctrl+O, Enter, Ctrl+X"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Then run the application with:"
echo "  ./mac-run.sh"
echo ""
echo "Default admin login:"
echo "  Username: admin"
echo "  Password: admin123"
echo ""
