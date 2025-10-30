#!/bin/bash
# Run script for Library Management System

echo "=========================================="
echo "  Library Management System"
echo "=========================================="
echo ""

# Check if compiled
if [ ! -d "bin" ]; then
    echo "Error: Project not compiled yet!"
    echo "Please run: ./compile.sh first"
    exit 1
fi

# Check if MySQL Connector exists
if [ ! -f "lib/mysql-connector-java-8.0.33.jar" ]; then
    echo "WARNING: MySQL Connector JAR not found!"
    echo "The application may not connect to database."
    echo ""
fi

# Run the application
java -cp "bin:lib/*" com.library.Main
