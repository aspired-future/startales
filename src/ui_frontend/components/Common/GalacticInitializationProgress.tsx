import React, { useState, useEffect } from 'react';
import './GalacticInitializationProgress.css';

export interface InitializationStep {
  id: string;
  label: string;
  description: string;
  icon: string;
  estimatedDuration: number; // in milliseconds
  status: 'pending' | 'in_progress' | 'completed' | 'error';
  progress?: number; // 0-100
  details?: string;
}

export interface GalacticInitializationProgressProps {
  isVisible: boolean;
  onComplete?: () => void;
  onError?: (error: string) => void;
}

export const GalacticInitializationProgress: React.FC<GalacticInitializationProgressProps> = ({
  isVisible,
  onComplete,
  onError
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [steps, setSteps] = useState<InitializationStep[]>([
    {
      id: 'galaxy_structure',
      label: 'Generating Galaxy Structure',
      description: 'Creating star systems, nebulae, and cosmic phenomena...',
      icon: '🌌',
      estimatedDuration: 2000,
      status: 'pending'
    },
    {
      id: 'star_systems',
      label: 'Initializing Star Systems',
      description: 'Placing stars, planets, and orbital mechanics...',
      icon: '⭐',
      estimatedDuration: 3000,
      status: 'pending'
    },
    {
      id: 'alien_races',
      label: 'Generating Alien Races',
      description: 'Creating diverse species with unique characteristics...',
      icon: '👽',
      estimatedDuration: 2500,
      status: 'pending'
    },
    {
      id: 'civilizations',
      label: 'Building Civilizations',
      description: 'Establishing governments, cultures, and histories...',
      icon: '🏛️',
      estimatedDuration: 4000,
      status: 'pending'
    },
    {
      id: 'characters',
      label: 'Creating Characters',
      description: 'Generating thousands of unique NPCs with personalities...',
      icon: '👥',
      estimatedDuration: 3500,
      status: 'pending'
    },
    {
      id: 'trade_routes',
      label: 'Establishing Trade Networks',
      description: 'Connecting civilizations through commerce and diplomacy...',
      icon: '🚀',
      estimatedDuration: 2000,
      status: 'pending'
    },
    {
      id: 'final_setup',
      label: 'Finalizing Systems',
      description: 'Connecting all components and preparing for launch...',
      icon: '⚙️',
      estimatedDuration: 1500,
      status: 'pending'
    }
  ]);

  const [overallProgress, setOverallProgress] = useState(0);
  const [currentStepProgress, setCurrentStepProgress] = useState(0);
  const [isInitializing, setIsInitializing] = useState(false);

  useEffect(() => {
    if (isVisible && !isInitializing) {
      startInitialization();
    }
  }, [isVisible]);

  const startInitialization = async () => {
    setIsInitializing(true);
    
    for (let i = 0; i < steps.length; i++) {
      await processStep(i);
    }
    
    // Complete initialization
    setTimeout(() => {
      setOverallProgress(100);
      if (onComplete) {
        onComplete();
      }
    }, 500);
  };

  const processStep = (stepIndex: number): Promise<void> => {
    return new Promise((resolve) => {
      setCurrentStepIndex(stepIndex);
      
      // Mark step as in progress
      setSteps(prev => prev.map((step, index) => 
        index === stepIndex 
          ? { ...step, status: 'in_progress' as const }
          : step
      ));

      const step = steps[stepIndex];
      const duration = step.estimatedDuration;
      const progressInterval = 50; // Update every 50ms
      const totalUpdates = duration / progressInterval;
      let currentUpdate = 0;

      const progressTimer = setInterval(() => {
        currentUpdate++;
        const stepProgress = (currentUpdate / totalUpdates) * 100;
        setCurrentStepProgress(Math.min(stepProgress, 100));
        
        // Update step details with realistic progress messages
        const details = getProgressDetails(step.id, stepProgress);
        setSteps(prev => prev.map((s, index) => 
          index === stepIndex 
            ? { ...s, progress: stepProgress, details }
            : s
        ));

        if (currentUpdate >= totalUpdates) {
          clearInterval(progressTimer);
          
          // Mark step as completed
          setSteps(prev => prev.map((s, index) => 
            index === stepIndex 
              ? { ...s, status: 'completed' as const, progress: 100 }
              : s
          ));
          
          // Update overall progress
          const newOverallProgress = ((stepIndex + 1) / steps.length) * 100;
          setOverallProgress(newOverallProgress);
          
          setCurrentStepProgress(0);
          resolve();
        }
      }, progressInterval);
    });
  };

  const getProgressDetails = (stepId: string, progress: number): string => {
    const progressMessages: Record<string, string[]> = {
      galaxy_structure: [
        'Mapping galactic coordinates...',
        'Placing spiral arms and star clusters...',
        'Generating nebulae and cosmic phenomena...',
        'Establishing galactic center and outer rim...',
        'Finalizing cosmic architecture...'
      ],
      star_systems: [
        'Igniting stellar cores...',
        'Calculating planetary orbits...',
        'Forming asteroid belts and moons...',
        'Establishing habitable zones...',
        'Calibrating stellar classifications...'
      ],
      alien_races: [
        'Evolving diverse life forms...',
        'Defining biological characteristics...',
        'Establishing evolutionary histories...',
        'Creating unique physiologies...',
        'Finalizing species traits...'
      ],
      civilizations: [
        'Founding ancient civilizations...',
        'Developing cultural traditions...',
        'Establishing governmental systems...',
        'Writing historical chronicles...',
        'Connecting diplomatic relations...'
      ],
      characters: [
        'Generating personality matrices...',
        'Creating individual backstories...',
        'Establishing social networks...',
        'Defining personal motivations...',
        'Finalizing character relationships...'
      ],
      trade_routes: [
        'Mapping interstellar highways...',
        'Establishing trade agreements...',
        'Creating economic networks...',
        'Defining resource flows...',
        'Activating commerce systems...'
      ],
      final_setup: [
        'Synchronizing all systems...',
        'Validating data integrity...',
        'Preparing user interface...',
        'Launching galactic simulation...'
      ]
    };

    const messages = progressMessages[stepId] || ['Processing...'];
    const messageIndex = Math.floor((progress / 100) * messages.length);
    return messages[Math.min(messageIndex, messages.length - 1)];
  };

  if (!isVisible) return null;

  return (
    <div className="galactic-initialization-overlay">
      <div className="initialization-container">
        <div className="initialization-header">
          <div className="galaxy-animation">
            <div className="galaxy-spiral"></div>
            <div className="galaxy-center"></div>
          </div>
          <h1>🌌 Initializing Galactic Systems</h1>
          <p>Generating civilizations, races, and star systems...</p>
        </div>

        <div className="overall-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${overallProgress}%` }}
            ></div>
          </div>
          <div className="progress-text">
            {Math.round(overallProgress)}% Complete
          </div>
        </div>

        <div className="steps-container">
          {steps.map((step, index) => (
            <div 
              key={step.id} 
              className={`step-item ${step.status} ${index === currentStepIndex ? 'current' : ''}`}
            >
              <div className="step-icon">
                {step.status === 'completed' ? '✅' : 
                 step.status === 'in_progress' ? '⚡' : 
                 step.status === 'error' ? '❌' : step.icon}
              </div>
              <div className="step-content">
                <div className="step-label">{step.label}</div>
                <div className="step-description">
                  {step.status === 'in_progress' && step.details ? step.details : step.description}
                </div>
                {step.status === 'in_progress' && (
                  <div className="step-progress">
                    <div className="step-progress-bar">
                      <div 
                        className="step-progress-fill" 
                        style={{ width: `${currentStepProgress}%` }}
                      ></div>
                    </div>
                    <span className="step-progress-text">
                      {Math.round(currentStepProgress)}%
                    </span>
                  </div>
                )}
              </div>
              <div className="step-status">
                {step.status === 'completed' && <span className="status-completed">✓</span>}
                {step.status === 'in_progress' && <div className="status-spinner"></div>}
                {step.status === 'error' && <span className="status-error">!</span>}
              </div>
            </div>
          ))}
        </div>

        <div className="initialization-footer">
          <div className="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <p>This may take a few moments as we create your unique galactic experience...</p>
        </div>
      </div>
    </div>
  );
};
