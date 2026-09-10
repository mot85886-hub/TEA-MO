'use client';

import React from 'react';
import { useTournament } from '@/lib/store';
import { Flame, ShieldCheck, Trophy, Sparkles, Mail, Headphones, Lock } from 'lucide-react';

export default function Footer() {
  const { setActiveView, setActiveTab } = useTournament();

  const handleNav = (tab: string, view: 'public' | 'user' | 'admin' = 'public') => {
    setActiveView(view);
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#06080C] border-t border-[#161D2B] text-slate-400 text-xs mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#FF2A4D] to-[#FF6B00] flex items-center justify-center text-white">
                <Flame className="w-5 h-5" />
              </div>
              <span className="font-gaming font-bold text-base text-white tracking-wider">
                FREE FIRE <span className="text-[#FF2A4D]">ARENA</span>
              </span>
            </div>
            <p className="text-[12px] leading-relaxed text-[#8E9EB5]">
              The next-generation competitive esports tournament engine. Real-time bracket synchronization, atomic wallet ledger, and automated Booyah verification.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-[#00F59B] bg-[#00F59B]/10 border border-[#00F59B]/20 px-3 py-1.5 rounded-lg w-fit">
              <ShieldCheck className="w-4 h-4" />
              <span>Garena Anti-Cheat Verified Platform</span>
            </div>
          </div>

          {/* Public Tournament Links */}
          <div className="space-y-3">
            <h4 className="font-gaming font-bold text-white text-xs uppercase tracking-wider">Tournaments</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => handleNav('tournaments', 'public')} className="hover:text-white transition-colors cursor-pointer">
                  Upcoming Squad Tournaments
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('tournaments', 'public')} className="hover:text-white transition-colors cursor-pointer">
                  Solo Desert Clash (Free Entry)
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('tournaments', 'public')} className="hover:text-white transition-colors cursor-pointer">
                  Duo Purgatory Cup
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('leaderboard', 'public')} className="hover:text-white transition-colors cursor-pointer">
                  National Standings & MVP List
                </button>
              </li>
            </ul>
          </div>

          {/* User & Player links */}
          <div className="space-y-3">
            <h4 className="font-gaming font-bold text-white text-xs uppercase tracking-wider">Player Suite</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => handleNav('dashboard', 'user')} className="hover:text-white transition-colors cursor-pointer">
                  Player Dashboard & Stats
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('team', 'user')} className="hover:text-white transition-colors cursor-pointer">
                  Squad & Roster Management
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('wallet', 'user')} className="hover:text-white transition-colors cursor-pointer">
                  Double-Entry Wallet Ledger
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('match-room', 'user')} className="hover:text-white transition-colors cursor-pointer">
                  Live Custom Match Rooms
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('faq', 'public')} className="hover:text-white transition-colors cursor-pointer">
                  Helpdesk & Support Tickets
                </button>
              </li>
            </ul>
          </div>

          {/* Rules & Compliance */}
          <div className="space-y-3">
            <h4 className="font-gaming font-bold text-white text-xs uppercase tracking-wider">Legal & Compliance</h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <button onClick={() => handleNav('rules', 'public')} className="hover:text-white transition-colors cursor-pointer">
                  Official Esports Rulebook
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('rules', 'public')} className="hover:text-white transition-colors cursor-pointer">
                  Fair Play, Anti-Teaming & Emulator Ban
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('rules', 'public')} className="hover:text-white transition-colors cursor-pointer">
                  Proof of Skill & Scoring Formula
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('admin-dashboard', 'admin')} className="text-amber-400/80 hover:text-amber-300 transition-colors flex items-center gap-1 cursor-pointer">
                  <Lock className="w-3 h-3" /> Admin Portal & Auditing
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal disclaimer */}
        <div className="pt-6 border-t border-[#161D2B] flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>
            © 2026 Free Fire Tournament Platform. All tournament operations are skill-based competitive gaming events. Free Fire is a registered trademark of Garena International.
          </p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-[#8E9EB5]">
              <Lock className="w-3 h-3 text-[#00F59B]" /> 256-bit TLS Secured
            </span>
            <span className="text-slate-600">•</span>
            <span>Version 4.8.0 PRO MAX</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
