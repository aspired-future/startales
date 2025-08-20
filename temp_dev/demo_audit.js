#!/usr/bin/env node

const http = require('http');

// List of all demos to test
const demos = [
  // Social Network & Communication
  { name: 'Witter Social Network', url: 'http://localhost:5173', category: 'Social' },
  { name: 'Leader Speech System', url: 'http://localhost:4000/demo/speech', category: 'Social' },
  { name: 'Voice Communication', url: 'http://localhost:4000/demo/voice', category: 'Social' },
  { name: 'Player Communication', url: 'http://localhost:4010/demo/communication-demo.html', category: 'Social' },
  { name: 'Leader Communications', url: 'http://localhost:4000/demo/leader-communications', category: 'Social' },
  
  // Governance & Politics
  { name: 'Policy Management', url: 'http://localhost:4000/demo/policies', category: 'Governance' },
  { name: 'Cabinet Meetings', url: 'http://localhost:4000/demo/cabinet', category: 'Governance' },
  { name: 'Policy Advisors & Cabinet', url: 'http://localhost:4010/demo/policy-advisor-demo.html', category: 'Governance' },
  { name: 'Approval Rating System', url: 'http://localhost:4010/demo/approval-rating-demo.html', category: 'Governance' },
  
  // Economy & Trade
  { name: 'Trade & Economy', url: 'http://localhost:4000/demo/trade', category: 'Economy' },
  { name: 'Business & Entrepreneurship', url: 'http://localhost:4000/demo/businesses', category: 'Economy' },
  
  // Simulation & Analytics
  { name: 'Simulation Engine', url: 'http://localhost:4000/demo/simulation', category: 'Simulation' },
  { name: 'Population System', url: 'http://localhost:4000/demo/population', category: 'Simulation' },
  { name: 'Professions & Industries', url: 'http://localhost:4000/demo/professions', category: 'Simulation' },
  { name: 'Demographics', url: 'http://localhost:4000/demo/demographics', category: 'Simulation' },
  
  // Infrastructure & Cities
  { name: 'City Specialization', url: 'http://localhost:4000/demo/cities', category: 'Infrastructure' },
  { name: 'Migration System', url: 'http://localhost:4000/demo/migration', category: 'Infrastructure' },
  { name: 'Technology System', url: 'http://localhost:4000/demo/technology', category: 'Infrastructure' },
  
  // Security & Legal
  { name: 'Legal System', url: 'http://localhost:4000/demo/legal', category: 'Security' },
  { name: 'Security System', url: 'http://localhost:4000/demo/security', category: 'Security' },
  
  // Intelligence & News
  { name: 'Intelligence System', url: 'http://localhost:4000/demo/intelligence', category: 'Intelligence' },
  { name: 'News Generation', url: 'http://localhost:4000/demo/news', category: 'Intelligence' },
  
  // Campaign Management
  { name: 'Campaign Setup Wizard', url: 'http://localhost:4000/demo/campaign-setup', category: 'Campaign' },
  { name: 'Visual Systems', url: 'http://localhost:4000/demo/visual-systems', category: 'Campaign' }
];

async function testDemo(demo) {
  return new Promise((resolve) => {
    const url = new URL(demo.url);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: 'GET',
      timeout: 5000
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        const status = res.statusCode;
        const hasContent = data.length > 100;
        const isHTML = data.includes('<html') || data.includes('<!doctype');
        const hasTitle = data.includes('<title>');
        const hasInteractivity = data.includes('<button') || data.includes('<input') || data.includes('onclick');
        const hasAPI = data.includes('/api/') || data.includes('fetch(') || data.includes('axios');
        
        resolve({
          ...demo,
          status,
          hasContent,
          isHTML,
          hasTitle,
          hasInteractivity,
          hasAPI,
          contentLength: data.length,
          working: status === 200 && hasContent && isHTML
        });
      });
    });

    req.on('error', (err) => {
      resolve({
        ...demo,
        status: 'ERROR',
        error: err.message,
        working: false
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        ...demo,
        status: 'TIMEOUT',
        working: false
      });
    });

    req.end();
  });
}

async function auditAllDemos() {
  console.log('🔍 Starting comprehensive demo audit...\n');
  
  const results = [];
  for (const demo of demos) {
    console.log(`Testing: ${demo.name}...`);
    const result = await testDemo(demo);
    results.push(result);
    
    const statusIcon = result.working ? '✅' : '❌';
    const issues = [];
    if (!result.hasContent) issues.push('No content');
    if (!result.hasInteractivity) issues.push('No interactivity');
    if (!result.hasAPI) issues.push('No API calls');
    
    console.log(`  ${statusIcon} ${result.status} - ${result.contentLength} bytes ${issues.length ? '(' + issues.join(', ') + ')' : ''}`);
  }
  
  console.log('\n📊 AUDIT SUMMARY:');
  console.log('==================');
  
  const working = results.filter(r => r.working);
  const broken = results.filter(r => !r.working);
  const noInteractivity = results.filter(r => r.working && !r.hasInteractivity);
  const noAPI = results.filter(r => r.working && !r.hasAPI);
  
  console.log(`✅ Working demos: ${working.length}/${results.length}`);
  console.log(`❌ Broken demos: ${broken.length}`);
  console.log(`⚠️  No interactivity: ${noInteractivity.length}`);
  console.log(`⚠️  No API calls: ${noAPI.length}`);
  
  console.log('\n🚨 ISSUES FOUND:');
  console.log('================');
  
  if (broken.length > 0) {
    console.log('\n❌ BROKEN DEMOS:');
    broken.forEach(demo => {
      console.log(`  - ${demo.name}: ${demo.status} ${demo.error || ''}`);
    });
  }
  
  if (noInteractivity.length > 0) {
    console.log('\n⚠️  DEMOS WITHOUT INTERACTIVITY:');
    noInteractivity.forEach(demo => {
      console.log(`  - ${demo.name}`);
    });
  }
  
  if (noAPI.length > 0) {
    console.log('\n⚠️  DEMOS WITHOUT API CALLS:');
    noAPI.forEach(demo => {
      console.log(`  - ${demo.name}`);
    });
  }
  
  // Group by category for analysis
  console.log('\n📋 BY CATEGORY:');
  console.log('===============');
  const categories = [...new Set(results.map(r => r.category))];
  categories.forEach(category => {
    const categoryDemos = results.filter(r => r.category === category);
    const workingCount = categoryDemos.filter(r => r.working).length;
    console.log(`${category}: ${workingCount}/${categoryDemos.length} working`);
  });
  
  return results;
}

// Run the audit
auditAllDemos().catch(console.error);

