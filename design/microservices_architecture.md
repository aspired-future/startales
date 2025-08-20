# Microservices Architecture Design

## Overview
This document outlines the scalable microservices architecture for the Startales game system, designed to support 50-10,000 players per server cluster with horizontal scaling capabilities.

## Architecture Principles

### Core Principles
- **Microservices**: Each domain has its own service with clear boundaries
- **Containerization**: All services run in Docker containers
- **Horizontal Scaling**: Services can scale independently based on load
- **Event-Driven**: Services communicate via events and message queues
- **Database per Service**: Each service owns its data
- **API Gateway**: Single entry point for external clients
- **Service Discovery**: Dynamic service registration and discovery

### Scaling Targets
- **Phase 1**: 50 concurrent players (MVP)
- **Phase 2**: 500 concurrent players 
- **Phase 3**: 10,000 concurrent players per server cluster

## Service Architecture

### Core Services

#### 1. API Gateway Service
- **Purpose**: Single entry point, routing, authentication, rate limiting
- **Technology**: Node.js + Express + Redis
- **Scaling**: 2-5 instances behind load balancer
- **Responsibilities**:
  - Request routing to appropriate services
  - JWT authentication and authorization
  - Rate limiting and DDoS protection
  - Request/response transformation
  - API versioning

#### 2. Realtime Gateway Service (WebSocket)
- **Purpose**: WebSocket connections, real-time communication
- **Technology**: Node.js + ws + Redis Pub/Sub
- **Scaling**: 5-20 instances (sticky sessions)
- **Responsibilities**:
  - WebSocket connection management
  - Real-time message routing
  - Presence tracking
  - Channel management
  - Connection state synchronization

#### 3. Campaign Service
- **Purpose**: Campaign management, game state
- **Technology**: Node.js + PostgreSQL
- **Scaling**: 2-10 instances
- **Responsibilities**:
  - Campaign CRUD operations
  - Game state management
  - Player management
  - Session management

#### 4. Simulation Engine Service
- **Purpose**: Game simulation, physics, AI
- **Technology**: Node.js + PostgreSQL + Redis
- **Scaling**: 5-50 instances (CPU intensive)
- **Responsibilities**:
  - Game tick processing
  - Physics simulation
  - NPC AI behavior
  - Economic simulation
  - World state updates

#### 5. Provider Adapter Service
- **Purpose**: AI provider integrations (LLM, STT, TTS, Image)
- **Technology**: Node.js + Redis Queue
- **Scaling**: 3-15 instances
- **Responsibilities**:
  - LLM request processing
  - STT/TTS processing
  - Image generation
  - Provider failover and load balancing
  - Response caching

#### 6. Analytics Service
- **Purpose**: Metrics, telemetry, analytics
- **Technology**: Node.js + ClickHouse/TimescaleDB
- **Scaling**: 2-5 instances
- **Responsibilities**:
  - Metrics collection and aggregation
  - Performance monitoring
  - Player analytics
  - System health monitoring

#### 7. Content Service
- **Purpose**: Static content, assets, content packs
- **Technology**: Node.js + S3/MinIO
- **Scaling**: 2-8 instances
- **Responsibilities**:
  - Asset storage and delivery
  - Content pack management
  - CDN integration
  - File upload/download

#### 8. Notification Service
- **Purpose**: Push notifications, email, alerts
- **Technology**: Node.js + Redis Queue
- **Scaling**: 2-5 instances
- **Responsibilities**:
  - Push notification delivery
  - Email notifications
  - System alerts
  - Notification templates

### Supporting Infrastructure

#### Message Queue (NATS/Redis)
- **Purpose**: Inter-service communication
- **Technology**: NATS Streaming or Redis Streams
- **Scaling**: 3-node cluster
- **Usage**:
  - Event publishing/subscribing
  - Task queues
  - Service-to-service messaging

#### Service Discovery (Consul/etcd)
- **Purpose**: Service registration and discovery
- **Technology**: Consul or etcd
- **Scaling**: 3-node cluster
- **Usage**:
  - Service health checks
  - Configuration management
  - Load balancer configuration

#### Monitoring Stack
- **Prometheus**: Metrics collection
- **Grafana**: Visualization and dashboards
- **Jaeger**: Distributed tracing
- **ELK Stack**: Centralized logging

## Data Architecture

### Database Strategy
- **PostgreSQL**: Primary database for transactional data
- **Redis**: Caching, sessions, real-time data
- **ClickHouse/TimescaleDB**: Analytics and time-series data
- **MinIO/S3**: Object storage for assets

### Data Patterns
- **Database per Service**: Each service owns its data
- **Event Sourcing**: For audit trails and state reconstruction
- **CQRS**: Separate read/write models for complex queries
- **Caching**: Multi-level caching strategy

## Communication Patterns

### Synchronous Communication
- **HTTP/REST**: Client-to-service via API Gateway
- **gRPC**: High-performance service-to-service calls

### Asynchronous Communication
- **Event Publishing**: Services publish domain events
- **Message Queues**: Task processing and background jobs
- **WebSockets**: Real-time client communication

### Event Types
- **Domain Events**: Business logic events (player joined, campaign created)
- **Integration Events**: Cross-service coordination
- **System Events**: Infrastructure and monitoring events

## Scaling Strategy

### Horizontal Scaling
- **Stateless Services**: All services designed to be stateless
- **Load Balancing**: Round-robin, least connections, or weighted
- **Auto-scaling**: Based on CPU, memory, and custom metrics

### Vertical Scaling
- **Resource Allocation**: CPU and memory per service type
- **Performance Tuning**: JVM tuning, connection pooling
- **Hardware Optimization**: SSD storage, high-memory instances

### Caching Strategy
- **L1 Cache**: In-memory application cache
- **L2 Cache**: Redis distributed cache
- **L3 Cache**: CDN for static assets
- **Cache Invalidation**: Event-driven cache updates

## Deployment Architecture

### Container Strategy
```yaml
# Example service deployment
version: '3.8'
services:
  api-gateway:
    image: startales/api-gateway:latest
    replicas: 3
    resources:
      limits:
        cpus: '1.0'
        memory: 512M
    environment:
      - NODE_ENV=production
      - REDIS_URL=redis://redis-cluster:6379
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

### Orchestration
- **Docker Compose**: Development and small deployments
- **Kubernetes**: Production scaling and orchestration
- **Docker Swarm**: Alternative for simpler deployments

### Service Mesh (Optional)
- **Istio**: Advanced traffic management, security, observability
- **Linkerd**: Lightweight service mesh alternative

## Security Architecture

### Authentication & Authorization
- **JWT Tokens**: Stateless authentication
- **OAuth 2.0**: Third-party authentication
- **RBAC**: Role-based access control
- **API Keys**: Service-to-service authentication

### Network Security
- **TLS/SSL**: All communication encrypted
- **Network Policies**: Service-to-service communication rules
- **Firewall Rules**: Infrastructure-level protection
- **VPN**: Secure admin access

### Data Security
- **Encryption at Rest**: Database and file encryption
- **PII Redaction**: Automated sensitive data handling
- **Audit Logging**: All access and changes logged
- **Backup Encryption**: Secure backup storage

## Monitoring & Observability

### Metrics
- **Application Metrics**: Business and technical metrics
- **Infrastructure Metrics**: CPU, memory, network, disk
- **Custom Metrics**: Game-specific KPIs

### Logging
- **Structured Logging**: JSON format with correlation IDs
- **Centralized Logging**: ELK stack or similar
- **Log Levels**: DEBUG, INFO, WARN, ERROR
- **Log Retention**: Configurable retention policies

### Tracing
- **Distributed Tracing**: Request flow across services
- **Performance Monitoring**: Latency and bottleneck identification
- **Error Tracking**: Exception monitoring and alerting

### Health Checks
- **Liveness Probes**: Service availability
- **Readiness Probes**: Service ready to handle requests
- **Dependency Checks**: External service health

## Development Workflow

### Local Development
- **Docker Compose**: Full stack local development
- **Service Mocking**: Mock external dependencies
- **Hot Reloading**: Fast development iteration
- **Database Seeding**: Consistent test data

### CI/CD Pipeline
- **Build**: Docker image creation
- **Test**: Unit, integration, and E2E tests
- **Security Scan**: Vulnerability scanning
- **Deploy**: Automated deployment to environments

### Testing Strategy
- **Unit Tests**: Individual service testing
- **Integration Tests**: Service interaction testing
- **Contract Tests**: API contract validation
- **Load Tests**: Performance and scalability testing
- **Chaos Engineering**: Failure resilience testing

## Performance Targets

### Latency Targets
- **API Response**: < 100ms (95th percentile)
- **WebSocket Messages**: < 50ms
- **Database Queries**: < 10ms (simple), < 100ms (complex)
- **Cache Access**: < 1ms

### Throughput Targets
- **API Requests**: 10,000 RPS per service
- **WebSocket Messages**: 100,000 messages/second
- **Database Operations**: 50,000 ops/second
- **Queue Processing**: 10,000 jobs/second

### Resource Targets
- **CPU Utilization**: < 70% average
- **Memory Usage**: < 80% of allocated
- **Network Bandwidth**: < 80% of capacity
- **Storage I/O**: < 80% of IOPS capacity

## Migration Strategy

### Phase 1: Containerization (Current)
- Containerize existing monolithic services
- Set up basic Docker Compose environment
- Implement health checks and monitoring

### Phase 2: Service Extraction
- Extract Provider Adapter Service
- Extract Realtime Gateway Service
- Implement message queue communication

### Phase 3: Full Microservices
- Extract remaining services
- Implement service discovery
- Add comprehensive monitoring

### Phase 4: Advanced Features
- Service mesh implementation
- Advanced auto-scaling
- Multi-region deployment

## Configuration Management

### Environment Configuration
- **Development**: Local Docker Compose
- **Staging**: Kubernetes cluster (small)
- **Production**: Kubernetes cluster (full scale)

### Service Configuration
- **Environment Variables**: Runtime configuration
- **Config Maps**: Kubernetes configuration
- **Secrets Management**: Encrypted sensitive data
- **Feature Flags**: Runtime feature toggles

This architecture provides a solid foundation for scaling from 50 to 10,000 players while maintaining performance, reliability, and maintainability.
