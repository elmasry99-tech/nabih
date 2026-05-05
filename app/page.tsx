import Link from 'next/link';
import { Cpu, Zap, Radio, Shield, Activity, Layers } from 'lucide-react';
import OscilloscopeWave from '@/components/OscilloscopeWave';
import ProjectDetails from '@/components/ProjectDetails';

const features = [
  {
    Icon: Activity,
    title: 'Non-Intrusive Load Monitoring',
    desc: "Nabih analyses the aggregate current waveform at a single metering point to disaggregate individual appliance signatures — no per-device sensors.",
  },
  {
    Icon: Cpu,
    title: 'ESP32 Edge Intelligence',
    desc: 'ESP32-S3 samples AC mains at 4 kHz via DMA, extracts V-I trajectory features, and broadcasts structured JSON payloads over Wi-Fi.',
  },
  {
    Icon: Zap,
    title: 'Real-Time Disaggregation',
    desc: 'TFLite int8 classifier identifies appliance archetypes — resistive, inductive, switched-mode — with confidence scores per detection event.',
  },
  {
    Icon: Radio,
    title: 'Wireless Telemetry',
    desc: 'ESP32 acts as a Wi-Fi access point. No cloud dependency — the JSON snapshot is downloaded directly from the device over your local network.',
  },
  {
    Icon: Shield,
    title: 'Privacy-First',
    desc: 'All processing is browser-local. JSON payloads are parsed in-memory via the FileReader API. Zero telemetry leaves your machine.',
  },
  {
    Icon: Layers,
    title: 'Power Quality Analysis',
    desc: 'Beyond active power — Nabih reports Vrms, Irms, displacement angle, reactive power (VAR), and estimated THD from harmonic components.',
  },
];

const specs = [
  { label: 'ADC Sample Rate', value: '4 kHz' },
  { label: 'Classification Accuracy', value: '96.2 %' },
  { label: 'Inference Latency', value: '< 50 ms' },
  { label: 'Idle Current Draw', value: '< 80 mA' },
  { label: 'Appliance Classes', value: '12+' },
  { label: 'JSON Refresh Rate', value: '1 Hz' },
];

export default function HomePage() {
  return (
    <div style={{ color: 'var(--text-primary)' }}>
      {/* Global Page Glow */}
      <div
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, height: '600px',
          background: 'radial-gradient(ellipse 120% 60% at 50% -10%, rgba(126, 217, 87,0.18) 0%, rgba(46,139,139,0.08) 50%, transparent 100%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ paddingTop: '1rem', paddingBottom: '6rem' }}>

        <div className="max-w-6xl mx-auto px-6 text-center relative">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 mb-8" style={{
            background: 'rgba(46, 196, 182,0.06)',
            border: '1px solid rgba(46, 196, 182,0.2)',
            borderRadius: 4,
            padding: '4px 14px',
          }}>
            <span className="w-1.5 h-1.5 rounded-full led-pulse" style={{ backgroundColor: '#6ED3CF' }} />
            <span className="section-label">EE311 CAPSTONE · ESP32 + NILM SYSTEM</span>
          </div>

          <h1
            className="font-extrabold tracking-tight mb-6"
            style={{ fontSize: 'clamp(2.5rem, 7vw, 5rem)', lineHeight: 1.05 }}
          >
            <span style={{ color: 'var(--text-primary)' }}>Advanced Electrical</span>
            <br />
            <span className="glow-green">Intelligence Interface</span>
          </h1>

          <p
            style={{
              fontSize: '1.15rem',
              color: 'var(--text-secondary)',
              maxWidth: 560,
              margin: '0 auto 2.5rem',
              lineHeight: 1.7,
            }}
          >
            Non-Intrusive Load Monitoring powered by an ESP32 edge node. One current transformer. The entire electrical profile of your building.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/dashboard"
              className="px-8 py-3 rounded font-semibold text-sm tracking-wider uppercase transition-all"
              style={{
                background: 'rgba(110, 211, 207,0.15)',
                border: '1px solid rgba(110, 211, 207,0.5)',
                color: '#6ED3CF',
                boxShadow: '0 0 20px rgba(110, 211, 207,0.15)',
              }}
            >
              Launch Dashboard →
            </Link>
           
          </div>

  


        </div>

        {/* Oscilloscope waveform strip */}
        <div className="mt-16 relative" style={{ borderTop: '1px solid rgba(46, 196, 182,0.1)', borderBottom: '1px solid rgba(46, 196, 182,0.1)' }}>
          <div className="flex items-center justify-between px-8 py-2 max-w-7xl mx-auto">
            <span className="section-label">CH1 · LIVE MAINS SIGNATURE</span>
            <span className="section-label">4 kHz · 12-BIT ADC</span>
          </div>
          <OscilloscopeWave height={70} cycles={7} amplitude={20} />
          <div className="flex items-center justify-between px-8 py-2 max-w-7xl mx-auto">
            <span className="section-label">231.5 Vrms</span>
            <span className="section-label" style={{ color: '#6ED3CF' }}>SENSING</span>
          </div>
        </div>
      </section>

      {/* ── Spec Strip ───────────────────────────────────────── */}
      <section
        style={{
          background: 'rgba(46, 196, 182,0.02)',
          borderTop: '1px solid rgba(46, 196, 182,0.08)',
          borderBottom: '1px solid rgba(46, 196, 182,0.08)',
        }}
      >
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4 text-center">
            {specs.map(({ label, value }) => (
              <div key={label}>
                <div className="data-readout glow-green font-bold" style={{ fontSize: '1.4rem' }}>
                  {value}
                </div>
                <div className="section-label mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="mb-14">
          <div className="section-label mb-2">SYSTEM CAPABILITIES</div>
          <div className="cyber-divider mb-6" />
          <h2 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
            How Nabih Works
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {features.map(({ Icon, title, desc }) => (
            <div key={title} className="glass-card glass-card-hover rounded-lg p-6">
              <div
                className="w-10 h-10 rounded flex items-center justify-center mb-4"
                style={{
                  background: 'rgba(46, 196, 182,0.08)',
                  border: '1px solid rgba(46, 196, 182,0.2)',
                }}
              >
                <Icon size={18} style={{ color: '#2EC4B6' }} />
              </div>
              <h3
                className="font-bold mb-2 tracking-wide"
                style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}
              >
                {title}
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>



      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div
          className="rounded-lg p-12 text-center relative overflow-hidden"
          style={{
            background: 'rgba(46, 196, 182,0.04)',
            border: '1px solid rgba(46, 196, 182,0.2)',
            boxShadow: '0 0 60px rgba(46, 196, 182,0.06)',
          }}
        >
          <div className="section-label mb-4">DATA INJECTION READY</div>
          <h2 className="text-3xl font-bold mb-4 glow-green">Ready to Analyse Your Load?</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', maxWidth: 480, margin: '0 auto 2rem' }}>
            Upload your ESP32 JSON snapshot. Instant appliance disaggregation, power quality metrics, and cost estimates — fully client-side.
          </p>
          <Link
            href="/dashboard"
            className="inline-block px-10 py-3 rounded font-semibold text-sm tracking-wider uppercase"
            style={{
              background: 'rgba(110, 211, 207,0.15)',
              border: '1px solid rgba(110, 211, 207,0.5)',
              color: '#6ED3CF',
            }}
          >
            Open Dashboard →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="text-center py-6"
        style={{
          borderTop: '1px solid rgba(46, 196, 182,0.08)',
          color: 'var(--text-muted)',
          fontSize: '0.7rem',
          letterSpacing: '0.1em',
        }}
      >
        <span className="data-readout">NABIH NILM SYSTEM · EE311 CAPSTONE · NEXT.JS 16 + ESP32-S3</span>
      </footer>
    </div>
  );
}
