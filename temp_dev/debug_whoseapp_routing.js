// Debug WhoseApp Routing Issues
// Run this in browser console at http://localhost:5174

console.log('=== WhoseApp Debug Script ===');

// Check if React components are loaded
console.log('1. Checking React components...');
console.log('React:', typeof React !== 'undefined' ? '✅ Loaded' : '❌ Missing');

// Check if WhoseApp components exist
console.log('2. Checking WhoseApp components in DOM...');
const whoseAppElements = document.querySelectorAll('[class*="WhoseApp"], [class*="whoseapp"]');
console.log('WhoseApp elements found:', whoseAppElements.length);
whoseAppElements.forEach((el, i) => {
  console.log(`  ${i + 1}. ${el.tagName} - ${el.className}`);
});

// Check for error messages
console.log('3. Checking for error messages...');
const errorElements = document.querySelectorAll('[class*="error"], [class*="Error"]');
console.log('Error elements found:', errorElements.length);
errorElements.forEach((el, i) => {
  console.log(`  ${i + 1}. ${el.textContent}`);
});

// Check console errors
console.log('4. Recent console errors:');
console.log('Check the Console tab for any React/JavaScript errors');

// Check if routing is working
console.log('5. Checking current route...');
console.log('Current URL:', window.location.href);
console.log('Current pathname:', window.location.pathname);

// Check if WhoseApp screen is registered
console.log('6. Checking for screen factory...');
const screenElements = document.querySelectorAll('[class*="Screen"], [class*="screen"]');
console.log('Screen elements found:', screenElements.length);

// Try to find the specific issue
console.log('7. Looking for blank screen indicators...');
const emptyDivs = document.querySelectorAll('div:empty');
console.log('Empty divs found:', emptyDivs.length);

// Check if there are any loading states
const loadingElements = document.querySelectorAll('[class*="loading"], [class*="Loading"]');
console.log('Loading elements found:', loadingElements.length);

console.log('=== Debug Complete ===');
console.log('Next steps:');
console.log('1. Check Console tab for React errors');
console.log('2. Check Network tab for failed API calls');
console.log('3. Look for missing component imports');
