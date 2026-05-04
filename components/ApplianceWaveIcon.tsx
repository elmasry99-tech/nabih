'use client';

type WaveType = 'ac' | 'fridge' | 'lighting' | 'motor' | 'background' | 'generic';

function detectWaveType(name: string): WaveType {
  const n = name.toLowerCase();
  if (n.includes('ac') || n.includes('air') || n.includes('cool') || n.includes('hvac')) return 'ac';
  if (n.includes('fridge') || n.includes('refrig') || n.includes('compressor')) return 'fridge';
  if (n.includes('light') || n.includes('lamp') || n.includes('led') || n.includes('bulb')) return 'lighting';
  if (n.includes('motor') || n.includes('pump') || n.includes('fan') || n.includes('wash')) return 'motor';
  return 'generic';
}

const WAVE_PATHS: Record<WaveType, string> = {
  /* Smooth sine – AC / inductive */
  ac: 'M0,12 C8,2 16,2 24,12 C32,22 40,22 48,12',
  /* Spiky compressor signature */
  fridge: 'M0,12 L4,12 L5,2 L6,22 L7,12 L12,12 L14,8 L16,16 L18,12 L24,12 L28,6 L30,18 L32,12 L48,12',
  /* Sharp LED switching peaks */
  lighting: 'M0,14 L8,14 L9,4 L10,14 L20,14 L21,4 L22,14 L32,14 L33,4 L34,14 L44,14 L45,4 L46,14 L48,14',
  /* Motor start transient then steady */
  motor: 'M0,12 C2,4 4,20 6,12 C8,4 10,20 12,12 C16,12 20,10 24,12 C32,14 40,12 48,12',
  /* Noisy baseline */
  background: 'M0,12 L3,11 L6,13 L9,10 L12,14 L15,11 L18,13 L21,11 L24,12 L27,10 L30,14 L33,11 L36,13 L39,12 L42,11 L45,13 L48,12',
  /* Generic sine */
  generic: 'M0,12 C8,4 16,4 24,12 C32,20 40,20 48,12',
};

interface Props {
  applianceName: string;
  size?: number;
  color?: string;
}

export default function ApplianceWaveIcon({ applianceName, size = 48, color = '#2EC4B6' }: Props) {
  const type = detectWaveType(applianceName);
  const path = WAVE_PATHS[type];
  const h = 24;
  const glowColor = color.replace(')', ', 0.4)').replace('rgb', 'rgba').replace('#', '');

  return (
    <svg
      width={size}
      height={size / 2}
      viewBox={`0 0 48 24`}
      fill="none"
      style={{ flexShrink: 0 }}
    >
      <defs>
        <filter id={`wglow-${type}`}>
          <feGaussianBlur stdDeviation="1.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* Glow */}
      <path d={path} stroke={color} strokeWidth="3" opacity="0.25" filter={`url(#wglow-${type})`} />
      {/* Line */}
      <path d={path} stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
