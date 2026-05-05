'use client';

import { useState, useEffect } from 'react';
import { ref, query, limitToLast, onValue } from 'firebase/database';
import { database } from '@/lib/firebase';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { Zap, Activity, DollarSign, AlertTriangle, Leaf } from 'lucide-react';
import OscilloscopeWave from '@/components/OscilloscopeWave';
import ApplianceWaveIcon from '@/components/ApplianceWaveIcon';

interface DeviceState {
  state: 'ON' | 'OFF';
  confidence_pct: number;
}

interface NabihData {
  timestamp: string;
  total_power_watts: number;
  total_energy_kwh: number;
  accumulated_cost_sar: number;
  co2_kg: number;
  system_status: string;
  unknown_device_warning: boolean;
  devices: Record<string, DeviceState>;
}

const DEMO: NabihData = {
  timestamp: '2026-05-05 23:56:15',
  total_power_watts: 0.1,
  total_energy_kwh: 0.004685321,
  accumulated_cost_sar: 0.000843358,
  co2_kg: 0.00262378,
  system_status: 'Standby (Vampire Draw)',
  unknown_device_warning: false,
  devices: {
    boiler: { state: 'OFF', confidence_pct: 4 },
    vacuum: { state: 'OFF', confidence_pct: 2 },
    fan: { state: 'OFF', confidence_pct: 1 },
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
  const [isLive, setIsLive] = useState(false);
  const [history, setHistory] = useState<{time: string, power: number}[]>([]);
  const [co2History, setCo2History] = useState<{time: string, co2: number}[]>([]);
  const [energyHistory, setEnergyHistory] = useState<{time: string, energy: number}[]>([]);
  const [timeRange, setTimeRange] = useState<'day' | 'month'>('day');
  // Firebase Realtime Listener
  useEffect(() => {
    try {
      // Fetch the last 60 readings so we have enough data to draw a beautiful historical graph!
      const recentReadingsQuery = query(ref(database, 'readings'), limitToLast(60)); 
      
      const unsubscribe = onValue(recentReadingsQuery, (snapshot) => {
        const val = snapshot.val();
        if (val) {

          
          const keys = Object.keys(val);
          
          // 1. Build the historical arrays for the charts
          const newHistory = keys.map((k, index) => ({
            time: `T-${keys.length - index}`,
            power: val[k].power || 0
          }));
          setHistory(newHistory);

          const newCo2History = keys.map((k, index) => ({
            time: `T-${keys.length - index}`,
            co2: val[k].co2_kg || 0
          }));
          setCo2History(newCo2History);

          const newEnergyHistory = keys.map((k, index) => ({
            time: `T-${keys.length - index}`,
            energy: val[k].energy_kwh || 0
          }));
          setEnergyHistory(newEnergyHistory);

          // 2. Extract the absolute newest reading to drive the live gauge numbers
          const latestKey = keys[keys.length - 1];
          const raw = val[latestKey];

          // Map the flat raw ESP32 data into our beautiful dashboard schema!
          const mappedData: NabihData = {
            timestamp: raw.timestamp || new Date().toLocaleTimeString(),
            total_power_watts: raw.power || 0,
            total_energy_kwh: raw.energy_kwh || 0,
            accumulated_cost_sar: raw.cost_sar || 0,
            co2_kg: raw.co2_kg || 0,
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
  }, []);

  const deviceEntries = data && data.devices ? Object.entries(data.devices) : [];
  const activeDevices = deviceEntries.filter(([, d]) => d.state === 'ON');

  const barData = deviceEntries.map(([name, d]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    'Confidence (%)': d.confidence_pct,
  }));

  const pieData = [
    { name: 'Boiler', value: timeRange === 'day' ? 4.2 : 126 },
    { name: 'Fan', value: timeRange === 'day' ? 1.1 : 33 },
    { name: 'Vacuum', value: timeRange === 'day' ? 0.8 : 24 },
    { name: 'Others', value: timeRange === 'day' ? 0.5 : 15 },
  ];

  // Check if data is valid NabihData or raw unformatted data
  const isFormattedData = data && data.devices !== undefined && data.total_power_watts !== undefined;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10" style={{ color: 'var(--text-primary)', position: 'relative' }}>


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

      {/* Analytics Charts Row */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Real-time Power Chart */}
        <div className="glass-card rounded-lg overflow-hidden group" style={{ padding: '1rem 1.25rem 0' }}>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-3">
              <Zap size={15} className="text-[#7ED957]" />
              <span className="section-label">LIVE POWER (W)</span>
            </div>
            {data && (
              <div className="data-readout text-[#7ED957] font-bold" style={{ fontSize: '1rem' }}>
                {data.total_power_watts.toFixed(1)} <span className="text-[0.6rem] font-normal opacity-70">W</span>
              </div>
            )}
          </div>
          <div style={{ height: 140, margin: '0 -20px' }}>
            {history.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={history}>
                  <defs>
                    <linearGradient id="colorPower" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7ED957" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#7ED957" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip
                    contentStyle={{ background: 'var(--tooltip-bg)', border: '1px solid var(--card-border)', borderRadius: 8, color: 'var(--tooltip-text)', fontFamily: 'monospace', fontSize: 11 }}
                    formatter={(v) => [`${Number(v).toFixed(1)} W`, 'Power']}
                    labelFormatter={() => ''}
                    cursor={{ stroke: '#7ED957', strokeWidth: 1 }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="power" 
                    stroke="#7ED957" 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#colorPower)" 
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <OscilloscopeWave height={80} cycles={7} amplitude={25} />
            )}
          </div>
        </div>

        {/* Total Energy Chart */}
        <div className="glass-card rounded-lg overflow-hidden group" style={{ padding: '1rem 1.25rem 0' }}>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-3">
              <Activity size={15} className="text-[#6ED3CF]" />
              <span className="section-label">TOTAL ENERGY (KWH)</span>
            </div>
            {data && (
              <div className="data-readout text-[#6ED3CF] font-bold" style={{ fontSize: '1rem' }}>
                {data.total_energy_kwh.toFixed(6)} <span className="text-[0.6rem] font-normal opacity-70">kWh</span>
              </div>
            )}
          </div>
          <div style={{ height: 140, margin: '0 -20px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={energyHistory}>
                <defs>
                  <linearGradient id="colorEnergy" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6ED3CF" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6ED3CF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Tooltip
                  contentStyle={{ background: 'var(--tooltip-bg)', border: '1px solid var(--card-border)', borderRadius: 8, color: 'var(--tooltip-text)', fontFamily: 'monospace', fontSize: 11 }}
                  formatter={(v) => [`${Number(v).toFixed(6)} kWh`, 'Energy']}
                  labelFormatter={() => ''}
                  cursor={{ stroke: '#6ED3CF', strokeWidth: 1 }}
                />
                <Area 
                  type="monotone" 
                  dataKey="energy" 
                  stroke="#6ED3CF" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorEnergy)" 
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
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
            <div className="flex items-center gap-2">
              <Leaf size={14} style={{ color: '#a78bfa' }} />
              <span className="section-label mr-2">CO2 EMISSIONS</span>
              <span className="data-readout" style={{ fontSize: '0.75rem', color: '#a78bfa' }}>
                {data.co2_kg?.toFixed(6) || '0.000000'} KG
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
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <MetricCard
              label="Total Power"
              value={`${data.total_power_watts} W`}
              sub="Aggregate load"
              color="#7ED957"
              icon={Zap}
            />
            <MetricCard
              label="Total Cost"
              value={`${data.accumulated_cost_sar?.toFixed(6) || '0.000000'} SAR`}
              sub="Expenditure"
              color="#6ED3CF"
              icon={DollarSign}
            />
            <MetricCard
              label="CO2 Emissions"
              value={`${data.co2_kg?.toFixed(6) || '0.000000'} kg`}
              sub="Environmental impact"
              color="#a78bfa"
              icon={Leaf}
            />
            <MetricCard
              label="Active Devices"
              value={`${activeDevices.length} / ${deviceEntries.length}`}
              sub="Currently ON"
              color="#F4C20D"
              icon={Activity}
            />
            <MetricCard
              label="Total Energy"
              value={`${data.total_energy_kwh?.toFixed(6) || '0.000000'} kWh`}
              sub="Consumption"
              color="#7ED957"
              icon={Zap}
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

            {/* Device Contribution Pie Chart */}
            <div className="glass-card rounded-lg p-6 md:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="section-label">ENERGY CONTRIBUTION ANALYSIS</div>
                  <div className="text-[0.65rem] text-var(--text-muted) uppercase tracking-widest mt-1">
                    Device distribution by {timeRange}
                  </div>
                </div>
                <div className="flex bg-[rgba(46,196,182,0.05)] p-1 rounded-md border border-[rgba(46,196,182,0.1)]">
                  <button
                    onClick={() => setTimeRange('day')}
                    className={`px-4 py-1.5 rounded text-[0.6rem] font-bold tracking-wider transition-all ${timeRange === 'day' ? 'bg-[#2EC4B6] text-white shadow-lg' : 'text-var(--text-muted) hover:text-white'}`}
                  >
                    DAY
                  </button>
                  <button
                    onClick={() => setTimeRange('month')}
                    className={`px-4 py-1.5 rounded text-[0.6rem] font-bold tracking-wider transition-all ${timeRange === 'month' ? 'bg-[#2EC4B6] text-white shadow-lg' : 'text-var(--text-muted) hover:text-white'}`}
                  >
                    MONTH
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div style={{ height: 280 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={100}
                        paddingAngle={8}
                        dataKey="value"
                        animationBegin={0}
                        animationDuration={1200}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} stroke="rgba(0,0,0,0.2)" strokeWidth={2} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          background: 'var(--tooltip-bg)',
                          border: '1px solid var(--card-border)',
                          borderRadius: 8,
                          color: 'var(--tooltip-text)',
                          fontFamily: 'monospace',
                          fontSize: 12,
                          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)'
                        }}
                        formatter={(value) => [`${value} kWh`, 'Consumption']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  {pieData.map((item, i) => (
                    <div key={item.name} className="flex items-center justify-between p-3 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(46,196,182,0.05)] hover:bg-[rgba(46,196,182,0.05)] transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length], boxShadow: `0 0 8px ${CHART_COLORS[i % CHART_COLORS.length]}` }} />
                        <span className="section-label" style={{ color: 'var(--text-primary)', fontSize: '0.75rem' }}>{item.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="data-readout" style={{ fontSize: '0.9rem', color: CHART_COLORS[i % CHART_COLORS.length] }}>{item.value.toFixed(1)} kWh</div>
                        <div className="text-[0.55rem] text-var(--text-muted) font-mono">{((item.value / pieData.reduce((a, b) => a + b.value, 0)) * 100).toFixed(1)}% CONTRIBUTION</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
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
