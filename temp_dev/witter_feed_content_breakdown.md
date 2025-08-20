# Comprehensive Witter Feed Content Breakdown

## Overview
This document provides the complete breakdown of all content types that should appear in the Witter social media feed, including percentages, timing, and integration with various game systems.

## 📊 **Complete Content Distribution**

### **Primary Content Categories (100% Total)**

#### **1. Citizen Life & Social Content - 35%**
- **Daily Life Humor** - 15%
  - Futuristic technology mishaps and everyday galactic life
  - Work-life balance in space-age civilization
  - Relationships and social interactions
  - Consumer experiences with advanced technology

- **Personal Updates** - 10%
  - Life milestones, achievements, and personal news
  - Family events, celebrations, and social gatherings
  - Travel experiences across star systems
  - Hobby and interest sharing

- **Social Commentary** - 10%
  - Cultural observations and social trends
  - Generational differences in galactic society
  - Community events and local happenings
  - Social issues and citizen advocacy

#### **2. Business & Economic News - 20%**
- **Financial Markets** - 8%
  - Stock market movements and analysis
  - Corporate earnings and business performance
  - Investment advice and market commentary
  - Currency and commodity updates

- **Economic Policy** - 6%
  - Government fiscal and monetary policy news
  - Tax policy changes and budget announcements
  - Central bank decisions and economic indicators
  - Trade policy and international economic relations

- **Corporate News** - 6%
  - Company announcements and executive changes
  - Merger and acquisition activity
  - Product launches and business strategy
  - Industry trends and competitive analysis

#### **3. Sports & Entertainment - 18%**
- **Sports News** - 12%
  - Game results and live sports updates
  - Athlete news, transfers, and achievements
  - Team news and coaching changes
  - League updates and rule changes

- **Olympics & Major Events** - 4%
  - Galactic Olympics coverage and results
  - Inter-civilization tournaments
  - Championship events and playoffs
  - Record-breaking performances

- **Entertainment** - 2%
  - Celebrity news and entertainment industry
  - Cultural events and artistic achievements
  - Media releases and reviews
  - Fashion and lifestyle trends

#### **4. Political & Government News - 15%**
- **Official Government** - 8%
  - Policy announcements and government decisions
  - Legislative updates and political developments
  - Diplomatic news and international relations
  - Public service announcements

- **Political Commentary** - 4%
  - Citizen reactions to government policies
  - Political analysis and opinion pieces
  - Election coverage and political campaigns
  - Advocacy and political activism

- **Military & Defense** - 3%
  - Defense policy and military operations
  - Security updates and threat assessments
  - Military technology and procurement
  - Veterans affairs and military community

#### **5. Science & Technology - 7%**
- **Scientific Discoveries** - 4%
  - Research breakthroughs and innovations
  - Space exploration and astronomical discoveries
  - Medical and health advances
  - Environmental and climate science

- **Technology News** - 3%
  - New technology releases and reviews
  - AI and automation developments
  - Infrastructure and engineering projects
  - Cybersecurity and digital privacy

#### **6. Breaking News & Crisis - 5%**
- **Emergency Situations** - 3%
  - Natural disasters and emergency responses
  - Security incidents and public safety
  - Infrastructure failures and system outages
  - Health emergencies and medical alerts

- **Major Announcements** - 2%
  - Civilization-wide important announcements
  - Historical events and commemorations
  - Major policy changes with immediate impact
  - Significant diplomatic developments

---

## 🎯 **Content Distribution by Character Type**

### **Character Type Breakdown**
```typescript
interface ContentByCharacterType {
  // Citizens (55% of all posts)
  citizens: {
    regularCitizens: 35,        // Daily life, personal updates, social commentary
    investors: 7,               // Investment commentary, market reactions
    businessOwners: 5,          // Business perspectives, economic impact
    sportsFans: 8               // Sports reactions, team loyalty, game commentary
  };
  
  // Media & Journalists (25% of all posts)
  media: {
    generalNews: 8,             // Breaking news, general reporting
    financialJournalists: 6,    // Business and economic news
    sportsReporters: 5,         // Sports coverage and analysis
    scienceTech: 3,             // Science and technology reporting
    politicalReporters: 3       // Political news and government coverage
  };
  
  // Officials & Professionals (15% of all posts)
  officials: {
    government: 6,              // Official announcements, policy updates
    military: 2,                // Defense and security updates
    scientists: 3,              // Research announcements, expert analysis
    athletes: 2,                // Athlete personal posts, team updates
    businessLeaders: 2          // Corporate announcements, industry insights
  };
  
  // Analysts & Experts (5% of all posts)
  experts: {
    economicAnalysts: 2,        // Economic analysis and forecasting
    sportsAnalysts: 1,          // Sports analysis and predictions
    politicalAnalysts: 1,       // Political commentary and analysis
    techExperts: 1              // Technology analysis and reviews
  };
}
```

---

## ⏰ **Temporal Content Distribution**

### **Daily Content Rhythm**
```typescript
interface DailyContentRhythm {
  // Morning (6 AM - 12 PM) - 30% of daily content
  morning: {
    newsUpdates: 15,            // Breaking news, overnight developments
    marketOpen: 8,              // Market opening, economic indicators
    sportsRecaps: 4,            // Previous day's games, morning analysis
    personalUpdates: 3          // Good morning posts, daily plans
  };
  
  // Afternoon (12 PM - 6 PM) - 35% of daily content
  afternoon: {
    liveUpdates: 12,            // Real-time news, live sports
    businessNews: 8,            // Corporate announcements, market moves
    socialContent: 10,          // Lunch break posts, social interactions
    governmentNews: 5           // Policy announcements, official updates
  };
  
  // Evening (6 PM - 12 AM) - 30% of daily content
  evening: {
    sportsResults: 10,          // Game results, post-game analysis
    marketClose: 6,             // Market closing, daily summaries
    socialLife: 8,              // Evening activities, entertainment
    personalReflections: 6      // End of day thoughts, personal posts
  };
  
  // Late Night (12 AM - 6 AM) - 5% of daily content
  lateNight: {
    internationalNews: 2,       // News from other time zones
    nightOwls: 2,               // Late night personal posts
    emergencyNews: 1            // Breaking emergency situations
  };
}
```

### **Weekly Content Patterns**
```typescript
interface WeeklyContentPatterns {
  // Monday - Fresh Start (Heavy News/Business)
  monday: {
    businessNews: 25,           // Market outlook, economic previews
    governmentNews: 20,         // Policy announcements, official updates
    sportsNews: 15,             // Weekend sports recap, week ahead
    citizenContent: 40          // Back to work posts, weekly planning
  };
  
  // Tuesday-Thursday - Peak Activity (Balanced Mix)
  midweek: {
    businessNews: 20,           // Regular business operations
    sportsNews: 18,             // Mid-week games, ongoing seasons
    citizenContent: 35,         // Daily life, regular social activity
    newsUpdates: 15,            // Ongoing news developments
    scienceTech: 7,             // Research updates, tech news
    entertainment: 5            // Cultural events, entertainment news
  };
  
  // Friday - Wind Down (Social/Entertainment Focus)
  friday: {
    citizenContent: 45,         // Weekend plans, social anticipation
    sportsNews: 20,             // Weekend sports preview
    businessNews: 15,           // Week wrap-up, market outlook
    entertainment: 12,          // Weekend entertainment options
    newsUpdates: 8              // Week summary, lighter news
  };
  
  // Weekend - Leisure Focus (Sports/Social Heavy)
  weekend: {
    sportsNews: 35,             // Live games, major events
    citizenContent: 40,         // Leisure activities, social gatherings
    entertainment: 15,          // Cultural events, recreational activities
    businessNews: 5,            // Minimal business activity
    newsUpdates: 5              // Emergency/breaking news only
  };
}
```

---

## 🎪 **Special Event Content Adjustments**

### **Major Event Overrides**
When special events occur, content distribution temporarily shifts:

#### **Galactic Olympics (Every 4 Years)**
```typescript
interface OlympicsContentDistribution {
  duration: "2 weeks",
  contentAdjustment: {
    sportsNews: 45,             // +27% (Olympics coverage dominates)
    citizenContent: 30,         // -5% (Olympic reactions, patriotism)
    businessNews: 10,           // -10% (Reduced focus on markets)
    politicalNews: 8,           // -7% (Politics takes backseat)
    scienceTech: 4,             // -3% (Less tech focus)
    entertainment: 3            // -1% (Olympics are entertainment)
  }
}
```

#### **Economic Crisis Events**
```typescript
interface CrisisContentDistribution {
  triggers: ["market_crash", "inflation_spike", "currency_crisis"],
  contentAdjustment: {
    businessNews: 40,           // +20% (Crisis coverage)
    citizenContent: 25,         // -10% (Anxiety, concern posts)
    politicalNews: 20,          // +5% (Government response)
    sportsNews: 10,             // -8% (Less focus on sports)
    scienceTech: 3,             // -4% (Crisis takes priority)
    entertainment: 2            // -3% (Serious mood)
  }
}
```

#### **Major Political Events**
```typescript
interface PoliticalEventDistribution {
  triggers: ["elections", "major_policy", "diplomatic_crisis"],
  contentAdjustment: {
    politicalNews: 35,          // +20% (Political focus)
    citizenContent: 30,         // -5% (Political reactions)
    businessNews: 15,           // -5% (Policy impact on markets)
    sportsNews: 12,             // -6% (Less sports focus)
    scienceTech: 5,             // -2% (Politics dominates)
    entertainment: 3            // -2% (Serious political mood)
  }
}
```

#### **Championship Sports Events**
```typescript
interface ChampionshipContentDistribution {
  triggers: ["league_finals", "major_tournament", "rivalry_games"],
  contentAdjustment: {
    sportsNews: 35,             // +17% (Championship coverage)
    citizenContent: 35,         // 0% (Fan reactions maintain)
    businessNews: 15,           // -5% (Sports betting, sponsorship)
    politicalNews: 8,           // -7% (Sports distraction)
    scienceTech: 4,             // -3% (Less tech focus)
    entertainment: 3            // -1% (Sports are entertainment)
  }
}
```

---

## 🔄 **Dynamic Content Balancing**

### **Real-time Adjustment Factors**
```typescript
interface DynamicContentBalancing {
  // Engagement-based adjustments
  engagementFactors: {
    highEngagementBoost: 1.5,   // Boost content types with high engagement
    lowEngagementReduction: 0.7, // Reduce content types with low engagement
    trendingTopicBoost: 2.0,    // Major boost for trending topics
    controversyMultiplier: 1.3   // Controversial content gets more attention
  };
  
  // Time-sensitive adjustments
  timingFactors: {
    breakingNewsOverride: 3.0,  // Breaking news temporarily dominates
    liveEventBoost: 2.5,        // Live events get priority
    scheduledEventBoost: 1.8,   // Scheduled events get preparation coverage
    anniversaryBoost: 1.4       // Historical anniversaries get attention
  };
  
  // Civilization-specific adjustments
  culturalFactors: {
    militaristicCivs: {         // Military-focused civilizations
      militaryNews: 1.5,
      sportsNews: 1.2,          // Competitive sports culture
      businessNews: 0.9
    },
    commercialCivs: {           // Trade-focused civilizations
      businessNews: 1.6,
      economicNews: 1.4,
      politicalNews: 0.8
    },
    scientificCivs: {           // Research-focused civilizations
      scienceTech: 1.8,
      educationNews: 1.5,
      entertainmentNews: 0.7
    }
  };
}
```

### **Content Quality Metrics**
```typescript
interface ContentQualityMetrics {
  // Engagement metrics
  engagement: {
    likes: number,
    shares: number,
    comments: number,
    clickthrough: number
  };
  
  // Authenticity metrics
  authenticity: {
    characterConsistency: number,  // 0-1 score
    contextualRelevance: number,   // 0-1 score
    culturalAccuracy: number,      // 0-1 score
    temporalConsistency: number    // 0-1 score
  };
  
  // Diversity metrics
  diversity: {
    characterTypeBalance: number,   // Even distribution of character types
    contentCategoryBalance: number, // Balanced content categories
    civilizationRepresentation: number, // All civs represented
    perspectiveVariety: number     // Different viewpoints present
  };
}
```

---

## 🎯 **Implementation Priority**

### **Phase 1: Core Content (Months 1-2)**
1. **Citizen Life Content** (35%) - Basic social media foundation
2. **Basic News Content** (15%) - Essential news and updates
3. **Simple Sports Content** (10%) - Basic game results and reactions

### **Phase 2: Business Integration (Month 3)**
1. **Financial Markets Content** (8%) - Market news and commentary
2. **Economic Policy Content** (6%) - Government economic decisions
3. **Corporate News Content** (6%) - Business announcements

### **Phase 3: Sports Expansion (Month 4)**
1. **Full Sports Coverage** (12%) - Comprehensive sports news
2. **Olympics System** (4%) - Major sporting events
3. **Entertainment Content** (2%) - Cultural and entertainment news

### **Phase 4: Advanced Features (Month 5)**
1. **Dynamic Content Balancing** - Real-time adjustments
2. **Special Event Handling** - Crisis and major event coverage
3. **Quality Metrics** - Content authenticity and engagement tracking

This comprehensive content breakdown ensures a realistic, engaging social media ecosystem that reflects all aspects of galactic civilization life while maintaining proper balance and authentic character voices.
