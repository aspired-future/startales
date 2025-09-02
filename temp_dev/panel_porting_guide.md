# Panel Porting Guide - Systematic Approach

## **CRITICAL: Always Follow This Process to Prevent UI Breaks**

### **Phase 1: Preparation & Isolation**

1. **Create Backup**
   ```bash
   cp src/ui_frontend/components/GameHUD/screens/extracted/[PanelName]Screen.tsx src/ui_frontend/components/GameHUD/screens/extracted/[PanelName]Screen_backup.tsx
   ```

2. **Isolate the Panel**
   - Comment out import in `ScreenFactory.tsx`
   - Comment out import in `PanelPopup.tsx`
   - Replace component with `DefaultPanel` in `PanelPopup.tsx`
   - Verify UI loads without the panel

3. **Verify Isolation**
   ```bash
   npx playwright test console-debug.spec.ts --headed
   ```
   - Must show no console errors
   - UI must load completely

### **Phase 2: Template-Based Rewrite**

1. **Use Working Template**
   - Copy structure from `EducationScreen.tsx` (working example)
   - Follow exact import pattern
   - Use same interface structure

2. **Required Imports Pattern**
   ```typescript
   import React, { useState, useEffect, useCallback } from 'react';
   import BaseScreen, { ScreenProps, APIEndpoint, TabConfig } from '../BaseScreen';
   import './[PanelName]Screen.css';
   import '../shared/StandardDesign.css';
   import { LineChart, PieChart, BarChart } from '../../../Charts';
   ```

3. **Required Component Structure**
   ```typescript
   const [panelData, setPanelData] = useState<PanelData | null>(null);
   const [activeTab, setActiveTab] = useState<'overview' | 'tab2' | 'tab3' | 'tab4' | 'analytics'>('overview');
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);

   const apiEndpoints: APIEndpoint[] = [
     { method: 'GET', path: '/api/[endpoint]', description: 'Get [data]' }
   ];

   const fetchPanelData = useCallback(async () => {
     try {
       setLoading(true);
       setError(null);
       // API call with fallback to mock data
     } catch (err) {
       console.warn('Failed to fetch data:', err);
       // Set mock data
     } finally {
       setLoading(false);
     }
   }, []);

   useEffect(() => {
     fetchPanelData();
   }, [fetchPanelData]);
   ```

### **Phase 3: Design Implementation**

1. **Use Standard Design Classes**
   - `standard-panel social-theme` for main cards
   - `standard-metric` for metrics
   - `standard-data-table` for tables
   - `standard-btn social-theme` for buttons

2. **Tab Structure (Max 5 Tabs)**
   ```typescript
   const tabs: TabConfig[] = [
     { id: 'overview', label: 'Overview', icon: '📊' },
     { id: 'tab2', label: 'Tab 2', icon: '🏷️' },
     { id: 'tab3', label: 'Tab 3', icon: '📈' },
     { id: 'tab4', label: 'Tab 4', icon: '📋' },
     { id: 'analytics', label: 'Analytics', icon: '📊' }
   ];
   ```

3. **Render Functions Pattern**
   ```typescript
   const renderOverview = () => {
     if (!panelData) return null;
     return (
       <>
         <div className="standard-panel social-theme">
           <h3 style={{ marginBottom: '1rem', color: '#10b981' }}>📊 Overview</h3>
           {/* Content */}
         </div>
       </>
     );
   };

   const renderContent = () => {
     switch (activeTab) {
       case 'overview': return renderOverview();
       case 'tab2': return renderTab2();
       case 'tab3': return renderTab3();
       case 'tab4': return renderTab4();
       case 'analytics': return renderAnalytics();
       default: return renderOverview();
     }
   };
   ```

4. **Main Return Statement**
   ```typescript
   return (
     <BaseScreen
       screenId={screenId}
       title={title}
       icon={icon}
       gameContext={gameContext}
       tabs={tabs}
       activeTab={activeTab}
       onTabChange={setActiveTab}
       apiEndpoints={apiEndpoints}
     >
       {renderContent()}
     </BaseScreen>
   );
   ```

### **Phase 4: Testing & Validation**

1. **Syntax Check**
   ```bash
   # Check for TypeScript errors
   npx tsc --noEmit --project src/ui_frontend/tsconfig.json
   ```

2. **Incremental Testing**
   - Re-enable import in `ScreenFactory.tsx` only
   - Test with `console-debug.spec.ts`
   - Fix any errors before proceeding

3. **Full Integration Test**
   - Re-enable in `PanelPopup.tsx`
   - Replace `DefaultPanel` with actual component
   - Test complete UI functionality

4. **Final Validation**
   ```bash
   npx playwright test [panel-name]-test.spec.ts --headed
   ```

### **Phase 5: Error Recovery**

**If UI Breaks:**
1. Immediately comment out the problematic panel
2. Verify UI loads with `console-debug.spec.ts`
3. Check syntax with TypeScript compiler
4. Fix errors in isolation
5. Re-enable only after successful testing

### **Common Error Patterns to Avoid:**

1. **Missing Closing Braces/Parentheses**
   - Always check function definitions
   - Use proper indentation
   - Count opening/closing brackets

2. **Incorrect Props**
   - Only pass props defined in `ScreenProps` interface
   - Don't add extra props to `BaseScreen`

3. **Import Conflicts**
   - Don't redefine imported interfaces
   - Use unique interface names

4. **State Management**
   - Always initialize state properly
   - Use proper TypeScript types
   - Handle loading and error states

### **Success Criteria:**

✅ UI loads without console errors  
✅ Panel displays with correct design  
✅ All tabs work properly  
✅ Data displays correctly  
✅ No TypeScript compilation errors  
✅ Playwright tests pass  

### **Emergency Rollback:**

If everything breaks:
```bash
# Restore from backup
cp src/ui_frontend/components/GameHUD/screens/extracted/[PanelName]Screen_backup.tsx src/ui_frontend/components/GameHUD/screens/extracted/[PanelName]Screen.tsx

# Comment out panel
# Re-enable DefaultPanel in PanelPopup.tsx
```

