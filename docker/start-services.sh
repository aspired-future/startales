#!/bin/bash

# StarTales Docker Services Startup Script
# Comprehensive service management for development and production environments

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

print_usage() {
    echo "🚀 StarTales Docker Services Manager"
    echo "Usage: $0 [PROFILE] [OPTIONS]"
    echo ""
    echo "PROFILES:"
    echo "  dev      - Development environment (all services, single replicas)"
    echo "  core     - Core services only (API, UI, Database, Redis) - Lightweight"
    echo "  ai       - Core + AI services (Ollama) - Resource intensive"
    echo "  voice    - Core + Voice services (STT/TTS) - Resource intensive"
    echo "  full     - All services including AI and Voice - Very resource intensive"
    echo "  prod     - Production environment (50 players, monitoring) - High resource"
    echo ""
    echo "OPTIONS:"
    echo "  --build     - Force rebuild of images"
    echo "  --logs      - Show logs after startup"
    echo "  --stop      - Stop services instead of starting"
    echo "  --status    - Show service status"
    echo "  --health    - Check health of all services"
    echo "  --clean     - Clean up stopped containers and unused images"
    echo ""
    echo "EXAMPLES:"
    echo "  $0 dev               # Start development environment"
    echo "  $0 core              # Start lightweight core services"
    echo "  $0 ai --build        # Start AI services with rebuild"
    echo "  $0 full --logs       # Start everything and show logs"
    echo "  $0 prod              # Start production environment"
    echo "  $0 --stop            # Stop all services"
    echo "  $0 --health          # Check service health"
}

check_resources() {
    local profile=$1
    local total_mem=$(free -g | awk '/^Mem:/{print $2}')
    
    echo -e "${BLUE}💻 System Resources: ${total_mem}GB RAM available${NC}"
    
    case $profile in
        "dev")
            if [ $total_mem -lt 4 ]; then
                echo -e "${YELLOW}⚠️  Warning: Development environment needs at least 4GB RAM. You have ${total_mem}GB${NC}"
                echo -e "${YELLOW}   Consider using 'core' profile instead${NC}"
            fi
            ;;
        "core")
            if [ $total_mem -lt 2 ]; then
                echo -e "${YELLOW}⚠️  Warning: Core services need at least 2GB RAM. You have ${total_mem}GB${NC}"
            fi
            ;;
        "ai")
            if [ $total_mem -lt 8 ]; then
                echo -e "${YELLOW}⚠️  Warning: AI services need at least 8GB RAM. You have ${total_mem}GB${NC}"
                echo -e "${YELLOW}   Consider using 'core' profile instead${NC}"
            fi
            ;;
        "voice")
            if [ $total_mem -lt 6 ]; then
                echo -e "${YELLOW}⚠️  Warning: Voice services need at least 6GB RAM. You have ${total_mem}GB${NC}"
                echo -e "${YELLOW}   Consider using 'core' profile instead${NC}"
            fi
            ;;
        "full")
            if [ $total_mem -lt 12 ]; then
                echo -e "${RED}⚠️  Warning: Full services need at least 12GB RAM. You have ${total_mem}GB${NC}"
                echo -e "${RED}   This may cause system instability${NC}"
                read -p "Continue anyway? (y/N): " -n 1 -r
                echo
                if [[ ! $REPLY =~ ^[Yy]$ ]]; then
                    exit 1
                fi
            fi
            ;;
        "prod")
            if [ $total_mem -lt 16 ]; then
                echo -e "${RED}⚠️  Warning: Production environment needs at least 16GB RAM. You have ${total_mem}GB${NC}"
                echo -e "${RED}   This may cause system instability${NC}"
                read -p "Continue anyway? (y/N): " -n 1 -r
                echo
                if [[ ! $REPLY =~ ^[Yy]$ ]]; then
                    exit 1
                fi
            fi
            ;;
    esac
}

create_network() {
    if ! docker network ls | grep -q startales-network; then
        echo -e "${BLUE}🌐 Creating startales-network...${NC}"
        docker network create startales-network
    else
        echo -e "${GREEN}✅ Network startales-network already exists${NC}"
    fi
}

start_services() {
    local profile=$1
    local build_flag=$2
    
    create_network
    check_resources $profile
    
    echo -e "${GREEN}🚀 Starting StarTales services with profile: $profile${NC}"
    echo ""
    
    case $profile in
        "dev")
            echo -e "${BLUE}📦 Starting development environment...${NC}"
            docker compose -f docker-compose.yml up -d $build_flag
            ;;
        "core")
            echo -e "${BLUE}📦 Starting core services only...${NC}"
            docker compose -f docker-compose.yml up -d $build_flag ui api postgres redis
            ;;
        "ai")
            echo -e "${BLUE}🤖 Starting core + AI services...${NC}"
            docker compose -f docker-compose.yml up -d $build_flag ui api postgres redis ollama qdrant
            ;;
        "voice")
            echo -e "${BLUE}🎤 Starting core + voice services...${NC}"
            docker compose -f docker-compose.yml up -d $build_flag ui api postgres redis stt tts
            ;;
        "full")
            echo -e "${BLUE}🌟 Starting all development services...${NC}"
            docker compose -f docker-compose.yml up -d $build_flag
            ;;
        "prod")
            echo -e "${PURPLE}🏭 Starting production environment...${NC}"
            docker compose -f docker-compose.production.yml up -d $build_flag
            ;;
        *)
            echo -e "${RED}❌ Unknown profile: $profile${NC}"
            print_usage
            exit 1
            ;;
    esac
    
    echo ""
    echo -e "${GREEN}✅ Services started successfully!${NC}"
    echo ""
    echo -e "${BLUE}🌐 Available endpoints:${NC}"
    echo "  🎮 UI:           http://localhost:5173"
    echo "  🔌 API:          http://localhost:4000"
    echo "  📊 API Health:   http://localhost:4000/api/health"
    
    if [[ $profile == "ai" || $profile == "full" || $profile == "dev" ]]; then
        echo "  🤖 Ollama:       http://localhost:11434"
        echo "  🔍 Qdrant:       http://localhost:6333"
    fi
    
    if [[ $profile == "voice" || $profile == "full" || $profile == "dev" ]]; then
        echo "  🎤 STT Service:  http://localhost:8001"
        echo "  🔊 TTS Service:  http://localhost:8002"
    fi
    
    if [[ $profile == "prod" ]]; then
        echo "  📊 Grafana:      http://localhost:3000 (admin/admin123)"
        echo "  📈 Prometheus:   http://localhost:9090"
    fi
    
    echo "  🗄️  PostgreSQL:   localhost:5432 (gtw/gtw)"
    echo "  💾 Redis:        localhost:6379"
    echo "  📨 NATS:         localhost:4222"
}

stop_services() {
    echo -e "${YELLOW}🛑 Stopping all StarTales services...${NC}"
    
    # Stop all possible configurations
    docker compose -f docker-compose.yml down 2>/dev/null || true
    docker compose -f docker-compose.production.yml down 2>/dev/null || true
    docker compose -f docker-compose.voice.yml down 2>/dev/null || true
    docker compose -f docker-compose.microservices.yml down 2>/dev/null || true
    
    echo -e "${GREEN}✅ All services stopped${NC}"
}

show_status() {
    echo -e "${BLUE}📊 StarTales Services Status:${NC}"
    echo ""
    
    # Check if network exists
    if docker network ls | grep -q startales-network; then
        echo -e "${GREEN}✅${NC} Network: startales-network"
    else
        echo -e "${RED}❌${NC} Network: startales-network (not found)"
    fi
    
    # Check running containers
    echo ""
    echo -e "${BLUE}🐳 Running containers:${NC}"
    if docker ps --filter "network=startales-network" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" 2>/dev/null | grep -v "NAMES"; then
        docker ps --filter "network=startales-network" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    else
        echo "No containers running on startales-network"
    fi
    
    # Show all StarTales containers (even if not on the network)
    echo ""
    echo -e "${BLUE}🔍 All StarTales containers:${NC}"
    docker ps -a --filter "name=startales" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" 2>/dev/null || echo "No StarTales containers found"
}

check_health() {
    echo -e "${BLUE}🏥 Checking service health...${NC}"
    echo ""
    
    # Check API health
    if curl -f -s http://localhost:4000/api/health > /dev/null 2>&1; then
        echo -e "${GREEN}✅ API Service: Healthy${NC}"
    else
        echo -e "${RED}❌ API Service: Unhealthy or not running${NC}"
    fi
    
    # Check UI
    if curl -f -s http://localhost:5173 > /dev/null 2>&1; then
        echo -e "${GREEN}✅ UI Service: Healthy${NC}"
    else
        echo -e "${RED}❌ UI Service: Unhealthy or not running${NC}"
    fi
    
    # Check STT
    if curl -f -s http://localhost:8001/health > /dev/null 2>&1; then
        echo -e "${GREEN}✅ STT Service: Healthy${NC}"
    else
        echo -e "${YELLOW}⚠️  STT Service: Not running or unhealthy${NC}"
    fi
    
    # Check TTS
    if curl -f -s http://localhost:8002/health > /dev/null 2>&1; then
        echo -e "${GREEN}✅ TTS Service: Healthy${NC}"
    else
        echo -e "${YELLOW}⚠️  TTS Service: Not running or unhealthy${NC}"
    fi
    
    # Check Ollama
    if curl -f -s http://localhost:11434/api/tags > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Ollama Service: Healthy${NC}"
    else
        echo -e "${YELLOW}⚠️  Ollama Service: Not running or unhealthy${NC}"
    fi
    
    # Check PostgreSQL
    if docker exec -it $(docker ps -q --filter "name=postgres") pg_isready -U gtw > /dev/null 2>&1; then
        echo -e "${GREEN}✅ PostgreSQL: Healthy${NC}"
    else
        echo -e "${RED}❌ PostgreSQL: Unhealthy or not running${NC}"
    fi
    
    # Check Redis
    if docker exec -it $(docker ps -q --filter "name=redis") redis-cli ping > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Redis: Healthy${NC}"
    else
        echo -e "${RED}❌ Redis: Unhealthy or not running${NC}"
    fi
}

clean_up() {
    echo -e "${YELLOW}🧹 Cleaning up Docker resources...${NC}"
    
    # Remove stopped containers
    docker container prune -f
    
    # Remove unused images
    docker image prune -f
    
    # Remove unused volumes
    docker volume prune -f
    
    # Remove unused networks
    docker network prune -f
    
    echo -e "${GREEN}✅ Cleanup completed${NC}"
}

show_logs() {
    echo -e "${BLUE}📋 Showing logs for all services...${NC}"
    echo "Press Ctrl+C to exit log viewing"
    echo ""
    
    # Try different compose files
    if docker compose -f docker-compose.yml ps > /dev/null 2>&1; then
        docker compose -f docker-compose.yml logs -f
    elif docker compose -f docker-compose.production.yml ps > /dev/null 2>&1; then
        docker compose -f docker-compose.production.yml logs -f
    else
        echo -e "${RED}❌ No running services found${NC}"
    fi
}

# Parse arguments
PROFILE=""
BUILD_FLAG=""
SHOW_LOGS=false
STOP_SERVICES=false
SHOW_STATUS=false
CHECK_HEALTH=false
CLEAN_UP=false

while [[ $# -gt 0 ]]; do
    case $1 in
        dev|core|ai|voice|full|prod)
            PROFILE="$1"
            shift
            ;;
        --build)
            BUILD_FLAG="--build"
            shift
            ;;
        --logs)
            SHOW_LOGS=true
            shift
            ;;
        --stop)
            STOP_SERVICES=true
            shift
            ;;
        --status)
            SHOW_STATUS=true
            shift
            ;;
        --health)
            CHECK_HEALTH=true
            shift
            ;;
        --clean)
            CLEAN_UP=true
            shift
            ;;
        -h|--help)
            print_usage
            exit 0
            ;;
        *)
            echo -e "${RED}❌ Unknown option: $1${NC}"
            print_usage
            exit 1
            ;;
    esac
done

# Execute based on flags
if [ "$STOP_SERVICES" = true ]; then
    stop_services
elif [ "$SHOW_STATUS" = true ]; then
    show_status
elif [ "$CHECK_HEALTH" = true ]; then
    check_health
elif [ "$CLEAN_UP" = true ]; then
    clean_up
elif [ -n "$PROFILE" ]; then
    start_services "$PROFILE" "$BUILD_FLAG"
    if [ "$SHOW_LOGS" = true ]; then
        show_logs
    fi
else
    echo -e "${RED}❌ No profile specified${NC}"
    echo ""
    print_usage
    exit 1
fi
