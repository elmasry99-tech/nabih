'use client';

import React, { useState } from 'react';
import { Brain, Cpu, Binary, Cloud, BarChart, ChevronRight, Zap } from 'lucide-react';

const sections = [
  {
    id: 'concept',
    title: 'Core Concept & Methodology',
    icon: Brain,
    content: (
      <div className="space-y-4">
        <p>
          The project is rooted in the principle of avoiding resource waste (Israf) by making "invisible" electricity consumption visible. 
          Nabeeh operates as an <span className="glow-green font-bold">"electrical fingerprint scanner"</span> from a single central measurement point.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <div className="glass-card p-3 rounded border-l-4 border-l-[#2EC4B6]">
            <h4 className="section-label mb-1">Non-Intrusive Monitoring</h4>
            <p className="text-xs text-secondary">Avoids per-outlet sensors by analyzing high-frequency voltage and current waveforms at the main inlet.</p>
          </div>
          <div className="glass-card p-3 rounded border-l-4 border-l-[#7ED957]">
            <h4 className="section-label mb-1">Edge AI Disaggregation</h4>
            <p className="text-xs text-secondary">Identifies unique "harmonic signatures"—distinguishing a refrigerator's noise from a vacuum cleaner's.</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'hardware',
    title: 'Hardware Architecture',
    icon: Cpu,
    content: (
      <div className="space-y-4">
        <p>The "Edge Node" utilizes high-fidelity signal capture and safe, non-invasive installation components.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
          {[
            { label: 'Microcontroller', val: 'ESP32-S3 (Dual-core, AI Acceleration)' },
            { label: 'Current Sensing', val: 'PZCT-02 (100A Split-Core Transformer)' },
            { label: 'Voltage Sensing', val: 'ZMPT101B (Mathematically Calibrated)' },
            { label: 'Conditioning', val: 'Star-grounding & DC-offset stabilization' },
          ].map((item) => (
            <div key={item.label} className="flex flex-col p-3 border border-white/5 bg-white/5 rounded">
              <span className="section-label" style={{ fontSize: '0.6rem' }}>{item.label}</span>
              <span className="data-readout text-sm mt-1">{item.val}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted italic mt-4">Note: Star-grounding architecture eliminates ADC ghosting and electromagnetic interference (EMI).</p>
      </div>
    ),
  },
  {
    id: 'software',
    title: 'Software & Edge AI',
    icon: Binary,
    content: (
      <div className="space-y-4">
        <p>Intelligence lies in local processing, removing reliance on persistent cloud connections for core inference.</p>
        <ul className="space-y-3 mt-2">
          <li className="flex gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-[#7ED957] mt-1.5 shrink-0" />
            <div>
              <span className="font-bold block text-sm">Digital Signal Processing (DSP)</span>
              <span className="text-xs text-secondary text-balance">High-speed sampling loop calculating RMS, Real/Apparent Power, and Power Factor.</span>
            </div>
          </li>
          <li className="flex gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-[#2EC4B6] mt-1.5 shrink-0" />
            <div>
              <span className="font-bold block text-sm">EloquentML Random Forest</span>
              <span className="text-xs text-secondary">Deployed directly on ESP32-S3 for instant appliance state classification.</span>
            </div>
          </li>
          <li className="flex gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-[#6ED3CF] mt-1.5 shrink-0" />
            <div>
              <span className="font-bold block text-sm">Arduino Framework & C++</span>
              <span className="text-xs text-secondary text-balance">Optimized for low-level hardware control and maximum sampling frequency.</span>
            </div>
          </li>
        </ul>
      </div>
    ),
  },
  {
    id: 'pipeline',
    title: 'Data Pipeline & Web',
    icon: Cloud,
    content: (
      <div className="space-y-4">
        <p>A seamless IoT pipeline connects the hardware edge to the user-facing dashboard.</p>
        <div className="relative p-6 glass-card rounded-lg overflow-hidden">
          {/* Decorative Grid */}
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#2EC4B6 1px, transparent 1px)', backgroundSize: '10px 10px' }} />
          
          <div className="relative z-10 flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded bg-black/40 border border-[#2EC4B6]/30 flex items-center justify-center data-readout text-[10px] text-[#2EC4B6]">JSON</div>
              <ChevronRight className="text-muted" size={16} />
              <div className="px-3 py-1 rounded bg-[#2EC4B6]/10 border border-[#2EC4B6]/30 text-[10px] section-label">Firebase RTDB</div>
              <ChevronRight className="text-muted" size={16} />
              <div className="px-3 py-1 rounded bg-[#7ED957]/10 border border-[#7ED957]/30 text-[10px] section-label text-[#7ED957]">Next.js App</div>
            </div>
            
            <p className="text-sm text-secondary">
              Data is pushed every two seconds via secure HTTP POST. The frontend features a 
              <span className="italic font-medium"> "Technocratic" </span> 
              aesthetic—using blueprint overlays and dark mode for live monitoring.
            </p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'results',
    title: 'Results & Significance',
    icon: BarChart,
    content: (
      <div className="space-y-4">
        <p>Translating abstract electrical metrics into actionable consumer intelligence.</p>
        <div className="space-y-3 mt-2">
          <div className="flex justify-between items-center p-3 glass-card rounded">
            <span className="text-sm font-medium">Load Differentiation</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-muted">Inductive vs Resistive</span>
          </div>
          <div className="flex justify-between items-center p-3 glass-card rounded">
            <span className="text-sm font-medium">Financial Translation (SAR)</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-[#7ED957]/20 text-[#7ED957] border border-[#7ED957]/30">SEC Tariff Sync</span>
          </div>
          <div className="flex justify-between items-center p-3 glass-card rounded">
            <span className="text-sm font-medium">Anomaly Detection</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">Telegram Alerts</span>
          </div>
        </div>
        <p className="text-xs text-secondary mt-4 leading-relaxed">
          Nabeeh empowers users to detect "vampire loads" and optimize consumption for a sustainable energy future.
        </p>
      </div>
    ),
  },
];

export default function ProjectDetails() {
  const [activeTab, setActiveTab] = useState(sections[0].id);

  const activeData = sections.find((s) => s.id === activeTab) || sections[0];

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold mb-4 text-white uppercase tracking-tight">Project Details</h1>
        <div className="section-label mb-3">DETAILED TECHNICAL OVERVIEW</div>
        <div className="cyber-divider mb-6 mx-auto max-w-xs" />
        <h2 className="text-xl font-bold opacity-70" style={{ color: 'var(--text-primary)' }}>
          The Engineering of Nabeeh
        </h2>
      </div>

      <div className="grid lg:grid-cols-[300px_1fr] gap-8">
        {/* Sidebar Navigation */}
        <div className="flex flex-col gap-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveTab(section.id)}
              className={`flex items-center gap-4 px-4 py-3 rounded-lg text-left transition-all group ${
                activeTab === section.id
                  ? 'bg-[#2EC4B6]/10 border border-[#2EC4B6]/30 shadow-[0_0_20px_rgba(46,196,182,0.1)]'
                  : 'hover:bg-white/5 border border-transparent'
              }`}
            >
              <div className={`p-2 rounded transition-colors ${
                activeTab === section.id ? 'bg-[#2EC4B6] text-black' : 'bg-white/5 text-secondary group-hover:text-primary'
              }`}>
                <section.icon size={18} />
              </div>
              <div className="flex flex-col">
                <span className={`text-xs font-bold tracking-wide uppercase ${
                  activeTab === section.id ? 'text-primary' : 'text-muted'
                }`}>
                  {section.title}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="glass-card rounded-xl p-8 min-h-[250px] relative overflow-hidden flex flex-col">
          {/* Background Highlight */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#2EC4B6]/5 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none" />
          
          <div className="relative z-10 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-[1px] bg-[#2EC4B6]" />
              <h3 className="text-xl font-bold glow-green">{activeData.title}</h3>
            </div>
            
            <div className="text-lg text-secondary leading-relaxed">
              {activeData.content}
            </div>
          </div>

          {/* Bottom Indicators */}
          <div className="mt-auto pt-6 flex items-center gap-2">
            <Zap size={14} className="text-[#7ED957]" />
            <span className="data-readout text-[10px] text-muted uppercase">NILM System Component v1.0.4</span>
          </div>
        </div>
      </div>
    </div>
  );
}
