import React from 'react';

interface ScoreDisplayProps {
  score: number;
  level: number;
  experience: number;
  experienceToNext: number;
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({
  score,
  level,
  experience,
  experienceToNext
}) => {
  const progressPercentage = (experience / experienceToNext) * 100;

  const formatScore = (score: number): string => {
    if (score >= 1000000) {
      return `${(score / 1000000).toFixed(1)}M`;
    } else if (score >= 1000) {
      return `${(score / 1000).toFixed(1)}K`;
    }
    return score.toString();
  };

  return (
    <div className="score-display">
      <div className="score-info">
        <div className="score-value">
          <span className="score-icon">⭐</span>
          <span className="score-number">{formatScore(score)}</span>
        </div>
        <div className="level-info">
          <span className="level-label">Level</span>
          <span className="level-number">{level}</span>
        </div>
      </div>
      
      <div className="experience-bar">
        <div className="experience-progress" style={{ width: `${progressPercentage}%` }}></div>
        <div className="experience-text">
          {experience} / {experienceToNext} XP
        </div>
      </div>
      
      <style jsx>{`
        .score-display {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: 4px 12px;
          background: rgba(15, 15, 35, 0.9);
          border: 1px solid rgba(78, 205, 196, 0.3);
          border-radius: 6px;
          backdrop-filter: blur(10px);
          min-width: 160px;
          max-height: 50px;
          flex-shrink: 0;
        }
        
        .score-info {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        
        .score-value {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        
        .score-icon {
          font-size: 18px;
          filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.6));
        }
        
        .score-number {
          color: #4ecdc4;
          font-size: 16px;
          font-weight: 700;
          text-shadow: 0 0 10px rgba(78, 205, 196, 0.5);
        }
        
        .level-info {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
        }
        
        .level-label {
          color: #b8bcc8;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .level-number {
          color: #4ecdc4;
          font-size: 14px;
          font-weight: 600;
          text-shadow: 0 0 8px rgba(78, 205, 196, 0.4);
        }
        
        .experience-bar {
          position: relative;
          width: 100%;
          height: 4px;
          background: rgba(26, 26, 46, 0.8);
          border-radius: 2px;
          overflow: hidden;
          border: 1px solid rgba(78, 205, 196, 0.2);
        }
        
        .experience-progress {
          height: 100%;
          background: linear-gradient(90deg, #4ecdc4 0%, #45b7aa 100%);
          border-radius: 3px;
          transition: width 0.5s ease;
          box-shadow: 0 0 8px rgba(78, 205, 196, 0.4);
        }
        
        .experience-text {
          position: absolute;
          top: -20px;
          left: 50%;
          transform: translateX(-50%);
          color: #b8bcc8;
          font-size: 10px;
          white-space: nowrap;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .score-display:hover .experience-text {
          opacity: 1;
        }
        
        @media (max-width: 768px) {
          .score-display {
            min-width: 150px;
            padding: 6px 12px;
          }
          
          .score-info {
            gap: 15px;
          }
          
          .score-number {
            font-size: 16px;
          }
          
          .level-number {
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
};

export default ScoreDisplay;
