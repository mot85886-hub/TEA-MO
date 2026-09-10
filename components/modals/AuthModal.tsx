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
  const { setCurrentUser, setActiveView, setActiveTab, signInWithGoogle, isFirebaseLoading } = useTournament();
  const [isRegister, setIsRegister] = useState<boolean>(defaultMode === 'register');
  const [googleLoading, setGoogleLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    mobile: '',
    password: '',
    playerUid: '',
    ign: '',
  });

  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);
      setAuthError(null);
      await signInWithGoogle();
      onClose();
    } catch (err: any) {
      console.error('Google Sign In Failed:', err);
      setAuthError(err?.message || 'Google sign-in was interrupted or failed.');
    } finally {
      setGoogleLoading(false);
    }
  };

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

        {/* Google Firebase Auth */}
        <div className="p-4 bg-[#141926] border-b border-[#1C2333]">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs flex items-center justify-center gap-2.5 transition-all shadow-md cursor-pointer disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            {googleLoading ? 'Connecting to Google Firebase...' : 'Continue with Google (Firebase)'}
          </button>
          {authError && (
            <p className="mt-2 text-[11px] text-[#FF2A4D] bg-[#FF2A4D]/10 p-2 rounded-lg border border-[#FF2A4D]/20">
              {authError}
            </p>
          )}
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
