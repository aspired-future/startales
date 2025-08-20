# Sprint 11 Demo Guide: Psychology & Behavioral Economics System

## 🧠 **Psychology & Behavioral Economics System Demo**

**Sprint 11 Complete**: Comprehensive human behavior modeling with Big Five personality traits, behavioral economics, social psychology, and policy response systems.

---

## 🚀 **Quick Start - Demo Access**

### **Primary Demo Interface**
```
http://localhost:4010/demo/psychology
```

### **API Health Check**
```
http://localhost:4010/api/psychology/health
```

### **System Status Verification**
```bash
# Check if Docker containers are running
docker ps

# Check API health
curl http://localhost:4010/api/psychology/health

# Check psychology factors
curl http://localhost:4010/api/psychology/factors
```

---

## 🎯 **Demo Features Overview**

### **1. Psychological Profiling**
- **Generate Individual Profiles**: Create psychological profiles with Big Five personality traits
- **Personality Archetypes**: ENTREPRENEUR, CONSERVATIVE, INNOVATOR, TRADITIONALIST, SOCIAL_LEADER
- **Risk Assessment**: Risk tolerance, loss aversion, time preference, uncertainty tolerance
- **Motivation Systems**: Maslow's hierarchy + comprehensive value systems
- **Cultural Backgrounds**: American, European, Asian, African, Latin American, Mixed

### **2. Behavioral Economics Testing**
- **Loss Aversion**: Test prospect theory and loss aversion coefficients
- **Social Proof**: Analyze social influence effects and group behavior
- **Framing Effects**: Test message framing impact on different personality types
- **Anchoring Bias**: Demonstrate anchoring effects in decision-making
- **Cognitive Biases**: Comprehensive bias modeling and testing

### **3. Policy Response Psychology**
- **Policy Analysis**: Predict citizen reactions to policy changes
- **Compliance Prediction**: Model compliance rates by personality type
- **Adaptation Timelines**: Track policy adaptation phases (shock, resistance, exploration, commitment)
- **Effectiveness Assessment**: Multi-dimensional policy effectiveness analysis
- **Optimization Recommendations**: Psychology-informed policy improvements

### **4. Social Dynamics Modeling**
- **Group Analysis**: Analyze group psychology and social cohesion
- **Influence Networks**: Map social influence patterns and leadership emergence
- **Collective Mood**: Assess population emotional state and trends
- **Social Phenomena**: Identify groupthink, polarization, conformity pressure
- **Change Dynamics**: Model resistance to change and innovation adoption

### **5. Incentive Design System**
- **Create Incentives**: Design behavioral incentives with multiple components
- **Effectiveness Testing**: Test incentive performance across personality types
- **Optimization**: AI-powered incentive design optimization
- **Targeting Analysis**: Precision targeting based on psychological profiles
- **Cost-Benefit Analysis**: ROI and sustainability assessment

### **6. Behavioral Prediction**
- **Response Prediction**: Predict individual behavioral responses to stimuli
- **Scenario Analysis**: Multi-scenario behavioral modeling
- **Model Validation**: Prediction accuracy and confidence assessment
- **Cross-Validation**: Temporal stability and cultural generalization testing

---

## 🔗 **System Integration Demonstrations**

### **Population Engine Integration**
```
http://localhost:4010/demo/population
```
- **Enhanced Citizen Modeling**: Individual psychology drives realistic population behavior
- **Demographic Psychology**: Personality distributions across age groups and cultures
- **Career Psychology**: Profession choices based on personality traits
- **Life Event Responses**: Psychological responses to major life changes

### **Migration System Integration**
```
http://localhost:4010/demo/migration
```
- **Cultural Adaptation**: Psychology of cultural integration and adaptation stress
- **Migration Psychology**: Personality factors in migration decisions
- **Integration Patterns**: Cultural flexibility and adaptation success modeling
- **Community Integration**: Social psychology of migrant community formation

### **Business Engine Integration**
```
http://localhost:4010/demo/businesses
```
- **Entrepreneurial Psychology**: Personality traits driving business success
- **Consumer Behavior**: Psychology-based purchasing decisions and market behavior
- **Employee Psychology**: Workplace behavior and productivity modeling
- **Market Psychology**: Collective market behavior and sentiment analysis

### **City Dynamics Integration**
```
http://localhost:4010/demo/cities
```
- **Urban Psychology**: Community behavior and city development patterns
- **Neighborhood Dynamics**: Social cohesion and community psychology
- **Public Policy Response**: City-level policy psychology and compliance
- **Quality of Life Psychology**: Psychological factors in city attractiveness

---

## 🧪 **Interactive Testing Scenarios**

### **Scenario 1: Policy Implementation**
1. **Navigate to Psychology Demo**: `http://localhost:4010/demo/psychology`
2. **Generate Diverse Profiles**: Create profiles with different archetypes
3. **Test Policy Response**: Analyze reactions to "Universal Basic Income Policy"
4. **Review Compliance Predictions**: Examine compliance rates by personality type
5. **Optimize Policy Design**: Use psychology insights for policy improvements

### **Scenario 2: Behavioral Economics Validation**
1. **Test Loss Aversion**: Run prospect theory validation with different scenarios
2. **Social Proof Analysis**: Test social influence effects with varying group sizes
3. **Framing Effect Testing**: Compare positive vs negative message framing
4. **Cross-Personality Analysis**: Examine how different personalities respond to biases

### **Scenario 3: Incentive Design Optimization**
1. **Create Green Energy Incentive**: Design environmental behavior incentive
2. **Test Effectiveness**: Analyze response rates across personality types
3. **Optimize Components**: Adjust monetary vs social recognition components
4. **Validate Targeting**: Confirm optimal personality targeting strategy

### **Scenario 4: Social Dynamics Analysis**
1. **Analyze City Group**: Examine social dynamics for a city population
2. **Map Influence Networks**: Identify natural leaders and influence patterns
3. **Assess Collective Mood**: Monitor population emotional state
4. **Predict Social Trends**: Forecast social phenomena and group behavior

---

## 📊 **API Testing Guide**

### **Core Psychology APIs**

#### **1. System Health & Status**
```bash
# System health check
curl http://localhost:4010/api/psychology/health

# Psychology factors overview
curl http://localhost:4010/api/psychology/factors

# Comprehensive analytics
curl http://localhost:4010/api/psychology/analytics
```

#### **2. Profile Management**
```bash
# Get all profiles
curl http://localhost:4010/api/psychology/profiles

# Get specific profile
curl http://localhost:4010/api/psychology/profiles/PROFILE_ID

# Create new profile
curl -X POST http://localhost:4010/api/psychology/profiles \
  -H "Content-Type: application/json" \
  -d '{
    "archetype": "ENTREPRENEUR",
    "culturalBackground": "American",
    "citizenId": "demo_citizen_123"
  }'
```

#### **3. Behavioral Prediction**
```bash
# Predict behavioral response
curl -X POST http://localhost:4010/api/psychology/predict \
  -H "Content-Type: application/json" \
  -d '{
    "profileId": "PROFILE_ID",
    "stimulusType": "policy",
    "stimulusId": "carbon_tax_policy",
    "stimulusDetails": {
      "name": "Carbon Tax Implementation",
      "type": "environmental",
      "impact": "medium",
      "cost": 50
    }
  }'
```

#### **4. Incentive Management**
```bash
# Get all incentives
curl http://localhost:4010/api/psychology/incentives

# Create new incentive
curl -X POST http://localhost:4010/api/psychology/incentives \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Solar Panel Incentive",
    "description": "Encourage residential solar adoption",
    "type": "environmental",
    "incentiveComponents": {
      "monetaryReward": 5000,
      "socialRecognition": 70,
      "purposeAlignment": 85
    }
  }'

# Get incentive effectiveness
curl http://localhost:4010/api/psychology/incentives/INCENTIVE_ID/effectiveness
```

#### **5. Social Dynamics**
```bash
# Get social dynamics for group
curl http://localhost:4010/api/psychology/social-dynamics/demo_city_1?groupType=city

# Update social dynamics
curl -X PUT http://localhost:4010/api/psychology/social-dynamics/demo_city_1 \
  -H "Content-Type: application/json" \
  -d '{"groupType": "city"}'
```

#### **6. Policy Analysis**
```bash
# Analyze policy response
curl -X POST http://localhost:4010/api/psychology/policy-responses \
  -H "Content-Type: application/json" \
  -d '{
    "policyId": "healthcare_reform_2025",
    "policyDetails": {
      "name": "Universal Healthcare",
      "type": "social",
      "scope": "national",
      "impact": "high"
    }
  }'

# Get policy responses
curl http://localhost:4010/api/psychology/policy-responses/healthcare_reform_2025
```

---

## 🎮 **Demo Walkthrough Scripts**

### **Complete Psychology Demo (15 minutes)**

#### **Phase 1: System Overview (3 minutes)**
1. Open `http://localhost:4010/demo/psychology`
2. Review system status and integration badges
3. Check system metrics (profile count, risk tolerance, etc.)
4. Explain psychology system architecture and capabilities

#### **Phase 2: Profile Generation (4 minutes)**
1. Click "Generate Profile" to create psychological profile
2. Examine Big Five personality traits and risk profile
3. Review motivation systems and core values
4. Generate multiple profiles with different archetypes
5. Click "Population Overview" to see aggregate analytics

#### **Phase 3: Behavioral Economics (3 minutes)**
1. Test "Loss Aversion" - examine prospect theory results
2. Test "Social Proof" - analyze social influence patterns
3. Test "Framing Effect" - compare message framing impact
4. Review behavioral economics insights and bias patterns

#### **Phase 4: Policy Psychology (3 minutes)**
1. Click "Analyze Policy" to test policy response prediction
2. Review initial reactions and predicted behaviors
3. Examine adaptation timeline and influence factors
4. Test "Predict Compliance" for compliance modeling
5. Review "Policy Effectiveness" optimization recommendations

#### **Phase 5: Integration Demo (2 minutes)**
1. Navigate to integrated system demos
2. Show Population + Psychology integration
3. Demonstrate Migration + Psychology cultural adaptation
4. Highlight Business + Psychology entrepreneurial modeling
5. Explain cross-system psychology data flow

---

## 🔍 **Troubleshooting Guide**

### **Common Issues & Solutions**

#### **Demo Not Loading**
```bash
# Check Docker containers
docker ps

# Restart containers if needed
docker compose -f docker/docker-compose.demo.yml down
docker compose -f docker/docker-compose.demo.yml up -d --build

# Check logs
docker logs docker-api-1
```

#### **API Errors**
```bash
# Verify API health
curl http://localhost:4010/api/psychology/health

# Check specific endpoint
curl -v http://localhost:4010/api/psychology/factors

# Test with sample data
curl -X POST http://localhost:4010/api/psychology/profiles \
  -H "Content-Type: application/json" \
  -d '{"citizenId": "test_123", "archetype": "ENTREPRENEUR"}'
```

#### **No Data in Analytics**
1. Generate some psychological profiles first
2. Create behavioral responses through prediction API
3. Wait for analytics to update (real-time)
4. Refresh demo page to see updated metrics

#### **Integration Issues**
1. Verify all system APIs are healthy
2. Check cross-system data linking (citizen IDs, etc.)
3. Test individual system demos first
4. Verify Docker network connectivity

---

## 📈 **Performance Metrics**

### **Expected Performance**
- **Profile Generation**: < 100ms per profile
- **Behavioral Prediction**: < 200ms per prediction
- **Analytics Generation**: < 500ms for 100+ profiles
- **Policy Analysis**: < 1s for population-wide analysis
- **Social Dynamics**: < 300ms per group analysis

### **Scalability Testing**
```bash
# Generate multiple profiles for testing
for i in {1..50}; do
  curl -X POST http://localhost:4010/api/psychology/profiles \
    -H "Content-Type: application/json" \
    -d "{\"citizenId\": \"perf_test_$i\", \"archetype\": \"ENTREPRENEUR\"}"
done

# Test analytics performance
time curl http://localhost:4010/api/psychology/analytics
```

---

## 🎯 **Key Demo Highlights**

### **Business Value Demonstrations**
1. **Realistic Human Behavior**: Show how psychology drives authentic economic decisions
2. **Policy Optimization**: Demonstrate psychology-informed policy design
3. **Market Psychology**: Explain behavioral economics in trading and investment
4. **Cultural Integration**: Show sophisticated migration and adaptation modeling
5. **Predictive Insights**: Highlight behavioral prediction accuracy and confidence

### **Technical Excellence**
1. **Comprehensive APIs**: 11 REST endpoints with full functionality
2. **System Integration**: Seamless integration with 7 existing systems
3. **Performance**: Efficient handling of large datasets
4. **Testing**: 90+ unit tests with full coverage
5. **Documentation**: Complete technical and user documentation

### **Innovation Showcase**
1. **Big Five Psychology**: Industry-standard personality modeling
2. **Behavioral Economics**: Cutting-edge behavioral science applications
3. **Social Psychology**: Advanced group dynamics and influence modeling
4. **Cultural Psychology**: Sophisticated cultural adaptation systems
5. **AI Integration**: Ready for AI analysis and interpretation systems

---

## 🏆 **Sprint 11 Success Demonstration**

**COMPLETED**: Psychology & Behavioral Economics System provides the behavioral foundation that makes all economic simulation systems realistic and human-centered.

**READY FOR**: Sprint 10 - AI Analysis & Interpretation Engine to leverage psychology system for intelligent economic analysis! 🤖✨
