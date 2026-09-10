'use client';

import React from 'react';
import { useTournament } from '@/lib/store';
import { User, Trophy, Swords, Target, Award, ShieldCheck, CheckCircle2, Phone, Mail } from 'lucide-react';

export default function UserProfileView() {
  const { currentUser } = useTournament();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Profile Card */}
      <div className="rounded-3xl bg-gradient-to-r from-[#141A27] to-[#0A0E17] border border-[#232D42] p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
        <div className="flex items-center gap-5">
          <img
            src={currentUser.avatar}
            alt={currentUser.ign}
            className="w-20 h-20 rounded-2xl object-cover border-2 border-[#FF2A4D] shadow-xl"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-gaming font-black text-2xl text-white uppercase">{currentUser.ign}</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FF2A4D]/20 text-[#FF2A4D]">
                {currentUser.role}
              </span>
            </div>
            <p className="text-xs text-[#8E9EB5]">UID: <strong className="text-white font-mono">{currentUser.playerUid}</strong></p>
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-[#00F59B]" /> {currentUser.email}</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-[#00B0FF]" /> {currentUser.mobile}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-[#121824] px-4 py-2 rounded-xl border border-[#1E2638] text-xs text-[#00F59B]">
          <ShieldCheck className="w-4 h-4" />
          <span>Garena Identity Verified</span>
        </div>
      </div>

      {/* Career Stats Grid */}
      <div>
        <h3 className="font-gaming font-bold text-base text-white uppercase mb-4 flex items-center gap-2">
          <Trophy className="w-4 h-4 text-[#FFB800]" /> Competitive Battle Royale Career
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="p-4 rounded-2xl bg-[#0E131E] border border-[#1F273B] text-center">
            <span className="text-[10px] text-[#8E9EB5] uppercase font-bold block">Matches</span>
            <span className="font-gaming font-black text-2xl text-white mt-1 block">{currentUser.stats.totalMatches}</span>
          </div>
          <div className="p-4 rounded-2xl bg-[#0E131E] border border-[#1F273B] text-center">
            <span className="text-[10px] text-[#8E9EB5] uppercase font-bold block">Booyahs</span>
            <span className="font-gaming font-black text-2xl text-[#FFB800] mt-1 block">{currentUser.stats.wins}</span>
          </div>
          <div className="p-4 rounded-2xl bg-[#0E131E] border border-[#1F273B] text-center">
            <span className="text-[10px] text-[#8E9EB5] uppercase font-bold block">Win Rate</span>
            <span className="font-gaming font-black text-2xl text-[#00F59B] mt-1 block">{currentUser.stats.winRate}%</span>
          </div>
          <div className="p-4 rounded-2xl bg-[#0E131E] border border-[#1F273B] text-center">
            <span className="text-[10px] text-[#8E9EB5] uppercase font-bold block">Total Frags</span>
            <span className="font-gaming font-black text-2xl text-white mt-1 block">{currentUser.stats.kills}</span>
          </div>
          <div className="p-4 rounded-2xl bg-[#0E131E] border border-[#1F273B] text-center">
            <span className="text-[10px] text-[#8E9EB5] uppercase font-bold block">K/D Ratio</span>
            <span className="font-gaming font-black text-2xl text-[#FF2A4D] mt-1 block">{currentUser.stats.kdRatio}</span>
          </div>
          <div className="p-4 rounded-2xl bg-[#0E131E] border border-[#1F273B] text-center">
            <span className="text-[10px] text-[#8E9EB5] uppercase font-bold block">Total Won</span>
            <span className="font-gaming font-black text-2xl text-[#00F59B] mt-1 block">
              ₹{currentUser.stats.totalEarnings.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Badges & Achievements */}
      <div className="p-6 rounded-2xl bg-[#0E131E] border border-[#1C2538] space-y-4">
        <h3 className="font-gaming font-bold text-base text-white uppercase flex items-center gap-2">
          <Award className="w-4 h-4 text-[#FF2A4D]" /> Badges & Medals
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          {[
            { title: 'Championship Finalist', desc: 'Participated in Tier-1 Majors', icon: '🏆', color: 'border-[#FFB800]/40' },
            { title: 'Booyah Master', desc: 'Achieved 5+ 1st Place Victory Royales', icon: '👑', color: 'border-[#00F59B]/40' },
            { title: 'Top Fragger', desc: 'Eliminated 10+ players in a single match', icon: '🎯', color: 'border-[#FF2A4D]/40' },
            { title: 'Verified Veteran', desc: 'Completed over 40 official tournament matches', icon: '🛡️', color: 'border-[#00B0FF]/40' },
          ].map(badge => (
            <div
              key={badge.title}
              className={`p-4 rounded-xl bg-[#141A27] border ${badge.color} space-y-1.5`}
            >
              <div className="text-2xl">{badge.icon}</div>
              <h4 className="font-bold text-white text-sm">{badge.title}</h4>
              <p className="text-[#8E9EB5] text-[11px]">{badge.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
