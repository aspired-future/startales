/**
 * Character Service
 * 
 * Database operations for the Dynamic Character System
 */

import { Pool } from 'pg';
import { DynamicCharacter, CharacterTemplate, CharacterAnalytics, CharacterEvent } from './characterInterfaces';

export class CharacterService {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  // Character CRUD operations
  async createCharacter(character: DynamicCharacter): Promise<string> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');

      // Insert main character record
      const characterResult = await client.query(`
        INSERT INTO characters (
          id, name, category, subcategory, civilization_id, planet_id, city_id,
          location, demographics, appearance, personality, attributes, profession,
          background, skills, social_media, opinions, status, ai_behavior,
          lifecycle, game_integration, metadata
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22)
        RETURNING id
      `, [
        character.id,
        JSON.stringify(character.name),
        character.category,
        character.subcategory,
        character.civilization_id,
        character.planet_id,
        character.city_id,
        JSON.stringify(character.location),
        JSON.stringify(character.demographics),
        JSON.stringify(character.appearance),
        JSON.stringify(character.personality),
        JSON.stringify(character.attributes),
        JSON.stringify(character.profession),
        JSON.stringify(character.background),
        JSON.stringify(character.skills),
        JSON.stringify(character.social_media),
        JSON.stringify(character.opinions),
        JSON.stringify(character.status),
        JSON.stringify(character.ai_behavior),
        JSON.stringify(character.lifecycle),
        JSON.stringify(character.game_integration),
        JSON.stringify(character.metadata)
      ]);

      // Insert relationships
      await this.insertCharacterRelationships(client, character.id, character.relationships);

      await client.query('COMMIT');
      console.log(`✅ Created character: ${character.name.full_display}`);
      
      // Generate character portrait
      this.generateCharacterPortrait(character);
      
      return characterResult.rows[0].id;

    } catch (error) {
      await client.query('ROLLBACK');
      console.error('❌ Error creating character:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  async getCharacter(characterId: string): Promise<DynamicCharacter | null> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(`
        SELECT * FROM characters WHERE id = $1
      `, [characterId]);

      if (result.rows.length === 0) {
        return null;
      }

      const row = result.rows[0];
      const character: DynamicCharacter = {
        id: row.id,
        name: JSON.parse(row.name),
        category: row.category,
        subcategory: row.subcategory,
        civilization_id: row.civilization_id,
        planet_id: row.planet_id,
        city_id: row.city_id,
        location: JSON.parse(row.location),
        demographics: JSON.parse(row.demographics),
        appearance: JSON.parse(row.appearance),
        personality: JSON.parse(row.personality),
        attributes: JSON.parse(row.attributes),
        profession: JSON.parse(row.profession),
        background: JSON.parse(row.background),
        skills: JSON.parse(row.skills),
        relationships: await this.getCharacterRelationships(client, characterId),
        social_media: JSON.parse(row.social_media),
        opinions: JSON.parse(row.opinions),
        status: JSON.parse(row.status),
        ai_behavior: JSON.parse(row.ai_behavior),
        lifecycle: JSON.parse(row.lifecycle),
        game_integration: JSON.parse(row.game_integration),
        metadata: JSON.parse(row.metadata)
      };

      return character;

    } catch (error) {
      console.error('❌ Error getting character:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  async getCharactersByCivilization(civilizationId: number, limit: number = 50): Promise<DynamicCharacter[]> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(`
        SELECT * FROM characters 
        WHERE civilization_id = $1 
        ORDER BY (metadata->>'last_updated')::timestamp DESC
        LIMIT $2
      `, [civilizationId, limit]);

      const characters: DynamicCharacter[] = [];
      for (const row of result.rows) {
        const character = await this.getCharacter(row.id);
        if (character) {
          characters.push(character);
        }
      }

      return characters;

    } catch (error) {
      console.error('❌ Error getting characters by civilization:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  async getCharactersByCategory(category: string, civilizationId?: number, limit: number = 50): Promise<DynamicCharacter[]> {
    const client = await this.pool.connect();
    try {
      let query = `
        SELECT * FROM characters 
        WHERE category = $1
      `;
      const params = [category];

      if (civilizationId) {
        query += ` AND civilization_id = $2`;
        params.push(civilizationId);
      }

      query += ` ORDER BY (attributes->>'social_influence')::int DESC LIMIT $${params.length + 1}`;
      params.push(limit);

      const result = await client.query(query, params);

      const characters: DynamicCharacter[] = [];
      for (const row of result.rows) {
        const character = await this.getCharacter(row.id);
        if (character) {
          characters.push(character);
        }
      }

      return characters;

    } catch (error) {
      console.error('❌ Error getting characters by category:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  async updateCharacter(characterId: string, updates: Partial<DynamicCharacter>): Promise<void> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');

      // Build dynamic update query
      const updateFields = [];
      const values = [];
      let paramIndex = 1;

      for (const [key, value] of Object.entries(updates)) {
        if (key === 'id') continue; // Don't update ID
        
        if (typeof value === 'object' && value !== null) {
          updateFields.push(`${key} = $${paramIndex}`);
          values.push(JSON.stringify(value));
        } else {
          updateFields.push(`${key} = $${paramIndex}`);
          values.push(value);
        }
        paramIndex++;
      }

      if (updateFields.length > 0) {
        // Update last_updated in metadata
        updateFields.push(`metadata = jsonb_set(metadata, '{last_updated}', $${paramIndex})`);
        values.push(JSON.stringify(new Date()));
        paramIndex++;

        values.push(characterId);

        const query = `
          UPDATE characters 
          SET ${updateFields.join(', ')}
          WHERE id = $${paramIndex}
        `;

        await client.query(query, values);
      }

      await client.query('COMMIT');
      console.log(`✅ Updated character: ${characterId}`);

    } catch (error) {
      await client.query('ROLLBACK');
      console.error('❌ Error updating character:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  async deleteCharacter(characterId: string): Promise<void> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');

      // Delete relationships
      await client.query(`DELETE FROM character_relationships WHERE character_id = $1 OR related_character_id = $1`, [characterId]);

      // Delete character
      await client.query(`DELETE FROM characters WHERE id = $1`, [characterId]);

      await client.query('COMMIT');
      console.log(`✅ Deleted character: ${characterId}`);

    } catch (error) {
      await client.query('ROLLBACK');
      console.error('❌ Error deleting character:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  async getCharacterTemplates(): Promise<CharacterTemplate[]> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(`
        SELECT * FROM character_templates 
        ORDER BY story_importance DESC, rarity DESC
      `);

      return result.rows.map(row => ({
        id: row.id,
        name: row.name,
        category: row.category,
        subcategory: row.subcategory,
        rarity: row.rarity,
        baseAttributes: JSON.parse(row.base_attributes),
        professionPool: JSON.parse(row.profession_pool),
        skillSets: JSON.parse(row.skill_sets),
        personalityTraits: JSON.parse(row.personality_traits),
        emergenceConditions: JSON.parse(row.emergence_conditions),
        storyImportance: row.story_importance
      }));

    } catch (error) {
      console.error('❌ Error getting character templates:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  async getCharacterTemplate(templateId: string): Promise<CharacterTemplate | null> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(`
        SELECT * FROM character_templates WHERE id = $1
      `, [templateId]);

      if (result.rows.length === 0) {
        return null;
      }

      const row = result.rows[0];
      return {
        id: row.id,
        name: row.name,
        category: row.category,
        subcategory: row.subcategory,
        rarity: row.rarity,
        baseAttributes: JSON.parse(row.base_attributes),
        professionPool: JSON.parse(row.profession_pool),
        skillSets: JSON.parse(row.skill_sets),
        personalityTraits: JSON.parse(row.personality_traits),
        emergenceConditions: JSON.parse(row.emergence_conditions),
        storyImportance: row.story_importance
      };

    } catch (error) {
      console.error('❌ Error getting character template:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  // Private helper methods
  private async insertCharacterRelationships(client: any, characterId: string, relationships: any): Promise<void> {
    const allRelationships = [
      ...relationships.family.map((r: any) => ({ ...r, type: 'family' })),
      ...relationships.friends.map((r: any) => ({ ...r, type: 'friends' })),
      ...relationships.colleagues.map((r: any) => ({ ...r, type: 'colleagues' })),
      ...relationships.rivals.map((r: any) => ({ ...r, type: 'rivals' }))
    ];

    for (const relationship of allRelationships) {
      await client.query(`
        INSERT INTO character_relationships (
          character_id, related_character_id, relationship_type, relationship_category,
          strength, history, current_status, last_interaction
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `, [
        characterId,
        relationship.character_id,
        relationship.relationship_type,
        relationship.type,
        relationship.strength,
        relationship.history,
        relationship.current_status,
        relationship.last_interaction
      ]);
    }
  }

  private async getCharacterRelationships(client: any, characterId: string): Promise<any> {
    const result = await client.query(`
      SELECT * FROM character_relationships WHERE character_id = $1
    `, [characterId]);

    const relationships = {
      family: [],
      friends: [],
      colleagues: [],
      rivals: []
    };

    for (const row of result.rows) {
      const relationship = {
        character_id: row.related_character_id,
        relationship_type: row.relationship_type,
        strength: row.strength,
        history: row.history,
        current_status: row.current_status,
        last_interaction: row.last_interaction
      };

      const category = row.relationship_category as keyof typeof relationships;
      if (relationships[category]) {
        relationships[category].push(relationship);
      }
    }

    return relationships;
  }

  /**
   * Generate portrait for a character
   */
  private async generateCharacterPortrait(character: any): Promise<void> {
    try {
      const { getCharacterVisualIntegration } = await import('../visual-systems/CharacterVisualIntegration.js');
      const characterVisual = getCharacterVisualIntegration();
      
      // Queue image generation (non-blocking)
      characterVisual.queueCharacterImageGeneration({
        id: character.id,
        name: character.name,
        species: character.demographics?.species,
        role: character.profession?.title,
        category: character.category,
        subcategory: character.subcategory,
        appearance: character.appearance,
        personality: character.personality,
        profession: character.profession,
        civilization_id: character.civilization_id,
        planet_id: character.planet_id,
        city_id: character.city_id
      }, 'high');
    } catch (error) {
      console.warn(`Failed to queue character portrait generation for ${character.name?.full_display || character.id}:`, error);
    }
  }
}
