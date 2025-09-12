// Quick test to verify WhoseApp integration
// Run this in browser console at http://localhost:5173

console.log('🧪 Testing WhoseApp Integration...');

// Test 1: Check if WhoseApp screen is available
const checkWhoseAppScreen = () => {
  console.log('1. Checking if WhoseApp screen is available...');
  
  // Look for WhoseApp in navigation or screen selector
  const whoseAppElements = document.querySelectorAll('*');
  let found = false;
  
  whoseAppElements.forEach(el => {
    if (el.textContent && el.textContent.toLowerCase().includes('whoseapp')) {
      console.log('✅ Found WhoseApp element:', el.textContent);
      found = true;
    }
  });
  
  if (!found) {
    console.log('❌ WhoseApp not found in current view');
    console.log('💡 Try navigating to communications section');
  }
  
  return found;
};

// Test 2: Check for UnifiedConversationInterface
const checkUnifiedInterface = () => {
  console.log('2. Checking for UnifiedConversationInterface components...');
  
  // Look for toggle buttons, voice controls, etc.
  const toggleButtons = document.querySelectorAll('button');
  let voiceToggleFound = false;
  
  toggleButtons.forEach(btn => {
    if (btn.textContent && (
      btn.textContent.includes('Switch to Voice') ||
      btn.textContent.includes('Start Voice') ||
      btn.textContent.includes('End Voice')
    )) {
      console.log('✅ Found voice toggle button:', btn.textContent);
      voiceToggleFound = true;
    }
  });
  
  return voiceToggleFound;
};

// Test 3: Check for character/conversation elements
const checkConversationElements = () => {
  console.log('3. Checking for conversation elements...');
  
  const conversationElements = document.querySelectorAll('*');
  let found = false;
  
  conversationElements.forEach(el => {
    if (el.textContent && (
      el.textContent.includes('Elena Vasquez') ||
      el.textContent.includes('Sarah Kim') ||
      el.textContent.includes('Prime Minister') ||
      el.textContent.includes('Defense Secretary')
    )) {
      console.log('✅ Found character element:', el.textContent.trim());
      found = true;
    }
  });
  
  return found;
};

// Run all tests
const runTests = () => {
  console.log('🚀 Starting WhoseApp Integration Tests...\n');
  
  const test1 = checkWhoseAppScreen();
  const test2 = checkUnifiedInterface();
  const test3 = checkConversationElements();
  
  console.log('\n📊 Test Results:');
  console.log(`WhoseApp Screen Available: ${test1 ? '✅' : '❌'}`);
  console.log(`Unified Interface Present: ${test2 ? '✅' : '❌'}`);
  console.log(`Character Elements Found: ${test3 ? '✅' : '❌'}`);
  
  if (test1 && test2 && test3) {
    console.log('\n🎉 All tests passed! WhoseApp integration is working!');
  } else {
    console.log('\n⚠️ Some tests failed. Check the specific issues above.');
    console.log('💡 Make sure you\'re on the WhoseApp screen/tab');
  }
};

// Auto-run tests
runTests();

// Export for manual testing
window.testWhoseApp = runTests;
