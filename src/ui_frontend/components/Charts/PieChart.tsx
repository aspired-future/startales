import React from 'react';
import './Charts.css';

export interface PieDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface PieChartProps {
  data: PieDataPoint[];
  title?: string;
  size?: number;
  showLabels?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
}

const defaultColors = [
  '#4ecdc4', '#45b7aa', '#96ceb4', '#feca57', 
  '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3',
  '#ff6b6b', '#ee5a24', '#0abde3', '#10ac84'
];

export const PieChart: React.FC<PieChartProps> = ({
  data,
  title,
  size = 200,
  showLabels = true,
  showLegend = true,
  showTooltip = true
}) => {
  const [hoveredSegment, setHoveredSegment] = React.useState<number | null>(null);
  
  if (!data || data.length === 0) {
    return <div className="chart-empty">No data available</div>;
  }

  const total = data.reduce((sum, item) => sum + item.value, 0);
  const radius = size / 2 - 20;
  const center = size / 2;
  
  let currentAngle = -90; // Start from top
  
  const segments = data.map((item, index) => {
    const percentage = (item.value / total) * 100;
    const angle = (item.value / total) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    
    const startAngleRad = (startAngle * Math.PI) / 180;
    const endAngleRad = (endAngle * Math.PI) / 180;
    
    const x1 = center + radius * Math.cos(startAngleRad);
    const y1 = center + radius * Math.sin(startAngleRad);
    const x2 = center + radius * Math.cos(endAngleRad);
    const y2 = center + radius * Math.sin(endAngleRad);
    
    const largeArcFlag = angle > 180 ? 1 : 0;
    
    const pathData = [
      `M ${center} ${center}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      'Z'
    ].join(' ');
    
    // Calculate label position
    const labelAngle = (startAngle + endAngle) / 2;
    const labelAngleRad = (labelAngle * Math.PI) / 180;
    const labelRadius = radius * 0.7;
    const labelX = center + labelRadius * Math.cos(labelAngleRad);
    const labelY = center + labelRadius * Math.sin(labelAngleRad);
    
    currentAngle = endAngle;
    
    return {
      ...item,
      pathData,
      percentage,
      color: item.color || defaultColors[index % defaultColors.length],
      labelX,
      labelY,
      index
    };
  });

  return (
    <div className="pie-chart-container">
      {title && <h3 className="chart-title">{title}</h3>}
      <div className="pie-chart-content">
        <svg width={size} height={size} className="pie-chart">
          {segments.map((segment, index) => (
            <g key={index}>
              <path
                d={segment.pathData}
                fill={segment.color}
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="2"
                className={`pie-segment ${hoveredSegment === index ? 'hovered' : ''}`}
                onMouseEnter={() => setHoveredSegment(index)}
                onMouseLeave={() => setHoveredSegment(null)}
                style={{
                  transform: hoveredSegment === index ? 'scale(1.05)' : 'scale(1)',
                  transformOrigin: `${center}px ${center}px`,
                  transition: 'transform 0.2s ease'
                }}
              />
              
              {/* Labels on segments */}
              {showLabels && segment.percentage > 5 && (
                <text
                  x={segment.labelX}
                  y={segment.labelY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="white"
                  fontSize="12"
                  fontWeight="bold"
                  className="pie-label"
                >
                  {segment.percentage.toFixed(1)}%
                </text>
              )}
            </g>
          ))}
        </svg>
        
        {/* Legend */}
        {showLegend && (
          <div className="pie-legend">
            {segments.map((segment, index) => (
              <div 
                key={index} 
                className={`legend-item ${hoveredSegment === index ? 'highlighted' : ''}`}
                onMouseEnter={() => setHoveredSegment(index)}
                onMouseLeave={() => setHoveredSegment(null)}
              >
                <div 
                  className="legend-color" 
                  style={{ backgroundColor: segment.color }}
                ></div>
                <span className="legend-label">{segment.label}</span>
                <span className="legend-value">
                  {segment.value} ({segment.percentage.toFixed(1)}%)
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Tooltip */}
      {showTooltip && hoveredSegment !== null && (
        <div className="chart-tooltip pie-tooltip">
          <div className="tooltip-label">{segments[hoveredSegment].label}</div>
          <div className="tooltip-value">
            {segments[hoveredSegment].value} ({segments[hoveredSegment].percentage.toFixed(1)}%)
          </div>
        </div>
      )}
    </div>
  );
};
