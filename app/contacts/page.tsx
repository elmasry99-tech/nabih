'use client';

import React from 'react';
import { Mail, Shield, Zap, Globe, MessageSquare } from 'lucide-react';

const contacts = [
  {
    name: 'Hamzal alaqil',
    email: 'HAMZAH.M.ALAQIL@gmail.com',
    role: 'Lead Engineer',
    initials: 'HA',
  },
  {
    name: 'Abdullah alazwari',
    email: 'abdullahalazwari2@gmail.com',
    role: 'Hardware Specialist',
    initials: 'AA',
  },
  {
    name: 'Abdulelah Alessi',
    email: 'abdul.alessi@gmail.com',
    role: 'Software Architect',
    initials: 'AA',
  },
  {
    name: 'Albaraa barakat',
    email: 'Engbarakat22@gmail.com',
    role: 'System Integration',
    initials: 'AB',
  },
];

export default function ContactsPage() {
  return (
    <div className="min-h-screen pt-12 pb-24 px-6 relative overflow-hidden">
      {/* Background Decor */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] pointer-events-none opacity-20"
        style={{
          background: 'radial-gradient(circle at center, var(--accent) 0%, transparent 70%)',
          filter: 'blur(100px)',
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="section-label mb-4">Communication Hub</div>
          <h1 className="text-5xl font-extrabold mb-6 tracking-tight">
            Connect with the <span className="glow-green">Team</span>
          </h1>
          <div className="cyber-divider mb-8 mx-auto max-w-sm" />
          <p className="text-secondary max-w-2xl mx-auto text-lg leading-relaxed">
            The engineers behind the Nabih NILM System. Reach out for technical inquiries, 
            collaboration opportunities, or project documentation.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {contacts.map((contact) => (
            <div 
              key={contact.email}
              className="glass-card glass-card-hover rounded-xl p-8 flex flex-col items-center text-center group"
            >
              <div className="relative mb-6">
                <div className="w-20 h-20 rounded-full bg-black/40 border border-white/10 flex items-center justify-center text-2xl font-bold text-primary data-readout group-hover:border-accent transition-colors">
                  {contact.initials}
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-accent flex items-center justify-center border-2 border-black">
                  <Shield size={12} className="text-black" />
                </div>
              </div>

              <h3 className="text-lg font-bold mb-1 text-primary">{contact.name}</h3>
              <p className="text-xs section-label mb-4">{contact.role}</p>
              
              <div className="w-full h-[1px] bg-white/5 mb-6" />

              <a 
                href={`mailto:${contact.email}`}
                className="flex items-center gap-2 text-xs text-secondary hover:text-accent transition-colors group/link"
              >
                <Mail size={14} className="group-hover/link:animate-bounce" />
                <span className="data-readout truncate max-w-[180px]">{contact.email}</span>
              </a>
            </div>
          ))}
        </div>

        {/* Support Section */}
        <div className="mt-24 grid md:grid-cols-3 gap-8">
          {[
            {
              Icon: Zap,
              title: 'Technical Support',
              desc: 'Detailed ESP32-S3 firmware and NILM algorithm assistance.',
            },
            {
              Icon: Globe,
              title: 'Collaboration',
              desc: 'Inquiries regarding scaling Nabih for commercial energy monitoring.',
            },
            {
              Icon: MessageSquare,
              title: 'Documentation',
              desc: 'Request full schematics, BOM, and training dataset access.',
            },
          ].map((item) => (
            <div key={item.title} className="flex gap-4 p-6 rounded-lg bg-white/5 border border-white/5">
              <div className="shrink-0 w-12 h-12 rounded bg-accent/10 border border-accent/20 flex items-center justify-center">
                <item.Icon size={20} className="text-accent" />
              </div>
              <div>
                <h4 className="font-bold text-sm mb-1 text-primary uppercase tracking-wider">{item.title}</h4>
                <p className="text-xs text-secondary leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
