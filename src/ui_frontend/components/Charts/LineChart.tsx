import React from 'react';
import './Charts.css';

export interface DataPoint {
  label: string;
  value: number;
}

export interface LineChartProps {
  data: DataPoint[];
  title?: string;
  color?: string;
  height?: number;
  width?: number;
  showGrid?: boolean;
  showTooltip?: boolean;
}

export const LineChart: React.FC<LineChartProps> = ({
  data,
  title,
  color = '#4ecdc4',
  height = 200,
  width = 400,
  showGrid = true,
  showTooltip = true
}) => {
  const [hoveredPoint, setHoveredPoint] = React.useState<number | null>(null);
  
  if (!data || data.length === 0) {
    return <div className="chart-empty">No data available</div>;
  }

  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue || 1;
  
  const padding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;
  
  const points = data.map((point, index) => {
    const x = padding + (index / (data.length - 1)) * chartWidth;
    const y = padding + ((maxValue - point.value) / range) * chartHeight;
    return { x, y, ...point };
  });
  
  const pathData = points.map((point, index) => 
    `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
  ).join(' ');

  return (
    <div className="line-chart-container">
      {title && <h3 className="chart-title">{title}</h3>}
      <svg width={width} height={height} className="line-chart">
        {/* Grid lines */}
        {showGrid && (
          <g className="grid">
            {/* Horizontal grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map(ratio => (
              <line
                key={`h-${ratio}`}
                x1={padding}
                y1={padding + ratio * chartHeight}
                x2={width - padding}
                y2={padding + ratio * chartHeight}
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="1"
              />
            ))}
            {/* Vertical grid lines */}
            {points.map((point, index) => (
              <line
                key={`v-${index}`}
                x1={point.x}
                y1={padding}
                x2={point.x}
                y2={height - padding}
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="1"
              />
            ))}
          </g>
        )}
        
        {/* Area under the line */}
        <path
          d={`${pathData} L ${points[points.length - 1].x} ${height - padding} L ${padding} ${height - padding} Z`}
          fill={`url(#gradient-${color.replace('#', '')})`}
          opacity="0.2"
        />
        
        {/* Line */}
        <path
          d={pathData}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Data points */}
        {points.map((point, index) => (
          <circle
            key={index}
            cx={point.x}
            cy={point.y}
            r={hoveredPoint === index ? 6 : 4}
            fill={color}
            stroke="rgba(255,255,255,0.8)"
            strokeWidth="2"
            className="data-point"
            onMouseEnter={() => setHoveredPoint(index)}
            onMouseLeave={() => setHoveredPoint(null)}
          />
        ))}
        
        {/* Y-axis labels */}
        <g className="y-axis">
          {[maxValue, maxValue * 0.75, maxValue * 0.5, maxValue * 0.25, minValue].map((value, index) => (
            <text
              key={index}
              x={padding - 10}
              y={padding + index * (chartHeight / 4) + 5}
              textAnchor="end"
              fill="rgba(255,255,255,0.6)"
              fontSize="12"
            >
              {value.toFixed(0)}
            </text>
          ))}
        </g>
        
        {/* X-axis labels */}
        <g className="x-axis">
          {points.map((point, index) => (
            <text
              key={index}
              x={point.x}
              y={height - padding + 20}
              textAnchor="middle"
              fill="rgba(255,255,255,0.6)"
              fontSize="12"
            >
              {point.label}
            </text>
          ))}
        </g>
        
        {/* Gradient definition */}
        <defs>
          <linearGradient id={`gradient-${color.replace('#', '')}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Tooltip */}
      {showTooltip && hoveredPoint !== null && (
        <div 
          className="chart-tooltip"
          style={{
            left: points[hoveredPoint].x,
            top: points[hoveredPoint].y - 40
          }}
        >
          <div className="tooltip-label">{points[hoveredPoint].label}</div>
          <div className="tooltip-value">{points[hoveredPoint].value}</div>
        </div>
      )}
    </div>
  );
};
