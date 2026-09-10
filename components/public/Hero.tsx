'use client';

import React, { useState } from 'react';
import { useTournament } from '@/lib/store';
import { Trophy, Flame, Zap, Shield, ArrowRight, Play, Users, Clock, Sparkles } from 'lucide-react';
import JoinTournamentModal from '../modals/JoinTournamentModal';

export default function Hero() {
  const { tournaments, setActiveTab, setSelectedTournamentId } = useTournament();
  const [showJoinModal, setShowJoinModal] = useState(false);

  // Spotlight tournament
  const spotlight = tournaments.find(t => t.id === 'tourn-1') || tournaments[0];

  return (
    <>
      <section className="relative overflow-hidden pt-8 pb-16 lg:pt-12 lg:pb-24">
        {/* Background glow and subtle ambient pattern */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-[#FF2A4D]/15 via-[#FF6B00]/5 to-transparent pointer-events-none blur-3xl -z-10" />
        <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-[#FF2A4D]/10 pointer-events-none blur-[100px] -z-10" />
        <div className="absolute bottom-10 left-10 w-80 h-80 rounded-full bg-[#FF6B00]/10 pointer-events-none blur-[120px] -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1A1822] border border-[#FF2A4D]/30 text-[#FF2A4D] text-xs font-gaming font-bold uppercase tracking-wider">
                <Flame className="w-4 h-4 animate-pulse text-[#FF2A4D]" />
                <span>Season 2026 Pro Championship Circuit</span>
              </div>

              {/* Main Headline */}
              <div className="space-y-2">
                <h1 className="font-gaming font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-white uppercase leading-[1.08]">
                  COMPETE. <br />
                  <span className="bg-gradient-to-r from-[#FF2A4D] via-[#FF6B00] to-[#FFB800] bg-clip-text text-transparent">
                    DOMINATE. WIN.
                  </span>
                </h1>
                <p className="text-base sm:text-lg text-[#8E9EB5] max-w-xl font-body leading-relaxed">
                  Join India’s premier Free Fire tournament platform. Enter custom room scrims, climb verified esports leaderboards, and withdraw cash prizes instantly to your UPI account.
                </p>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => setShowJoinModal(true)}
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#FF2A4D] to-[#FF6B00] hover:opacity-95 text-white font-gaming font-bold text-sm tracking-wider uppercase flex items-center gap-2 shadow-xl shadow-[#FF2A4D]/30 transition-all cursor-pointer group"
                >
                  <span>JOIN TOURNAMENT</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => setActiveTab('tournaments')}
                  className="px-7 py-4 rounded-xl bg-[#131926] hover:bg-[#1C2538] border border-[#232D42] text-white font-gaming font-bold text-sm tracking-wider uppercase flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Trophy className="w-4 h-4 text-[#FFB800]" />
                  <span>VIEW ALL TOURNAMENTS</span>
                </button>
              </div>

              {/* Trust & Stats row */}
              <div className="pt-6 border-t border-[#1C2333] grid grid-cols-3 gap-4 max-w-lg">
                <div>
                  <span className="font-gaming font-bold text-2xl text-white block">₹1.8M+</span>
                  <span className="text-[11px] text-[#8E9EB5] uppercase font-semibold">Prizes Distributed</span>
                </div>
                <div>
                  <span className="font-gaming font-bold text-2xl text-[#00F59B] block">42/48</span>
                  <span className="text-[11px] text-[#8E9EB5] uppercase font-semibold">Squads in Live Arena</span>
                </div>
                <div>
                  <span className="font-gaming font-bold text-2xl text-[#FFB800] block">&lt; 5 Mins</span>
                  <span className="text-[11px] text-[#8E9EB5] uppercase font-semibold">Instant UPI Payouts</span>
                </div>
              </div>
            </div>

            {/* Right Spotlight Card */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl bg-gradient-to-b from-[#181F2F] to-[#0E131E] border border-[#26334D] p-1 shadow-2xl overflow-hidden group">
                {/* Live Banner Header */}
                <div className="relative h-56 rounded-xl overflow-hidden">
                  <img
                    src={spotlight.banner}
                    alt={spotlight.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0E131E] via-[#0E131E]/40 to-transparent" />

                  {/* Status badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-red-600/90 backdrop-blur-md text-white font-gaming font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-red-600/30">
                      <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                      ● LIVE NOW
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-[#0E131E]/80 backdrop-blur-md text-[#FFB800] text-xs font-bold border border-[#FFB800]/30">
                      {spotlight.mode} • {spotlight.map}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3">
                    <span className="text-[11px] uppercase font-bold tracking-widest text-[#FF6B00]">Featured Major</span>
                    <h3 className="font-gaming font-bold text-xl text-white uppercase truncate drop-shadow-md">
                      {spotlight.name}
                    </h3>
                  </div>
                </div>

                {/* Card Details */}
                <div className="p-5 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[#131926] p-3 rounded-xl border border-[#1F273B]">
                      <span className="text-[10px] text-[#8E9EB5] uppercase font-bold block">Prize Pool</span>
                      <span className="font-gaming font-bold text-xl text-[#00F59B]">
                        ₹{spotlight.prizePool.toLocaleString()}
                      </span>
                    </div>

                    <div className="bg-[#131926] p-3 rounded-xl border border-[#1F273B]">
                      <span className="text-[10px] text-[#8E9EB5] uppercase font-bold block">Entry Fee</span>
                      <span className="font-gaming font-bold text-xl text-white">
                        {spotlight.entryFee === 0 ? 'FREE' : `₹${spotlight.entryFee}`}
                      </span>
                    </div>
                  </div>

                  {/* Slots Progress */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-[#8E9EB5]">Slots Registered</span>
                      <span className="font-bold text-white font-gaming">
                        {spotlight.joinedSlots} / {spotlight.maxSlots} Teams
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-[#161D2B] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#FF2A4D] to-[#FF6B00] transition-all duration-500"
                        style={{ width: `${(spotlight.joinedSlots / spotlight.maxSlots) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Card actions */}
                  <div className="flex gap-2.5 pt-1">
                    <button
                      onClick={() => setShowJoinModal(true)}
                      className="flex-1 py-3 rounded-xl bg-[#FF2A4D] hover:bg-[#E01E3F] text-white font-gaming font-bold text-xs tracking-wider uppercase transition-all shadow-lg shadow-[#FF2A4D]/25 cursor-pointer"
                    >
                      JOIN TOURNAMENT
                    </button>
                    <button
                      onClick={() => {
                        setSelectedTournamentId(spotlight.id);
                        setActiveTab('tournament-detail');
                      }}
                      className="px-4 py-3 rounded-xl bg-[#141A27] hover:bg-[#1E2638] text-white font-gaming font-bold text-xs tracking-wider uppercase border border-[#232C40] transition-all cursor-pointer"
                    >
                      VIEW DETAILS
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {showJoinModal && (
        <JoinTournamentModal tournament={spotlight} onClose={() => setShowJoinModal(false)} />
      )}
    </>
  );
}
