import React, { useState, useEffect } from 'react';
import './FlagCustomizer.css';

interface FlagCustomizationOptions {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  pattern: string;
  symbol: string;
  symbolPosition: string;
  style: string;
  mood: string;
}

interface FlagCustomizerProps {
  civilizationName: string;
  initialOptions?: Partial<FlagCustomizationOptions>;
  onOptionsChange?: (options: FlagCustomizationOptions) => void;
  onGenerate?: (options: FlagCustomizationOptions) => void;
  isGenerating?: boolean;
  previewUrl?: string;
  className?: string;
}

const COLOR_PRESETS = [
  { name: 'Royal Blue', value: '#1e40af' },
  { name: 'Crimson Red', value: '#dc2626' },
  { name: 'Forest Green', value: '#166534' },
  { name: 'Golden Yellow', value: '#d97706' },
  { name: 'Imperial Purple', value: '#7c2d12' },
  { name: 'Silver', value: '#6b7280' },
  { name: 'Deep Orange', value: '#ea580c' },
  { name: 'Teal', value: '#0f766e' },
  { name: 'Maroon', value: '#7f1d1d' },
  { name: 'Navy', value: '#1e3a8a' }
];

const PATTERN_OPTIONS = [
  { name: 'Horizontal Stripes', value: 'horizontal_stripes' },
  { name: 'Vertical Stripes', value: 'vertical_stripes' },
  { name: 'Diagonal Split', value: 'diagonal_split' },
  { name: 'Quadrants', value: 'quadrants' },
  { name: 'Cross', value: 'cross' },
  { name: 'Chevron', value: 'chevron' },
  { name: 'Border', value: 'border' },
  { name: 'Solid', value: 'solid' }
];

const SYMBOL_OPTIONS = [
  { name: 'Star', value: 'star' },
  { name: 'Eagle', value: 'eagle' },
  { name: 'Lion', value: 'lion' },
  { name: 'Crown', value: 'crown' },
  { name: 'Sword', value: 'sword' },
  { name: 'Shield', value: 'shield' },
  { name: 'Tree', value: 'tree' },
  { name: 'Mountain', value: 'mountain' },
  { name: 'Sun', value: 'sun' },
  { name: 'Moon', value: 'moon' },
  { name: 'Gear', value: 'gear' },
  { name: 'Atom', value: 'atom' },
  { name: 'None', value: 'none' }
];

const SYMBOL_POSITIONS = [
  { name: 'Center', value: 'center' },
  { name: 'Top Left', value: 'top_left' },
  { name: 'Top Right', value: 'top_right' },
  { name: 'Bottom Left', value: 'bottom_left' },
  { name: 'Bottom Right', value: 'bottom_right' }
];

const STYLE_OPTIONS = [
  { name: 'Traditional', value: 'traditional' },
  { name: 'Modern', value: 'modern' },
  { name: 'Minimalist', value: 'minimalist' },
  { name: 'Ornate', value: 'ornate' },
  { name: 'Military', value: 'military' },
  { name: 'Futuristic', value: 'futuristic' }
];

const MOOD_OPTIONS = [
  { name: 'Proud', value: 'proud' },
  { name: 'Peaceful', value: 'peaceful' },
  { name: 'Powerful', value: 'powerful' },
  { name: 'Noble', value: 'noble' },
  { name: 'Mysterious', value: 'mysterious' },
  { name: 'Progressive', value: 'progressive' }
];

export const FlagCustomizer: React.FC<FlagCustomizerProps> = ({
  civilizationName,
  initialOptions = {},
  onOptionsChange,
  onGenerate,
  isGenerating = false,
  previewUrl,
  className = ''
}) => {
  const [options, setOptions] = useState<FlagCustomizationOptions>({
    primaryColor: '#1e40af',
    secondaryColor: '#dc2626',
    accentColor: '#d97706',
    pattern: 'horizontal_stripes',
    symbol: 'star',
    symbolPosition: 'center',
    style: 'traditional',
    mood: 'proud',
    ...initialOptions
  });

  useEffect(() => {
    if (onOptionsChange) {
      onOptionsChange(options);
    }
  }, [options, onOptionsChange]);

  const handleOptionChange = (key: keyof FlagCustomizationOptions, value: string) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  const handleGenerate = () => {
    if (onGenerate) {
      onGenerate(options);
    }
  };

  const handleRandomize = () => {
    const randomOptions: FlagCustomizationOptions = {
      primaryColor: COLOR_PRESETS[Math.floor(Math.random() * COLOR_PRESETS.length)].value,
      secondaryColor: COLOR_PRESETS[Math.floor(Math.random() * COLOR_PRESETS.length)].value,
      accentColor: COLOR_PRESETS[Math.floor(Math.random() * COLOR_PRESETS.length)].value,
      pattern: PATTERN_OPTIONS[Math.floor(Math.random() * PATTERN_OPTIONS.length)].value,
      symbol: SYMBOL_OPTIONS[Math.floor(Math.random() * SYMBOL_OPTIONS.length)].value,
      symbolPosition: SYMBOL_POSITIONS[Math.floor(Math.random() * SYMBOL_POSITIONS.length)].value,
      style: STYLE_OPTIONS[Math.floor(Math.random() * STYLE_OPTIONS.length)].value,
      mood: MOOD_OPTIONS[Math.floor(Math.random() * MOOD_OPTIONS.length)].value
    };
    setOptions(randomOptions);
  };

  return (
    <div className={`flag-customizer ${className}`}>
      <div className="flag-customizer__header">
        <h3 className="flag-customizer__title">
          Design Flag for {civilizationName}
        </h3>
        <button 
          className="flag-customizer__randomize"
          onClick={handleRandomize}
          disabled={isGenerating}
        >
          🎲 Randomize
        </button>
      </div>

      <div className="flag-customizer__content">
        <div className="flag-customizer__preview">
          <div className="flag-customizer__preview-container">
            {previewUrl ? (
              <img 
                src={previewUrl} 
                alt={`${civilizationName} flag preview`}
                className="flag-customizer__preview-image"
              />
            ) : (
              <div className="flag-customizer__preview-placeholder">
                <div className="flag-customizer__preview-icon">🏴</div>
                <div className="flag-customizer__preview-text">
                  Flag Preview
                </div>
              </div>
            )}
            {isGenerating && (
              <div className="flag-customizer__preview-loading">
                <div className="flag-customizer__spinner"></div>
                <div>Generating...</div>
              </div>
            )}
          </div>
          
          <button 
            className="flag-customizer__generate"
            onClick={handleGenerate}
            disabled={isGenerating}
          >
            {isGenerating ? 'Generating...' : '🎨 Generate Flag'}
          </button>
        </div>

        <div className="flag-customizer__controls">
          {/* Colors */}
          <div className="flag-customizer__section">
            <h4 className="flag-customizer__section-title">Colors</h4>
            
            <div className="flag-customizer__color-group">
              <label className="flag-customizer__label">Primary Color</label>
              <div className="flag-customizer__color-options">
                {COLOR_PRESETS.map(color => (
                  <button
                    key={color.value}
                    className={`flag-customizer__color-option ${
                      options.primaryColor === color.value ? 'flag-customizer__color-option--selected' : ''
                    }`}
                    style={{ backgroundColor: color.value }}
                    onClick={() => handleOptionChange('primaryColor', color.value)}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            <div className="flag-customizer__color-group">
              <label className="flag-customizer__label">Secondary Color</label>
              <div className="flag-customizer__color-options">
                {COLOR_PRESETS.map(color => (
                  <button
                    key={color.value}
                    className={`flag-customizer__color-option ${
                      options.secondaryColor === color.value ? 'flag-customizer__color-option--selected' : ''
                    }`}
                    style={{ backgroundColor: color.value }}
                    onClick={() => handleOptionChange('secondaryColor', color.value)}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            <div className="flag-customizer__color-group">
              <label className="flag-customizer__label">Accent Color</label>
              <div className="flag-customizer__color-options">
                {COLOR_PRESETS.map(color => (
                  <button
                    key={color.value}
                    className={`flag-customizer__color-option ${
                      options.accentColor === color.value ? 'flag-customizer__color-option--selected' : ''
                    }`}
                    style={{ backgroundColor: color.value }}
                    onClick={() => handleOptionChange('accentColor', color.value)}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Pattern */}
          <div className="flag-customizer__section">
            <h4 className="flag-customizer__section-title">Pattern</h4>
            <div className="flag-customizer__options">
              {PATTERN_OPTIONS.map(pattern => (
                <button
                  key={pattern.value}
                  className={`flag-customizer__option ${
                    options.pattern === pattern.value ? 'flag-customizer__option--selected' : ''
                  }`}
                  onClick={() => handleOptionChange('pattern', pattern.value)}
                >
                  {pattern.name}
                </button>
              ))}
            </div>
          </div>

          {/* Symbol */}
          <div className="flag-customizer__section">
            <h4 className="flag-customizer__section-title">Symbol</h4>
            <div className="flag-customizer__options">
              {SYMBOL_OPTIONS.map(symbol => (
                <button
                  key={symbol.value}
                  className={`flag-customizer__option ${
                    options.symbol === symbol.value ? 'flag-customizer__option--selected' : ''
                  }`}
                  onClick={() => handleOptionChange('symbol', symbol.value)}
                >
                  {symbol.name}
                </button>
              ))}
            </div>
          </div>

          {/* Symbol Position */}
          {options.symbol !== 'none' && (
            <div className="flag-customizer__section">
              <h4 className="flag-customizer__section-title">Symbol Position</h4>
              <div className="flag-customizer__options">
                {SYMBOL_POSITIONS.map(position => (
                  <button
                    key={position.value}
                    className={`flag-customizer__option ${
                      options.symbolPosition === position.value ? 'flag-customizer__option--selected' : ''
                    }`}
                    onClick={() => handleOptionChange('symbolPosition', position.value)}
                  >
                    {position.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Style */}
          <div className="flag-customizer__section">
            <h4 className="flag-customizer__section-title">Style</h4>
            <div className="flag-customizer__options">
              {STYLE_OPTIONS.map(style => (
                <button
                  key={style.value}
                  className={`flag-customizer__option ${
                    options.style === style.value ? 'flag-customizer__option--selected' : ''
                  }`}
                  onClick={() => handleOptionChange('style', style.value)}
                >
                  {style.name}
                </button>
              ))}
            </div>
          </div>

          {/* Mood */}
          <div className="flag-customizer__section">
            <h4 className="flag-customizer__section-title">Mood</h4>
            <div className="flag-customizer__options">
              {MOOD_OPTIONS.map(mood => (
                <button
                  key={mood.value}
                  className={`flag-customizer__option ${
                    options.mood === mood.value ? 'flag-customizer__option--selected' : ''
                  }`}
                  onClick={() => handleOptionChange('mood', mood.value)}
                >
                  {mood.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlagCustomizer;
