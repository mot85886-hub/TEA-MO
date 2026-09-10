'use client';

import React, { useState } from 'react';
import { useTournament } from '@/lib/store';
import { Trophy, Search, Medal, Flame, Swords, Shield } from 'lucide-react';

export default function LeaderboardView() {
  const { leaderboard, tournaments } = useTournament();
  const [search, setSearch] = useState('');
  const [selectedTourn, setSelectedTourn] = useState('ALL');

  const filtered = leaderboard.filter(entry => {
    return entry.teamOrPlayerName.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#FFB800] text-xs font-gaming font-bold uppercase tracking-wider mb-1">
            <Trophy className="w-4 h-4" />
            <span>Official Rankings</span>
          </div>
          <h1 className="font-gaming font-extrabold text-3xl sm:text-4xl text-white uppercase tracking-tight">
            Championship Leaderboard
          </h1>
          <p className="text-xs sm:text-sm text-[#8E9EB5] mt-1">
            Real-time battle royale standings compiled from telemetry, kills, and placement points.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search team or player..."
            className="w-full bg-[#121724] border border-[#212B3E] rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FF2A4D]"
          />
        </div>
      </div>

      {/* Top 3 Podium Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        {/* Rank 2 */}
        {leaderboard[1] && (
          <div className="md:order-1 rounded-2xl bg-[#0E131E] border border-slate-700/60 p-6 flex flex-col items-center text-center space-y-3 relative overflow-hidden shadow-xl">
            <div className="w-14 h-14 rounded-2xl bg-slate-800 text-slate-300 font-gaming font-black text-2xl flex items-center justify-center border border-slate-600 shadow-md">
              #2
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Runner Up</span>
              <h3 className="font-gaming font-bold text-xl text-white mt-0.5">{leaderboard[1].teamOrPlayerName}</h3>
            </div>
            <div className="grid grid-cols-2 gap-3 w-full bg-[#141A27] p-3 rounded-xl text-xs">
              <div>
                <span className="text-[#8E9EB5] block text-[10px]">Kills</span>
                <span className="font-gaming font-bold text-base text-white">{leaderboard[1].kills}</span>
              </div>
              <div>
                <span className="text-[#8E9EB5] block text-[10px]">Total Score</span>
                <span className="font-gaming font-bold text-base text-[#00F59B]">{leaderboard[1].totalScore} pts</span>
              </div>
            </div>
          </div>
        )}

        {/* Rank 1 (Tall & Highlighted) */}
        {leaderboard[0] && (
          <div className="md:order-2 rounded-2xl bg-gradient-to-b from-[#1E1925] to-[#0E131E] border-2 border-[#FFB800]/50 p-6 flex flex-col items-center text-center space-y-3 relative overflow-hidden shadow-2xl shadow-[#FFB800]/10">
            <div className="absolute top-0 right-0 bg-[#FFB800] text-black font-gaming font-bold text-[10px] uppercase px-3 py-1 rounded-bl-xl">
              CHAMPION
            </div>
            <div className="w-16 h-16 rounded-2xl bg-[#FFB800] text-black font-gaming font-black text-3xl flex items-center justify-center shadow-lg shadow-[#FFB800]/30">
              #1
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[#FFB800] tracking-wider">Tournament Leader</span>
              <h3 className="font-gaming font-black text-2xl text-white mt-0.5">{leaderboard[0].teamOrPlayerName}</h3>
            </div>
            <div className="grid grid-cols-2 gap-3 w-full bg-[#1A1F2C] p-3 rounded-xl text-xs border border-[#FFB800]/20">
              <div>
                <span className="text-[#8E9EB5] block text-[10px]">Kills</span>
                <span className="font-gaming font-bold text-lg text-white">{leaderboard[0].kills}</span>
              </div>
              <div>
                <span className="text-[#8E9EB5] block text-[10px]">Total Score</span>
                <span className="font-gaming font-bold text-lg text-[#00F59B]">{leaderboard[0].totalScore} pts</span>
              </div>
            </div>
          </div>
        )}

        {/* Rank 3 */}
        {leaderboard[2] && (
          <div className="md:order-3 rounded-2xl bg-[#0E131E] border border-amber-900/40 p-6 flex flex-col items-center text-center space-y-3 relative overflow-hidden shadow-xl">
            <div className="w-14 h-14 rounded-2xl bg-[#1C1714] text-[#CD7F32] font-gaming font-black text-2xl flex items-center justify-center border border-amber-800 shadow-md">
              #3
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[#CD7F32] tracking-wider">3rd Place</span>
              <h3 className="font-gaming font-bold text-xl text-white mt-0.5">{leaderboard[2].teamOrPlayerName}</h3>
            </div>
            <div className="grid grid-cols-2 gap-3 w-full bg-[#141A27] p-3 rounded-xl text-xs">
              <div>
                <span className="text-[#8E9EB5] block text-[10px]">Kills</span>
                <span className="font-gaming font-bold text-base text-white">{leaderboard[2].kills}</span>
              </div>
              <div>
                <span className="text-[#8E9EB5] block text-[10px]">Total Score</span>
                <span className="font-gaming font-bold text-base text-[#00F59B]">{leaderboard[2].totalScore} pts</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Leaderboard Table */}
      <div className="bg-[#0E131E] rounded-2xl border border-[#1C2538] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#141A27] text-[#8E9EB5] uppercase font-gaming font-bold border-b border-[#1C2538]">
              <tr>
                <th className="py-3.5 px-4">Rank</th>
                <th className="py-3.5 px-4">Squad / Player</th>
                <th className="py-3.5 px-4 text-center">Matches</th>
                <th className="py-3.5 px-4 text-center">Kills</th>
                <th className="py-3.5 px-4 text-center">Placement Pts</th>
                <th className="py-3.5 px-4 text-center">Kill Pts</th>
                <th className="py-3.5 px-4 text-center">Bonus</th>
                <th className="py-3.5 px-4 text-right">Total Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#172033]">
              {filtered.map((entry) => (
                <tr
                  key={entry.teamOrPlayerName}
                  className="hover:bg-[#121824] transition-colors"
                >
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center justify-center w-7 h-7 rounded-lg font-gaming font-bold text-xs ${
                        entry.rank === 1
                          ? 'bg-[#FFB800] text-black shadow-md shadow-[#FFB800]/20'
                          : entry.rank === 2
                          ? 'bg-slate-300 text-black'
                          : entry.rank === 3
                          ? 'bg-amber-700 text-white'
                          : 'bg-[#182133] text-slate-300'
                      }`}
                    >
                      {entry.rank}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{entry.teamOrPlayerName}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-center text-slate-300">{entry.matches}</td>
                  <td className="py-3.5 px-4 text-center font-bold text-white">{entry.kills}</td>
                  <td className="py-3.5 px-4 text-center text-slate-300">{entry.placementPoints}</td>
                  <td className="py-3.5 px-4 text-center text-slate-300">+{entry.killPoints}</td>
                  <td className="py-3.5 px-4 text-center text-[#FF6B00]">+{entry.bonus}</td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="font-gaming font-black text-sm text-[#00F59B]">
                      {entry.totalScore} pts
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
