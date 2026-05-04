'use client';

import { useMemo } from 'react';

function generateWavePath(
  totalWidth: number,
  height: number,
  amplitude: number,
  cycles: number,
  noiseLevel = 0,
): string {
  const step = 4;
  const cx = height / 2;
  const pts: string[] = [];
  for (let x = 0; x <= totalWidth; x += step) {
    const base = cx + amplitude * Math.sin((x / totalWidth) * cycles * 2 * Math.PI);
    const noise = noiseLevel * (Math.random() * 2 - 1);
    pts.push(`${x.toFixed(1)},${(base + noise).toFixed(1)}`);
  }
  return 'M ' + pts.join(' L ');
}

interface Props {
  /** pixel width of one tile; the component renders 2 side by side for loop */
  tileWidth?: number;
  height?: number;
  cycles?: number;
  amplitude?: number;
  color?: string;
  glowColor?: string;
  className?: string;
}

export default function OscilloscopeWave({
  tileWidth = 1200,
  height = 80,
  cycles = 6,
  amplitude = 22,
  color = '#7ED957',
  glowColor = 'rgba(126, 217, 87,0.4)',
  className = '',
}: Props) {
  const path = useMemo(
    () => generateWavePath(tileWidth, height, amplitude, cycles),
    [tileWidth, height, amplitude, cycles],
  );

  const svgId = `wave-filter-${cycles}`;

  return (
    <div
      className={`w-full overflow-hidden ${className}`}
      style={{ height, position: 'relative' }}
    >
      <svg
        width={tileWidth * 2}
        height={height}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          animation: `wave-scroll 8s linear infinite`,
        }}
      >
        <defs>
          <filter id={svgId} x="-20%" y="-50%" width="140%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Glow layer */}
        <path
          d={path}
          fill="none"
          stroke={glowColor}
          strokeWidth="4"
          filter={`url(#${svgId})`}
          opacity={0.6}
        />
        {/* Second copy of glow layer */}
        <path
          d={path}
          fill="none"
          stroke={glowColor}
          strokeWidth="4"
          filter={`url(#${svgId})`}
          opacity={0.6}
          transform={`translate(${tileWidth}, 0)`}
        />

        {/* Sharp line */}
        <path d={path} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        <path
          d={path}
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          transform={`translate(${tileWidth}, 0)`}
        />
      </svg>
    </div>
  );
}
