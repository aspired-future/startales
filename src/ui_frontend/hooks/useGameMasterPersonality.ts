import { useState, useEffect } from 'react';
import { GameMasterPersonality } from '../services/ContentGenerator';

export const useGameMasterPersonality = () => {
  const [personality, setPersonality] = useState<GameMasterPersonality | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializePersonality = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Create a default Game Master personality for the demo
        const defaultPersonality: GameMasterPersonality = {
          creativity: 8.5,
          humor: 7.2,
          drama: 6.8,
          complexity: 7.9,
          realism: 8.1,
          optimism: 6.5,
          mysticism: 7.3,
          technologicalFocus: 8.7,
          culturalDepth: 9.2,
          conflictTendency: 5.8,
          explorationEmphasis: 9.1,
          characterDevelopment: 8.9,
          worldBuildingDetail: 9.5,
          narrativePacing: 7.4,
          playerAgency: 8.3,
          
          // Personality traits that affect content generation
          preferredThemes: [
            'exploration', 'first_contact', 'cultural_exchange', 
            'technological_advancement', 'diplomatic_intrigue', 
            'ancient_mysteries', 'galactic_politics'
          ],
          
          contentStyle: {
            descriptionLength: 'detailed',
            dialogueStyle: 'formal_diplomatic',
            conflictResolution: 'negotiation_preferred',
            mysteryLevel: 'moderate',
            humorFrequency: 'occasional',
            technicalDetail: 'high'
          },
          
          biases: {
            favorsDiplomacyOverWar: true,
            prefersComplexSolutions: true,
            emphasizesConsequences: true,
            valuesCharacterGrowth: true,
            encouragesExploration: true,
            supportsPlayerCreativity: true
          }
        };

        // Simulate some loading time for realism
        await new Promise(resolve => setTimeout(resolve, 1000));

        setPersonality(defaultPersonality);
        console.log('🎭 Game Master Personality initialized:', defaultPersonality);
      } catch (err) {
        console.error('❌ Failed to initialize Game Master Personality:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    initializePersonality();
  }, []);

  return {
    personality,
    isLoading,
    error,
    
    // Helper methods
    isCreative: personality ? personality.creativity > 7 : false,
    isHumorous: personality ? personality.humor > 6 : false,
    isDramatic: personality ? personality.drama > 7 : false,
    isComplex: personality ? personality.complexity > 7 : false,
    isRealistic: personality ? personality.realism > 7 : false,
    isOptimistic: personality ? personality.optimism > 6 : false,
    isMystical: personality ? personality.mysticism > 6 : false,
    isTechFocused: personality ? personality.technologicalFocus > 7 : false,
    hasCulturalDepth: personality ? personality.culturalDepth > 8 : false,
    isConflictProne: personality ? personality.conflictTendency > 6 : false,
    emphasizesExploration: personality ? personality.explorationEmphasis > 8 : false,
    developsCharacters: personality ? personality.characterDevelopment > 7 : false,
    buildsDetailedWorlds: personality ? personality.worldBuildingDetail > 8 : false,
    pacesFast: personality ? personality.narrativePacing > 7 : false,
    respectsPlayerAgency: personality ? personality.playerAgency > 7 : false
  };
};
