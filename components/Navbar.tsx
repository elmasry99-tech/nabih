'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Cpu, Activity, Image as ImageIcon, Menu, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const links = [
  { href: '/', label: 'Overview', icon: Cpu },
  { href: '/dashboard', label: 'Dashboard', icon: Activity },
  { href: '/gallery', label: 'Gallery', icon: ImageIcon },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  return (
    <nav
      className="sticky top-0 z-50 w-full"
      style={{
        background: 'var(--navbar-bg)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--navbar-border)',
        boxShadow: '0 1px 0 var(--navbar-border), 0 4px 20px var(--navbar-shadow)',
        transition: 'background 0.3s, border-color 0.3s',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <Image 
            src="/logo.png" 
            alt="Nabih Logo" 
            width={200} 
            height={64} 
            className="object-contain" 
            style={{ width: 'auto', height: 'auto', maxHeight: '64px' }}
            priority 
          />
          <div className="led-pulse w-2 h-2 rounded-full ml-1" style={{ backgroundColor: 'var(--led-color)' }} />
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-2 px-4 py-2 rounded text-sm font-medium transition-all duration-200"
                style={
                  active
                    ? {
                        background: 'color-mix(in srgb, var(--accent) 12%, transparent)',
                        border: '1px solid color-mix(in srgb, var(--accent) 35%, transparent)',
                        color: 'var(--accent-bright)',
                        boxShadow: '0 0 16px color-mix(in srgb, var(--accent-bright) 15%, transparent)',
                      }
                    : {
                        border: '1px solid transparent',
                        color: 'var(--nav-inactive)',
                      }
                }
              >
                <Icon size={14} />
                <span className="tracking-wider text-xs uppercase">{label}</span>
              </Link>
            );
          })}
        </div>

        {/* Status badge + theme toggle */}
        <div className="hidden md:flex items-center gap-3">
          <div className="badge-online">
            <span className="w-1.5 h-1.5 rounded-full led-pulse" style={{ backgroundColor: 'var(--led-color)' }} />
            SYSTEM ONLINE
          </div>
          <ThemeToggle />
        </div>

        {/* Mobile: theme toggle + hamburger */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <button
            className="p-2 rounded"
            style={{ color: 'var(--accent)' }}
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          className="md:hidden px-6 py-4 flex flex-col gap-2"
          style={{ borderTop: '1px solid var(--navbar-border)' }}
        >
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded text-sm"
                style={
                  active
                    ? { background: 'color-mix(in srgb, var(--accent) 10%, transparent)', color: 'var(--accent)', border: '1px solid color-mix(in srgb, var(--accent) 30%, transparent)' }
                    : { color: 'var(--nav-inactive)', border: '1px solid transparent' }
                }
              >
                <Icon size={16} />
                <span className="uppercase tracking-wider text-xs">{label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}
