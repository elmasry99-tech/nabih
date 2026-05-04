'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, Camera, BookOpen, Tag } from 'lucide-react';

interface GalleryImage {
  url: string;
  name: string;
  tag: 'team' | 'hardware' | 'software' | 'uploaded';
  meta?: string;
}

const PLACEHOLDER: GalleryImage[] = [
  {
    url: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="100%" height="100%" fill="#FFFFFF"/><line x1="0" y1="0" x2="400" y2="300" stroke="rgba(46, 196, 182,0.05)" stroke-width="1"/><line x1="400" y1="0" x2="0" y2="300" stroke="rgba(46, 196, 182,0.05)" stroke-width="1"/><text x="50%" y="42%" fill="#2EC4B6" font-size="42" text-anchor="middle" font-family="monospace">👥</text><text x="50%" y="60%" fill="rgba(46, 196, 182,0.6)" font-size="14" text-anchor="middle" font-family="monospace">PROJECT TEAM</text><text x="50%" y="72%" fill="rgba(46, 196, 182,0.3)" font-size="10" text-anchor="middle" font-family="monospace">EE311 · NABIH</text></svg>`
    )}`,
    name: 'Project Team',
    tag: 'team',
    meta: 'EE311 Capstone Group',
  },
  {
    url: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="100%" height="100%" fill="#FFFFFF"/><rect x="100" y="80" width="200" height="140" rx="4" fill="none" stroke="rgba(46, 196, 182,0.3)" stroke-width="1"/><rect x="130" y="100" width="60" height="40" rx="2" fill="rgba(46, 196, 182,0.1)" stroke="rgba(46, 196, 182,0.3)" stroke-width="1"/><rect x="210" y="100" width="60" height="40" rx="2" fill="rgba(46, 196, 182,0.1)" stroke="rgba(46, 196, 182,0.3)" stroke-width="1"/><text x="50%" y="78%" fill="#2EC4B6" font-size="12" text-anchor="middle" font-family="monospace">ESP32-S3 PROTOTYPE</text></svg>`
    )}`,
    name: 'ESP32-S3 Board',
    tag: 'hardware',
    meta: 'Rev 1.2 · Dual-Core 240 MHz',
  },
  {
    url: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="100%" height="100%" fill="#FFFFFF"/><circle cx="200" cy="140" r="60" fill="none" stroke="rgba(46, 196, 182,0.3)" stroke-width="2"/><circle cx="200" cy="140" r="40" fill="none" stroke="rgba(46, 196, 182,0.15)" stroke-width="1"/><text x="50%" y="54%" fill="#2EC4B6" font-size="11" text-anchor="middle" font-family="monospace">SCT-013-030</text><text x="50%" y="78%" fill="rgba(46, 196, 182,0.6)" font-size="12" text-anchor="middle" font-family="monospace">CURRENT TRANSFORMER</text></svg>`
    )}`,
    name: 'SCT-013 CT Sensor',
    tag: 'hardware',
    meta: 'Non-invasive · 30A max',
  },
  {
    url: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="100%" height="100%" fill="#FFFFFF"/><polyline points="20,150 60,150 70,80 80,220 90,150 130,150 140,100 150,200 160,150 200,150 210,120 220,180 230,150 380,150" fill="none" stroke="#2EC4B6" stroke-width="1.5"/><text x="50%" y="82%" fill="rgba(46, 196, 182,0.5)" font-size="12" text-anchor="middle" font-family="monospace">NILM LOAD SIGNATURE</text></svg>`
    )}`,
    name: 'NILM Waveform Capture',
    tag: 'software',
    meta: 'Oscilloscope · 4 kHz sample',
  },
  {
    url: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="100%" height="100%" fill="#FFFFFF"/><rect x="40" y="60" width="320" height="180" rx="4" fill="none" stroke="rgba(46, 196, 182,0.2)" stroke-width="1"/><rect x="60" y="80" width="280" height="20" rx="2" fill="rgba(46, 196, 182,0.08)"/><rect x="60" y="110" width="180" height="12" rx="2" fill="rgba(46, 196, 182,0.05)"/><rect x="60" y="130" width="220" height="12" rx="2" fill="rgba(46, 196, 182,0.05)"/><rect x="60" y="150" width="160" height="12" rx="2" fill="rgba(46, 196, 182,0.05)"/><text x="50%" y="86%" fill="rgba(46, 196, 182,0.5)" font-size="12" text-anchor="middle" font-family="monospace">DASHBOARD PROTOTYPE</text></svg>`
    )}`,
    name: 'UI Wireframe v0.3',
    tag: 'software',
    meta: 'Figma → Next.js',
  },
  {
    url: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="100%" height="100%" fill="#FFFFFF"/><text x="50%" y="40%" fill="#6ED3CF" font-size="40" text-anchor="middle" font-family="monospace">📐</text><text x="50%" y="60%" fill="rgba(110, 211, 207,0.7)" font-size="12" text-anchor="middle" font-family="monospace">ANALOG FRONT-END</text><text x="50%" y="72%" fill="rgba(46, 196, 182,0.3)" font-size="10" text-anchor="middle" font-family="monospace">SCH REV 1.1</text></svg>`
    )}`,
    name: 'Analog Front-End Schematic',
    tag: 'hardware',
    meta: 'KiCad · EE311 Lab',
  },
];

const LOG_ENTRIES = [
  {
    week: 'WK 01–02',
    title: 'Problem Definition & Literature Review',
    body: "Scoped NILM system requirements. Reviewed Hart's 1992 paper on load monitoring and modern edge-ML approaches. Settled on event-driven transient detection over steady-state disaggregation.",
    status: 'COMPLETE',
  },
  {
    week: 'WK 03–04',
    title: 'Hardware Selection & Schematic Design',
    body: 'Selected ESP32-S3 for dual-core advantage. Designed analog front-end: SCT-013-030 CT, ZMPT101B voltage reference, 12-bit ADC oversampled at 4 kHz via DMA. KiCad schematic Rev 1.1 complete.',
    status: 'COMPLETE',
  },
  {
    week: 'WK 05–06',
    title: 'Firmware Development',
    body: 'Wrote ESP-IDF FreeRTOS tasks for signal acquisition, FFT feature extraction (32-point), and Wi-Fi JSON broadcast. Implemented circular DMA buffer to prevent sample dropout at 4 kHz.',
    status: 'COMPLETE',
  },
  {
    week: 'WK 07–08',
    title: 'NILM ML Model Integration',
    body: 'Trained Random Forest on PLAID dataset features (P, Q, V-I trajectory, harmonics). Quantised to TFLite int8 — on-device inference at < 50 ms latency, 96.2 % accuracy on held-out set.',
    status: 'COMPLETE',
  },
  {
    week: 'WK 09–10',
    title: 'System Integration & Bench Testing',
    body: 'Validated with 4 simultaneous appliances: AC, refrigerator, lighting, laptop. Confirmed JSON schema compatibility with Nabih web dashboard. Power overhead verified at 74 mA idle.',
    status: 'COMPLETE',
  },
  {
    week: 'WK 11–12',
    title: 'Final Demo & Report Submission',
    body: 'Conducted live demo with 4-appliance simultaneous load scenario. Presented disaggregation accuracy and cost estimation results to faculty panel. Final report submitted.',
    status: 'COMPLETE',
  },
];

const TAG_STYLE: Record<string, { color: string; bg: string; border: string }> = {
  team:     { color: '#a78bfa', bg: 'rgba(167,139,250,0.08)', border: 'rgba(167,139,250,0.25)' },
  hardware: { color: '#7ED957', bg: 'rgba(126, 217, 87,0.08)',  border: 'rgba(126, 217, 87,0.25)' },
  software: { color: '#6ED3CF', bg: 'rgba(110, 211, 207,0.08)',   border: 'rgba(110, 211, 207,0.25)' },
  uploaded: { color: '#F4C20D', bg: 'rgba(244, 194, 13,0.08)',  border: 'rgba(244, 194, 13,0.25)' },
};

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>(PLACEHOLDER);
  const [filter, setFilter] = useState('all');
  const fileRef = useRef<HTMLInputElement>(null);

  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    const newImgs: GalleryImage[] = files
      .filter((f) => f.type.startsWith('image/'))
      .map((f) => ({
        url: URL.createObjectURL(f),
        name: f.name.replace(/\.[^/.]+$/, ''),
        tag: 'uploaded' as const,
        meta: `${(f.size / 1024).toFixed(0)} KB · ${new Date().toLocaleDateString()}`,
      }));
    setImages((prev) => [...prev, ...newImgs]);
    e.target.value = '';
  }

  const tags = ['all', 'team', 'hardware', 'software', 'uploaded'];
  const visible = filter === 'all' ? images : images.filter((i) => i.tag === filter);

  return (
    <div
      className="max-w-7xl mx-auto px-6 py-10"
      style={{ color: 'var(--text-primary)' }}
    >
      {/* Header */}
      <div className="mb-8">
        <div className="section-label mb-1">NABIH NILM · PROJECT DOCUMENTATION</div>
        <div className="cyber-divider mb-4" />
        <h1
          className="font-extrabold tracking-tight glow-green"
          style={{ fontSize: '1.75rem' }}
        >
          GALLERY
        </h1>
      </div>

      {/* ── Project Log ───────────────────────────────────── */}
      <section className="mb-16">
        <div
          className="glass-card rounded-lg overflow-hidden"
        >
          <div
            className="flex items-center gap-3 px-6 py-4"
            style={{ borderBottom: '1px solid rgba(46, 196, 182,0.1)' }}
          >
            <BookOpen size={15} style={{ color: '#2EC4B6' }} />
            <span className="section-label">PROJECT LOG · DEVELOPMENT TIMELINE</span>
          </div>

          <div className="p-6 space-y-4">
            {LOG_ENTRIES.map(({ week, title, body, status }, idx) => (
              <motion.div
                key={week}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.07, duration: 0.35 }}
                className="flex gap-5"
              >
                {/* Timeline spine */}
                <div className="flex flex-col items-center" style={{ minWidth: 80 }}>
                  <div
                    className="data-readout text-center px-2 py-1 rounded"
                    style={{
                      fontSize: '0.6rem',
                      background: 'rgba(46, 196, 182,0.08)',
                      border: '1px solid rgba(46, 196, 182,0.2)',
                      color: '#2EC4B6',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {week}
                  </div>
                  {idx < LOG_ENTRIES.length - 1 && (
                    <div style={{ width: 1, flex: 1, minHeight: 24, background: 'rgba(46, 196, 182,0.1)', marginTop: 6 }} />
                  )}
                </div>

                {/* Entry */}
                <div
                  className="flex-1 rounded p-4 mb-2"
                  style={{
                    background: 'rgba(46, 196, 182,0.02)',
                    border: '1px solid rgba(46, 196, 182,0.08)',
                  }}
                >
                  <div className="flex items-center justify-between gap-3 mb-2 flex-wrap">
                    <span
                      className="font-semibold tracking-wide"
                      style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}
                    >
                      {title}
                    </span>
                    <span
                      className="data-readout px-2 py-0.5 rounded"
                      style={{
                        fontSize: '0.6rem',
                        background: 'rgba(110, 211, 207,0.08)',
                        border: '1px solid rgba(110, 211, 207,0.2)',
                        color: '#6ED3CF',
                      }}
                    >
                      {status}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                    {body}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Photo Gallery ─────────────────────────────────── */}
      <section>
        <div
          className="glass-card rounded-lg overflow-hidden"
        >
          <div
            className="flex flex-wrap items-center justify-between gap-4 px-6 py-4"
            style={{ borderBottom: '1px solid rgba(46, 196, 182,0.1)' }}
          >
            <div className="flex items-center gap-3">
              <Camera size={15} style={{ color: '#2EC4B6' }} />
              <span className="section-label">PHOTOGRAPHIC DOCUMENTATION</span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Filter */}
              <div className="flex gap-1.5">
                {tags.map((t) => (
                  <button
                    key={t}
                    onClick={() => setFilter(t)}
                    className="data-readout px-3 py-1 rounded uppercase transition-all"
                    style={{
                      fontSize: '0.6rem',
                      letterSpacing: '0.1em',
                      ...(filter === t
                        ? { background: 'rgba(46, 196, 182,0.15)', border: '1px solid rgba(46, 196, 182,0.4)', color: '#2EC4B6' }
                        : { background: 'transparent', border: '1px solid rgba(46, 196, 182,0.12)', color: 'var(--text-muted)' }),
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <button
                onClick={() => fileRef.current?.click()}
                className="btn-turquoise flex items-center gap-2 px-4 py-1.5 rounded text-xs font-semibold tracking-wider uppercase"
              >
                <Upload size={13} />
                Upload
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleUpload}
              />
            </div>
          </div>

          <div className="p-6">
            {visible.length === 0 ? (
              <div className="text-center py-16 section-label">NO RECORDS IN THIS CATEGORY</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {visible.map((img, i) => {
                  const ts = TAG_STYLE[img.tag];
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.04, duration: 0.3 }}
                      className="gallery-frame rounded-lg overflow-hidden group cursor-pointer"
                    >
                      {/* Scan line corner labels */}
                      <div
                        style={{
                          position: 'absolute',
                          top: 8, left: 8,
                          zIndex: 10,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 5,
                          background: 'rgba(244,246,245,0.8)',
                          border: `1px solid ${ts.border}`,
                          borderRadius: 3,
                          padding: '2px 6px',
                        }}
                      >
                        <Tag size={8} style={{ color: ts.color }} />
                        <span
                          className="data-readout uppercase"
                          style={{ fontSize: '0.55rem', color: ts.color, letterSpacing: '0.1em' }}
                        >
                          {img.tag}
                        </span>
                      </div>

                      {/* Image */}
                      <div
                        className="aspect-[4/3] overflow-hidden"
                        style={{ background: '#FFFFFF' }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={img.url}
                          alt={img.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          style={{ filter: 'saturate(0.9) contrast(1.05)' }}
                        />
                      </div>

                      {/* Caption */}
                      <div
                        style={{
                          padding: '10px 12px',
                          background: 'rgba(244,246,245,0.9)',
                          borderTop: '1px solid rgba(46, 196, 182,0.1)',
                        }}
                      >
                        <p
                          className="font-semibold truncate"
                          style={{ fontSize: '0.75rem', color: 'var(--text-primary)' }}
                        >
                          {img.name}
                        </p>
                        {img.meta && (
                          <p
                            className="data-readout truncate mt-0.5"
                            style={{ fontSize: '0.6rem', color: 'rgba(46, 196, 182,0.4)' }}
                          >
                            {img.meta}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="text-center py-8 mt-8"
        style={{
          borderTop: '1px solid rgba(46, 196, 182,0.08)',
          color: 'var(--text-muted)',
          fontSize: '0.65rem',
          letterSpacing: '0.12em',
        }}
      >
        <span className="data-readout">NABIH NILM · EE311 CAPSTONE · DOCUMENTATION ARCHIVE</span>
      </footer>
    </div>
  );
}
