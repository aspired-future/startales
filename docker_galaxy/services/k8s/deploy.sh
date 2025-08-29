#!/bin/bash
# Kubernetes Deployment Script for StarTales
# Supports up to 10,000 concurrent players

set -e

echo "🚀 Deploying StarTales to Kubernetes..."

# Configuration
NAMESPACE="startales"
KUBECTL_CMD="kubectl"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    if ! command -v kubectl &> /dev/null; then
        log_error "kubectl is not installed or not in PATH"
        exit 1
    fi
    
    if ! command -v docker &> /dev/null; then
        log_error "docker is not installed or not in PATH"
        exit 1
    fi
    
    # Check if cluster is accessible
    if ! kubectl cluster-info &> /dev/null; then
        log_error "Cannot connect to Kubernetes cluster"
        exit 1
    fi
    
    log_success "Prerequisites check passed"
}

# Build and push Docker images
build_and_push_images() {
    log_info "Building and pushing Docker images..."
    
    # Set your Docker registry here
    REGISTRY=${DOCKER_REGISTRY:-"your-registry.com/startales"}
    
    # Build API image
    log_info "Building API image..."
    docker build -t ${REGISTRY}/api:latest -f ../api/Dockerfile ../../..
    docker push ${REGISTRY}/api:latest
    
    # Build UI image
    log_info "Building UI image..."
    docker build -t ${REGISTRY}/ui:latest -f ../../Dockerfile.ui ../../..
    docker push ${REGISTRY}/ui:latest
    
    # Build STT image
    log_info "Building STT image..."
    docker build -t ${REGISTRY}/stt:latest -f ../stt/Dockerfile ../../..
    docker push ${REGISTRY}/stt:latest
    
    # Build TTS image
    log_info "Building TTS image..."
    docker build -t ${REGISTRY}/tts:latest -f ../tts/Dockerfile ../../..
    docker push ${REGISTRY}/tts:latest
    
    log_success "Docker images built and pushed"
}

# Deploy to Kubernetes
deploy_to_k8s() {
    log_info "Deploying to Kubernetes..."
    
    # Create namespace and basic resources
    log_info "Creating namespace and basic resources..."
    kubectl apply -f namespace.yaml
    kubectl apply -f configmap.yaml
    
    # Deploy databases first
    log_info "Deploying databases..."
    kubectl apply -f database-statefulset.yaml
    
    # Wait for databases to be ready
    log_info "Waiting for databases to be ready..."
    kubectl wait --for=condition=ready pod -l app=postgres -n ${NAMESPACE} --timeout=300s
    kubectl wait --for=condition=ready pod -l app=redis -n ${NAMESPACE} --timeout=300s
    
    # Deploy AI services
    log_info "Deploying AI services..."
    kubectl apply -f ollama-deployment.yaml
    kubectl apply -f stt-deployment.yaml
    kubectl apply -f tts-deployment.yaml
    
    # Wait for AI services to be ready
    log_info "Waiting for AI services to be ready..."
    kubectl wait --for=condition=ready pod -l app=ollama -n ${NAMESPACE} --timeout=600s
    kubectl wait --for=condition=ready pod -l app=stt -n ${NAMESPACE} --timeout=600s
    kubectl wait --for=condition=ready pod -l app=tts -n ${NAMESPACE} --timeout=600s
    
    # Deploy application services
    log_info "Deploying application services..."
    kubectl apply -f api-deployment.yaml
    kubectl apply -f ui-deployment.yaml
    
    # Wait for application services to be ready
    log_info "Waiting for application services to be ready..."
    kubectl wait --for=condition=ready pod -l app=api -n ${NAMESPACE} --timeout=300s
    kubectl wait --for=condition=ready pod -l app=ui -n ${NAMESPACE} --timeout=300s
    
    # Deploy ingress
    log_info "Deploying ingress..."
    kubectl apply -f ingress.yaml
    
    log_success "Kubernetes deployment completed"
}

# Verify deployment
verify_deployment() {
    log_info "Verifying deployment..."
    
    # Check pod status
    log_info "Pod status:"
    kubectl get pods -n ${NAMESPACE}
    
    # Check service status
    log_info "Service status:"
    kubectl get services -n ${NAMESPACE}
    
    # Check ingress status
    log_info "Ingress status:"
    kubectl get ingress -n ${NAMESPACE}
    
    # Check HPA status
    log_info "HPA status:"
    kubectl get hpa -n ${NAMESPACE}
    
    log_success "Deployment verification completed"
}

# Scale for production
scale_for_production() {
    log_info "Scaling for production (10k players)..."
    
    # Scale API pods
    kubectl scale deployment api --replicas=20 -n ${NAMESPACE}
    
    # Scale UI pods
    kubectl scale deployment ui --replicas=10 -n ${NAMESPACE}
    
    # Scale AI services
    kubectl scale deployment stt --replicas=5 -n ${NAMESPACE}
    kubectl scale deployment tts --replicas=5 -n ${NAMESPACE}
    kubectl scale deployment ollama --replicas=3 -n ${NAMESPACE}
    
    log_success "Production scaling completed"
}

# Main execution
main() {
    echo "🎮 StarTales Kubernetes Deployment"
    echo "=================================="
    
    case "${1:-deploy}" in
        "build")
            check_prerequisites
            build_and_push_images
            ;;
        "deploy")
            check_prerequisites
            deploy_to_k8s
            verify_deployment
            ;;
        "scale")
            scale_for_production
            ;;
        "full")
            check_prerequisites
            build_and_push_images
            deploy_to_k8s
            verify_deployment
            scale_for_production
            ;;
        "status")
            verify_deployment
            ;;
        *)
            echo "Usage: $0 {build|deploy|scale|full|status}"
            echo ""
            echo "Commands:"
            echo "  build   - Build and push Docker images"
            echo "  deploy  - Deploy to Kubernetes"
            echo "  scale   - Scale for production (10k players)"
            echo "  full    - Build, deploy, and scale"
            echo "  status  - Check deployment status"
            exit 1
            ;;
    esac
    
    log_success "Operation completed successfully! 🎉"
}

# Run main function
main "$@"
