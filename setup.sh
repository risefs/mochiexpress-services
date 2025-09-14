#!/bin/bash

# MochiExpress Services Setup Script
echo "🚀 Setting up MochiExpress Services..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node --version)"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file from template..."
    cp env.example .env
    echo "⚠️  Please update .env with your Supabase credentials before starting the application."
else
    echo "✅ .env file already exists"
fi

# Run initial build to verify setup
echo "🔨 Building application..."
npm run build

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Setup completed successfully!"
    echo ""
    echo "Next steps:"
    echo "1. Update .env with your Supabase credentials"
    echo "2. Create the 'users' table in your Supabase database (see README.md)"
    echo "3. Start development server: npm run start:dev"
    echo ""
    echo "📚 API will be available at: http://localhost:3000/api/v1"
    echo "📖 Documentation: http://localhost:3000/api/docs"
else
    echo "❌ Build failed. Please check for errors above."
    exit 1
fi
