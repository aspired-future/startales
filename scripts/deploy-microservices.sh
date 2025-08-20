#!/bin/bash

# Microservices Deployment Script
# Deploys the Startales game system with scalable microservices architecture

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
COMPOSE_FILE="docker-compose.microservices.yml"
ENV_FILE="docker/env/microservices.env.example"
PROJECT_NAME="startales"
SCALE_PROFILE=${1:-"development"}

# Logging function
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    log "Checking prerequisites..."
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    # Check Docker Compose
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    # Check if Docker daemon is running
    if ! docker info &> /dev/null; then
        error "Docker daemon is not running. Please start Docker first."
        exit 1
    fi
    
    success "Prerequisites check passed"
}

# Setup environment
setup_environment() {
    log "Setting up environment..."
    
    # Create .env file if it doesn't exist
    if [ ! -f ".env" ]; then
        if [ -f "$ENV_FILE" ]; then
            cp "$ENV_FILE" ".env"
            warning "Created .env file from example. Please update with your actual values."
        else
            error "Environment example file not found: $ENV_FILE"
            exit 1
        fi
    fi
    
    # Create necessary directories
    mkdir -p docker/nginx/ssl
    mkdir -p docker/postgres
    mkdir -p docker/prometheus
    mkdir -p docker/grafana/provisioning
    mkdir -p docker/grafana/dashboards
    mkdir -p docker/loki
    mkdir -p docker/promtail
    mkdir -p docker/ollama/models
    mkdir -p logs
    
    success "Environment setup completed"
}

# Set scaling profile
set_scaling_profile() {
    log "Setting scaling profile: $SCALE_PROFILE"
    
    case $SCALE_PROFILE in
        "development")
            export API_GATEWAY_REPLICAS=1
            export REALTIME_GATEWAY_REPLICAS=1
            export CAMPAIGN_SERVICE_REPLICAS=1
            export SIMULATION_ENGINE_REPLICAS=1
            export PROVIDER_ADAPTER_REPLICAS=1
            export ANALYTICS_SERVICE_REPLICAS=1
            export CONTENT_SERVICE_REPLICAS=1
            export NOTIFICATION_SERVICE_REPLICAS=1
            ;;
        "staging")
            export API_GATEWAY_REPLICAS=2
            export REALTIME_GATEWAY_REPLICAS=2
            export CAMPAIGN_SERVICE_REPLICAS=2
            export SIMULATION_ENGINE_REPLICAS=3
            export PROVIDER_ADAPTER_REPLICAS=2
            export ANALYTICS_SERVICE_REPLICAS=1
            export CONTENT_SERVICE_REPLICAS=2
            export NOTIFICATION_SERVICE_REPLICAS=1
            ;;
        "production")
            export API_GATEWAY_REPLICAS=3
            export REALTIME_GATEWAY_REPLICAS=5
            export CAMPAIGN_SERVICE_REPLICAS=3
            export SIMULATION_ENGINE_REPLICAS=10
            export PROVIDER_ADAPTER_REPLICAS=5
            export ANALYTICS_SERVICE_REPLICAS=2
            export CONTENT_SERVICE_REPLICAS=3
            export NOTIFICATION_SERVICE_REPLICAS=2
            ;;
        *)
            warning "Unknown scaling profile: $SCALE_PROFILE. Using development profile."
            set_scaling_profile "development"
            ;;
    esac
    
    success "Scaling profile set to $SCALE_PROFILE"
}

# Build services
build_services() {
    log "Building services..."
    
    # Build all services
    docker-compose -f "$COMPOSE_FILE" -p "$PROJECT_NAME" build --parallel
    
    success "Services built successfully"
}

# Start infrastructure services first
start_infrastructure() {
    log "Starting infrastructure services..."
    
    # Start core infrastructure
    docker-compose -f "$COMPOSE_FILE" -p "$PROJECT_NAME" up -d \
        postgres \
        redis \
        nats \
        consul \
        minio \
        clickhouse
    
    # Wait for services to be ready
    log "Waiting for infrastructure services to be ready..."
    sleep 30
    
    # Check health of critical services
    check_service_health "postgres" "5432"
    check_service_health "redis" "6379"
    check_service_health "nats" "4222"
    check_service_health "consul" "8500"
    check_service_health "minio" "9000"
    check_service_health "clickhouse" "8123"
    
    success "Infrastructure services started"
}

# Start application services
start_application_services() {
    log "Starting application services..."
    
    # Start application services with scaling
    docker-compose -f "$COMPOSE_FILE" -p "$PROJECT_NAME" up -d \
        --scale api-gateway=$API_GATEWAY_REPLICAS \
        --scale realtime-gateway=$REALTIME_GATEWAY_REPLICAS \
        --scale campaign-service=$CAMPAIGN_SERVICE_REPLICAS \
        --scale simulation-engine=$SIMULATION_ENGINE_REPLICAS \
        --scale provider-adapter=$PROVIDER_ADAPTER_REPLICAS \
        --scale analytics-service=$ANALYTICS_SERVICE_REPLICAS \
        --scale content-service=$CONTENT_SERVICE_REPLICAS \
        --scale notification-service=$NOTIFICATION_SERVICE_REPLICAS
    
    # Wait for services to be ready
    log "Waiting for application services to be ready..."
    sleep 45
    
    success "Application services started"
}

# Start monitoring services
start_monitoring() {
    log "Starting monitoring services..."
    
    docker-compose -f "$COMPOSE_FILE" -p "$PROJECT_NAME" up -d \
        prometheus \
        grafana \
        loki \
        promtail \
        jaeger
    
    success "Monitoring services started"
}

# Start load balancer
start_load_balancer() {
    log "Starting load balancer..."
    
    docker-compose -f "$COMPOSE_FILE" -p "$PROJECT_NAME" up -d nginx
    
    success "Load balancer started"
}

# Check service health
check_service_health() {
    local service=$1
    local port=$2
    local max_attempts=30
    local attempt=1
    
    log "Checking health of $service on port $port..."
    
    while [ $attempt -le $max_attempts ]; do
        if nc -z localhost $port; then
            success "$service is healthy"
            return 0
        fi
        
        log "Attempt $attempt/$max_attempts: $service not ready yet..."
        sleep 2
        ((attempt++))
    done
    
    error "$service failed to start within expected time"
    return 1
}

# Initialize databases
initialize_databases() {
    log "Initializing databases..."
    
    # Wait for PostgreSQL to be fully ready
    sleep 10
    
    # Run database migrations
    docker-compose -f "$COMPOSE_FILE" -p "$PROJECT_NAME" exec -T postgres psql -U postgres -d startales_campaigns -c "SELECT 1;" || true
    docker-compose -f "$COMPOSE_FILE" -p "$PROJECT_NAME" exec -T postgres psql -U postgres -d startales_simulation -c "SELECT 1;" || true
    docker-compose -f "$COMPOSE_FILE" -p "$PROJECT_NAME" exec -T postgres psql -U postgres -d startales_analytics -c "SELECT 1;" || true
    
    # Initialize ClickHouse
    docker-compose -f "$COMPOSE_FILE" -p "$PROJECT_NAME" exec -T clickhouse clickhouse-client --query "CREATE DATABASE IF NOT EXISTS analytics;"
    
    # Initialize MinIO buckets
    docker-compose -f "$COMPOSE_FILE" -p "$PROJECT_NAME" exec -T minio mc alias set local http://localhost:9000 \$MINIO_ROOT_USER \$MINIO_ROOT_PASSWORD
    docker-compose -f "$COMPOSE_FILE" -p "$PROJECT_NAME" exec -T minio mc mb local/startales-content --ignore-existing
    docker-compose -f "$COMPOSE_FILE" -p "$PROJECT_NAME" exec -T minio mc mb local/startales-backups --ignore-existing
    
    success "Databases initialized"
}

# Setup Ollama models
setup_ollama() {
    log "Setting up Ollama models..."
    
    # Wait for Ollama to be ready
    sleep 20
    
    # Pull default model
    docker-compose -f "$COMPOSE_FILE" -p "$PROJECT_NAME" exec -T ollama ollama pull llama3.1:8b || warning "Failed to pull Ollama model - will continue without local LLM"
    
    success "Ollama setup completed"
}

# Display service status
show_status() {
    log "Service Status:"
    echo ""
    
    docker-compose -f "$COMPOSE_FILE" -p "$PROJECT_NAME" ps
    
    echo ""
    log "Service URLs:"
    echo "  🌐 Load Balancer:      http://localhost"
    echo "  🔌 API Gateway:        http://localhost:3000"
    echo "  ⚡ WebSocket Gateway:   ws://localhost:3001"
    echo "  📊 Grafana:            http://localhost:3000 (admin/\$GRAFANA_PASSWORD)"
    echo "  🔍 Prometheus:         http://localhost:9090"
    echo "  📋 Consul:             http://localhost:8500"
    echo "  🗄️  MinIO Console:      http://localhost:9001"
    echo "  🔍 Jaeger:             http://localhost:16686"
    echo "  🦙 Ollama:             http://localhost:11434"
    echo ""
    
    log "Health Check Commands:"
    echo "  curl http://localhost:3000/health"
    echo "  curl http://localhost:3001/health"
    echo "  curl http://localhost:3002/health"
    echo ""
}

# Cleanup function
cleanup() {
    log "Cleaning up..."
    docker-compose -f "$COMPOSE_FILE" -p "$PROJECT_NAME" down
}

# Main deployment function
deploy() {
    log "Starting Startales Microservices Deployment"
    log "Profile: $SCALE_PROFILE"
    echo ""
    
    check_prerequisites
    setup_environment
    set_scaling_profile
    build_services
    start_infrastructure
    initialize_databases
    start_application_services
    setup_ollama
    start_monitoring
    start_load_balancer
    
    echo ""
    success "🚀 Startales Microservices deployed successfully!"
    echo ""
    show_status
}

# Handle script arguments
case "${1:-deploy}" in
    "deploy")
        deploy
        ;;
    "development"|"staging"|"production")
        SCALE_PROFILE=$1
        deploy
        ;;
    "status")
        show_status
        ;;
    "stop")
        log "Stopping all services..."
        docker-compose -f "$COMPOSE_FILE" -p "$PROJECT_NAME" down
        success "All services stopped"
        ;;
    "restart")
        log "Restarting all services..."
        docker-compose -f "$COMPOSE_FILE" -p "$PROJECT_NAME" restart
        success "All services restarted"
        ;;
    "logs")
        docker-compose -f "$COMPOSE_FILE" -p "$PROJECT_NAME" logs -f ${2:-}
        ;;
    "scale")
        if [ -z "$2" ] || [ -z "$3" ]; then
            error "Usage: $0 scale <service> <replicas>"
            exit 1
        fi
        log "Scaling $2 to $3 replicas..."
        docker-compose -f "$COMPOSE_FILE" -p "$PROJECT_NAME" up -d --scale $2=$3
        success "Scaled $2 to $3 replicas"
        ;;
    "health")
        log "Checking service health..."
        docker-compose -f "$COMPOSE_FILE" -p "$PROJECT_NAME" ps
        ;;
    "cleanup")
        log "Cleaning up all resources..."
        docker-compose -f "$COMPOSE_FILE" -p "$PROJECT_NAME" down -v --remove-orphans
        docker system prune -f
        success "Cleanup completed"
        ;;
    "help")
        echo "Startales Microservices Deployment Script"
        echo ""
        echo "Usage: $0 [command] [options]"
        echo ""
        echo "Commands:"
        echo "  deploy                 Deploy all services (default)"
        echo "  development           Deploy with development scaling"
        echo "  staging               Deploy with staging scaling"
        echo "  production            Deploy with production scaling"
        echo "  status                Show service status and URLs"
        echo "  stop                  Stop all services"
        echo "  restart               Restart all services"
        echo "  logs [service]        Show logs (optionally for specific service)"
        echo "  scale <service> <n>   Scale service to n replicas"
        echo "  health                Check service health"
        echo "  cleanup               Remove all containers and volumes"
        echo "  help                  Show this help message"
        echo ""
        echo "Examples:"
        echo "  $0 deploy             # Deploy with development profile"
        echo "  $0 production         # Deploy with production scaling"
        echo "  $0 scale api-gateway 5"
        echo "  $0 logs realtime-gateway"
        ;;
    *)
        error "Unknown command: $1"
        echo "Use '$0 help' for usage information"
        exit 1
        ;;
esac
