# Database & Storage Strategy for Startales

## Executive Summary

**Hybrid approach combining managed services for simplicity and self-hosted solutions for cost optimization**. Start with managed services (RDS, ElastiCache, S3) for rapid deployment, then migrate to self-hosted solutions as scale increases beyond 500 concurrent players.

## Database Architecture

### **Multi-Database Strategy**

```
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                        │
└─────────────────┬───────────────────────────────────────────┘
                  │
    ┌─────────────┼─────────────────┐
    │             │                 │
┌───▼────┐  ┌────▼────┐      ┌────▼────┐
│Primary │  │ Session │      │ Vector  │
│Game DB │  │ Cache   │      │   DB    │
│(OLTP)  │  │(Redis)  │      │(Qdrant) │
└────────┘  └─────────┘      └─────────┘
    │
┌───▼────┐
│Analytics│
│   DB    │
│(OLAP)   │
└─────────┘
```

### **Database Selection by Scale**

| Component | 0-100 Players | 100-500 Players | 500+ Players |
|-----------|---------------|------------------|---------------|
| **Primary Game DB** | RDS PostgreSQL (db.t3.medium) | RDS PostgreSQL (db.r5.large) | Self-hosted PostgreSQL Cluster |
| **Session Cache** | ElastiCache Redis (cache.t3.micro) | ElastiCache Redis (cache.r5.large) | Self-hosted Redis Cluster |
| **Vector DB** | Self-hosted Qdrant (t3.medium) | Self-hosted Qdrant (r5.large) | Self-hosted Qdrant Cluster |
| **Analytics DB** | Same as Primary | RDS PostgreSQL (separate) | Self-hosted ClickHouse |

## Cost Analysis by Scale

### **Small Scale (50 Players)**

| Service | Managed AWS | Self-Hosted EC2 | Monthly Savings |
|---------|-------------|------------------|-----------------|
| **Primary DB** | $180 (db.r5.large) | $90 (r5.large) | $90 (50%) |
| **Cache** | $120 (cache.r5.large) | $45 (r5.large) | $75 (63%) |
| **Vector DB** | N/A (not available) | $60 (t3.large) | N/A |
| **Storage** | $50 (EBS + S3) | $30 (EBS only) | $20 (40%) |
| **Total** | $350 | $225 | **$125 (36%)** |

### **Medium Scale (500 Players)**

| Service | Managed AWS | Self-Hosted EC2 | Monthly Savings |
|---------|-------------|------------------|-----------------|
| **Primary DB** | $360 (db.r5.xlarge) | $180 (r5.xlarge) | $180 (50%) |
| **Cache** | $240 (cache.r5.xlarge) | $90 (r5.xlarge) | $150 (63%) |
| **Vector DB** | N/A | $90 (r5.large) | N/A |
| **Analytics DB** | $180 (db.r5.large) | $90 (r5.large) | $90 (50%) |
| **Storage** | $200 (EBS + S3) | $120 (EBS only) | $80 (40%) |
| **Total** | $980 | $570 | **$410 (42%)** |

### **Large Scale (5000 Players)**

| Service | Managed AWS | Self-Hosted EC2 | Monthly Savings |
|---------|-------------|------------------|-----------------|
| **Primary DB** | $1,440 (db.r5.4xlarge) | $540 (3x r5.xlarge cluster) | $900 (63%) |
| **Cache** | $960 (cache.r5.4xlarge) | $270 (3x r5.xlarge cluster) | $690 (72%) |
| **Vector DB** | N/A | $270 (3x r5.large cluster) | N/A |
| **Analytics DB** | $720 (db.r5.2xlarge) | $360 (2x r5.xlarge cluster) | $360 (50%) |
| **Storage** | $800 (EBS + S3) | $400 (EBS only) | $400 (50%) |
| **Total** | $3,920 | $1,840 | **$2,080 (53%)** |

## Storage Strategy

### **Multi-Tier Storage Architecture**

```
┌─────────────────────────────────────────────────────────────┐
│                     CDN (CloudFront)                        │
│                   Global Edge Caches                        │
└─────────────────┬───────────────────────────────────────────┘
                  │
    ┌─────────────┼─────────────────┐
    │             │                 │
┌───▼────┐  ┌────▼────┐      ┌────▼────┐
│Hot Data│  │Warm Data│      │Cold Data│
│  EFS   │  │S3 Standard│    │S3 Glacier│
│$0.30/GB│  │$0.023/GB│     │$0.004/GB│
└────────┘  └─────────┘      └─────────┘
```

### **Storage Allocation by Data Type**

| Data Type | Storage Solution | Access Pattern | Retention | Cost/GB/Month |
|-----------|------------------|----------------|-----------|---------------|
| **Game Assets** | EFS + CloudFront | High frequency, shared | Permanent | $0.30 + CDN |
| **Player Saves** | S3 Standard | Medium frequency | 2 years | $0.023 |
| **Session Data** | Redis (memory) | Ultra-high frequency | 24 hours | $0.50 (memory) |
| **Game Logs** | S3 Standard → Glacier | Low frequency | 7 years | $0.023 → $0.004 |
| **AI Models** | EFS | Medium frequency, shared | Permanent | $0.30 |
| **Backups** | S3 Glacier | Very low frequency | 10 years | $0.004 |
| **Analytics Data** | S3 Standard | Medium frequency | 5 years | $0.023 |

## Implementation Strategy

### **Phase 1: Managed Services Foundation (Month 1)**

```bash
# Deploy managed services for rapid startup
aws rds create-db-instance \
  --db-instance-identifier startales-primary \
  --db-instance-class db.r5.large \
  --engine postgres \
  --engine-version 15.4 \
  --allocated-storage 100 \
  --storage-type gp3 \
  --storage-encrypted \
  --multi-az \
  --backup-retention-period 7 \
  --deletion-protection

aws elasticache create-cache-cluster \
  --cache-cluster-id startales-cache \
  --cache-node-type cache.r5.large \
  --engine redis \
  --engine-version 7.0 \
  --num-cache-nodes 1 \
  --security-group-ids sg-12345678
```

**Benefits:**
- Immediate deployment (< 30 minutes)
- Automated backups and maintenance
- Built-in monitoring and alerting
- High availability out of the box

**Costs:** ~$350/month for 50 players

### **Phase 2: Hybrid Approach (Month 3)**

```yaml
# docker-compose.yml for self-hosted components
version: '3.8'
services:
  qdrant:
    image: qdrant/qdrant:v1.7.0
    ports:
      - "6333:6333"
      - "6334:6334"
    volumes:
      - qdrant_data:/qdrant/storage
    environment:
      QDRANT__SERVICE__HTTP_PORT: 6333
      QDRANT__SERVICE__GRPC_PORT: 6334
    deploy:
      resources:
        limits:
          memory: 4G
        reservations:
          memory: 2G

  postgres-analytics:
    image: postgres:15
    environment:
      POSTGRES_DB: startales_analytics
      POSTGRES_USER: analytics_user
      POSTGRES_PASSWORD: ${ANALYTICS_DB_PASSWORD}
    volumes:
      - analytics_data:/var/lib/postgresql/data
    ports:
      - "5433:5432"
    command: >
      postgres
      -c shared_preload_libraries=pg_stat_statements
      -c pg_stat_statements.track=all
      -c max_connections=200
      -c shared_buffers=1GB
      -c effective_cache_size=3GB

volumes:
  qdrant_data:
  analytics_data:
```

**Benefits:**
- Cost optimization for specialized workloads
- Better control over vector database performance
- Separation of OLTP and OLAP workloads

**Costs:** ~$570/month for 500 players

### **Phase 3: Full Self-Hosted Clusters (Month 6)**

```yaml
# kubernetes/postgres-cluster.yaml
apiVersion: postgresql.cnpg.io/v1
kind: Cluster
metadata:
  name: postgres-cluster
spec:
  instances: 3
  
  postgresql:
    parameters:
      max_connections: "400"
      shared_buffers: "2GB"
      effective_cache_size: "6GB"
      maintenance_work_mem: "512MB"
      checkpoint_completion_target: "0.9"
      wal_buffers: "16MB"
      default_statistics_target: "100"
      random_page_cost: "1.1"
      effective_io_concurrency: "200"
      
  bootstrap:
    initdb:
      database: startales
      owner: gameuser
      secret:
        name: postgres-credentials
        
  storage:
    size: 500Gi
    storageClass: gp3
    
  monitoring:
    enabled: true
    
  backup:
    retentionPolicy: "30d"
    barmanObjectStore:
      destinationPath: "s3://startales-backups/postgres"
      s3Credentials:
        accessKeyId:
          name: backup-credentials
          key: ACCESS_KEY_ID
        secretAccessKey:
          name: backup-credentials
          key: SECRET_ACCESS_KEY
      wal:
        retention: "5d"
      data:
        retention: "30d"
```

**Benefits:**
- Maximum cost optimization (53% savings)
- Full control over performance tuning
- Custom backup and disaster recovery
- Horizontal scaling capabilities

**Costs:** ~$1,840/month for 5000 players

## Container Orchestration Strategy

### **Docker Compose → Kubernetes Migration Path**

| Stage | Orchestration | Complexity | Management Overhead | Cost |
|-------|---------------|------------|-------------------|------|
| **Stage 1** | Docker Compose | Low | Manual scaling | Lowest |
| **Stage 2** | Docker Swarm | Medium | Semi-automated | Low |
| **Stage 3** | Managed K8s (EKS) | High | AWS-managed control plane | Medium |
| **Stage 4** | Self-hosted K8s | Very High | Full self-management | Lowest |

### **When to Adopt Kubernetes**

**Adopt Kubernetes when you have:**
- 500+ concurrent players
- 20+ microservices
- Multi-region deployment needs
- Complex scaling requirements
- Dedicated DevOps team

**Kubernetes Benefits for Gaming:**
- **Auto-scaling**: Handle traffic spikes during events
- **Rolling updates**: Zero-downtime deployments
- **Resource optimization**: Better hardware utilization
- **Multi-tenancy**: Isolate different game environments
- **Disaster recovery**: Automated failover and recovery

### **Self-Hosted vs Managed Kubernetes**

| Aspect | EKS (Managed) | Self-Hosted |
|--------|---------------|-------------|
| **Control Plane Cost** | $73/month per cluster | $0 |
| **Management Overhead** | Low | High |
| **Customization** | Limited | Full |
| **Security Updates** | Automated | Manual |
| **Break-even Point** | Never (for cost) | 10+ nodes |
| **Recommendation** | < 1000 players | 1000+ players |

## Database Performance Optimization

### **PostgreSQL Tuning for Gaming Workloads**

```sql
-- postgresql.conf optimizations
shared_buffers = '25% of RAM'
effective_cache_size = '75% of RAM'
maintenance_work_mem = '1GB'
checkpoint_completion_target = 0.9
wal_buffers = '16MB'
default_statistics_target = 100
random_page_cost = 1.1  -- For SSD storage
effective_io_concurrency = 200

-- Gaming-specific optimizations
max_connections = 400
work_mem = '4MB'
max_wal_size = '4GB'
min_wal_size = '1GB'

-- Enable query optimization
shared_preload_libraries = 'pg_stat_statements'
track_activity_query_size = 2048
pg_stat_statements.track = all
```

### **Redis Configuration for Session Management**

```conf
# redis.conf for gaming sessions
maxmemory 8gb
maxmemory-policy allkeys-lru
save 900 1
save 300 10
save 60 10000

# Optimize for gaming workloads
tcp-keepalive 300
timeout 0
tcp-backlog 511
databases 16

# Persistence for critical session data
appendonly yes
appendfsync everysec
no-appendfsync-on-rewrite no
auto-aof-rewrite-percentage 100
auto-aof-rewrite-min-size 64mb
```

## Backup & Disaster Recovery

### **Multi-Tier Backup Strategy**

| Data Type | Backup Frequency | Retention | Storage | RTO | RPO |
|-----------|------------------|-----------|---------|-----|-----|
| **Game State** | Every 15 minutes | 7 days | S3 Standard | 5 minutes | 15 minutes |
| **Player Data** | Every hour | 30 days | S3 Standard | 15 minutes | 1 hour |
| **Analytics** | Daily | 1 year | S3 IA | 4 hours | 24 hours |
| **System Config** | On change | Permanent | Git + S3 | 1 minute | 0 |

### **Automated Backup Scripts**

```bash
#!/bin/bash
# automated-backup.sh

# PostgreSQL backup
pg_dump -h $DB_HOST -U $DB_USER -d startales | \
  gzip | \
  aws s3 cp - s3://startales-backups/postgres/$(date +%Y%m%d_%H%M%S).sql.gz

# Redis backup
redis-cli --rdb /tmp/redis_backup.rdb
aws s3 cp /tmp/redis_backup.rdb s3://startales-backups/redis/$(date +%Y%m%d_%H%M%S).rdb

# Qdrant backup
curl -X POST "http://localhost:6333/collections/game_vectors/snapshots"
SNAPSHOT_NAME=$(curl -X GET "http://localhost:6333/collections/game_vectors/snapshots" | jq -r '.result[-1].name')
curl -X GET "http://localhost:6333/collections/game_vectors/snapshots/$SNAPSHOT_NAME/download" \
  --output /tmp/qdrant_snapshot.tar
aws s3 cp /tmp/qdrant_snapshot.tar s3://startales-backups/qdrant/$(date +%Y%m%d_%H%M%S).tar

# Cleanup local files
rm -f /tmp/redis_backup.rdb /tmp/qdrant_snapshot.tar
```

## Monitoring & Alerting

### **Database Monitoring Stack**

```yaml
# monitoring/prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'postgres'
    static_configs:
      - targets: ['postgres-exporter:9187']
  
  - job_name: 'redis'
    static_configs:
      - targets: ['redis-exporter:9121']
      
  - job_name: 'qdrant'
    static_configs:
      - targets: ['qdrant:6333']

rule_files:
  - "alerts.yml"

alerting:
  alertmanagers:
    - static_configs:
        - targets:
          - alertmanager:9093
```

### **Critical Alerts**

```yaml
# alerts.yml
groups:
- name: database
  rules:
  - alert: PostgreSQLDown
    expr: pg_up == 0
    for: 1m
    labels:
      severity: critical
    annotations:
      summary: "PostgreSQL is down"
      
  - alert: RedisDown
    expr: redis_up == 0
    for: 1m
    labels:
      severity: critical
    annotations:
      summary: "Redis is down"
      
  - alert: HighDatabaseConnections
    expr: pg_stat_database_numbackends / pg_settings_max_connections > 0.8
    for: 5m
    labels:
      severity: warning
    annotations:
      summary: "High database connection usage"
      
  - alert: LowDiskSpace
    expr: (node_filesystem_avail_bytes / node_filesystem_size_bytes) < 0.1
    for: 5m
    labels:
      severity: critical
    annotations:
      summary: "Low disk space on database server"
```

## Security Best Practices

### **Database Security**

```sql
-- Create dedicated users with minimal privileges
CREATE USER game_app WITH PASSWORD 'secure_password';
CREATE USER analytics_readonly WITH PASSWORD 'analytics_password';

-- Grant minimal required permissions
GRANT CONNECT ON DATABASE startales TO game_app;
GRANT USAGE ON SCHEMA public TO game_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO game_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO game_app;

-- Read-only access for analytics
GRANT CONNECT ON DATABASE startales TO analytics_readonly;
GRANT USAGE ON SCHEMA public TO analytics_readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO analytics_readonly;
```

### **Network Security**

```yaml
# Security groups for database tier
DatabaseSecurityGroup:
  Type: AWS::EC2::SecurityGroup
  Properties:
    GroupDescription: Database tier security group
    VpcId: !Ref VPC
    SecurityGroupIngress:
      - IpProtocol: tcp
        FromPort: 5432
        ToPort: 5432
        SourceSecurityGroupId: !Ref ApplicationSecurityGroup
      - IpProtocol: tcp
        FromPort: 6379
        ToPort: 6379
        SourceSecurityGroupId: !Ref ApplicationSecurityGroup
      - IpProtocol: tcp
        FromPort: 6333
        ToPort: 6333
        SourceSecurityGroupId: !Ref ApplicationSecurityGroup
```

## Migration Strategy

### **Phase 1 → Phase 2 Migration (Managed to Hybrid)**

```bash
#!/bin/bash
# migrate-to-hybrid.sh

# 1. Deploy self-hosted Qdrant
docker-compose up -d qdrant

# 2. Migrate vector data
python scripts/migrate_vectors.py --source=pinecone --target=qdrant

# 3. Deploy analytics database
docker-compose up -d postgres-analytics

# 4. Migrate analytics data
pg_dump -h rds-endpoint.amazonaws.com -U user analytics_db | \
  psql -h localhost -U analytics_user startales_analytics

# 5. Update application configuration
kubectl set env deployment/game-engine VECTOR_DB_URL=http://qdrant:6333
kubectl set env deployment/analytics-service DB_URL=postgresql://localhost:5433/startales_analytics

# 6. Verify migration
python scripts/verify_migration.py
```

## Conclusion

**Recommended Strategy:**
1. **Start with managed services** (RDS, ElastiCache) for rapid deployment
2. **Migrate to self-hosted** when you reach 300-500 concurrent players
3. **Adopt Kubernetes** when you have 500+ players and 20+ services
4. **Use hybrid storage** (S3 for cold data, EFS for hot data, EBS for databases)

**Key Benefits:**
- **66% cost reduction** at scale through self-hosting
- **Predictable scaling** with container orchestration
- **High availability** through clustering and replication
- **Performance optimization** through custom tuning
- **Data sovereignty** and compliance control

**Next Steps:**
1. Deploy Phase 1 managed services for immediate launch
2. Plan Phase 2 migration timeline based on user growth
3. Implement comprehensive monitoring and alerting
4. Establish backup and disaster recovery procedures
5. Prepare Kubernetes migration strategy for future scale
