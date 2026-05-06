'use client';

import Image from 'next/image';
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Tag, Calendar, MapPin, BookOpen } from 'lucide-react';

interface GalleryImage {
  url: string;
  name: string;
  tag: 'team' | 'hardware' | 'software' | 'uploaded' | 'event';
  meta?: string;
}

const PLACEHOLDER: GalleryImage[] = [
  {
    url: '/gallery/1.jpeg',
    name: 'Showcasing Innovation at Prince Sattam bin Abdulaziz University Engineering Hackathon',
    tag: 'event',
    meta: 'Innovation Hub · PSBAU Engineering Hackathon',
  },
  {
    url: '/gallery/2.jpeg',
    name: 'From Concept to Prototype: The Technical Development of Nabeeh',
    tag: 'team',
    meta: 'Project Collaboration · PSBAU Hackathon',
  },
  {
    url: '/gallery/3.jpeg',
    name: 'Prototype Exhibition',
    tag: 'hardware',
    meta: 'NILM System Showcase',
  },
];

const TAG_STYLE: Record<string, { color: string; bg: string; border: string }> = {
  all:      { color: '#2EC4B6', bg: 'rgba(46, 196, 182, 0.08)', border: 'rgba(46, 196, 182, 0.25)' },
  event:    { color: '#F4C20D', bg: 'rgba(244, 194, 13, 0.08)',  border: 'rgba(244, 194, 13, 0.25)' },
  team:     { color: '#a78bfa', bg: 'rgba(167, 139, 250, 0.08)', border: 'rgba(167, 139, 250, 0.25)' },
  hardware: { color: '#7ED957', bg: 'rgba(126, 217, 87, 0.08)',  border: 'rgba(126, 217, 87, 0.25)' },
  software: { color: '#6ED3CF', bg: 'rgba(110, 211, 207, 0.08)', border: 'rgba(110, 211, 207, 0.25)' },
  uploaded: { color: '#FF7E67', bg: 'rgba(255, 126, 103, 0.08)', border: 'rgba(255, 126, 103, 0.25)' },
};

export default function GalleryPage() {
  const [images] = useState<GalleryImage[]>(PLACEHOLDER);
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12" style={{ color: 'var(--text-primary)' }}>
      {/* ── Header Section ─────────────────────────────────── */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <div className="flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-[#2EC4B6]/60 mb-2">
          <BookOpen size={14} />
          <span>PROJECT DOCUMENTATION & MEDIA</span>
        </div>
        <div className="h-px w-full bg-gradient-to-r from-[#2EC4B6]/30 via-[#2EC4B6]/10 to-transparent mb-6" />
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black tracking-tight mb-2 text-white glow-green">
              VISUAL <span className="text-[#2EC4B6]">GALLERY</span>
            </h1>
            <p className="text-sm text-[#8E9AAF] max-w-xl leading-relaxed">
              A curated collection of hardware prototypes, software architectures, and significant milestones 
              captured during the development of Nabih NILM.
            </p>
          </div>
          

          <input type="file" ref={fileRef} className="hidden" multiple accept="image/*" />
        </div>
      </motion.div>

      {/* ── Image Grid ───────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {images.map((img, idx) => (
            <motion.div
              layout
              key={img.url + idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="group relative"
            >
              <div className="glass-card rounded-2xl overflow-hidden border border-white/5 hover:border-[#2EC4B6]/30 transition-all duration-500 hover:shadow-[0_0_40px_rgba(46,196,182,0.15)] h-full flex flex-col">
                {/* Image Container */}
                <div className="aspect-[4/3] relative overflow-hidden bg-[#0A0F1E]">
                  <Image
                    src={img.url}
                    alt={img.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  
                  {/* Overlay Tag */}
                  <div 
                    className="absolute top-4 left-4 px-3 py-1 rounded-full text-[9px] font-black tracking-widest backdrop-blur-md border shadow-lg"
                    style={{
                      backgroundColor: TAG_STYLE[img.tag].bg,
                      color: TAG_STYLE[img.tag].color,
                      borderColor: TAG_STYLE[img.tag].border,
                    }}
                  >
                    {img.tag.toUpperCase()}
                  </div>

                </div>

                {/* Info Area */}
                <div className="p-6 flex-grow flex flex-col justify-between bg-gradient-to-b from-white/[0.02] to-transparent">
                  <div>
                    <h3 className="text-sm font-bold text-white/90 mb-3 leading-snug group-hover:text-[#2EC4B6] transition-colors">
                      {img.name}
                    </h3>
                    {img.meta && (
                      <div className="flex items-center gap-2 text-[10px] text-[#8E9AAF] font-medium">
                        {img.tag === 'event' ? <MapPin size={10} className="text-[#F4C20D]" /> : <Tag size={10} />}
                        <span className="tracking-wide">{img.meta}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* ── Empty State ───────────────────────────────────── */}
      {images.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-32 text-center"
        >
          <Camera size={48} className="mx-auto text-[#2EC4B6]/20 mb-4" />
          <p className="text-[#8E9AAF] font-medium">No documentation found in this category.</p>
        </motion.div>
      )}

      {/* ── Footer ────────────────────────────────────────── */}
      <footer className="mt-24 pt-8 border-t border-white/5 text-center">
        <p className="text-[10px] text-[#8E9AAF]/40 tracking-[0.3em] font-black uppercase">
          Nabih NILM System · Media Archive · {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}
