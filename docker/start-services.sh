#!/bin/bash

# Startales Microservices Startup Script
# Allows selective startup of service groups based on resource availability

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_usage() {
    echo "Usage: $0 [PROFILE] [OPTIONS]"
    echo ""
    echo "PROFILES:"
    echo "  core     - Start core services only (API, UI, Database) - Lightweight"
    echo "  ai       - Start core + AI services (Ollama) - Resource intensive"
    echo "  voice    - Start core + Voice services (STT/TTS) - Resource intensive"
    echo "  full     - Start all services - Very resource intensive"
    echo "  demo     - Start demo environment (legacy compatibility)"
    echo ""
    echo "OPTIONS:"
    echo "  --build  - Force rebuild of images"
    echo "  --logs   - Show logs after startup"
    echo "  --stop   - Stop services instead of starting"
    echo "  --status - Show service status"
    echo ""
    echo "EXAMPLES:"
    echo "  $0 core              # Start lightweight core services"
    echo "  $0 ai --build        # Start AI services with rebuild"
    echo "  $0 full --logs       # Start everything and show logs"
    echo "  $0 --stop            # Stop all services"
}

check_resources() {
    local profile=$1
    local total_mem=$(free -g | awk '/^Mem:/{print $2}')
    
    case $profile in
        "core")
            if [ $total_mem -lt 2 ]; then
                echo -e "${YELLOW}Warning: Core services need at least 2GB RAM. You have ${total_mem}GB${NC}"
            fi
            ;;
        "ai")
            if [ $total_mem -lt 8 ]; then
                echo -e "${YELLOW}Warning: AI services need at least 8GB RAM. You have ${total_mem}GB${NC}"
                echo -e "${YELLOW}Consider using 'core' profile instead${NC}"
            fi
            ;;
        "voice")
            if [ $total_mem -lt 6 ]; then
                echo -e "${YELLOW}Warning: Voice services need at least 6GB RAM. You have ${total_mem}GB${NC}"
                echo -e "${YELLOW}Consider using 'core' profile instead${NC}"
            fi
            ;;
        "full")
            if [ $total_mem -lt 16 ]; then
                echo -e "${RED}Warning: Full services need at least 16GB RAM. You have ${total_mem}GB${NC}"
                echo -e "${RED}This may cause system instability${NC}"
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
    if ! docker network ls | grep -q startales; then
        echo -e "${BLUE}Creating startales network...${NC}"
        docker network create startales
    fi
}

start_services() {
    local profile=$1
    local build_flag=$2
    
    create_network
    check_resources $profile
    
    echo -e "${GREEN}Starting Startales services with profile: $profile${NC}"
    
    case $profile in
        "core")
            docker compose -f docker-compose.master.yml up -d $build_flag api ui postgres redis nats
            ;;
        "ai")
            docker compose -f docker-compose.master.yml --profile ai up -d $build_flag
            ;;
        "voice")
            docker compose -f docker-compose.master.yml --profile voice up -d $build_flag
            ;;
        "full")
            docker compose -f docker-compose.master.yml --profile full up -d $build_flag
            ;;
        "demo")
            # Legacy compatibility
            docker compose -f docker-compose.demo.yml up -d $build_flag
            ;;
        *)
            echo -e "${RED}Unknown profile: $profile${NC}"
            print_usage
            exit 1
            ;;
    esac
    
    echo -e "${GREEN}Services started successfully!${NC}"
    echo ""
    echo "Available endpoints:"
    echo "  UI:           http://localhost:5173"
    echo "  API:          http://localhost:4000"
    echo "  Demos:        http://localhost:4000/demo/"
    
    if [[ $profile == "ai" || $profile == "full" ]]; then
        echo "  Ollama:       http://localhost:11434"
    fi
    
    if [[ $profile == "voice" || $profile == "full" ]]; then
        echo "  Whisper STT:  http://localhost:8001"
        echo "  Coqui TTS:    http://localhost:8002"
        echo "  Voice Gateway: http://localhost:8003"
    fi
}

stop_services() {
    echo -e "${YELLOW}Stopping all Startales services...${NC}"
    
    # Stop all possible configurations
    docker compose -f docker-compose.master.yml --profile full down 2>/dev/null || true
    docker compose -f docker-compose.demo.yml down 2>/dev/null || true
    
    echo -e "${GREEN}All services stopped${NC}"
}

show_status() {
    echo -e "${BLUE}Startales Services Status:${NC}"
    echo ""
    
    # Check if network exists
    if docker network ls | grep -q startales; then
        echo -e "${GREEN}✓${NC} Network: startales"
    else
        echo -e "${RED}✗${NC} Network: startales (not found)"
    fi
    
    # Check running containers
    echo ""
    echo "Running containers:"
    docker ps --filter "network=startales" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" 2>/dev/null || echo "No containers running"
}

show_logs() {
    echo -e "${BLUE}Showing logs for all services...${NC}"
    docker compose -f docker-compose.master.yml logs -f
}

# Parse arguments
PROFILE=""
BUILD_FLAG=""
SHOW_LOGS=false
STOP_SERVICES=false
SHOW_STATUS=false

while [[ $# -gt 0 ]]; do
    case $1 in
        core|ai|voice|full|demo)
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
        -h|--help)
            print_usage
            exit 0
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
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
elif [ -n "$PROFILE" ]; then
    start_services "$PROFILE" "$BUILD_FLAG"
    if [ "$SHOW_LOGS" = true ]; then
        show_logs
    fi
else
    echo -e "${RED}No profile specified${NC}"
    print_usage
    exit 1
fi
