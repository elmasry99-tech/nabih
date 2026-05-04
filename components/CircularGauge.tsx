'use client';

interface Props {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  unit?: string;
}

export default function CircularGauge({
  value,
  max = 5000,
  size = 160,
  strokeWidth = 10,
  label = 'Active Power',
  unit = 'W',
}: Props) {
  const r = (size - strokeWidth * 2) / 2;
  const cx = size / 2;
  const cy = size / 2;

  // 270-degree arc gauge
  const arcDegrees = 270;
  const circumference = 2 * Math.PI * r;
  const arcLength = (arcDegrees / 360) * circumference;

  const pct = Math.min(Math.max(value / max, 0), 1);
  const filled = pct * arcLength;

  // Color thresholds
  const color =
    pct < 0.4
      ? '#6ED3CF'
      : pct < 0.7
        ? '#F4C20D'
        : '#f87171';

  const glowColor =
    pct < 0.4
      ? 'rgba(110, 211, 207,0.5)'
      : pct < 0.7
        ? 'rgba(244, 194, 13,0.5)'
        : 'rgba(248,113,113,0.5)';

  // Rotate start point to "7 o'clock" (135° from 3 o'clock position in SVG)
  const rotation = 135;

  return (
    <div className="flex flex-col items-center gap-2">
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size}>
          <defs>
            <filter id="gauge-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Track (background arc) */}
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke="rgba(46, 196, 182,0.08)"
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeLinecap="round"
            transform={`rotate(${rotation} ${cx} ${cy})`}
          />

          {/* Track tick marks */}
          {[0, 0.25, 0.5, 0.75, 1].map((t) => {
            const angle = ((rotation + t * arcDegrees) * Math.PI) / 180;
            const innerR = r - strokeWidth;
            const outerR = r + strokeWidth / 2;
            const x1 = cx + innerR * Math.cos(angle);
            const y1 = cy + innerR * Math.sin(angle);
            const x2 = cx + outerR * Math.cos(angle);
            const y2 = cy + outerR * Math.sin(angle);
            return (
              <line
                key={t}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="rgba(46, 196, 182,0.2)"
                strokeWidth="1"
              />
            );
          })}

          {/* Glow layer */}
          {filled > 0 && (
            <circle
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={glowColor}
              strokeWidth={strokeWidth + 4}
              strokeDasharray={`${filled} ${circumference}`}
              strokeLinecap="round"
              transform={`rotate(${rotation} ${cx} ${cy})`}
              filter="url(#gauge-glow)"
              opacity={0.5}
            />
          )}

          {/* Filled arc */}
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${filled} ${circumference}`}
            strokeLinecap="round"
            transform={`rotate(${rotation} ${cx} ${cy})`}
            style={{ transition: 'stroke-dasharray 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), stroke 0.4s ease' }}
          />
        </svg>

        {/* Center text */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span
            className="data-readout font-bold"
            style={{ fontSize: size * 0.16, color, textShadow: `0 0 16px ${glowColor}` }}
          >
            {value.toLocaleString()}
          </span>
          <span
            className="data-readout"
            style={{ fontSize: size * 0.08, color: 'var(--text-muted)', marginTop: 2 }}
          >
            {unit}
          </span>
        </div>
      </div>

      <span className="section-label">{label}</span>

      {/* Load % bar */}
      <div
        className="w-full"
        style={{
          height: 3,
          background: 'rgba(46, 196, 182,0.1)',
          borderRadius: 2,
          overflow: 'hidden',
          width: size * 0.7,
        }}
      >
        <div
          style={{
            width: `${pct * 100}%`,
            height: '100%',
            background: color,
            boxShadow: `0 0 6px ${glowColor}`,
            borderRadius: 2,
            transition: 'width 0.8s ease',
          }}
        />
      </div>
      <span
        className="data-readout"
        style={{ fontSize: '0.6rem', color: 'rgba(46, 196, 182,0.4)' }}
      >
        {(pct * 100).toFixed(1)}% of {(max / 1000).toFixed(1)} kW
      </span>
    </div>
  );
}
