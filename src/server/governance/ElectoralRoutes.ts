import { Router } from 'express';
import { Pool } from 'pg';
import { ElectoralEngine } from './ElectoralEngine.js';
import { ElectionContentGenerator } from '../witter/ElectionContentGenerator.js';

export function createElectoralRoutes(pool: Pool): Router {
  const router = Router();
  const electoralEngine = new ElectoralEngine(pool);
  const contentGenerator = new ElectionContentGenerator();

  // Initialize electoral system for a civilization
  router.post('/civilizations/:civilizationId/initialize', async (req, res) => {
    try {
      const { civilizationId } = req.params;
      const { constitutionType = 'presidential' } = req.body;

      await electoralEngine.initializeElectoralSystem(civilizationId, constitutionType);

      res.json({
        success: true,
        message: `Electoral system initialized for civilization ${civilizationId}`,
        constitutionType
      });
    } catch (error) {
      console.error('Failed to initialize electoral system:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to initialize electoral system',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Get electoral data for a civilization
  router.get('/civilizations/:civilizationId/elections', async (req, res) => {
    try {
      const { civilizationId } = req.params;
      const electoralData = await electoralEngine.getElectoralData(civilizationId);

      res.json({
        success: true,
        data: electoralData
      });
    } catch (error) {
      console.error('Failed to get electoral data:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve electoral data',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Get specific election details
  router.get('/elections/:electionId', async (req, res) => {
    try {
      const { electionId } = req.params;
      
      const client = await pool.connect();
      try {
        // Get election details
        const electionResult = await client.query(`
          SELECT * FROM electoral_cycles WHERE id = $1
        `, [electionId]);

        if (electionResult.rows.length === 0) {
          return res.status(404).json({
            success: false,
            error: 'Election not found'
          });
        }

        const election = electionResult.rows[0];

        // Get campaign promises
        const promisesResult = await client.query(`
          SELECT cp.*, pp.party_name 
          FROM campaign_promises cp
          JOIN political_parties pp ON cp.party_id = pp.id
          WHERE cp.election_id = $1
          ORDER BY cp.priority DESC, cp.popularity_boost DESC
        `, [electionId]);

        // Get campaign activities
        const activitiesResult = await client.query(`
          SELECT ca.*, pp.party_name
          FROM campaign_activities ca
          JOIN political_parties pp ON ca.party_id = pp.id
          WHERE ca.election_id = $1
          ORDER BY ca.scheduled_date DESC
          LIMIT 20
        `, [electionId]);

        // Get polling data
        const pollsResult = await client.query(`
          SELECT * FROM election_polls 
          WHERE election_id = $1 
          ORDER BY poll_date DESC 
          LIMIT 10
        `, [electionId]);

        res.json({
          success: true,
          data: {
            election,
            promises: promisesResult.rows,
            activities: activitiesResult.rows,
            polls: pollsResult.rows
          }
        });
      } finally {
        client.release();
      }
    } catch (error) {
      console.error('Failed to get election details:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve election details',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Get latest polling data
  router.get('/elections/:electionId/polls/latest', async (req, res) => {
    try {
      const { electionId } = req.params;
      
      const client = await pool.connect();
      try {
        const result = await client.query(`
          SELECT * FROM election_polls 
          WHERE election_id = $1 
          ORDER BY poll_date DESC 
          LIMIT 1
        `, [electionId]);

        if (result.rows.length === 0) {
          return res.status(404).json({
            success: false,
            error: 'No polling data found'
          });
        }

        res.json({
          success: true,
          data: result.rows[0]
        });
      } finally {
        client.release();
      }
    } catch (error) {
      console.error('Failed to get polling data:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve polling data',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Get campaign activities for media coverage
  router.get('/elections/:electionId/activities/recent', async (req, res) => {
    try {
      const { electionId } = req.params;
      const { limit = '10' } = req.query;
      
      const client = await pool.connect();
      try {
        const result = await client.query(`
          SELECT ca.*, pp.party_name, pp.ideology
          FROM campaign_activities ca
          JOIN political_parties pp ON ca.party_id = pp.id
          WHERE ca.election_id = $1 AND ca.media_attention > 50
          ORDER BY ca.scheduled_date DESC, ca.media_attention DESC
          LIMIT $2
        `, [electionId, parseInt(limit as string)]);

        res.json({
          success: true,
          data: result.rows
        });
      } finally {
        client.release();
      }
    } catch (error) {
      console.error('Failed to get campaign activities:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve campaign activities',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Simulate election event (for testing)
  router.post('/elections/:electionId/simulate-event', async (req, res) => {
    try {
      const { electionId } = req.params;
      const { eventType, eventData } = req.body;

      // Create mock election event
      const electionEvent = {
        id: `event_${Date.now()}`,
        electionId,
        type: eventType,
        timestamp: new Date(),
        eventData,
        importance: 70 + Math.random() * 30,
        headline: eventData.title || `${eventType} Event`,
        content: eventData.description || 'Election event occurred'
      };

      // Generate content
      const content = await contentGenerator.processElectionEvent(electionEvent);

      res.json({
        success: true,
        data: {
          event: electionEvent,
          generatedContent: content
        }
      });
    } catch (error) {
      console.error('Failed to simulate election event:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to simulate election event',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Get election timeline for a civilization
  router.get('/civilizations/:civilizationId/timeline', async (req, res) => {
    try {
      const { civilizationId } = req.params;
      
      const client = await pool.connect();
      try {
        // Get all elections for the civilization
        const electionsResult = await client.query(`
          SELECT * FROM electoral_cycles 
          WHERE civilization_id = $1 
          ORDER BY scheduled_date ASC
        `, [civilizationId]);

        // Get recent campaign activities across all elections
        const activitiesResult = await client.query(`
          SELECT ca.*, pp.party_name, ec.election_type
          FROM campaign_activities ca
          JOIN political_parties pp ON ca.party_id = pp.id
          JOIN electoral_cycles ec ON ca.election_id = ec.id
          WHERE ec.civilization_id = $1
          ORDER BY ca.scheduled_date DESC
          LIMIT 50
        `, [civilizationId]);

        // Get recent polling data
        const pollsResult = await client.query(`
          SELECT ep.*, ec.election_type
          FROM election_polls ep
          JOIN electoral_cycles ec ON ep.election_id = ec.id
          WHERE ec.civilization_id = $1
          ORDER BY ep.poll_date DESC
          LIMIT 20
        `, [civilizationId]);

        res.json({
          success: true,
          data: {
            elections: electionsResult.rows,
            recentActivities: activitiesResult.rows,
            recentPolls: pollsResult.rows
          }
        });
      } finally {
        client.release();
      }
    } catch (error) {
      console.error('Failed to get election timeline:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve election timeline',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Process electoral events (called by simulation engine)
  router.post('/process-events', async (req, res) => {
    try {
      const { currentDate } = req.body;
      const processDate = currentDate ? new Date(currentDate) : new Date();

      await electoralEngine.processElectoralEvents(processDate);

      res.json({
        success: true,
        message: 'Electoral events processed',
        processedAt: processDate
      });
    } catch (error) {
      console.error('Failed to process electoral events:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to process electoral events',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Get election content for Witter/News integration
  router.get('/content/recent', async (req, res) => {
    try {
      const { limit = '20', type = 'all' } = req.query;
      
      const client = await pool.connect();
      try {
        let query = `
          SELECT 
            ca.id,
            ca.election_id,
            ca.activity_type as type,
            ca.title,
            ca.description,
            ca.scheduled_date as timestamp,
            ca.media_attention as importance,
            pp.party_name,
            ec.election_type,
            ec.civilization_id
          FROM campaign_activities ca
          JOIN political_parties pp ON ca.party_id = pp.id
          JOIN electoral_cycles ec ON ca.election_id = ec.id
          WHERE ca.media_attention > 30
        `;

        const params = [];
        
        if (type !== 'all') {
          query += ` AND ca.activity_type = $${params.length + 1}`;
          params.push(type);
        }

        query += ` ORDER BY ca.scheduled_date DESC, ca.media_attention DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit as string));

        const result = await client.query(query, params);

        // Transform to election event format for content generation
        const events = result.rows.map(row => ({
          id: row.id,
          electionId: row.election_id,
          type: row.type,
          timestamp: row.timestamp,
          importance: row.importance,
          headline: row.title,
          content: row.description,
          eventData: {
            party: row.party_name,
            title: row.title,
            description: row.description
          },
          electionContext: {
            electionType: row.election_type,
            civilizationId: row.civilization_id
          }
        }));

        res.json({
          success: true,
          data: events
        });
      } finally {
        client.release();
      }
    } catch (error) {
      console.error('Failed to get election content:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve election content',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  return router;
}


