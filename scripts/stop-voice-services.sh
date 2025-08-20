#!/bin/bash

# Stop Voice Services for Startales

set -e

echo "🛑 Stopping Startales Voice Services..."

# Navigate to project root
cd "$(dirname "$0")/.."

# Stop services
docker-compose -f docker/docker-compose.voice.yml down

echo "✅ Voice services stopped!"
echo ""
echo "🧹 To clean up completely (remove volumes and images):"
echo "   docker-compose -f docker/docker-compose.voice.yml down -v --rmi all"
