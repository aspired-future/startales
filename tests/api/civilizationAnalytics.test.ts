/**
 * Civilization Analytics API Tests
 * Task 45: Economic inequality visualization and social mobility tracking
 */

import request from 'supertest';
import express from 'express';
import civilizationAnalyticsRouter from '../../src/server/routes/civilizationAnalytics.js';
import { initDb } from '../../src/server/storage/db.js';

const app = express();
app.use(express.json());
app.use('/api/civilization-analytics', civilizationAnalyticsRouter);

describe('Civilization Analytics API', () => {
  beforeAll(async () => {
    await initDb();
  });

  describe('GET /api/civilization-analytics/:campaignId', () => {
    it('should return comprehensive civilization analytics', async () => {
      const response = await request(app)
        .get('/api/civilization-analytics/1')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('campaignId', 1);
      expect(response.body.data).toHaveProperty('timestamp');
      expect(response.body.data).toHaveProperty('economic');
      expect(response.body.data).toHaveProperty('socialMobility');
      expect(response.body.data).toHaveProperty('demographics');
      expect(response.body.data).toHaveProperty('trends');
      expect(response.body.data).toHaveProperty('recommendations');

      // Verify economic metrics structure
      const economic = response.body.data.economic;
      expect(economic).toHaveProperty('giniCoefficient');
      expect(economic).toHaveProperty('economicHealth');
      expect(economic).toHaveProperty('povertyRate');
      expect(economic).toHaveProperty('middleClassRate');
      expect(economic).toHaveProperty('wealthRate');
      expect(economic).toHaveProperty('socialMobilityIndex');
      expect(economic).toHaveProperty('averageIncome');
      expect(economic).toHaveProperty('incomeDistribution');

      // Verify social mobility metrics structure
      const socialMobility = response.body.data.socialMobility;
      expect(socialMobility).toHaveProperty('upwardMobility');
      expect(socialMobility).toHaveProperty('downwardMobility');
      expect(socialMobility).toHaveProperty('mobilityEvents');
      expect(socialMobility).toHaveProperty('generationalMobility');
      expect(socialMobility).toHaveProperty('educationImpact');

      // Verify demographics structure
      const demographics = response.body.data.demographics;
      expect(demographics).toHaveProperty('totalPopulation');
      expect(demographics).toHaveProperty('ageDistribution');
      expect(demographics).toHaveProperty('educationLevels');
      expect(demographics).toHaveProperty('employmentRate');
      expect(demographics).toHaveProperty('urbanizationRate');
    });

    it('should return 400 for invalid campaign ID', async () => {
      const response = await request(app)
        .get('/api/civilization-analytics/invalid')
        .expect(400);

      expect(response.body.error).toBe('Invalid campaign ID');
    });
  });

  describe('GET /api/civilization-analytics/:campaignId/economic', () => {
    it('should return economic metrics only', async () => {
      const response = await request(app)
        .get('/api/civilization-analytics/1/economic')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('campaignId', 1);
      expect(response.body.data).toHaveProperty('economic');
      expect(response.body.data).not.toHaveProperty('socialMobility');
      expect(response.body.data).not.toHaveProperty('demographics');

      const economic = response.body.data.economic;
      expect(typeof economic.giniCoefficient).toBe('number');
      expect(typeof economic.economicHealth).toBe('number');
      expect(typeof economic.povertyRate).toBe('number');
      expect(typeof economic.middleClassRate).toBe('number');
      expect(typeof economic.wealthRate).toBe('number');
      expect(typeof economic.averageIncome).toBe('number');
    });
  });

  describe('GET /api/civilization-analytics/:campaignId/social-mobility', () => {
    it('should return social mobility metrics only', async () => {
      const response = await request(app)
        .get('/api/civilization-analytics/1/social-mobility')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('campaignId', 1);
      expect(response.body.data).toHaveProperty('socialMobility');
      expect(response.body.data).not.toHaveProperty('economic');
      expect(response.body.data).not.toHaveProperty('demographics');

      const socialMobility = response.body.data.socialMobility;
      expect(typeof socialMobility.upwardMobility).toBe('number');
      expect(typeof socialMobility.downwardMobility).toBe('number');
      expect(typeof socialMobility.educationImpact).toBe('number');
      expect(socialMobility.mobilityEvents).toHaveProperty('education');
      expect(socialMobility.mobilityEvents).toHaveProperty('business');
      expect(socialMobility.mobilityEvents).toHaveProperty('inheritance');
      expect(socialMobility.mobilityEvents).toHaveProperty('disaster');
    });
  });

  describe('GET /api/civilization-analytics/:campaignId/demographics', () => {
    it('should return population demographics', async () => {
      const response = await request(app)
        .get('/api/civilization-analytics/1/demographics')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('campaignId', 1);
      expect(response.body.data).toHaveProperty('demographics');

      const demographics = response.body.data.demographics;
      expect(typeof demographics.totalPopulation).toBe('number');
      expect(typeof demographics.employmentRate).toBe('number');
      expect(typeof demographics.urbanizationRate).toBe('number');
      expect(demographics.ageDistribution).toHaveProperty('young');
      expect(demographics.ageDistribution).toHaveProperty('adult');
      expect(demographics.ageDistribution).toHaveProperty('elderly');
      expect(demographics.educationLevels).toHaveProperty('basic');
      expect(demographics.educationLevels).toHaveProperty('intermediate');
      expect(demographics.educationLevels).toHaveProperty('advanced');
    });
  });

  describe('GET /api/civilization-analytics/:campaignId/trends', () => {
    it('should return historical trends', async () => {
      const response = await request(app)
        .get('/api/civilization-analytics/1/trends')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('campaignId', 1);
      expect(response.body.data).toHaveProperty('trends');

      const trends = response.body.data.trends;
      expect(Array.isArray(trends.economicGrowth)).toBe(true);
      expect(Array.isArray(trends.inequalityTrend)).toBe(true);
      expect(Array.isArray(trends.mobilityTrend)).toBe(true);
    });
  });

  describe('GET /api/civilization-analytics/:campaignId/recommendations', () => {
    it('should return policy recommendations', async () => {
      const response = await request(app)
        .get('/api/civilization-analytics/1/recommendations')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('campaignId', 1);
      expect(response.body.data).toHaveProperty('recommendations');
      expect(response.body.data).toHaveProperty('metrics');

      const recommendations = response.body.data.recommendations;
      expect(Array.isArray(recommendations)).toBe(true);
      expect(recommendations.length).toBeGreaterThan(0);

      const metrics = response.body.data.metrics;
      expect(typeof metrics.economicHealth).toBe('number');
      expect(typeof metrics.giniCoefficient).toBe('number');
      expect(typeof metrics.socialMobilityIndex).toBe('number');
    });
  });

  describe('GET /api/civilization-analytics/:campaignId/inequality', () => {
    it('should return detailed inequality analysis', async () => {
      const response = await request(app)
        .get('/api/civilization-analytics/1/inequality')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('campaignId', 1);
      expect(response.body.data).toHaveProperty('inequality');
      expect(response.body.data).toHaveProperty('interpretation');

      const inequality = response.body.data.inequality;
      expect(typeof inequality.giniCoefficient).toBe('number');
      expect(typeof inequality.povertyRate).toBe('number');
      expect(typeof inequality.middleClassRate).toBe('number');
      expect(typeof inequality.wealthRate).toBe('number');
      expect(typeof inequality.averageIncome).toBe('number');
      expect(inequality.incomeDistribution).toHaveProperty('poor');
      expect(inequality.incomeDistribution).toHaveProperty('median');
      expect(inequality.incomeDistribution).toHaveProperty('rich');

      const interpretation = response.body.data.interpretation;
      expect(['High', 'Moderate', 'Low']).toContain(interpretation.inequalityLevel);
      expect(['Good', 'Fair', 'Poor']).toContain(interpretation.economicHealth);
    });
  });

  describe('POST /api/civilization-analytics/:campaignId/simulate-policy', () => {
    it('should simulate education investment policy impact', async () => {
      const response = await request(app)
        .post('/api/civilization-analytics/1/simulate-policy')
        .send({
          policyType: 'education_investment',
          intensity: 2
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('campaignId', 1);
      expect(response.body.data).toHaveProperty('policyType', 'education_investment');
      expect(response.body.data).toHaveProperty('intensity', 2);
      expect(response.body.data).toHaveProperty('current');
      expect(response.body.data).toHaveProperty('simulated');
      expect(response.body.data).toHaveProperty('impact');

      const impact = response.body.data.impact;
      expect(typeof impact.economicHealthChange).toBe('number');
      expect(typeof impact.inequalityChange).toBe('number');
      expect(typeof impact.mobilityChange).toBe('number');

      // Education investment should improve mobility and economic health
      expect(impact.mobilityChange).toBeGreaterThan(0);
      expect(impact.economicHealthChange).toBeGreaterThan(0);
    });

    it('should simulate wealth redistribution policy impact', async () => {
      const response = await request(app)
        .post('/api/civilization-analytics/1/simulate-policy')
        .send({
          policyType: 'wealth_redistribution',
          intensity: 1.5
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      const impact = response.body.data.impact;

      // Wealth redistribution should reduce inequality
      expect(impact.inequalityChange).toBeLessThan(0);
      expect(impact.economicHealthChange).toBeGreaterThan(0);
    });

    it('should simulate job creation policy impact', async () => {
      const response = await request(app)
        .post('/api/civilization-analytics/1/simulate-policy')
        .send({
          policyType: 'job_creation',
          intensity: 1
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      const impact = response.body.data.impact;

      // Job creation should improve economic health
      expect(impact.economicHealthChange).toBeGreaterThan(0);
    });

    it('should return 400 for missing policy parameters', async () => {
      const response = await request(app)
        .post('/api/civilization-analytics/1/simulate-policy')
        .send({
          policyType: 'education_investment'
          // Missing intensity
        })
        .expect(400);

      expect(response.body.error).toBe('Policy type and intensity are required');
    });

    it('should return 400 for unknown policy type', async () => {
      const response = await request(app)
        .post('/api/civilization-analytics/1/simulate-policy')
        .send({
          policyType: 'unknown_policy',
          intensity: 1
        })
        .expect(400);

      expect(response.body.error).toBe('Unknown policy type');
    });
  });

  describe('Metric Validation', () => {
    it('should return realistic metric ranges', async () => {
      const response = await request(app)
        .get('/api/civilization-analytics/1')
        .expect(200);

      const economic = response.body.data.economic;
      
      // Gini coefficient should be between 0 and 1
      expect(economic.giniCoefficient).toBeGreaterThanOrEqual(0);
      expect(economic.giniCoefficient).toBeLessThanOrEqual(1);
      
      // Economic health should be between 0 and 100
      expect(economic.economicHealth).toBeGreaterThanOrEqual(0);
      expect(economic.economicHealth).toBeLessThanOrEqual(100);
      
      // Rates should be percentages (0-100)
      expect(economic.povertyRate).toBeGreaterThanOrEqual(0);
      expect(economic.povertyRate).toBeLessThanOrEqual(100);
      expect(economic.middleClassRate).toBeGreaterThanOrEqual(0);
      expect(economic.middleClassRate).toBeLessThanOrEqual(100);
      expect(economic.wealthRate).toBeGreaterThanOrEqual(0);
      expect(economic.wealthRate).toBeLessThanOrEqual(100);
      
      // Social mobility index should be between 0 and 1
      expect(economic.socialMobilityIndex).toBeGreaterThanOrEqual(0);
      expect(economic.socialMobilityIndex).toBeLessThanOrEqual(1);
      
      // Average income should be positive
      expect(economic.averageIncome).toBeGreaterThan(0);
    });

    it('should have consistent income distribution percentages', async () => {
      const response = await request(app)
        .get('/api/civilization-analytics/1/economic')
        .expect(200);

      const economic = response.body.data.economic;
      const distribution = economic.incomeDistribution;
      
      // Percentages should add up to approximately 100
      const totalPercentage = distribution.poor.percentage + 
                             distribution.median.percentage + 
                             distribution.rich.percentage;
      expect(totalPercentage).toBeCloseTo(100, 1);
      
      // Each tier should have positive average income
      expect(distribution.poor.averageIncome).toBeGreaterThan(0);
      expect(distribution.median.averageIncome).toBeGreaterThan(0);
      expect(distribution.rich.averageIncome).toBeGreaterThan(0);
      
      // Income should increase with tier
      expect(distribution.median.averageIncome).toBeGreaterThan(distribution.poor.averageIncome);
      expect(distribution.rich.averageIncome).toBeGreaterThan(distribution.median.averageIncome);
    });
  });
});
