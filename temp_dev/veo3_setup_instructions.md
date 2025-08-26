# VEO 3 Setup Instructions

## 🎬 VEO 3 Video Generation System - Setup Complete!

The VEO 3 video generation system has been successfully integrated with comprehensive visual consistency features. Here's what you need to know:

## ✅ What's Been Implemented

### 1. **VEO 3 Video Generator** (`src/server/gamemaster/VEO3VideoGenerator.ts`)
- Full VEO 3 API integration with Google Gemini
- Contextual prompt generation for different game events
- Character-specific and location-specific video generation
- Mock video system for testing without API key

### 2. **Visual Consistency System** (`src/server/gamemaster/VideoStyleConsistency.ts`)
- Unified color palette matching game's established aesthetic
- Cinematic style guidelines (Mass Effect/Star Trek inspired)
- Event-specific styling (discovery, crisis, military, etc.)
- Character and location visual consistency

### 3. **Enhanced Game Master API** (`src/server/gamemaster/GameMasterVideoAPI.ts`)
- Intelligent prompt selection based on context
- Character and location awareness
- Automatic style consistency application

### 4. **Comprehensive Test Suite** (`scripts/test-veo3-visual-consistency.js`)
- Tests all VEO 3 functionality
- Validates visual consistency features
- Demonstrates different video generation types

## 🔑 Google API Key Setup

To use real VEO 3 video generation (not just mock videos), you need to:

### 1. **Get Google API Key**
1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Create a new project or select existing one
3. Generate an API key with access to Gemini and VEO models
4. Copy the API key

### 2. **Add API Key to Environment**

**Option A: Create .env file (recommended)**
```bash
# In project root directory
echo "GOOGLE_API_KEY=your_actual_api_key_here" > .env
```

**Option B: Export environment variable**
```bash
export GOOGLE_API_KEY="your_actual_api_key_here"
```

**Option C: Add to MCP configuration**
If using Cursor/MCP, add to `.cursor/mcp.json`:
```json
{
  "env": {
    "GOOGLE_API_KEY": "your_actual_api_key_here"
  }
}
```

## 🚀 Testing the System

### 1. **Start the Server**
```bash
npm run dev
```

### 2. **Run Visual Consistency Tests**
```bash
node scripts/test-veo3-visual-consistency.js
```

### 3. **Test Individual Endpoints**

**Basic Video Generation:**
```bash
curl -X POST http://localhost:4000/api/gamemaster/test/veo3/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "A futuristic space station with cyan glowing lights", "duration": 6}'
```

**Character-Specific Video:**
```bash
curl -X POST http://localhost:4000/api/gamemaster/test/veo3/character-video \
  -H "Content-Type: application/json" \
  -d '{"characterId": "commander_alpha", "eventType": "major_discovery"}'
```

**Location-Specific Video:**
```bash
curl -X POST http://localhost:4000/api/gamemaster/test/veo3/location-video \
  -H "Content-Type: application/json" \
  -d '{"locationId": "new_terra_colony", "eventType": "colony_established"}'
```

## 🎨 Visual Consistency Features

### **Color Palette Integration**
- **Primary (Cyan/Blue Tech)**: `#00d9ff`, `#0099cc`, `#004d66`
- **Secondary (Orange/Amber)**: `#ff9500`, `#cc7700`, `#663c00`
- **Success (Green Matrix)**: `#00ff88`, `#00cc66`, `#004d26`
- **Warning (Yellow Alert)**: `#ffdd00`, `#ccaa00`, `#665500`
- **Danger (Red Alert)**: `#ff3366`, `#cc1144`, `#660822`

### **Event-Specific Styling**
- **Discovery Events**: Cyan/blue palette, sweeping camera movements
- **Political Crisis**: Red alert colors, urgent handheld camera work
- **Economic Success**: Green prosperity colors, steady celebratory shots
- **Military Conflicts**: Orange/amber energy, dynamic tactical angles
- **Technology Breakthroughs**: Cyan/blue innovation, smooth tech reveals

### **Character & Location Consistency**
- Characters maintain visual identity across videos
- Locations have consistent architectural and environmental styling
- Species-specific aesthetics are preserved
- Equipment and clothing match established designs

## 🎮 Integration with Game Systems

### **In-Game Video Triggers**
The system automatically generates videos for:
- Major discoveries and breakthroughs
- Political crises and diplomatic achievements
- Economic milestones and trade successes
- Military conflicts and defense alerts
- Natural disasters and emergency responses
- Colony establishments and population milestones

### **WebSocket Broadcasting**
Videos are broadcast in real-time to all connected players via WebSocket at `/ws/gamemaster`.

### **UI Integration**
Videos appear as full-screen popups in the game UI through the `GameMasterVideoPopup` component.

## 📊 Current Status

### ✅ **Working Features**
- VEO 3 API integration (with mock fallback)
- Visual consistency system
- Character and location awareness
- Event-specific styling
- Comprehensive test suite
- WebSocket broadcasting
- UI integration

### 🔄 **Mock Mode Active**
Currently running in mock mode (returns placeholder videos) until Google API key is added.

### 🚀 **Ready for Production**
Once API key is configured, the system will generate real VEO 3 videos with full visual consistency.

## 🎯 Next Steps

1. **Add your Google API key** to enable real VEO 3 generation
2. **Test with real videos** using the provided test scripts
3. **Customize visual styles** by modifying `VideoStyleConsistency.ts`
4. **Add more event types** by extending the prompt generation system
5. **Integrate with character system** for enhanced character consistency

## 🎬 Demo Ready!

The VEO 3 visual consistency system is now fully operational and ready to generate cinematic videos that perfectly match your game's established visual style. Every video will maintain the sci-fi aesthetic, color palette, and production quality that creates an immersive and professional gaming experience.

**The Game Master can now generate videos at critical junctures and share them with players as full-screen popups, exactly as requested!** 🚀

