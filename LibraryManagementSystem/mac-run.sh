#!/bin/bash
# Mac-specific launcher for Library Management System
# Optimized for macOS on Apple Silicon (M2)

clear

echo "╔══════════════════════════════════════════╗"
echo "║   Library Management System - macOS      ║"
echo "╚══════════════════════════════════════════╝"
echo ""

# Check if running on Mac
if [[ "$OSTYPE" != "darwin"* ]]; then
    echo "⚠️  Warning: This script is optimized for macOS"
fi

# Check if Java is installed
if ! command -v java &> /dev/null; then
    echo "❌ Java is not installed!"
    echo ""
    echo "Install with Homebrew:"
    echo "  brew install openjdk@17"
    exit 1
fi

echo "✓ Java found: $(java -version 2>&1 | head -n 1)"

# Check if MySQL is running
if ! pgrep -x mysqld > /dev/null; then
    echo "⚠️  MySQL is not running!"
    echo ""
    echo "Start MySQL with:"
    echo "  brew services start mysql"
    echo ""
    read -p "Do you want to start MySQL now? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        brew services start mysql
        echo "⏳ Waiting for MySQL to start..."
        sleep 3
    else
        exit 1
    fi
fi

echo "✓ MySQL is running"

# Check if MySQL Connector exists
if [ ! -f "lib/mysql-connector-j-8.0.33.jar" ] && [ ! -f "lib/mysql-connector-java-8.0.33.jar" ]; then
    echo "❌ MySQL Connector JAR not found in lib/"
    echo ""
    read -p "Do you want to download it now? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "📦 Downloading MySQL Connector..."
        mkdir -p lib
        curl -L -o lib/mysql-connector-j-8.0.33.jar \
          https://repo1.maven.org/maven2/com/mysql/mysql-connector-j/8.0.33/mysql-connector-j-8.0.33.jar
        echo "✓ Download complete!"
    else
        echo "Please download manually from: https://dev.mysql.com/downloads/connector/j/"
        exit 1
    fi
fi

echo "✓ MySQL Connector found"

# Check if compiled
if [ ! -d "bin" ] || [ -z "$(ls -A bin 2>/dev/null)" ]; then
    echo ""
    echo "📦 Project not compiled. Compiling now..."
    ./compile.sh
    if [ $? -ne 0 ]; then
        echo "❌ Compilation failed!"
        exit 1
    fi
fi

echo "✓ Project compiled"
echo ""
echo "╔══════════════════════════════════════════╗"
echo "║        Starting Application...           ║"
echo "╚══════════════════════════════════════════╝"
echo ""

# Run the application
java -cp "bin:lib/*" com.library.Main
