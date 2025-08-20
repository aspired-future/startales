# 🎮 Startales Demo Access Guide

## 🚀 Quick Start

### Option 1: Direct Demo Server (Recommended)
```bash
npm run demo:start
```

### Option 2: Docker (If Available)
```bash
docker compose -f docker/docker-compose.demo.yml up --build -d
```

### Option 3: Manual Start
```bash
cd src
npx tsx demo/index.ts
```

## 🎯 All Available Demos

Once the server is running, access these demos in your browser:

### **🎮 Core Simulation Engine** (Sprint 1) ✅
- **URL**: `http://localhost:4010/demo/hud`
- **Features**: 
  - Interactive simulation step engine
  - Real-time KPI tracking (production, military, science)
  - Resource management (credits, materials, energy, food)
  - Building system with queues
  - Deterministic PRNG testing

### **💾 Persistence & Event Sourcing** (Sprint 2) ✅
- **URL**: `http://localhost:4010/demo/persistence`
- **Features**:
  - Campaign save/resume/branch functionality
  - SQLite database with event sourcing
  - Event replay and state reconstruction
  - Campaign lifecycle management

### **📜 Policies & Advisors** (Sprint 3) ✅
- **URL**: `http://localhost:4010/demo/policies`
- **Features**:
  - Natural language policy creation
  - AI-powered policy parsing and validation
  - 5 domain advisors (Economic, Military, Science, Infrastructure, Foreign)
  - Policy lifecycle management (draft → active → expired)

### **💰 Trade & Economy** (Sprint 4) ✅
- **URL**: `http://localhost:4010/demo/trade`
- **Features**:
  - Dynamic pricing with supply/demand
  - Trade route creation and management
  - Contract system (buy/sell/exchange)
  - Market analytics and price indices

### **👥 Population & Demographics Engine** (Sprint 5) ✅ **NEW!**
- **URL**: `http://localhost:4010/demo/population`
- **Features**:
  - Individual citizen modeling with psychological profiles
  - Population demographics and analytics
  - Incentive response testing and policy impact analysis
  - Citizen behavior simulation and demographic evolution
  - Real-time population metrics and inequality tracking

## 🔗 API Endpoints

### **Simulation Engine APIs**
- `GET /api/sim/step` - Execute simulation step
- `GET /api/sim/state` - Get current simulation state
- `POST /api/sim/reset` - Reset simulation

### **Campaign Management APIs**
- `GET /api/campaigns` - List all campaigns
- `POST /api/campaigns` - Create new campaign
- `GET /api/campaigns/:id/resume` - Resume campaign
- `POST /api/campaigns/:id/step` - Execute campaign step
- `POST /api/campaigns/:id/branch` - Branch campaign

### **Policy System APIs**
- `GET /api/policies` - List all policies
- `POST /api/policies` - Create new policy
- `POST /api/policies/activate` - Activate policy
- `GET /api/advisors/:domain/query` - Query domain advisor

### **Trade System APIs**
- `GET /api/trade/prices` - Get current market prices
- `GET /api/trade/routes` - List trade routes
- `POST /api/trade/contracts` - Create trade contract
- `GET /api/trade/indices` - Get market indices

### **Population System APIs** **NEW!**
- `GET /api/population/citizens` - Get citizens (with filtering)
- `GET /api/population/demographics` - Get population metrics
- `POST /api/population/incentives` - Test incentive responses
- `POST /api/population/simulate` - Simulate population evolution
- `GET /api/population/analytics/trends` - Get demographic trends
- `GET /api/population/health` - Population system health check

## 🎯 What Each Demo Shows

### **Core Simulation** - The Foundation
- Demonstrates the deterministic simulation engine that powers everything
- Shows how resources, buildings, and queues work together
- Validates that the same seed produces identical results

### **Persistence** - Save Your Progress
- Shows how campaigns can be saved, resumed, and branched
- Demonstrates event sourcing for reliable state management
- Proves that complex game states can be perfectly reconstructed

### **Policies** - Government in Action
- Natural language policy creation ("Increase military spending by 40%")
- AI advisors provide contextual recommendations
- Shows how policies modify simulation behavior

### **Trade** - Economic Complexity
- Dynamic market pricing based on supply and demand
- Trade routes with capacity and tariff management
- Contract system for complex economic relationships

### **Population** - Living Citizens **NEW!**
- Individual citizens with unique psychological profiles
- Realistic demographic distributions and social mobility
- Policy impact testing with authentic behavioral responses
- Population evolution over time with life events and decisions

## 🔧 Troubleshooting

### Server Won't Start
1. Make sure you're in the project root directory
2. Run `npm install` to ensure dependencies are installed
3. Check that port 4010 is available
4. Try the manual start method: `cd src && npx tsx demo/index.ts`

### API Endpoints Not Working
1. Verify the server is running on port 4010
2. Check the console for any error messages
3. Test the health endpoint: `http://localhost:4010/api/population/health`

### Demo Pages Not Loading
1. Ensure the server started successfully
2. Check browser console for JavaScript errors
3. Try refreshing the page or clearing browser cache

## 🎮 Demo Flow Recommendations

### **New Users**: Start with Core Simulation
1. Visit `/demo/hud` to understand the basic simulation
2. Try `/demo/persistence` to see save/resume functionality
3. Explore `/demo/policies` for government mechanics

### **Economic Focus**: Trade & Population
1. Start with `/demo/trade` for market dynamics
2. Move to `/demo/population` for citizen behavior
3. Test how policies affect both trade and citizens

### **Complete Experience**: All Systems
1. Core Simulation → Persistence → Policies → Trade → Population
2. See how each system builds on the previous ones
3. Experience the full complexity of governing a civilization

## 🚀 Next Steps

With Sprint 5 complete, we now have:
- ✅ **5 Complete Systems** with interactive demos
- ✅ **25+ API Endpoints** for comprehensive game management
- ✅ **Individual Citizen Modeling** with realistic behavior
- ✅ **Economic Simulation** with authentic market dynamics
- ✅ **Policy System** with AI-powered natural language processing

**Ready for Sprint 6**: Profession & Industry System to build on the citizen career foundation!

---

**🎉 Enjoy exploring the living, breathing civilization simulation!** 🏙️✨
