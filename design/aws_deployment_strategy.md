# AWS Deployment Strategy: Self-Hosted STT/TTS

## Executive Summary

Running open-source STT/TTS models on AWS provides **60-85% cost savings** compared to cloud APIs while maintaining high performance and reliability. This strategy is particularly effective for games with consistent voice usage patterns.

## Cost Analysis

### Current Cloud API Costs (Per Month)
| Service | Provider | Rate | 50 Players | 500 Players | 5000 Players |
|---------|----------|------|------------|--------------|---------------|
| STT | OpenAI Whisper API | $0.006/min | $1,080 | $10,800 | $108,000 |
| TTS | OpenAI TTS | $0.015/1K chars | $23 | $230 | $2,300 |
| **Total** | | | **$1,103** | **$11,030** | **$110,300** |

### AWS Self-Hosted Costs (Per Month)
| Component | 50 Players | 500 Players | 5000 Players |
|-----------|------------|--------------|---------------|
| GPU Instances | $378 (1x g4dn.xlarge) | $1,134 (3x g4dn.xlarge) | $3,780 (10x g4dn.xlarge) |
| Load Balancer | $23 (ALB) | $23 (ALB) | $69 (3x ALB) |
| Storage | $20 (EBS) | $60 (EBS) | $200 (EBS) |
| Data Transfer | $50 | $150 | $500 |
| **Total** | **$471** | **$1,367** | **$4,549** |
| **Savings** | **$632 (57%)** | **$9,663 (88%)** | **$105,751 (96%)** |

## Architecture Overview

### Core Components

1. **STT Service (Whisper)**
   - Model: OpenAI Whisper Large v3
   - Hardware: NVIDIA T4 GPU (g4dn instances)
   - Container: Custom Docker image with CUDA support
   - API: FastAPI with WebSocket streaming

2. **TTS Service (Coqui XTTS)**
   - Model: Coqui XTTS v2 (multilingual, voice cloning)
   - Hardware: Same GPU instances (shared with STT)
   - Container: Custom Docker image with PyTorch
   - API: FastAPI with streaming audio output

3. **Load Balancing & Scaling**
   - Application Load Balancer (ALB)
   - Auto Scaling Groups
   - CloudWatch metrics for scaling decisions
   - ECS Fargate for container orchestration

### Deployment Architecture

```
Internet Gateway
    ↓
Application Load Balancer
    ↓
ECS Cluster (Multiple AZs)
    ├── STT/TTS Service (g4dn.xlarge)
    ├── STT/TTS Service (g4dn.xlarge)  
    └── STT/TTS Service (g4dn.xlarge)
    ↓
Shared EFS Storage (Models)
    ↓
CloudWatch Logs & Metrics
```

## Implementation Strategy

### Phase 1: Single Instance Setup (50-100 players)
- 1x g4dn.xlarge instance
- Combined STT/TTS service
- Basic monitoring
- **Cost: ~$471/month**

### Phase 2: High Availability (100-500 players)
- 3x g4dn.xlarge instances across AZs
- Load balancer with health checks
- Auto-scaling based on queue depth
- **Cost: ~$1,367/month**

### Phase 3: Enterprise Scale (500+ players)
- Dedicated STT and TTS instance pools
- Advanced monitoring and alerting
- Multi-region deployment
- **Cost: Scales linearly with usage**

## Technical Implementation

### Docker Configuration

```dockerfile
# STT/TTS Service Dockerfile
FROM nvidia/cuda:11.8-devel-ubuntu22.04

# Install Python and dependencies
RUN apt-get update && apt-get install -y \
    python3.10 python3-pip ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# Install Python packages
COPY requirements.txt .
RUN pip install -r requirements.txt

# Download models (done at build time)
RUN python -c "import whisper; whisper.load_model('large-v3')"
RUN python -c "from TTS.api import TTS; TTS('tts_models/multilingual/multi-dataset/xtts_v2')"

COPY . /app
WORKDIR /app
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### ECS Task Definition

```json
{
  "family": "stt-tts-service",
  "requiresCompatibilities": ["EC2"],
  "networkMode": "bridge",
  "cpu": "4096",
  "memory": "15360",
  "taskRoleArn": "arn:aws:iam::ACCOUNT:role/ecs-task-role",
  "containerDefinitions": [
    {
      "name": "stt-tts",
      "image": "your-account.dkr.ecr.region.amazonaws.com/stt-tts:latest",
      "portMappings": [
        {
          "containerPort": 8000,
          "protocol": "tcp"
        }
      ],
      "resourceRequirements": [
        {
          "type": "GPU",
          "value": "1"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/stt-tts",
          "awslogs-region": "us-east-1"
        }
      }
    }
  ]
}
```

## Performance Optimization

### Model Optimization
- **Whisper**: Use `large-v3` for best accuracy, `base` for speed
- **TTS**: Pre-load voice embeddings, use voice cloning for character voices
- **Batching**: Process multiple requests together when possible
- **Caching**: Cache common phrases and character voices

### Infrastructure Optimization
- **Spot Instances**: Use for 60-70% cost reduction (with proper failover)
- **Reserved Instances**: 1-year commitment for 40% savings
- **EFS**: Shared model storage across instances
- **CloudFront**: CDN for audio file delivery

## Monitoring & Alerting

### Key Metrics
- GPU utilization (target: 70-80%)
- Request latency (STT: <2s, TTS: <3s)
- Queue depth (scale trigger)
- Error rates
- Cost per request

### Scaling Triggers
- **Scale Up**: Queue depth > 10 requests
- **Scale Down**: Queue depth < 2 requests for 10 minutes
- **Emergency**: Error rate > 5%

## Security Considerations

### Network Security
- VPC with private subnets
- Security groups restricting access
- WAF on load balancer
- VPC endpoints for AWS services

### Data Security
- Encryption at rest (EBS, EFS)
- Encryption in transit (TLS)
- IAM roles with minimal permissions
- Audio data retention policies

## Migration Strategy

### Phase 1: Parallel Deployment (Month 1)
- Deploy AWS infrastructure alongside existing cloud APIs
- Route 10% of traffic to AWS for testing
- Monitor performance and costs

### Phase 2: Gradual Migration (Month 2)
- Increase AWS traffic to 50%
- Optimize performance based on real usage
- Fine-tune scaling parameters

### Phase 3: Full Migration (Month 3)
- Route 100% traffic to AWS
- Decommission cloud API subscriptions
- Implement advanced features (voice cloning, etc.)

## Risk Mitigation

### Technical Risks
- **GPU Availability**: Multi-AZ deployment, spot instance mix
- **Model Updates**: Automated deployment pipeline
- **Performance Degradation**: Real-time monitoring and alerting

### Cost Risks
- **Unexpected Scaling**: Cost budgets and alerts
- **Spot Instance Interruption**: Mixed instance types
- **Data Transfer Overages**: CloudFront CDN usage

## ROI Analysis

### Break-Even Points
- **50 Players**: 2.3 months
- **500 Players**: 1.1 months  
- **5000 Players**: 0.4 months

### 3-Year Total Cost of Ownership
| Scale | Cloud APIs | AWS Self-Hosted | Savings |
|-------|------------|-----------------|---------|
| 50 Players | $39,708 | $16,956 | $22,752 (57%) |
| 500 Players | $397,080 | $49,212 | $347,868 (88%) |
| 5000 Players | $3,970,800 | $163,764 | $3,807,036 (96%) |

## Conclusion

Self-hosting STT/TTS on AWS provides:
- **Immediate cost savings**: 57-96% depending on scale
- **Better control**: Custom models, voice cloning, optimization
- **Scalability**: Linear cost scaling with usage
- **Performance**: Dedicated resources, lower latency
- **Privacy**: No data sent to third-party APIs

**Recommendation**: Implement Phase 1 immediately for 50+ concurrent players. The ROI is compelling and the technical risk is manageable with proper monitoring and failover strategies.
