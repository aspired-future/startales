# Tiered LLM Pricing Strategy

## Executive Summary

Startales will offer **5 subscription tiers** based on AI model quality, with **Ollama (AWS-hosted)** as the primary cost-effective solution for most sessions. This strategy maximizes profit margins while providing clear value differentiation for premium subscribers.

## Model Cost Analysis (Per 1K Tokens)

| Provider | Model | Input Cost | Output Cost | Quality Score | Use Case |
|----------|-------|------------|-------------|---------------|----------|
| **Ollama** | llama3.1:8b | $0.00* | $0.00* | 7/10 | Standard gameplay |
| **Ollama** | llama3.1:70b | $0.00* | $0.00* | 8/10 | Premium gameplay |
| **Gemini** | gemini-1.5-flash | $0.075 | $0.30 | 8/10 | Fast premium |
| **Gemini** | gemini-1.5-pro | $1.25 | $5.00 | 9/10 | Elite gameplay |
| **OpenAI** | gpt-4o-mini | $0.15 | $0.60 | 8/10 | Premium alternative |
| **OpenAI** | gpt-4o | $2.50 | $10.00 | 9/10 | Ultra premium |
| **Anthropic** | claude-3-5-haiku | $0.25 | $1.25 | 8/10 | Narrative focus |
| **Anthropic** | claude-3-5-sonnet | $3.00 | $15.00 | 10/10 | Master tier |
| **Grok** | grok-beta | $5.00 | $15.00 | 8/10 | Real-time events |

*AWS hosting costs: ~$0.50-2.00 per hour for GPU instances

## Subscription Tiers & Model Assignment

### **Tier 1: Cadet ($19.99/month)**
- **Primary Model**: Ollama llama3.1:8b (AWS-hosted)
- **Backup Model**: Gemini 1.5 Flash (cost-capped)
- **Features**:
  - 20 hours/month gameplay
  - Standard AI empires and NPCs
  - Basic voice synthesis
  - Simple narrative generation
- **Target Margin**: 85% (mostly AWS infrastructure costs)

### **Tier 2: Commander ($39.99/month)**
- **Primary Model**: Ollama llama3.1:70b (AWS-hosted)
- **Backup Model**: GPT-4o-mini (cost-capped)
- **Features**:
  - 40 hours/month gameplay
  - Enhanced AI empires with better strategy
  - Improved voice synthesis
  - Richer narrative generation
  - Access to 2 additional alien species
- **Target Margin**: 80%

### **Tier 3: Admiral ($69.99/month)**
- **Primary Model**: Gemini 1.5 Pro
- **Backup Model**: GPT-4o
- **Features**:
  - 60 hours/month gameplay
  - Advanced AI empires with complex diplomacy
  - Premium voice synthesis with character voices
  - Dynamic plot generation
  - Access to all 8 alien species
  - Visual content generation
- **Target Margin**: 70%

### **Tier 4: Fleet Admiral ($99.99/month)**
- **Primary Model**: GPT-4o
- **Backup Model**: Claude 3.5 Sonnet
- **Features**:
  - 100 hours/month gameplay
  - Elite AI empires with human-level strategy
  - Real-time voice cloning
  - Complex multi-threaded narratives
  - Custom species creation
  - Advanced visual generation
  - Priority server access
- **Target Margin**: 60%

### **Tier 5: Galactic Emperor ($149.99/month)**
- **Primary Model**: Claude 3.5 Sonnet
- **Backup Model**: GPT-4o + Grok (for real-time events)
- **Features**:
  - Unlimited gameplay hours
  - Master-level AI empires
  - Real-time voice synthesis with emotional nuance
  - Personalized storylines with deep character development
  - Custom universe creation
  - Advanced visual and audio generation
  - Dedicated server instances
  - Early access to new features
- **Target Margin**: 50%

## Cost Per Hour Analysis

### Typical AI Calls Per Hour of Gameplay
- **Narrative Generation**: 50 calls × 500 tokens avg = 25K tokens
- **NPC Dialogue**: 30 calls × 200 tokens avg = 6K tokens  
- **Strategic AI**: 20 calls × 800 tokens avg = 16K tokens
- **Voice Commands**: 40 calls × 100 tokens avg = 4K tokens
- **Total**: ~51K tokens per hour (25K input, 26K output)

### Cost Per Hour by Tier

| Tier | Model | Input Cost | Output Cost | Total/Hour | Revenue/Hour | Margin |
|------|-------|------------|-------------|------------|--------------|--------|
| Cadet | Ollama 8b | $0.00 | $0.00 | $0.50* | $1.00 | 50% |
| Commander | Ollama 70b | $0.00 | $0.00 | $1.00* | $1.00 | 0% |
| Admiral | Gemini Pro | $0.031 | $0.130 | $0.161 | $1.17 | 86% |
| Fleet Admiral | GPT-4o | $0.063 | $0.260 | $0.323 | $1.00 | 68% |
| Emperor | Claude Sonnet | $0.075 | $0.390 | $0.465 | Unlimited | 95%+ |

*AWS infrastructure costs

## Implementation Strategy

### Phase 1: Ollama Foundation (Month 1-2)
1. **Deploy AWS Ollama Infrastructure**
   - 3x g4dn.xlarge instances for llama3.1:8b
   - 2x g4dn.2xlarge instances for llama3.1:70b
   - Auto-scaling based on demand
   - **Cost**: ~$1,500/month for 200+ concurrent players

2. **Register All Adapters**
   - OllamaLLMAdapter (primary)
   - OpenAILLMAdapter (premium backup)
   - AnthropicLLMAdapter (ultra premium)
   - GeminiLLMAdapter (cost-effective premium)
   - GrokLLMAdapter (special features)

3. **Test with Ollama**
   - Validate llama3.1:8b performance for basic gameplay
   - Test llama3.1:70b for enhanced experiences
   - Measure response times and quality

### Phase 2: Premium Tier Launch (Month 3)
1. **Enable Cloud Provider Adapters**
   - Implement cost monitoring and caps
   - Set up automatic failover chains
   - Configure per-tier model selection

2. **Launch Tiered Subscriptions**
   - Start with Cadet and Commander tiers
   - Monitor usage patterns and costs
   - Optimize model selection based on real data

### Phase 3: Full Tier Rollout (Month 4-6)
1. **Launch All Tiers**
   - Admiral, Fleet Admiral, and Emperor tiers
   - Advanced features for premium tiers
   - Custom model fine-tuning for top tier

2. **Advanced Features**
   - Voice cloning for premium tiers
   - Visual generation for Admiral+
   - Real-time event integration with Grok

## Cost Control Mechanisms

### **Hard Caps**
- **Per-session limits**: Max tokens per game session
- **Monthly limits**: Total AI spend per subscriber
- **Emergency shutoffs**: Automatic suspension if costs exceed 2x expected

### **Smart Routing**
- **Load balancing**: Route to cheapest available model
- **Quality fallback**: Degrade gracefully under high load
- **Geographic routing**: Use regional Ollama instances

### **Usage Optimization**
- **Caching**: Cache common responses and character personalities
- **Batching**: Group similar requests together
- **Compression**: Optimize prompts and responses

## Revenue Projections

### Conservative Estimates (Year 1)
| Tier | Subscribers | Monthly Revenue | Annual Revenue |
|------|-------------|-----------------|----------------|
| Cadet | 500 | $9,995 | $119,940 |
| Commander | 200 | $7,998 | $95,976 |
| Admiral | 100 | $6,999 | $83,988 |
| Fleet Admiral | 50 | $4,999 | $59,988 |
| Emperor | 20 | $2,999 | $35,988 |
| **Total** | **870** | **$32,990** | **$395,880** |

### Aggressive Estimates (Year 2)
| Tier | Subscribers | Monthly Revenue | Annual Revenue |
|------|-------------|-----------------|----------------|
| Cadet | 2,000 | $39,980 | $479,760 |
| Commander | 800 | $31,992 | $383,904 |
| Admiral | 400 | $27,996 | $335,952 |
| Fleet Admiral | 200 | $19,998 | $239,976 |
| Emperor | 100 | $14,999 | $179,988 |
| **Total** | **3,500** | **$134,965** | **$1,619,580** |

## Competitive Advantages

### **Cost Leadership**
- **60-85% lower AI costs** than competitors using only cloud APIs
- **Scalable infrastructure** that grows with revenue
- **Multiple provider redundancy** prevents vendor lock-in

### **Quality Differentiation**
- **Clear value tiers** with measurable AI quality differences
- **Premium experiences** justify higher pricing
- **Unlimited tier** captures high-value customers

### **Technical Moats**
- **Custom Ollama deployment** expertise
- **Multi-provider adapter framework** 
- **Real-time optimization** algorithms

## Risk Mitigation

### **Technical Risks**
- **Ollama failures**: Multi-provider failover chains
- **AWS outages**: Multi-region deployment
- **Model quality issues**: A/B testing and user feedback

### **Financial Risks**
- **Cost overruns**: Hard caps and monitoring
- **Pricing pressure**: Flexible tier adjustments
- **Competition**: Continuous model evaluation and updates

### **Operational Risks**
- **Scaling challenges**: Auto-scaling infrastructure
- **Support burden**: Automated tier-appropriate support
- **Churn**: Quality monitoring and proactive upgrades

## Success Metrics

### **Financial KPIs**
- **Gross margin by tier**: Target 50-85%
- **AI cost per subscriber**: Target <30% of revenue
- **Tier upgrade rate**: Target 15% monthly

### **Technical KPIs**
- **Response latency**: <2s for all tiers
- **Uptime**: 99.9% for all services
- **Model quality scores**: User satisfaction >4.2/5

### **Business KPIs**
- **Subscriber growth**: 25% month-over-month
- **Revenue per user**: Increase 10% quarterly
- **Churn rate**: <5% monthly across all tiers

## Conclusion

This tiered LLM strategy provides:
- **Immediate profitability** with Ollama-based tiers
- **Clear upgrade paths** for subscribers
- **Scalable cost structure** that grows with revenue
- **Competitive differentiation** through AI quality
- **Risk mitigation** through provider diversity

**Recommendation**: Implement Phase 1 immediately with Ollama infrastructure, then gradually roll out premium tiers as subscriber base grows and validates the model.
