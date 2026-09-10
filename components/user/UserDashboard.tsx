'use client';

import React, { useState } from 'react';
import { useTournament } from '@/lib/store';
import {
  Wallet,
  Trophy,
  Swords,
  TrendingUp,
  Clock,
  ArrowRight,
  Plus,
  ArrowDownLeft,
  ChevronRight,
  Gamepad2,
  CheckCircle2
} from 'lucide-react';
import DepositModal from '../modals/DepositModal';

export default function UserDashboard() {
  const {
    currentUser,
    wallet,
    tournaments,
    registrations,
    matches,
    results,
    setActiveTab,
    setSelectedTournamentId,
  } = useTournament();

  const [showDeposit, setShowDeposit] = useState(false);

  // User's registered tournaments
  const myRegistrations = registrations.filter(r => r.userId === currentUser.id);
  const myTournamentIds = myRegistrations.map(r => r.tournamentId);
  const myTournaments = tournaments.filter(t => myTournamentIds.includes(t.id));

  // Find active or upcoming match
  const liveMatch = matches.find(m => myTournamentIds.includes(m.tournamentId) && (m.status === 'LIVE' || m.credentialsReleased));
  const liveMatchTournament = liveMatch ? tournaments.find(t => t.id === liveMatch.tournamentId) : null;

  // Recent user results
  const myResults = results.filter(r => r.submittedBy === currentUser.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#141A27] via-[#101420] to-[#0A0D14] border border-[#212C42] p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
        <div className="space-y-2 max-w-xl z-10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-[#FF2A4D]/20 border border-[#FF2A4D]/40 text-[#FF2A4D] text-[10px] font-gaming font-bold uppercase tracking-wider">
              PLAYER COMMAND CENTER
            </span>
            <span className="text-xs text-slate-400 font-mono">UID: {currentUser.playerUid}</span>
          </div>
          <h1 className="font-gaming font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
            Welcome back, <span className="text-[#FF2A4D]">{currentUser.ign}</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#8E9EB5]">
            Check upcoming scrim schedules, monitor assigned lobby slots, and manage tournament entry funds.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-3 z-10">
          <button
            onClick={() => setActiveTab('tournaments')}
            className="px-5 py-3 rounded-xl bg-[#FF2A4D] hover:bg-[#E01E3F] text-white font-gaming font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#FF2A4D]/25 transition-all cursor-pointer"
          >
            <Trophy className="w-4 h-4" />
            Browse Tourneys
          </button>
          <button
            onClick={() => setShowDeposit(true)}
            className="px-5 py-3 rounded-xl bg-[#00F59B] hover:bg-[#00D484] text-black font-gaming font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#00F59B]/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Deposit
          </button>
        </div>

        {/* Ambient subtle glow */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-[#FF2A4D]/10 pointer-events-none blur-3xl" />
      </div>

      {/* Live Match Alert (If exists) */}
      {liveMatch && (
        <div className="rounded-2xl bg-gradient-to-r from-red-950/40 via-[#191522] to-[#121824] border-2 border-[#FF2A4D] p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl shadow-red-950/30 animate-pulse">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#FF2A4D] text-white flex items-center justify-center font-bold shadow-lg shadow-[#FF2A4D]/30">
              <Gamepad2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-600 text-white uppercase">
                  ● ROOM CREDENTIALS UNLOCKED
                </span>
                <span className="text-xs text-white font-semibold">
                  {liveMatchTournament?.name || 'Live Tournament'}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Room ID: <strong className="font-mono text-white">{liveMatch.roomId}</strong> • Password:{' '}
                <strong className="font-mono text-[#00F59B]">{liveMatch.password}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('match-room')}
            className="px-6 py-2.5 rounded-xl bg-[#00F59B] text-black font-gaming font-bold text-xs uppercase tracking-wider shadow-md hover:bg-[#00D484] transition-all cursor-pointer whitespace-nowrap"
          >
            Go To Custom Room &rarr;
          </button>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Wallet Balance */}
        <div className="p-5 rounded-2xl bg-[#0E131E] border border-[#1F273B] space-y-2">
          <div className="flex items-center justify-between text-[#8E9EB5]">
            <span className="text-[10px] uppercase font-bold">Available Wallet</span>
            <Wallet className="w-4 h-4 text-[#00F59B]" />
          </div>
          <div className="font-gaming font-black text-2xl text-white">
            ₹{wallet.availableBalance.toLocaleString()}
          </div>
          <button
            onClick={() => setActiveTab('wallet')}
            className="text-[11px] text-[#00F59B] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
          >
            Manage Wallet <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Total Matches */}
        <div className="p-5 rounded-2xl bg-[#0E131E] border border-[#1F273B] space-y-2">
          <div className="flex items-center justify-between text-[#8E9EB5]">
            <span className="text-[10px] uppercase font-bold">Matches Played</span>
            <Swords className="w-4 h-4 text-[#FF6B00]" />
          </div>
          <div className="font-gaming font-black text-2xl text-white">{currentUser.stats.totalMatches}</div>
          <span className="text-[11px] text-[#8E9EB5]">Official Lobbies</span>
        </div>

        {/* Wins / Booyahs */}
        <div className="p-5 rounded-2xl bg-[#0E131E] border border-[#1F273B] space-y-2">
          <div className="flex items-center justify-between text-[#8E9EB5]">
            <span className="text-[10px] uppercase font-bold">Tournament Wins</span>
            <Trophy className="w-4 h-4 text-[#FFB800]" />
          </div>
          <div className="font-gaming font-black text-2xl text-[#FFB800]">{currentUser.stats.wins}</div>
          <span className="text-[11px] text-[#8E9EB5]">1st Place Booyahs</span>
        </div>

        {/* Win Rate */}
        <div className="p-5 rounded-2xl bg-[#0E131E] border border-[#1F273B] space-y-2">
          <div className="flex items-center justify-between text-[#8E9EB5]">
            <span className="text-[10px] uppercase font-bold">Win Rate</span>
            <TrendingUp className="w-4 h-4 text-[#00B0FF]" />
          </div>
          <div className="font-gaming font-black text-2xl text-white">{currentUser.stats.winRate}%</div>
          <span className="text-[11px] text-[#8E9EB5]">K/D: {currentUser.stats.kdRatio}</span>
        </div>

        {/* Total Earnings */}
        <div className="p-5 rounded-2xl bg-[#0E131E] border border-[#1F273B] space-y-2 col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-[#8E9EB5]">
            <span className="text-[10px] uppercase font-bold">Total Earnings</span>
            <Trophy className="w-4 h-4 text-[#00F59B]" />
          </div>
          <div className="font-gaming font-black text-2xl text-[#00F59B]">
            ₹{currentUser.stats.totalEarnings.toLocaleString()}
          </div>
          <span className="text-[11px] text-[#8E9EB5]">Direct Cash Payouts</span>
        </div>
      </div>

      {/* Two Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: My Registered Tournaments */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-gaming font-bold text-base text-white uppercase tracking-wide flex items-center gap-2">
              <Trophy className="w-4 h-4 text-[#FF2A4D]" /> My Registered Tournaments ({myTournaments.length})
            </h2>
            <button
              onClick={() => setActiveTab('tournaments')}
              className="text-xs text-[#FF2A4D] hover:underline cursor-pointer"
            >
              Browse More
            </button>
          </div>

          {myTournaments.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-[#0E131E] border border-[#1C2538] space-y-3">
              <Trophy className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="font-gaming font-bold text-white text-sm">No Active Registrations</p>
              <p className="text-xs text-[#8E9EB5]">You have not joined any upcoming scrims yet.</p>
              <button
                onClick={() => setActiveTab('tournaments')}
                className="px-4 py-2 rounded-xl bg-[#FF2A4D] text-white text-xs font-gaming font-bold uppercase cursor-pointer"
              >
                Join a Tournament
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {myTournaments.map(tournament => {
                const reg = myRegistrations.find(r => r.tournamentId === tournament.id);
                return (
                  <div
                    key={tournament.id}
                    className="p-4 rounded-2xl bg-[#0E131E] border border-[#1F273B] hover:border-[#2D3952] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3.5">
                      <img
                        src={tournament.banner}
                        alt={tournament.name}
                        className="w-16 h-14 rounded-xl object-cover border border-[#232D42]"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-gaming font-bold text-sm text-white">{tournament.name}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FF2A4D]/20 text-[#FF2A4D]">
                            Slot #{reg?.slotNumber}
                          </span>
                        </div>
                        <p className="text-xs text-[#8E9EB5] mt-0.5">
                          {tournament.mode} • {tournament.map} • Prize: ₹{tournament.prizePool.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedTournamentId(tournament.id);
                          setActiveTab('match-room');
                        }}
                        className="px-4 py-2 rounded-xl bg-[#FF2A4D] hover:bg-[#E01E3F] text-white font-gaming font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                      >
                        Match Room
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Recent Results & Performance */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="font-gaming font-bold text-base text-white uppercase tracking-wide flex items-center gap-2">
            <Swords className="w-4 h-4 text-[#FFB800]" /> Recent Match Submissions
          </h2>

          <div className="space-y-3">
            {myResults.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-[#0E131E] border border-[#1C2538] text-slate-500 text-xs">
                No match results recorded yet.
              </div>
            ) : (
              myResults.map(res => (
                <div
                  key={res.id}
                  className="p-4 rounded-2xl bg-[#0E131E] border border-[#1F273B] space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">Placement #{res.placement}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        res.status === 'VERIFIED'
                          ? 'bg-[#00F59B]/20 text-[#00F59B]'
                          : res.status === 'REJECTED'
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {res.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="flex justify-between text-[#8E9EB5]">
                    <span>Frags / Kills: <strong className="text-white">{res.kills}</strong></span>
                    <span>Total Score: <strong className="text-[#00F59B]">{res.totalScore} pts</strong></span>
                  </div>

                  {res.adminNote && (
                    <p className="text-[11px] text-slate-400 italic bg-[#141A27] p-2 rounded-lg">
                      Referee Note: {res.adminNote}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {showDeposit && <DepositModal onClose={() => setShowDeposit(false)} />}
    </div>
  );
}
