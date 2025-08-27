import React from 'react';
import './Charts.css';

export interface BarDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface BarChartProps {
  data: BarDataPoint[];
  title?: string;
  color?: string;
  height?: number;
  width?: number;
  showGrid?: boolean;
  showTooltip?: boolean;
  horizontal?: boolean;
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  title,
  color = '#4ecdc4',
  height = 200,
  width = 400,
  showGrid = true,
  showTooltip = true,
  horizontal = false
}) => {
  const [hoveredBar, setHoveredBar] = React.useState<number | null>(null);
  
  if (!data || data.length === 0) {
    return <div className="chart-empty">No data available</div>;
  }

  const maxValue = Math.max(...data.map(d => d.value));
  const padding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;
  
  const barWidth = horizontal ? chartHeight / data.length * 0.8 : chartWidth / data.length * 0.8;
  const barSpacing = horizontal ? chartHeight / data.length * 0.2 : chartWidth / data.length * 0.2;

  return (
    <div className="bar-chart-container">
      {title && <h3 className="chart-title">{title}</h3>}
      <svg width={width} height={height} className="bar-chart">
        {/* Grid lines */}
        {showGrid && (
          <g className="grid">
            {[0, 0.25, 0.5, 0.75, 1].map(ratio => (
              <line
                key={`grid-${ratio}`}
                x1={padding}
                y1={horizontal ? padding + ratio * chartHeight : padding + ratio * chartHeight}
                x2={horizontal ? width - padding : width - padding}
                y2={horizontal ? padding + ratio * chartHeight : padding + ratio * chartHeight}
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="1"
              />
            ))}
          </g>
        )}
        
        {/* Bars */}
        {data.map((item, index) => {
          const barLength = (item.value / maxValue) * (horizontal ? chartWidth : chartHeight);
          const barColor = item.color || color;
          
          if (horizontal) {
            const y = padding + index * (chartHeight / data.length) + barSpacing / 2;
            return (
              <g key={index}>
                <rect
                  x={padding}
                  y={y}
                  width={barLength}
                  height={barWidth}
                  fill={barColor}
                  className={`bar ${hoveredBar === index ? 'hovered' : ''}`}
                  onMouseEnter={() => setHoveredBar(index)}
                  onMouseLeave={() => setHoveredBar(null)}
                  opacity={hoveredBar === index ? 0.8 : 0.7}
                />
                {/* Value label */}
                <text
                  x={padding + barLength + 5}
                  y={y + barWidth / 2}
                  dominantBaseline="middle"
                  fill="rgba(255,255,255,0.8)"
                  fontSize="12"
                >
                  {item.value}
                </text>
                {/* Category label */}
                <text
                  x={padding - 10}
                  y={y + barWidth / 2}
                  textAnchor="end"
                  dominantBaseline="middle"
                  fill="rgba(255,255,255,0.6)"
                  fontSize="12"
                >
                  {item.label}
                </text>
              </g>
            );
          } else {
            const x = padding + index * (chartWidth / data.length) + barSpacing / 2;
            const y = height - padding - barLength;
            return (
              <g key={index}>
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barLength}
                  fill={barColor}
                  className={`bar ${hoveredBar === index ? 'hovered' : ''}`}
                  onMouseEnter={() => setHoveredBar(index)}
                  onMouseLeave={() => setHoveredBar(null)}
                  opacity={hoveredBar === index ? 0.8 : 0.7}
                />
                {/* Value label */}
                <text
                  x={x + barWidth / 2}
                  y={y - 5}
                  textAnchor="middle"
                  fill="rgba(255,255,255,0.8)"
                  fontSize="12"
                >
                  {item.value}
                </text>
                {/* Category label */}
                <text
                  x={x + barWidth / 2}
                  y={height - padding + 20}
                  textAnchor="middle"
                  fill="rgba(255,255,255,0.6)"
                  fontSize="12"
                >
                  {item.label}
                </text>
              </g>
            );
          }
        })}
        
        {/* Y-axis labels for vertical chart */}
        {!horizontal && (
          <g className="y-axis">
            {[maxValue, maxValue * 0.75, maxValue * 0.5, maxValue * 0.25, 0].map((value, index) => (
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
        )}
        
        {/* X-axis labels for horizontal chart */}
        {horizontal && (
          <g className="x-axis">
            {[0, maxValue * 0.25, maxValue * 0.5, maxValue * 0.75, maxValue].map((value, index) => (
              <text
                key={index}
                x={padding + index * (chartWidth / 4)}
                y={height - padding + 20}
                textAnchor="middle"
                fill="rgba(255,255,255,0.6)"
                fontSize="12"
              >
                {value.toFixed(0)}
              </text>
            ))}
          </g>
        )}
      </svg>
      
      {/* Tooltip */}
      {showTooltip && hoveredBar !== null && (
        <div className="chart-tooltip">
          <div className="tooltip-label">{data[hoveredBar].label}</div>
          <div className="tooltip-value">{data[hoveredBar].value}</div>
        </div>
      )}
    </div>
  );
};
