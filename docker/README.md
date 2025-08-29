# StarTales Docker & Kubernetes Infrastructure

This directory contains the complete containerization and orchestration setup for StarTales, supporting development environments up to production deployments for 10,000+ concurrent players.

## 🏗️ Architecture Overview

### Service Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend UI   │    │   API Service   │    │  AI Services    │
│   (React/Vite)  │◄──►│   (Node.js)     │◄──►│  (STT/TTS/LLM)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   PostgreSQL    │    │     Redis       │    │     Qdrant      │
│   (Database)    │    │    (Cache)      │    │   (Vectors)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Scaling Strategy
- **Development**: Single instance per service
- **50 Players**: 2-3 replicas with load balancing
- **10k Players**: Auto-scaling with HPA, multiple availability zones

## 📁 Directory Structure

```
docker/
├── services/                    # Individual service containers
│   ├── api/                    # Main API service
│   │   └── Dockerfile
│   ├── stt/                    # Speech-to-Text service
│   │   ├── Dockerfile
│   │   ├── app.py
│   │   └── requirements.txt
│   ├── tts/                    # Text-to-Speech service
│   │   ├── Dockerfile
│   │   ├── app.py
│   │   └── requirements.txt
│   ├── ollama/                 # Local LLM service
│   │   ├── docker-compose.yml
│   │   └── init-models.sh
│   └── k8s/                    # Kubernetes manifests
│       ├── namespace.yaml
│       ├── configmap.yaml
│       ├── api-deployment.yaml
│       ├── ui-deployment.yaml
│       ├── stt-deployment.yaml
│       ├── tts-deployment.yaml
│       ├── ollama-deployment.yaml
│       ├── database-statefulset.yaml
│       ├── ingress.yaml
│       └── deploy.sh
├── docker-compose.yml          # Development setup
├── docker-compose.production.yml # Production setup (50 players)
├── docker-compose.voice.yml    # Voice services (legacy)
├── docker-compose.microservices.yml # Full microservices (legacy)
└── README.md                   # This file
```

## 🚀 Quick Start

### Development Environment

1. **Start all services:**
   ```bash
   docker-compose up -d
   ```

2. **Access the application:**
   - Frontend: http://localhost:5173
   - API: http://localhost:4000
   - STT Service: http://localhost:8001
   - TTS Service: http://localhost:8002
   - Ollama: http://localhost:11434

3. **View logs:**
   ```bash
   docker-compose logs -f [service-name]
   ```

### Production Environment (50 Players)

1. **Deploy production stack:**
   ```bash
   docker-compose -f docker-compose.production.yml up -d
   ```

2. **Monitor with Grafana:**
   - Grafana: http://localhost:3000 (admin/admin123)
   - Prometheus: http://localhost:9090

### Kubernetes (10k Players)

1. **Deploy to Kubernetes:**
   ```bash
   cd docker/services/k8s
   ./deploy.sh full
   ```

2. **Scale for production:**
   ```bash
   ./deploy.sh scale
   ```

## 🔧 Service Configuration

### API Service
- **Port**: 4000
- **Replicas**: 2-50 (auto-scaling)
- **Resources**: 500m-2000m CPU, 1-4Gi RAM
- **Health Check**: `/api/health`

### STT Service (Speech-to-Text)
- **Port**: 8000
- **Model**: Whisper (base/small/medium)
- **Replicas**: 2-10 (auto-scaling)
- **Resources**: 1000m-2000m CPU, 2-4Gi RAM

### TTS Service (Text-to-Speech)
- **Port**: 8000
- **Model**: Coqui TTS
- **Replicas**: 2-8 (auto-scaling)
- **Resources**: 1000m-2000m CPU, 3-6Gi RAM

### Ollama Service (Local LLM)
- **Port**: 11434
- **Models**: llama3.2:3b, llama3.2:8b, codellama:7b
- **Replicas**: 1-5 (auto-scaling)
- **Resources**: 2000m-4000m CPU, 8-16Gi RAM

## 📊 Monitoring & Observability

### Metrics Collection
- **Prometheus**: Metrics aggregation
- **Grafana**: Visualization dashboards
- **Node Exporter**: System metrics
- **cAdvisor**: Container metrics

### Logging
- **Centralized Logging**: All services log to stdout
- **Log Aggregation**: Loki (Kubernetes) or Docker logs
- **Log Retention**: 30 days

### Health Checks
- **Liveness Probes**: Detect crashed containers
- **Readiness Probes**: Traffic routing decisions
- **Startup Probes**: Slow-starting containers

## 🔐 Security

### Container Security
- **Non-root users**: All containers run as non-root
- **Resource limits**: CPU and memory constraints
- **Network policies**: Restricted inter-pod communication
- **Image scanning**: Vulnerability detection

### Secrets Management
- **Kubernetes Secrets**: API keys and passwords
- **ConfigMaps**: Non-sensitive configuration
- **TLS Certificates**: Let's Encrypt integration

## 📈 Performance Tuning

### Database Optimization
- **Connection Pooling**: PgBouncer for PostgreSQL
- **Query Optimization**: pg_stat_statements enabled
- **Backup Strategy**: Automated daily backups

### Caching Strategy
- **Redis**: Session and application caching
- **CDN**: Static asset delivery
- **Browser Caching**: Optimized cache headers

### AI Service Optimization
- **Model Caching**: Persistent volumes for models
- **Batch Processing**: Efficient request handling
- **GPU Acceleration**: CUDA support (when available)

## 🚨 Troubleshooting

### Common Issues

1. **Services not starting:**
   ```bash
   docker-compose logs [service-name]
   kubectl logs -f deployment/[service-name] -n startales
   ```

2. **Database connection issues:**
   ```bash
   # Check database status
   docker-compose exec postgres pg_isready -U gtw
   kubectl exec -it postgres-0 -n startales -- pg_isready -U gtw
   ```

3. **AI services out of memory:**
   ```bash
   # Check resource usage
   docker stats
   kubectl top pods -n startales
   ```

4. **High latency:**
   ```bash
   # Check service mesh metrics
   kubectl get hpa -n startales
   ```

### Performance Monitoring

```bash
# Docker Compose
docker-compose exec api curl http://localhost:4000/api/health
docker-compose exec stt curl http://localhost:8000/health
docker-compose exec tts curl http://localhost:8000/health

# Kubernetes
kubectl get pods -n startales
kubectl get hpa -n startales
kubectl top pods -n startales
```

## 🔄 CI/CD Integration

### GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy to Kubernetes
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Deploy to K8s
      run: |
        cd docker/services/k8s
        ./deploy.sh full
```

### Image Versioning
- **Development**: `latest` tag
- **Staging**: `staging-{commit-hash}`
- **Production**: `v{version}` semantic versioning

## 📚 Additional Resources

- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Prometheus Monitoring](https://prometheus.io/docs/)
- [Grafana Dashboards](https://grafana.com/docs/)

## 🤝 Contributing

1. **Development Setup**: Use `docker-compose.yml`
2. **Testing**: Run integration tests with `docker-compose -f docker-compose.test.yml up`
3. **Production Testing**: Use `docker-compose.production.yml` locally
4. **Kubernetes Testing**: Use `minikube` or `kind` for local K8s testing

---

**Note**: This infrastructure is designed to scale from development (single developer) to production (10,000+ concurrent players). Choose the appropriate deployment method based on your current needs.