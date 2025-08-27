# Directory Cleanup Summary

## ✅ Completed Tasks

### 1. **Simulation Consolidation** 
**Target: `src/simulation/` (unified simulation directory)**

**Merged directories:**
- `src/server/simulation/` → `src/simulation/registry/`
- `src/server/sim/` → `src/simulation/engine/`  
- `src/server/sim-engine/` → `src/simulation/engine/`

**Final structure:**
```
src/simulation/
├── ai/                     (17 .cjs files - AI systems)
├── deterministic/          (25+ .cjs files - game mechanics)
├── engine/                 (orchestrators, engines, tests)
├── integration/            (5 .cjs files - system coordination)
├── registry/               (consistency, types, providers)
└── routes/                 (API routes for simulation)
```

### 2. **Services Reorganization**
**Moved to appropriate server subdirectories:**
- `AIService.js/ts` → `src/server/ai/`
- `GameStateProvider.ts` → `src/server/state/`
- `TrueAIWitterService.ts & WitterAIService.ts` → `src/server/witter/`

### 3. **Witter API Consolidation**
- `src/server/witter-api-server.ts` → `src/server/witter/`

### 4. **Demo Migration**
**Migrated content:**
- `src/demo/apis/` → `src/server/routes/` (31 API files)
- `src/demo/game-state/` → `src/server/state/` (12 state files)
- `src/demo/pages/` → `src/server/routes/` (14 page files)
- `src/demo/*.html` → `public/demos/` (4 HTML demo files)

## 🔄 In Progress

### **Fix Broken References**
Several files still reference the old demo paths:
- `comprehensive-demo-server.cjs` - references `./src/demo/apis/enhanced-knob-system.cjs`
- `docker/services/communication/communication-api.cjs` - same reference
- `src/server/routes/demo-pages.cjs` - references moved demo files
- Various other files with demo imports

## ⏳ Pending Tasks

### 1. **Update Import References**
Need to update all imports that reference:
- Old simulation paths (`src/server/sim*`)
- Old demo paths (`src/demo/*`)
- Old services paths (`src/services/*`)

### 2. **Evaluate src/simulation/integration**
✅ **Decision: Keep and merge** - Contains active orchestration logic used by simulation systems

### 3. **Delete src/demo folder**
Can only be done after fixing all references

## 🎯 Benefits Achieved

### **Better Organization:**
- **Simulation**: All simulation logic in one logical place
- **Services**: Distributed to appropriate server subdirectories
- **APIs**: Consolidated in server routes
- **State**: Centralized in server state directory

### **Cleaner Imports:**
- `import from '../simulation/...'` (clearer than server/sim-engine)
- Services now in logical locations (ai/, witter/, state/)

### **Reduced Confusion:**
- No more wondering where simulation code lives
- Clear separation between simulation engine and server APIs
- Logical grouping of related functionality

## 📋 Next Steps

1. **Fix all import references** to point to new locations
2. **Test that all systems still work** after the moves
3. **Update any build/deployment scripts** that reference old paths
4. **Delete empty directories** and the demo folder
5. **Update documentation** to reflect new structure

## 🚨 Important Notes

- **Don't delete src/demo yet** - still has active references
- **Test thoroughly** - major directory restructuring can break imports
- **Update CI/CD** - build scripts may reference old paths
- **Check Docker files** - may have hardcoded paths
