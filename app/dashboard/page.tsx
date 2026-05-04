'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { ref, query, limitToLast, onValue } from 'firebase/database';
import { database } from '@/lib/firebase';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import { Upload, Zap, Activity, DollarSign, AlertTriangle } from 'lucide-react';
import OscilloscopeWave from '@/components/OscilloscopeWave';
import ApplianceWaveIcon from '@/components/ApplianceWaveIcon';

interface DeviceState {
  state: 'ON' | 'OFF';
  confidence_pct: number;
}

interface NabihData {
  timestamp: string;
  total_power_watts: number;
  cost_sar_per_hour: number;
  system_status: string;
  unknown_device_warning: boolean;
  devices: Record<string, DeviceState>;
}

const DEMO: NabihData = {
  timestamp: '2026-05-03 21:49:44',
  total_power_watts: 2150.0,
  cost_sar_per_hour: 0.86,
  system_status: 'Active Load Detected',
  unknown_device_warning: false,
  devices: {
    boiler: { state: 'ON', confidence_pct: 92 },
    vacuum: { state: 'OFF', confidence_pct: 8 },
    fan: { state: 'ON', confidence_pct: 78 },
  },
};

const CHART_COLORS = ['#7ED957', '#6ED3CF', '#F4C20D', '#f87171', '#a78bfa', '#1F5F9B'] as const;

/* ── Metric card ──────────────────────────────────────── */
function MetricCard({
  label,
  value,
  sub,
  color = '#2EC4B6',
  icon: Icon,
}: {
  label: string;
  value: string;
  sub?: string;
  color?: string;
  icon?: React.ElementType;
}) {
  return (
    <div
      className="glass-card rounded-lg p-5 flex flex-col gap-2"
      style={{ borderColor: `${color}22` }}
    >
      <div className="flex items-center justify-between">
        <span className="section-label">{label}</span>
        {Icon && <Icon size={14} style={{ color, opacity: 0.6 }} />}
      </div>
      <span
        className="data-readout font-bold"
        style={{ fontSize: '1.6rem', color, textShadow: `0 0 20px ${color}80` }}
      >
        {value}
      </span>
      {sub && (
        <span className="data-readout" style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
          {sub}
        </span>
      )}
    </div>
  );
}

/* ── Dashboard page ───────────────────────────────────── */
export default function DashboardPage() {
  const [data, setData] = useState<NabihData | null>(null);
  const [error, setError] = useState('');
  const [pulse, setPulse] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [history, setHistory] = useState<{time: string, power: number}[]>([]);

  const triggerPulse = useCallback(() => {
    setPulse(true);
    setTimeout(() => setPulse(false), 700);
  }, []);

  // Firebase Realtime Listener
  useEffect(() => {
    try {
      // Fetch the last 60 readings so we have enough data to draw a beautiful historical graph!
      const recentReadingsQuery = query(ref(database, 'readings'), limitToLast(60)); 
      
      const unsubscribe = onValue(recentReadingsQuery, (snapshot) => {
        const val = snapshot.val();
        if (val) {
          console.log("Raw Firebase Data:", val);
          
          const keys = Object.keys(val);
          
          // 1. Build the historical array for the Line Chart using ALL fetched data
          const newHistory = keys.map((k, index) => ({
            time: `T-${keys.length - index}`,
            power: val[k].power || 0
          }));
          setHistory(newHistory);

          // 2. Extract the absolute newest reading to drive the live gauge numbers
          const latestKey = keys[keys.length - 1];
          const raw = val[latestKey];

          // Map the flat raw ESP32 data into our beautiful dashboard schema!
          const mappedData: NabihData = {
            timestamp: new Date().toLocaleTimeString(), // Or use raw.timestamp if it's formatted
            total_power_watts: raw.power || 0,
            cost_sar_per_hour: ((raw.power || 0) / 1000) * 0.18, // 0.18 SAR per kWh standard rate
            system_status: (raw.power || 0) > 50 ? 'Active Load Detected' : 'Standby (Vampire Draw)',
            unknown_device_warning: false,
            devices: {
              boiler: { state: raw.boiler || 'OFF', confidence_pct: raw.boiler === 'ON' ? 96 : 4 },
              vacuum: { state: raw.vacuum || 'OFF', confidence_pct: raw.vacuum === 'ON' ? 88 : 2 },
              fan: { state: raw.fan || 'OFF', confidence_pct: raw.fan === 'ON' ? 92 : 1 },
            }
          };
          
          setData(mappedData);
          setIsLive(true);
          triggerPulse();
          setError('');
        } else {
          console.warn("Connected to Firebase, but 'readings' node is empty!");
          setError("Connection successful, but the 'readings' path is currently empty.");
        }
      }, (err) => {
        console.error("Firebase subscription error:", err);
        setError(`Firebase Connection Error: ${err.message || 'Permission Denied.'}`);
      });

      return () => unsubscribe();
    } catch (err) {
      console.warn("Firebase config not fully set up yet.", err);
    }
  }, [triggerPulse]);

  // Loading states are now purely Firebase driven


  const deviceEntries = data && data.devices ? Object.entries(data.devices) : [];
  const activeDevices = deviceEntries.filter(([, d]) => d.state === 'ON');

  const barData = deviceEntries.map(([name, d]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    'Confidence (%)': d.confidence_pct,
  }));

  // Check if data is valid NabihData or raw unformatted data
  const isFormattedData = data && data.devices !== undefined && data.total_power_watts !== undefined;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10" style={{ color: 'var(--text-primary)', position: 'relative' }}>
      {/* Nabih Pulse overlay */}
      <AnimatePresence>
        {pulse && (
          <motion.div
            key="pulse"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.12 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            style={{ position: 'fixed', inset: 0, background: '#6ED3CF', pointerEvents: 'none', zIndex: 100 }}
          />
        )}
      </AnimatePresence>

      {/* Page header */}
      <div className="mb-8">
        <div className="section-label mb-1">NABIH NILM · ENERGY ANALYTICS TERMINAL</div>
        <div className="cyber-divider mb-4" />
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h1 className="font-extrabold tracking-tight glow-green" style={{ fontSize: '1.75rem' }}>
            DASHBOARD
          </h1>
          {data && (
            <div className="flex items-center gap-4">
              <span className="badge-online">
                <span className="w-1.5 h-1.5 rounded-full led-pulse" style={{ backgroundColor: '#6ED3CF' }} />
                {isLive ? 'LIVE FIREBASE SYNC' : 'DATA LOADED'}
              </span>
              <button
                onClick={() => { setData(null); setError(''); }}
                className="btn-cyber px-4 py-1.5 rounded text-xs tracking-wider uppercase"
              >
                ✕ Clear
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Oscilloscope header strip */}
      <div className="glass-card rounded-lg mb-6 overflow-hidden" style={{ padding: '0.75rem 1rem 0' }}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <Activity size={14} style={{ color: '#2EC4B6' }} />
            <span className="section-label">OSCILLOSCOPE · CH1 LIVE MAINS HARMONIC SIGNATURE</span>
          </div>
          <div className="flex items-center gap-4">
            {data && (
              <span className="data-readout" style={{ fontSize: '0.65rem', color: 'rgba(46, 196, 182,0.5)' }}>
                {data.total_power_watts} W · {data.cost_sar_per_hour.toFixed(3)} SAR/hr
              </span>
            )}
            <span className="badge-online">
              <span className="w-1.5 h-1.5 rounded-full led-pulse" style={{ backgroundColor: '#6ED3CF' }} />
              SENSING
            </span>
          </div>
        </div>
        
        <div style={{ height: 80, marginTop: 10 }}>
          {history.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history}>
                <YAxis domain={['auto', 'auto']} hide />
                <Tooltip
                  contentStyle={{ background: 'var(--tooltip-bg)', border: '1px solid var(--card-border)', borderRadius: 4, color: 'var(--tooltip-text)', fontFamily: 'monospace', fontSize: 12 }}
                  formatter={(v) => [`${Number(v).toFixed(1)} W`, 'Power']}
                  labelFormatter={() => ''}
                  cursor={{ stroke: 'rgba(46, 196, 182, 0.4)', strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="power" 
                  stroke="#6ED3CF" 
                  strokeWidth={2} 
                  dot={false} 
                  isAnimationActive={false} 
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <OscilloscopeWave height={60} cycles={7} amplitude={18} />
          )}
        </div>
      </div>

      {/* Connecting status view */}
      {!data && (
        <div className="glass-card rounded-lg flex flex-col items-center justify-center py-20 text-center">
          <div className="led-pulse w-4 h-4 rounded-full mb-6" style={{ backgroundColor: '#6ED3CF' }} />
          <h3 className="font-bold tracking-wider uppercase mb-2 glow-turquoise" style={{ fontSize: '1rem' }}>
            CONNECTING TO FIREBASE STREAM...
          </h3>
          <p className="section-label mb-4">WAITING FOR ESP32 TELEMETRY TO APPEAR IN THE DATABASE</p>
          {error && (
            <p className="data-readout mt-3 px-4 py-2 rounded" style={{ color: '#f87171', background: 'rgba(248,113,113,0.1)' }}>
              {error}
            </p>
          )}
        </div>
      )}

      {/* Data view */}
      {data && isFormattedData && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-6"
        >
          {/* Timestamp + status row */}
          <div
            className="flex flex-wrap items-center gap-6 px-4 py-3 rounded"
            style={{ background: 'var(--strip-bg)', border: '1px solid var(--strip-border)' }}
          >
            <div>
              <span className="section-label mr-2">TIMESTAMP</span>
              <span className="data-readout" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                {data.timestamp}
              </span>
            </div>
            <div>
              <span className="section-label mr-2">SYSTEM STATUS</span>
              <span className="data-readout" style={{ fontSize: '0.75rem', color: '#2EC4B6' }}>
                {data.system_status}
              </span>
            </div>
            {data.unknown_device_warning && (
              <div className="flex items-center gap-2">
                <AlertTriangle size={13} style={{ color: '#F4C20D' }} />
                <span className="data-readout" style={{ fontSize: '0.7rem', color: '#F4C20D' }}>
                  UNKNOWN DEVICE DETECTED
                </span>
              </div>
            )}
          </div>

          {/* Top metric cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard
              label="Total Power"
              value={`${data.total_power_watts} W`}
              sub="Aggregate active load"
              color="#7ED957"
              icon={Zap}
            />
            <MetricCard
              label="Cost Rate"
              value={`${data.cost_sar_per_hour.toFixed(3)}`}
              sub="SAR per hour"
              color="#6ED3CF"
              icon={DollarSign}
            />
            <MetricCard
              label="Active Devices"
              value={`${activeDevices.length} / ${deviceEntries.length}`}
              sub="Devices currently ON"
              color="#F4C20D"
              icon={Activity}
            />
            <MetricCard
              label="Daily Est. Cost"
              value={`${(data.cost_sar_per_hour * 24).toFixed(2)}`}
              sub="SAR · at current rate × 24 h"
              color="#a78bfa"
              icon={DollarSign}
            />
          </div>

          {/* Device table + confidence chart */}
          <div className="grid md:grid-cols-2 gap-5">
            {/* Device signatures table */}
            <div className="glass-card rounded-lg overflow-hidden">
              <div
                className="px-6 py-4 flex items-center gap-3"
                style={{ borderBottom: '1px solid var(--strip-border)' }}
              >
                <Activity size={15} style={{ color: '#2EC4B6' }} />
                <span className="section-label">DISAGGREGATED DEVICE SIGNATURES</span>
              </div>
              <table className="w-full">
                <thead>
                  <tr style={{ background: 'rgba(46, 196, 182,0.03)' }}>
                    {['Waveform', 'Device', 'State', 'Confidence'].map((h) => (
                      <th key={h} className="section-label px-5 py-3 text-left font-normal">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {deviceEntries.map(([name, dev], i) => (
                    <tr
                      key={name}
                      style={{ borderTop: '1px solid rgba(46, 196, 182,0.05)' }}
                      className="hover:bg-[rgba(46, 196, 182,0.03)] transition-colors"
                    >
                      <td className="px-5 py-4">
                        <ApplianceWaveIcon
                          applianceName={name}
                          size={48}
                          color={dev.state === 'ON' ? CHART_COLORS[i % CHART_COLORS.length] : '#94a3b8'}
                        />
                      </td>
                      <td className="px-5 py-4 font-semibold" style={{ color: 'var(--text-primary)', fontSize: '0.85rem', textTransform: 'capitalize' }}>
                        {name}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className="data-readout px-2 py-1 rounded"
                          style={{
                            fontSize: '0.65rem',
                            background: dev.state === 'ON' ? 'rgba(46, 196, 182,0.1)' : 'color-mix(in srgb, var(--text-muted) 10%, transparent)',
                            border: `1px solid ${dev.state === 'ON' ? 'rgba(46, 196, 182,0.35)' : 'color-mix(in srgb, var(--text-muted) 30%, transparent)'}`,
                            color: dev.state === 'ON' ? '#2EC4B6' : 'var(--text-secondary)',
                          }}
                        >
                          {dev.state}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div
                          className="inline-flex items-center gap-1.5 px-2 py-1 rounded data-readout"
                          style={{
                            fontSize: '0.65rem',
                            background: dev.confidence_pct >= 80 ? 'rgba(110, 211, 207,0.1)' : dev.confidence_pct >= 50 ? 'rgba(244, 194, 13,0.1)' : 'rgba(248,113,113,0.1)',
                            border: `1px solid ${dev.confidence_pct >= 80 ? 'rgba(110, 211, 207,0.3)' : dev.confidence_pct >= 50 ? 'rgba(244, 194, 13,0.3)' : 'rgba(248,113,113,0.3)'}`,
                            color: dev.confidence_pct >= 80 ? '#6ED3CF' : dev.confidence_pct >= 50 ? '#F4C20D' : '#f87171',
                          }}
                        >
                          {dev.confidence_pct}%
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Confidence bar chart */}
            <div className="glass-card rounded-lg p-6">
              <div className="section-label mb-4">DETECTION CONFIDENCE BY DEVICE</div>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={barData} margin={{ top: 5, right: 10, left: 0, bottom: 24 }}>
                  <CartesianGrid strokeDasharray="2 4" stroke="rgba(46, 196, 182,0.08)" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: 'var(--chart-tick)', fontFamily: 'monospace' }}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 10, fill: 'var(--chart-tick)', fontFamily: 'monospace' }}
                    unit="%"
                  />
                  <Tooltip
                    contentStyle={{
                      background: 'var(--tooltip-bg)',
                      border: '1px solid var(--card-border)',
                      borderRadius: 4,
                      color: 'var(--tooltip-text)',
                      fontFamily: 'monospace',
                      fontSize: 12,
                    }}
                    formatter={(v) => [`${v}%`]}
                  />
                  <Bar dataKey="Confidence (%)" radius={[3, 3, 0, 0]} fill="#7ED957" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      )}

      {/* Raw Data Debug View (Shown if data doesn't match expected structure) */}
      {data && !isFormattedData && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-lg p-6 mt-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={18} style={{ color: '#F4C20D' }} />
            <h3 className="section-label" style={{ color: '#F4C20D' }}>RAW FIREBASE DATA RECEIVED (SCHEMA MISMATCH)</h3>
          </div>
          <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
            Your connection to Firebase is <strong>WORKING</strong>, but the JSON structure from the ESP32 doesn't match the expected dashboard format yet. Here is the exact data we are receiving:
          </p>
          <pre className="data-readout p-4 rounded text-xs overflow-x-auto" style={{ background: 'rgba(0,0,0,0.05)', color: 'var(--text-primary)' }}>
            {JSON.stringify(data, null, 2)}
          </pre>
        </motion.div>
      )}
    </div>
  );
}
