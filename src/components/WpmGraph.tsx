import type { WpmDataPoint } from '../types';

interface WpmGraphProps {
  data: WpmDataPoint[];
  duration: number;
}

export const WpmGraph = ({ data, duration }: WpmGraphProps) => {
  if (data.length === 0) return null;

  const maxWpm = Math.max(...data.map(d => d.wpm), 20);
  const maxTime = Math.max(...data.map(d => d.time), duration);
  const paddedMaxWpm = Math.ceil(maxWpm * 1.1 / 10) * 10;
  
  const points = data.map(d => {
    const x = (d.time / maxTime) * 480 + 10;
    const y = 110 - ((d.wpm / paddedMaxWpm) * 90) + 10;
    return `${x},${y}`;
  }).join(' ');
  
  const areaPoints = `10,120 ${points} 490,120`;
  
  return (
    <div className="wpm-graph-container">
      <div className="graph-title">PERFORMANCE GRAPH</div>
      <div className="wpm-graph">
        <svg width="100%" height="140" viewBox="0 0 500 140" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="graphGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#00ff88" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#00ff88" stopOpacity="0.05" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          <rect x="10" y="10" width="480" height="110" fill="rgba(0, 0, 0, 0.3)" stroke="#1a2332" strokeWidth="1"/>
          
          {[0, 1, 2].map(i => (
            <g key={`grid-${i}`}>
              <line
                x1="10"
                y1={10 + i * 55}
                x2="490"
                y2={10 + i * 55}
                stroke="#2a3f5f"
                strokeWidth="1"
                opacity="0.4"
              />
              <text
                x="495"
                y={10 + i * 55 + 4}
                fill="#8892b0"
                fontSize="9"
                fontFamily="Orbitron, monospace"
              >
                {Math.round(paddedMaxWpm - (i * paddedMaxWpm / 2))}
              </text>
            </g>
          ))}
          
          <polyline
            points={areaPoints}
            fill="url(#graphGradient)"
          />
          
          <polyline
            points={points}
            fill="none"
            stroke="#00ff88"
            strokeWidth="2.5"
            strokeLinejoin="round"
            strokeLinecap="round"
            filter="url(#glow)"
          />
          
          {data.map((d, i) => {
            const x = (d.time / maxTime) * 480 + 10;
            const y = 110 - ((d.wpm / paddedMaxWpm) * 90) + 10;
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="3"
                fill="#00ff88"
                filter="url(#glow)"
              />
            );
          })}
        </svg>
        <div className="graph-labels">
          <span className="graph-label-start">0s</span>
          <span className="graph-label-center">WPM</span>
          <span className="graph-label-end">{duration}s</span>
        </div>
      </div>
    </div>
  );
};
