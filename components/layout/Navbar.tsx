'use client';

import React, { useState } from 'react';
import ClientDate from '../common/ClientDate';
import { useTournament } from '@/lib/store';
import {
  Flame,
  Trophy,
  Shield,
  Wallet,
  Bell,
  User,
  ChevronDown,
  Plus,
  ExternalLink,
  Lock,
  Menu,
  X,
  Sparkles,
  Gamepad2,
  CheckCheck
} from 'lucide-react';
import DepositModal from '../modals/DepositModal';
import AuthModal from '../modals/AuthModal';

export default function Navbar() {
  const {
    currentUser,
    switchUserRole,
    activeView,
    setActiveView,
    activeTab,
    setActiveTab,
    wallet,
    notifications,
    markNotificationAsRead,
    markAllNotificationsRead,
  } = useTournament();

  const [showDeposit, setShowDeposit] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNavClick = (tab: string, view: 'public' | 'user' | 'admin' = 'public') => {
    setActiveView(view);
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#080A0F]/90 backdrop-blur-md border-b border-[#1A2234]">
        {/* Sub-bar / Mode Switcher bar for evaluators & pro users */}
        <div className="bg-[#0B0F18] border-b border-[#141A29] px-4 py-1.5 flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-2 text-[#8E9EB5]">
            <span className="flex items-center gap-1 font-semibold text-white">
              <span className="w-2 h-2 rounded-full bg-[#00F59B] animate-pulse" />
              FREE FIRE ESPORTS ARENA
            </span>
            <span className="hidden sm:inline text-slate-600">|</span>
            <span className="hidden sm:inline text-slate-400">Official Sanctioned Tournament Platform</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick View switcher tabs */}
            <div className="flex items-center bg-[#131926] p-0.5 rounded-lg border border-[#1F273D]">
              <button
                onClick={() => handleNavClick('home', 'public')}
                className={`px-2.5 py-0.5 rounded-md font-semibold transition-all cursor-pointer ${
                  activeView === 'public'
                    ? 'bg-[#FF2A4D] text-white shadow-sm'
                    : 'text-[#8E9EB5] hover:text-white'
                }`}
              >
                Public Site
              </button>
              <button
                onClick={() => handleNavClick('dashboard', 'user')}
                className={`px-2.5 py-0.5 rounded-md font-semibold transition-all cursor-pointer ${
                  activeView === 'user'
                    ? 'bg-[#FF2A4D] text-white shadow-sm'
                    : 'text-[#8E9EB5] hover:text-white'
                }`}
              >
                User Panel
              </button>
              <button
                onClick={() => handleNavClick('admin-dashboard', 'admin')}
                className={`px-2.5 py-0.5 rounded-md font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                  activeView === 'admin'
                    ? 'bg-amber-500 text-black shadow-sm'
                    : 'text-amber-400/80 hover:text-amber-300'
                }`}
              >
                <Lock className="w-3 h-3" /> Admin Panel
              </button>
            </div>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-8">
            <button
              onClick={() => handleNavClick('home', 'public')}
              className="flex items-center gap-2.5 text-left group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FF2A4D] via-[#FF6B00] to-[#FFB800] p-0.5 shadow-lg shadow-[#FF2A4D]/25 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-[#0B0E14] rounded-[10px] flex items-center justify-center">
                  <Flame className="w-6 h-6 text-[#FF2A4D] group-hover:animate-bounce transition-all" />
                </div>
              </div>
              <div>
                <span className="font-gaming font-bold text-lg tracking-wider text-white block leading-tight">
                  FREE FIRE <span className="text-[#FF2A4D]">ARENA</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#FF6B00] block">
                  PRO MAX ESPORTS
                </span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            {activeView === 'public' && (
              <nav className="hidden md:flex items-center gap-1">
                <button
                  onClick={() => handleNavClick('home', 'public')}
                  className={`px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    activeTab === 'home' ? 'text-[#FF2A4D] bg-[#FF2A4D]/10' : 'text-[#8E9EB5] hover:text-white'
                  }`}
                >
                  Home
                </button>
                <button
                  onClick={() => handleNavClick('tournaments', 'public')}
                  className={`px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    activeTab === 'tournaments' ? 'text-[#FF2A4D] bg-[#FF2A4D]/10' : 'text-[#8E9EB5] hover:text-white'
                  }`}
                >
                  Tournaments
                </button>
                <button
                  onClick={() => handleNavClick('leaderboard', 'public')}
                  className={`px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    activeTab === 'leaderboard' ? 'text-[#FF2A4D] bg-[#FF2A4D]/10' : 'text-[#8E9EB5] hover:text-white'
                  }`}
                >
                  Leaderboards
                </button>
                <button
                  onClick={() => handleNavClick('winners', 'public')}
                  className={`px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    activeTab === 'winners' ? 'text-[#FF2A4D] bg-[#FF2A4D]/10' : 'text-[#8E9EB5] hover:text-white'
                  }`}
                >
                  Hall of Fame
                </button>
                <button
                  onClick={() => handleNavClick('rules', 'public')}
                  className={`px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    activeTab === 'rules' ? 'text-[#FF2A4D] bg-[#FF2A4D]/10' : 'text-[#8E9EB5] hover:text-white'
                  }`}
                >
                  Rules
                </button>
                <button
                  onClick={() => handleNavClick('faq', 'public')}
                  className={`px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    activeTab === 'faq' ? 'text-[#FF2A4D] bg-[#FF2A4D]/10' : 'text-[#8E9EB5] hover:text-white'
                  }`}
                >
                  FAQ & Support
                </button>
              </nav>
            )}

            {activeView === 'user' && (
              <div className="hidden md:flex items-center gap-2 text-xs font-gaming text-[#8E9EB5]">
                <span className="text-[#00F59B]">● PLAYER PORTAL</span>
                <span className="text-slate-600">/</span>
                <span className="text-white capitalize">{activeTab.replace('-', ' ')}</span>
              </div>
            )}

            {activeView === 'admin' && (
              <div className="hidden md:flex items-center gap-2 text-xs font-gaming text-amber-400">
                <span className="px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold">
                  SUPER ADMIN CONSOLE
                </span>
              </div>
            )}
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            {/* Wallet pill */}
            <div className="flex items-center bg-[#131926] border border-[#20293D] rounded-xl p-1 gap-2 shadow-inner">
              <button
                onClick={() => handleNavClick('wallet', 'user')}
                className="flex items-center gap-2 px-2.5 py-1 text-left cursor-pointer group"
              >
                <div className="w-6 h-6 rounded-md bg-[#00F59B]/15 text-[#00F59B] flex items-center justify-center">
                  <Wallet className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="block text-[9px] uppercase font-bold text-[#8E9EB5] leading-none">Wallet</span>
                  <span className="text-xs font-bold text-white group-hover:text-[#00F59B] transition-colors">
                    ₹{wallet.availableBalance.toLocaleString()}
                  </span>
                </div>
              </button>

              <button
                onClick={() => setShowDeposit(true)}
                title="Deposit Funds"
                className="w-7 h-7 rounded-lg bg-[#FF2A4D] hover:bg-[#E01E3F] text-white flex items-center justify-center shadow-md shadow-[#FF2A4D]/20 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="w-9 h-9 rounded-xl bg-[#131926] border border-[#20293D] text-[#8E9EB5] hover:text-white flex items-center justify-center transition-colors relative cursor-pointer"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#FF2A4D] text-white text-[9px] font-bold flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-[#0F131C] border border-[#232B3E] rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between pb-2 border-b border-[#1C2333] mb-2">
                    <span className="text-xs font-bold uppercase text-white font-gaming">Notifications</span>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllNotificationsRead}
                        className="text-[10px] text-[#FF2A4D] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <CheckCheck className="w-3 h-3" /> Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-64 overflow-y-auto space-y-2">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-slate-500 py-3 text-center">No notifications yet.</p>
                    ) : (
                      notifications.slice(0, 5).map(n => (
                        <div
                          key={n.id}
                          onClick={() => {
                            markNotificationAsRead(n.id);
                            if (n.type === 'MATCH') handleNavClick('match-room', 'user');
                            if (n.type === 'WALLET') handleNavClick('wallet', 'user');
                            setShowNotifications(false);
                          }}
                          className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                            n.read
                              ? 'bg-[#141926] border-[#1C2333] text-[#8E9EB5]'
                              : 'bg-[#182133] border-[#FF2A4D]/30 text-white'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-[11px] text-[#FF2A4D]">{n.title}</span>
                            <ClientDate
                              date={n.timestamp}
                              format="time"
                              className="text-[9px] text-slate-500"
                            />
                          </div>
                          <p className="text-[11px] leading-relaxed text-slate-300">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar / Auth */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1 pl-2 pr-3 rounded-xl bg-[#131926] border border-[#20293D] hover:border-slate-600 transition-all cursor-pointer"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.username}
                  className="w-7 h-7 rounded-lg object-cover border border-[#2E3B57]"
                />
                <div className="hidden sm:block text-left">
                  <span className="block text-xs font-bold text-white leading-none">{currentUser.ign}</span>
                  <span className="block text-[9px] text-[#8E9EB5] font-mono leading-none mt-0.5">
                    {currentUser.playerUid}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* User Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-[#0F131C] border border-[#232B3E] rounded-2xl shadow-2xl p-2 z-50 text-xs">
                  <div className="p-2 border-b border-[#1C2333] mb-1">
                    <span className="block font-bold text-white text-sm">{currentUser.fullName}</span>
                    <span className="block text-[#8E9EB5] text-[11px]">{currentUser.email}</span>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#FF2A4D]/20 text-[#FF2A4D]">
                      ROLE: {currentUser.role}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      handleNavClick('dashboard', 'user');
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#161D2B] text-slate-300 hover:text-white transition-colors cursor-pointer"
                  >
                    User Dashboard
                  </button>
                  <button
                    onClick={() => {
                      handleNavClick('profile', 'user');
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#161D2B] text-slate-300 hover:text-white transition-colors cursor-pointer"
                  >
                    My Player Profile & Stats
                  </button>
                  <button
                    onClick={() => {
                      handleNavClick('team', 'user');
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#161D2B] text-slate-300 hover:text-white transition-colors cursor-pointer"
                  >
                    My Team Roster
                  </button>
                  <button
                    onClick={() => {
                      handleNavClick('match-room', 'user');
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#161D2B] text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center justify-between"
                  >
                    <span>Match Room</span>
                    <span className="w-2 h-2 rounded-full bg-[#00F59B] animate-ping" />
                  </button>
                  <button
                    onClick={() => {
                      handleNavClick('wallet', 'user');
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#161D2B] text-slate-300 hover:text-white transition-colors cursor-pointer"
                  >
                    Wallet & Transactions
                  </button>

                  <div className="border-t border-[#1C2333] my-1 pt-1">
                    <button
                      onClick={() => {
                        setShowAuth(true);
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#161D2B] text-[#FF2A4D] font-semibold transition-colors cursor-pointer"
                    >
                      Switch Account / Role...
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-[#131926] border border-[#20293D] text-[#8E9EB5] hover:text-white cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0C1017] border-b border-[#1C2333] px-4 py-3 space-y-2">
            <div className="grid grid-cols-2 gap-2 pb-2 border-b border-[#1C2333]">
              <button
                onClick={() => handleNavClick('home', 'public')}
                className="py-2 px-3 rounded-lg bg-[#141926] text-xs font-bold text-left text-white"
              >
                Public Home
              </button>
              <button
                onClick={() => handleNavClick('tournaments', 'public')}
                className="py-2 px-3 rounded-lg bg-[#141926] text-xs font-bold text-left text-white"
              >
                Tournaments
              </button>
              <button
                onClick={() => handleNavClick('dashboard', 'user')}
                className="py-2 px-3 rounded-lg bg-[#141926] text-xs font-bold text-left text-[#FF2A4D]"
              >
                User Panel
              </button>
              <button
                onClick={() => handleNavClick('match-room', 'user')}
                className="py-2 px-3 rounded-lg bg-[#141926] text-xs font-bold text-left text-[#00F59B]"
              >
                Match Room
              </button>
              <button
                onClick={() => handleNavClick('leaderboard', 'public')}
                className="py-2 px-3 rounded-lg bg-[#141926] text-xs font-bold text-left text-white"
              >
                Leaderboard
              </button>
              <button
                onClick={() => handleNavClick('admin-dashboard', 'admin')}
                className="py-2 px-3 rounded-lg bg-amber-500/20 text-xs font-bold text-left text-amber-300"
              >
                Admin Panel
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Modals */}
      {showDeposit && <DepositModal onClose={() => setShowDeposit(false)} />}
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  );
}
