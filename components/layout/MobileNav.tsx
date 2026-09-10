'use client';

import React, { useState } from 'react';
import { useTournament } from '@/lib/store';
import { Home, Trophy, Wallet, Bell, User, Gamepad2 } from 'lucide-react';
import DepositModal from '../modals/DepositModal';

export default function MobileNav() {
  const { activeView, setActiveView, activeTab, setActiveTab, notifications } = useTournament();
  const [showDeposit, setShowDeposit] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const navigate = (tab: string, view: 'public' | 'user' | 'admin' = 'public') => {
    setActiveView(view);
    setActiveTab(tab);
  };

  return (
    <>
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0A0D14]/95 backdrop-blur-lg border-t border-[#1C2333] px-2 py-2 flex items-center justify-around shadow-2xl">
        <button
          onClick={() => navigate('home', 'public')}
          className={`flex flex-col items-center gap-1 p-1.5 transition-colors cursor-pointer ${
            activeView === 'public' && activeTab === 'home' ? 'text-[#FF2A4D]' : 'text-[#8E9EB5]'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Home</span>
        </button>

        <button
          onClick={() => navigate('tournaments', 'public')}
          className={`flex flex-col items-center gap-1 p-1.5 transition-colors cursor-pointer ${
            activeView === 'public' && activeTab === 'tournaments' ? 'text-[#FF2A4D]' : 'text-[#8E9EB5]'
          }`}
        >
          <Trophy className="w-5 h-5" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Tourneys</span>
        </button>

        <button
          onClick={() => navigate('match-room', 'user')}
          className={`relative flex flex-col items-center gap-1 p-1.5 -top-3 bg-gradient-to-tr from-[#FF2A4D] to-[#FF6B00] text-white rounded-2xl w-12 h-12 shadow-lg shadow-[#FF2A4D]/30 items-center justify-center cursor-pointer`}
        >
          <Gamepad2 className="w-6 h-6" />
        </button>

        <button
          onClick={() => navigate('wallet', 'user')}
          className={`flex flex-col items-center gap-1 p-1.5 transition-colors cursor-pointer ${
            activeView === 'user' && activeTab === 'wallet' ? 'text-[#00F59B]' : 'text-[#8E9EB5]'
          }`}
        >
          <Wallet className="w-5 h-5" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Wallet</span>
        </button>

        <button
          onClick={() => navigate('profile', 'user')}
          className={`relative flex flex-col items-center gap-1 p-1.5 transition-colors cursor-pointer ${
            activeView === 'user' && activeTab === 'profile' ? 'text-[#FF2A4D]' : 'text-[#8E9EB5]'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Profile</span>
          {unreadCount > 0 && (
            <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-[#FF2A4D]" />
          )}
        </button>
      </div>

      {showDeposit && <DepositModal onClose={() => setShowDeposit(false)} />}
    </>
  );
}
