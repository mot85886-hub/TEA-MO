'use client';

import React from 'react';
import { useTournament } from '@/lib/store';
import { Trophy, Award, Flame, Star, ShieldCheck } from 'lucide-react';

export default function WinnersView() {
  const hallOfFame = [
    {
      season: 'Free Fire Grand Clash — Season 5',
      champion: 'Frost Clan Pro',
      captain: 'FrostByte',
      prize: '₹25,000',
      frags: 44,
      date: 'Aug 2026',
      badge: 'Season MVP',
      avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80',
    },
    {
      season: 'Kalahari Desert Skirmish — Invitational',
      champion: 'Soul Hunters',
      captain: 'Viper_FF',
      prize: '₹15,000',
      frags: 38,
      date: 'Jul 2026',
      badge: 'Unstoppable Booyah',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    },
    {
      season: 'Bermuda Master Solo Championship',
      champion: 'Phoenix_FF',
      captain: 'Phoenix_FF',
      prize: '₹10,000',
      frags: 19,
      date: 'Jun 2026',
      badge: 'Solo Terminator',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <div className="flex items-center gap-2 text-[#FFB800] text-xs font-gaming font-bold uppercase tracking-wider mb-1">
          <Award className="w-4 h-4" />
          <span>Hall of Champions</span>
        </div>
        <h1 className="font-gaming font-extrabold text-3xl sm:text-4xl text-white uppercase tracking-tight">
          Tournament Winners & Prize Archives
        </h1>
        <p className="text-xs sm:text-sm text-[#8E9EB5] mt-1">
          Official history of grand finals champions, verified Booyahs, and instant prize disbursements.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {hallOfFame.map((champ, idx) => (
          <div
            key={champ.season}
            className="rounded-2xl bg-[#0E131E] border border-[#1F273B] p-6 space-y-4 relative overflow-hidden shadow-xl"
          >
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-full bg-[#FFB800]/20 text-[#FFB800] text-[10px] font-gaming font-bold uppercase">
                {champ.badge}
              </span>
              <span className="text-xs text-[#8E9EB5]">{champ.date}</span>
            </div>

            <div className="flex items-center gap-3">
              <img
                src={champ.avatar}
                alt={champ.champion}
                className="w-12 h-12 rounded-xl object-cover border border-[#2D3952]"
              />
              <div>
                <h3 className="font-gaming font-bold text-lg text-white">{champ.champion}</h3>
                <span className="text-xs text-[#8E9EB5]">Lead: {champ.captain}</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">{champ.season}</p>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#1C2538] text-xs">
              <div className="bg-[#141A27] p-2.5 rounded-xl text-center">
                <span className="text-[10px] text-[#8E9EB5] uppercase block">Total Payout</span>
                <span className="font-gaming font-bold text-base text-[#00F59B]">{champ.prize}</span>
              </div>
              <div className="bg-[#141A27] p-2.5 rounded-xl text-center">
                <span className="text-[10px] text-[#8E9EB5] uppercase block">Squad Frags</span>
                <span className="font-gaming font-bold text-base text-white">{champ.frags} Kills</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
