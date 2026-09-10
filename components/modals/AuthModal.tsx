'use client';

import React, { useState } from 'react';
import { useTournament } from '@/lib/store';
import { INITIAL_USERS } from '@/lib/mockData';
import { ShieldCheck, UserCheck, KeyRound, X, ArrowRight, User } from 'lucide-react';

interface AuthModalProps {
  onClose: () => void;
  defaultMode?: 'login' | 'register';
}

export default function AuthModal({ onClose, defaultMode = 'login' }: AuthModalProps) {
  const { setCurrentUser, setActiveView, setActiveTab } = useTournament();
  const [isRegister, setIsRegister] = useState<boolean>(defaultMode === 'register');
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    mobile: '',
    password: '',
    playerUid: '',
    ign: '',
  });

  const handleDemoLogin = (userIndex: number) => {
    const selected = INITIAL_USERS[userIndex];
    setCurrentUser(selected);
    if (selected.role === 'SUPER_ADMIN') {
      setActiveView('admin');
      setActiveTab('admin-dashboard');
    } else {
      setActiveView('user');
      setActiveTab('dashboard');
    }
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegister) {
      const newUser = {
        id: `user-${Date.now()}`,
        fullName: formData.fullName || 'Esports Player',
        username: formData.username || 'ProPlayer_FF',
        email: formData.email || 'player@esports.io',
        mobile: formData.mobile || '+91 98765 00000',
        role: 'USER' as const,
        playerUid: formData.playerUid || 'FF-9920192',
        ign: formData.ign || 'ProPlayer_FF',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        createdAt: new Date().toISOString(),
        status: 'ACTIVE' as const,
        stats: {
          totalMatches: 0,
          wins: 0,
          winRate: 0,
          totalEarnings: 0,
          kills: 0,
          kdRatio: 0,
        },
        achievements: [],
      };
      setCurrentUser(newUser);
      setActiveView('user');
      setActiveTab('dashboard');
    } else {
      handleDemoLogin(0);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#0F131C] border border-[#232B3E] rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#1C2333] bg-[#141925]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FF2A4D]/10 border border-[#FF2A4D]/30 flex items-center justify-center text-[#FF2A4D]">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-gaming font-bold text-white text-lg tracking-wide uppercase">
                {isRegister ? 'Create Player Account' : 'Player Sign In'}
              </h3>
              <p className="text-xs text-[#8E9EB5]">Free Fire Esports Network</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[#8E9EB5] hover:text-white hover:bg-[#1E2638] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Demo Switcher */}
        <div className="p-4 bg-[#121722] border-b border-[#1C2333]">
          <span className="block text-[11px] font-bold text-[#8E9EB5] uppercase tracking-wider mb-2">
            ⚡ Quick 1-Click Role Switcher (For Evaluation):
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleDemoLogin(0)}
              className="px-2.5 py-2 rounded-lg bg-[#192131] hover:bg-[#232F47] border border-[#232B3E] text-left transition-all cursor-pointer group"
            >
              <span className="block text-[11px] font-bold text-white group-hover:text-[#FF2A4D]">Phoenix_FF</span>
              <span className="block text-[9px] text-[#8E9EB5]">Solo / Player</span>
            </button>
            <button
              onClick={() => handleDemoLogin(1)}
              className="px-2.5 py-2 rounded-lg bg-[#192131] hover:bg-[#232F47] border border-[#232B3E] text-left transition-all cursor-pointer group"
            >
              <span className="block text-[11px] font-bold text-white group-hover:text-[#FF6B00]">FrostByte</span>
              <span className="block text-[9px] text-[#8E9EB5]">Team Captain</span>
            </button>
            <button
              onClick={() => handleDemoLogin(2)}
              className="px-2.5 py-2 rounded-lg bg-[#FF2A4D]/10 hover:bg-[#FF2A4D]/20 border border-[#FF2A4D]/30 text-left transition-all cursor-pointer group"
            >
              <span className="block text-[11px] font-bold text-[#FF2A4D]">Apex_Admin</span>
              <span className="block text-[9px] text-[#FF2A4D]/80">Super Admin</span>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
          {isRegister && (
            <>
              <div>
                <label className="block text-xs font-semibold text-[#8E9EB5] uppercase mb-1">Full Legal Name</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. Rohan Sharma"
                  className="w-full bg-[#141926] border border-[#232B3E] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF2A4D]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#8E9EB5] uppercase mb-1">Free Fire UID</label>
                  <input
                    type="text"
                    required
                    value={formData.playerUid}
                    onChange={(e) => setFormData({ ...formData, playerUid: e.target.value })}
                    placeholder="FF-89241031"
                    className="w-full bg-[#141926] border border-[#232B3E] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF2A4D]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#8E9EB5] uppercase mb-1">In-Game Name (IGN)</label>
                  <input
                    type="text"
                    required
                    value={formData.ign}
                    onChange={(e) => setFormData({ ...formData, ign: e.target.value })}
                    placeholder="Phoenix_99"
                    className="w-full bg-[#141926] border border-[#232B3E] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF2A4D]"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#8E9EB5] uppercase mb-1">Username or Email</label>
            <input
              type="text"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Phoenix_FF or player@esports.io"
              className="w-full bg-[#141926] border border-[#232B3E] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF2A4D]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#8E9EB5] uppercase mb-1">Password</label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••••••"
              className="w-full bg-[#141926] border border-[#232B3E] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF2A4D]"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#FF2A4D] hover:bg-[#E01E3F] text-white font-gaming font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg shadow-[#FF2A4D]/25 transition-all cursor-pointer"
            >
              {isRegister ? 'Register Player' : 'Sign In'} <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              className="text-xs text-[#8E9EB5] hover:text-white transition-colors cursor-pointer"
            >
              {isRegister ? 'Already have an account? Sign In' : "Don't have an account? Register Now"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
