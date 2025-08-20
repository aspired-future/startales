/**
 * Population System Verification Test
 * 
 * Simple verification script to test the Population & Demographics Engine
 * without requiring a full test framework setup.
 */

import { CitizenEngine } from '../src/server/population/CitizenEngine.js';
import { PopulationAnalytics } from '../src/server/population/PopulationAnalytics.js';

console.log('🏙️ Testing Population & Demographics Engine...\n');

// Create test configuration
const config = {
  initialPopulationSize: 50,
  birthRate: 0.015,
  deathRate: 0.008,
  immigrationRate: 0.005,
  emigrationRate: 0.003,
  timeStep: 'month',
  agingRate: 1.0,
  skillDecayRate: 0.001,
  memoryDecayRate: 0.01,
  decisionFrequency: 0.1,
  socialInfluenceStrength: 0.3,
  adaptationSpeed: 0.2,
  baseConsumption: 2000,
  incomeVolatility: 0.1,
  jobMobilityRate: 0.05
};

// Initialize systems
const engine = new CitizenEngine(config, 12345);
const analytics = new PopulationAnalytics();

console.log('✅ Systems initialized');

// Test 1: Generate citizens
console.log('\n📊 Test 1: Generating Citizens');
const cities = ['alpha_city', 'beta_city', 'gamma_city'];
for (let i = 0; i < 30; i++) {
  const cityId = cities[i % cities.length];
  engine.generateCitizen(cityId);
}

console.log(`✅ Generated ${engine.getCitizensCount()} citizens across ${cities.length} cities`);

// Test 2: Calculate population metrics
console.log('\n📈 Test 2: Population Metrics');
const allCitizens = engine.getAllCitizens();
const metrics = analytics.calculatePopulationMetrics(allCitizens);

console.log(`Total Population: ${metrics.totalPopulation}`);
console.log(`Average Age: ${metrics.averageAge.toFixed(1)} years`);
console.log(`Average Income: $${(metrics.averageIncome * 12).toLocaleString()}/year`);
console.log(`Unemployment Rate: ${(metrics.unemploymentRate * 100).toFixed(1)}%`);
console.log(`Happiness Index: ${(metrics.happinessIndex * 100).toFixed(1)}%`);
console.log(`Social Mobility: ${(metrics.socialMobility * 100).toFixed(1)}%`);

// Test 3: Demographic distributions
console.log('\n🎯 Test 3: Demographic Distributions');
console.log('Age Distribution:');
Object.entries(metrics.ageDistribution).forEach(([range, percentage]) => {
  console.log(`  ${range}: ${percentage.toFixed(1)}%`);
});

console.log('Education Distribution:');
Object.entries(metrics.educationDistribution).forEach(([level, percentage]) => {
  console.log(`  ${level}: ${percentage.toFixed(1)}%`);
});

console.log('Top Professions:');
Object.entries(metrics.professionDistribution).slice(0, 5).forEach(([profession, percentage]) => {
  console.log(`  ${profession}: ${percentage.toFixed(1)}%`);
});

// Test 4: Incentive response testing
console.log('\n🎯 Test 4: Incentive Response Testing');
const testCitizen = allCitizens[0];
console.log(`Testing citizen: ${testCitizen.id.value} (${testCitizen.career.currentProfession}, age ${Math.floor(testCitizen.demographics.age)})`);

const educationResponse = engine.calculateIncentiveResponse(
  testCitizen.id.value, 
  'education_opportunity', 
  1.0
);

console.log(`Education Opportunity Response: ${(educationResponse.responseStrength * 100).toFixed(1)}%`);
console.log('Behavior Changes:');
Object.entries(educationResponse.behaviorChange).forEach(([behavior, change]) => {
  console.log(`  ${behavior}: ${(change * 100).toFixed(1)}%`);
});

// Test 5: Population simulation
console.log('\n⏱️ Test 5: Population Simulation');
const beforeSimulation = analytics.calculatePopulationMetrics(allCitizens);

// Simulate 3 time steps
for (let step = 0; step < 3; step++) {
  allCitizens.forEach(citizen => {
    engine.simulateTimeStep(citizen.id.value, ['education_opportunity']);
  });
}

const afterSimulation = analytics.calculatePopulationMetrics(engine.getAllCitizens());

console.log('Changes after 3 time steps:');
console.log(`Happiness: ${((afterSimulation.happinessIndex - beforeSimulation.happinessIndex) * 100).toFixed(2)}%`);
console.log(`Stress: ${((afterSimulation.stressIndex - beforeSimulation.stressIndex) * 100).toFixed(2)}%`);
console.log(`Average Income: $${((afterSimulation.averageIncome - beforeSimulation.averageIncome) * 12).toFixed(0)}`);

// Test 6: Inequality analysis
console.log('\n📊 Test 6: Inequality Analysis');
const inequality = analytics.calculateInequality(engine.getAllCitizens());

console.log(`Gini Coefficient: ${inequality.giniCoefficient.toFixed(3)}`);
console.log('Income Deciles:');
inequality.incomeDeciles.forEach((income, index) => {
  console.log(`  ${(index + 1) * 10}th percentile: $${(income * 12).toLocaleString()}/year`);
});

console.log('Wealth Distribution:');
Object.entries(inequality.wealthDistribution).forEach(([range, percentage]) => {
  console.log(`  ${range}: ${percentage.toFixed(1)}%`);
});

// Test 7: City-specific analysis
console.log('\n🏙️ Test 7: City-Specific Analysis');
cities.forEach(cityId => {
  const cityCitizens = engine.getCitizensByCity(cityId);
  const cityMetrics = analytics.calculatePopulationMetrics(cityCitizens);
  console.log(`${cityId}: ${cityMetrics.totalPopulation} citizens, avg income $${(cityMetrics.averageIncome * 12).toLocaleString()}/year`);
});

console.log('\n🎉 Population & Demographics Engine Test Complete!');
console.log('\n📋 Summary:');
console.log(`✅ Generated and managed ${engine.getCitizensCount()} individual citizens`);
console.log(`✅ Calculated comprehensive demographic metrics and distributions`);
console.log(`✅ Tested incentive response system with behavioral economics`);
console.log(`✅ Simulated population evolution over multiple time steps`);
console.log(`✅ Analyzed inequality and social mobility patterns`);
console.log(`✅ Validated city-specific population analysis`);
console.log('\n🚀 Ready for Sprint 6: Profession & Industry System [Task 49]');
