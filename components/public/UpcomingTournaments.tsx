'use client';

import React, { useState, useMemo } from 'react';
import { useTournament } from '@/lib/store';
import { Tournament } from '@/lib/types';
import { Trophy, Search, Filter, Calendar, Users, Flame, ChevronRight, Shield, Swords } from 'lucide-react';
import JoinTournamentModal from '../modals/JoinTournamentModal';
import ClientDate from '../common/ClientDate';

export default function UpcomingTournaments() {
  const { tournaments, setActiveTab, setSelectedTournamentId, registrations, currentUser } = useTournament();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMode, setSelectedMode] = useState<string>('ALL');
  const [selectedFeeType, setSelectedFeeType] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [activeJoinTournament, setActiveJoinTournament] = useState<Tournament | null>(null);

  const filteredTournaments = useMemo(() => {
    return tournaments.filter(t => {
      // Search
      const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            t.map.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;

      // Mode
      if (selectedMode !== 'ALL' && t.mode !== selectedMode) return false;

      // Fee
      if (selectedFeeType === 'FREE' && t.entryFee > 0) return false;
      if (selectedFeeType === 'PAID' && t.entryFee === 0) return false;

      // Status
      if (selectedStatus !== 'ALL' && t.status !== selectedStatus) return false;

      return true;
    });
  }, [tournaments, searchQuery, selectedMode, selectedFeeType, selectedStatus]);

  const handleCardClick = (id: string) => {
    setSelectedTournamentId(id);
    setActiveTab('tournament-detail');
  };

  return (
    <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#FF2A4D] text-xs font-gaming font-bold uppercase tracking-wider mb-1">
            <Swords className="w-4 h-4" />
            <span>Competitive Lobbies</span>
          </div>
          <h2 className="font-gaming font-extrabold text-2xl sm:text-3xl text-white uppercase tracking-tight">
            Upcoming & Live Tournaments
          </h2>
          <p className="text-xs sm:text-sm text-[#8E9EB5] mt-1">
            Verified battle royale lobbies with automated telemetry and instant prize settlement.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tournament or map..."
            className="w-full bg-[#121724] border border-[#212B3E] rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FF2A4D]"
          />
        </div>
      </div>

      {/* Filter Chips Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-8 p-3 rounded-2xl bg-[#0E131E] border border-[#1C2538]">
        {/* Mode filter */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-[11px] font-bold text-[#8E9EB5] uppercase mr-1 hidden sm:inline">Mode:</span>
          {['ALL', 'Solo', 'Duo', 'Squad'].map(mode => (
            <button
              key={mode}
              onClick={() => setSelectedMode(mode)}
              className={`px-3 py-1.5 rounded-lg text-xs font-gaming font-bold uppercase transition-all cursor-pointer ${
                selectedMode === mode
                  ? 'bg-[#FF2A4D] text-white shadow-md shadow-[#FF2A4D]/25'
                  : 'bg-[#151C2C] text-[#8E9EB5] hover:text-white'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>

        {/* Fee filter */}
        <div className="flex items-center gap-1">
          <span className="text-[11px] font-bold text-[#8E9EB5] uppercase mr-1 hidden sm:inline">Entry:</span>
          {[
            { id: 'ALL', label: 'All' },
            { id: 'FREE', label: 'Free Entry' },
            { id: 'PAID', label: 'Paid' },
          ].map(fee => (
            <button
              key={fee.id}
              onClick={() => setSelectedFeeType(fee.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-gaming font-bold uppercase transition-all cursor-pointer ${
                selectedFeeType === fee.id
                  ? 'bg-[#FF6B00] text-white shadow-md shadow-[#FF6B00]/25'
                  : 'bg-[#151C2C] text-[#8E9EB5] hover:text-white'
              }`}
            >
              {fee.label}
            </button>
          ))}
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-1">
          <span className="text-[11px] font-bold text-[#8E9EB5] uppercase mr-1 hidden sm:inline">Status:</span>
          {[
            { id: 'ALL', label: 'All' },
            { id: 'REGISTRATION_OPEN', label: 'Open' },
            { id: 'LIVE', label: 'Live' },
            { id: 'COMPLETED', label: 'Ended' },
          ].map(st => (
            <button
              key={st.id}
              onClick={() => setSelectedStatus(st.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-gaming font-bold uppercase transition-all cursor-pointer ${
                selectedStatus === st.id
                  ? 'bg-[#00F59B] text-black shadow-md shadow-[#00F59B]/25'
                  : 'bg-[#151C2C] text-[#8E9EB5] hover:text-white'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tournament Cards Grid */}
      {filteredTournaments.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#0E131E] border border-[#1C2538] text-slate-400">
          <Trophy className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="font-gaming font-bold text-white text-base">No Tournaments Found</p>
          <p className="text-xs text-[#8E9EB5] mt-1">Try resetting filters or checking back soon for new scrim lobbies.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTournaments.map(tournament => {
            const isUserRegistered = registrations.some(
              r => r.tournamentId === tournament.id && r.userId === currentUser.id
            );
            const isFull = tournament.joinedSlots >= tournament.maxSlots;

            return (
              <div
                key={tournament.id}
                className="rounded-2xl bg-[#0E131E] border border-[#1F273B] hover:border-[#FF2A4D]/50 transition-all duration-300 overflow-hidden flex flex-col group shadow-lg hover:shadow-[#FF2A4D]/10"
              >
                {/* Image Banner & Badges */}
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={tournament.banner}
                    alt={tournament.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0E131E] via-[#0E131E]/30 to-transparent" />

                  {/* Status Badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    {tournament.status === 'LIVE' ? (
                      <span className="px-2.5 py-1 rounded-full bg-red-600 text-white font-gaming font-bold text-[10px] uppercase tracking-wider flex items-center gap-1 shadow-md shadow-red-600/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                        LIVE NOW
                      </span>
                    ) : tournament.status === 'REGISTRATION_OPEN' ? (
                      <span className="px-2.5 py-1 rounded-full bg-[#00F59B]/20 border border-[#00F59B]/40 text-[#00F59B] font-gaming font-bold text-[10px] uppercase tracking-wider">
                        REG OPEN
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-gaming font-bold text-[10px] uppercase tracking-wider">
                        {tournament.status}
                      </span>
                    )}

                    {isUserRegistered && (
                      <span className="px-2.5 py-1 rounded-full bg-[#FF2A4D]/20 border border-[#FF2A4D]/40 text-[#FF2A4D] font-gaming font-bold text-[10px] uppercase tracking-wider">
                        REGISTERED
                      </span>
                    )}
                  </div>

                  {/* Mode & Map Badge */}
                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 rounded-lg bg-[#0E131E]/80 backdrop-blur-md text-xs font-semibold text-slate-300 border border-slate-700/50">
                      {tournament.mode} • {tournament.map}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="font-gaming font-bold text-lg text-white uppercase truncate drop-shadow">
                      {tournament.name}
                    </h3>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  {/* Prize & Entry */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="bg-[#141A27] p-2.5 rounded-xl border border-[#1D2538]">
                      <span className="text-[10px] text-[#8E9EB5] uppercase font-bold block">Prize Pool</span>
                      <span className="font-gaming font-bold text-base text-[#00F59B]">
                        ₹{tournament.prizePool.toLocaleString()}
                      </span>
                    </div>

                    <div className="bg-[#141A27] p-2.5 rounded-xl border border-[#1D2538]">
                      <span className="text-[10px] text-[#8E9EB5] uppercase font-bold block">Entry Fee</span>
                      <span className="font-gaming font-bold text-base text-white">
                        {tournament.entryFee === 0 ? 'FREE' : `₹${tournament.entryFee}`}
                      </span>
                    </div>
                  </div>

                  {/* Schedule info */}
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between text-[#8E9EB5]">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#FF6B00]" />
                        Start Time
                      </span>
                      <ClientDate
                        date={tournament.tournamentStart}
                        format="datetime"
                        className="font-medium text-slate-300"
                      />
                    </div>

                    {/* Slots progress */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-[#8E9EB5]">Squad Slots</span>
                        <span className="font-bold text-white font-gaming">
                          {tournament.joinedSlots} / {tournament.maxSlots}
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full bg-[#182133] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#FF2A4D] to-[#FF6B00]"
                          style={{ width: `${(tournament.joinedSlots / tournament.maxSlots) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 flex gap-2">
                    {tournament.status === 'COMPLETED' ? (
                      <button
                        onClick={() => handleCardClick(tournament.id)}
                        className="w-full py-2.5 rounded-xl bg-[#161D2B] hover:bg-[#1E2638] text-slate-300 font-gaming font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                      >
                        VIEW FINAL RESULTS
                      </button>
                    ) : isUserRegistered ? (
                      <button
                        onClick={() => {
                          setSelectedTournamentId(tournament.id);
                          setActiveTab('match-room');
                        }}
                        className="w-full py-2.5 rounded-xl bg-[#00F59B] hover:bg-[#00D484] text-black font-gaming font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-[#00F59B]/20 cursor-pointer"
                      >
                        ENTER MATCH ROOM 🎮
                      </button>
                    ) : isFull ? (
                      <button
                        disabled
                        className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-400 font-gaming font-bold text-xs uppercase tracking-wider cursor-not-allowed"
                      >
                        LOBBY FULL
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => setActiveJoinTournament(tournament)}
                          className="flex-1 py-2.5 rounded-xl bg-[#FF2A4D] hover:bg-[#E01E3F] text-white font-gaming font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-[#FF2A4D]/20 cursor-pointer"
                        >
                          JOIN NOW
                        </button>
                        <button
                          onClick={() => handleCardClick(tournament.id)}
                          className="px-3.5 py-2.5 rounded-xl bg-[#141A27] hover:bg-[#1E2638] text-[#8E9EB5] hover:text-white border border-[#212A3E] transition-colors cursor-pointer"
                          title="Tournament Details"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeJoinTournament && (
        <JoinTournamentModal
          tournament={activeJoinTournament}
          onClose={() => setActiveJoinTournament(null)}
        />
      )}
    </section>
  );
}
