#!/bin/bash
# Compile script for Library Management System

echo "=========================================="
echo "  Compiling Library Management System"
echo "=========================================="

# Create bin directory if it doesn't exist
mkdir -p bin

# Check if MySQL Connector JAR exists
if [ ! -f "lib/mysql-connector-java-8.0.33.jar" ]; then
    echo "WARNING: MySQL Connector JAR not found in lib/ directory"
    echo "Please download it from: https://dev.mysql.com/downloads/connector/j/"
    echo "Place it in: lib/mysql-connector-java-8.0.33.jar"
    echo ""
    echo "Attempting compilation anyway..."
fi

# Compile all Java files
echo "Compiling Java source files..."
find src -name "*.java" > sources.txt
javac -cp ".:lib/*" -d bin @sources.txt

if [ $? -eq 0 ]; then
    echo "✓ Compilation successful!"
    echo ""
    echo "To run the application, use:"
    echo "./run.sh"
    rm sources.txt
else
    echo "✗ Compilation failed!"
    echo "Please check for errors above."
    rm sources.txt
    exit 1
fi
