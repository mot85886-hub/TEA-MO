'use client';

import React, { useState } from 'react';
import ClientDate from '../common/ClientDate';
import { useTournament } from '@/lib/store';
import {
  Trophy,
  Calendar,
  Clock,
  Users,
  ShieldAlert,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Award,
  Swords,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import JoinTournamentModal from '../modals/JoinTournamentModal';

export default function TournamentDetailsView() {
  const {
    selectedTournamentId,
    tournaments,
    registrations,
    currentUser,
    setActiveTab,
    matches,
  } = useTournament();

  const [activeTabSub, setActiveTabSub] = useState<'OVERVIEW' | 'RULES' | 'PRIZES' | 'ROSTER'>('OVERVIEW');
  const [showJoinModal, setShowJoinModal] = useState(false);

  const tournament = tournaments.find(t => t.id === selectedTournamentId) || tournaments[0];
  const registeredParticipants = registrations.filter(r => r.tournamentId === tournament.id);
  const isRegistered = registeredParticipants.some(r => r.userId === currentUser.id);

  const match = matches.find(m => m.tournamentId === tournament.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button */}
      <div>
        <button
          onClick={() => setActiveTab('tournaments')}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#121722] hover:bg-[#1A2234] text-xs font-bold text-[#8E9EB5] hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to All Tournaments
        </button>
      </div>

      {/* Hero Header Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-[#232D42] bg-[#0E131E] shadow-2xl">
        <div className="relative h-64 sm:h-80 w-full overflow-hidden">
          <img
            src={tournament.banner}
            alt={tournament.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0E131E] via-[#0E131E]/60 to-transparent" />

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            <span className="px-3 py-1 rounded-full bg-[#FF2A4D] text-white font-gaming font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-[#FF2A4D]/30">
              {tournament.status === 'LIVE' && <span className="w-2 h-2 rounded-full bg-white animate-ping" />}
              {tournament.status.replace('_', ' ')}
            </span>
            <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white font-gaming font-bold text-xs uppercase tracking-wider border border-white/10">
              {tournament.mode} • {tournament.map} • TPP
            </span>
            {isRegistered && (
              <span className="px-3 py-1 rounded-full bg-[#00F59B] text-black font-gaming font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#00F59B]/20">
                YOU ARE REGISTERED
              </span>
            )}
          </div>

          {/* Title & Info on image */}
          <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-1 max-w-2xl">
              <span className="text-xs uppercase font-bold tracking-widest text-[#FF6B00]">Official Esports Bracket</span>
              <h1 className="font-gaming font-black text-2xl sm:text-4xl text-white uppercase tracking-tight drop-shadow-md">
                {tournament.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 line-clamp-2">{tournament.description}</p>
            </div>

            <div className="flex items-center gap-3">
              {isRegistered ? (
                <button
                  onClick={() => setActiveTab('match-room')}
                  className="px-6 py-3.5 rounded-xl bg-[#00F59B] hover:bg-[#00D484] text-black font-gaming font-bold text-xs tracking-wider uppercase flex items-center gap-2 shadow-xl shadow-[#00F59B]/25 transition-all cursor-pointer"
                >
                  <Swords className="w-4 h-4" />
                  ENTER MATCH ROOM
                </button>
              ) : (
                <button
                  onClick={() => setShowJoinModal(true)}
                  disabled={tournament.joinedSlots >= tournament.maxSlots}
                  className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#FF2A4D] to-[#FF6B00] hover:opacity-95 text-white font-gaming font-bold text-xs tracking-wider uppercase flex items-center gap-2 shadow-xl shadow-[#FF2A4D]/25 disabled:opacity-50 transition-all cursor-pointer"
                >
                  <Trophy className="w-4 h-4" />
                  {tournament.joinedSlots >= tournament.maxSlots ? 'LOBBY FULL' : 'JOIN TOURNAMENT'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Quick Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#1C2538] border-t border-[#1C2538] bg-[#0A0E17]">
          <div className="p-4 sm:p-5 text-center">
            <span className="block text-[11px] text-[#8E9EB5] uppercase font-bold">Total Prize Pool</span>
            <span className="font-gaming font-extrabold text-xl sm:text-2xl text-[#00F59B]">
              ₹{tournament.prizePool.toLocaleString()}
            </span>
          </div>
          <div className="p-4 sm:p-5 text-center">
            <span className="block text-[11px] text-[#8E9EB5] uppercase font-bold">Entry Fee</span>
            <span className="font-gaming font-extrabold text-xl sm:text-2xl text-white">
              {tournament.entryFee === 0 ? 'FREE ENTRY' : `₹${tournament.entryFee}`}
            </span>
          </div>
          <div className="p-4 sm:p-5 text-center">
            <span className="block text-[11px] text-[#8E9EB5] uppercase font-bold">Squad Slots</span>
            <span className="font-gaming font-extrabold text-xl sm:text-2xl text-white">
              {tournament.joinedSlots} / {tournament.maxSlots}
            </span>
          </div>
          <div className="p-4 sm:p-5 text-center">
            <span className="block text-[11px] text-[#8E9EB5] uppercase font-bold">Match Time</span>
            <ClientDate
              date={tournament.tournamentStart}
              format="time"
              className="font-gaming font-bold text-sm sm:text-base text-[#FFB800] mt-1 block"
            />
          </div>
        </div>
      </div>

      {/* Detail Navigation Tabs */}
      <div className="flex border-b border-[#1C2538] space-x-6 text-xs font-gaming font-bold uppercase tracking-wider">
        {[
          { id: 'OVERVIEW', label: 'Tournament Overview' },
          { id: 'PRIZES', label: 'Prize Distribution' },
          { id: 'RULES', label: 'Rules & Scoring System' },
          { id: 'ROSTER', label: `Registered Squads (${registeredParticipants.length})` },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTabSub(tab.id as any)}
            className={`pb-3 transition-colors cursor-pointer border-b-2 ${
              activeTabSub === tab.id
                ? 'border-[#FF2A4D] text-[#FF2A4D]'
                : 'border-transparent text-[#8E9EB5] hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: Overview */}
      {activeTabSub === 'OVERVIEW' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column Details */}
          <div className="lg:col-span-8 space-y-6">
            {/* Tournament Specs Table */}
            <div className="bg-[#0E131E] rounded-2xl border border-[#1C2538] p-6 space-y-4">
              <h3 className="font-gaming font-bold text-base text-white uppercase tracking-wide flex items-center gap-2">
                <Swords className="w-4 h-4 text-[#FF2A4D]" /> Lobby Specifications
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="flex justify-between p-3 rounded-xl bg-[#141A27] border border-[#1D2538]">
                  <span className="text-[#8E9EB5]">Game Title</span>
                  <span className="font-bold text-white">Garena Free Fire MAX</span>
                </div>
                <div className="flex justify-between p-3 rounded-xl bg-[#141A27] border border-[#1D2538]">
                  <span className="text-[#8E9EB5]">Mode / Format</span>
                  <span className="font-bold text-white">{tournament.mode} (Battle Royale)</span>
                </div>
                <div className="flex justify-between p-3 rounded-xl bg-[#141A27] border border-[#1D2538]">
                  <span className="text-[#8E9EB5]">Official Map</span>
                  <span className="font-bold text-white">{tournament.map}</span>
                </div>
                <div className="flex justify-between p-3 rounded-xl bg-[#141A27] border border-[#1D2538]">
                  <span className="text-[#8E9EB5]">Perspective</span>
                  <span className="font-bold text-white">Third-Person Perspective (TPP)</span>
                </div>
                <div className="flex justify-between p-3 rounded-xl bg-[#141A27] border border-[#1D2538]">
                  <span className="text-[#8E9EB5]">Gun Property</span>
                  <span className="font-bold text-white">Disabled (Default Competitive)</span>
                </div>
                <div className="flex justify-between p-3 rounded-xl bg-[#141A27] border border-[#1D2538]">
                  <span className="text-[#8E9EB5]">Device Restriction</span>
                  <span className="font-bold text-[#00F59B]">Mobile Only (No Emulators)</span>
                </div>
              </div>
            </div>

            {/* Schedule Timeline */}
            <div className="bg-[#0E131E] rounded-2xl border border-[#1C2538] p-6 space-y-5">
              <h3 className="font-gaming font-bold text-base text-white uppercase tracking-wide flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#FFB800]" /> Tournament Schedule & Automation
              </h3>

              <div className="space-y-4 relative pl-6 border-l-2 border-[#1F293D] ml-2 text-xs">
                <div className="relative">
                  <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-[#00F59B] border-4 border-[#0E131E]" />
                  <span className="font-bold text-white block">Registration Opens</span>
                  <p className="text-[#8E9EB5]">Teams register roster and lock slots with atomic ledger check.</p>
                </div>

                <div className="relative">
                  <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-[#FF6B00] border-4 border-[#0E131E]" />
                  <span className="font-bold text-white block">Registration Closes (15 Mins Prior)</span>
                  <p className="text-[#8E9EB5]">All 48 slots finalized. Unconfirmed bookings released to waitlist.</p>
                </div>

                <div className="relative">
                  <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-[#FF2A4D] border-4 border-[#0E131E]" />
                  <span className="font-bold text-[#FF2A4D] block">Room ID & Password Release (15 Mins Prior)</span>
                  <p className="text-[#8E9EB5]">Room credentials appear inside Match Room tab. Captains join lobby slot.</p>
                </div>

                <div className="relative">
                  <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-slate-600 border-4 border-[#0E131E]" />
                  <span className="font-bold text-white block">Match Start & Telemetry Capture</span>
                  <p className="text-[#8E9EB5]">Custom room launch. In-game action begins across Bermuda.</p>
                </div>

                <div className="relative">
                  <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-[#00F59B] border-4 border-[#0E131E]" />
                  <span className="font-bold text-[#00F59B] block">Result Submission & Automated Payouts</span>
                  <p className="text-[#8E9EB5]">Captains upload screenshots. Admin verifies and wallet credits instantly.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Prize summary and Quick Action */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#0E131E] rounded-2xl border border-[#1C2538] p-5 space-y-4">
              <h3 className="font-gaming font-bold text-sm text-white uppercase tracking-wide flex items-center gap-2">
                <Trophy className="w-4 h-4 text-[#FFB800]" /> Prize Breakdown
              </h3>

              <div className="space-y-2.5">
                {tournament.prizes?.map(prize => (
                  <div
                    key={prize.rank}
                    className={`flex items-center justify-between p-3 rounded-xl border text-xs ${
                      prize.rank === 1
                        ? 'bg-[#FFB800]/10 border-[#FFB800]/30 text-white'
                        : prize.rank === 2
                        ? 'bg-slate-800/40 border-slate-700 text-white'
                        : 'bg-[#141A27] border-[#1D2538] text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs ${
                        prize.rank === 1 ? 'bg-[#FFB800] text-black' : 'bg-[#1D2538] text-white'
                      }`}>
                        #{prize.rank}
                      </span>
                      <span className="font-medium">{prize.label}</span>
                    </div>
                    <span className="font-gaming font-bold text-sm text-[#00F59B]">
                      ₹{prize.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Fair Play Notice */}
            <div className="bg-[#0E131E] rounded-2xl border border-[#1C2538] p-5 space-y-3">
              <h4 className="font-gaming font-bold text-xs text-[#FF2A4D] uppercase flex items-center gap-2">
                <ShieldAlert className="w-4 h-4" /> Zero-Tolerance Anti-Cheat
              </h4>
              <p className="text-[11px] text-[#8E9EB5] leading-relaxed">
                Emulators, scripts, config files, and teaming are permanently banned. Players caught violating rules forfeit all winnings and face hardware-level platform bans.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Prizes */}
      {activeTabSub === 'PRIZES' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tournament.prizes?.map(prize => (
            <div
              key={prize.rank}
              className="p-6 rounded-2xl bg-[#0E131E] border border-[#1F273B] text-center space-y-3 relative overflow-hidden"
            >
              {prize.rank === 1 && (
                <div className="absolute top-0 right-0 bg-[#FFB800] text-black font-gaming font-bold text-[10px] uppercase px-3 py-1 rounded-bl-xl">
                  CHAMPION
                </div>
              )}
              <div className="w-12 h-12 rounded-2xl bg-[#141A27] border border-[#232D42] text-[#FFB800] flex items-center justify-center mx-auto">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-[#8E9EB5] uppercase font-bold">{prize.label}</span>
                <h4 className="font-gaming font-black text-2xl text-[#00F59B] mt-1">
                  ₹{prize.amount.toLocaleString()}
                </h4>
              </div>
              <p className="text-[11px] text-slate-400">Credited automatically to team captain wallet upon match verification.</p>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Rules & Scoring */}
      {activeTabSub === 'RULES' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-5 bg-[#0E131E] p-6 rounded-2xl border border-[#1C2538] text-xs">
            <h3 className="font-gaming font-bold text-base text-white uppercase tracking-wide">
              Official Competitive Rules
            </h3>
            <ul className="space-y-2.5 text-slate-300 list-decimal pl-4 leading-relaxed">
              <li>
                <strong>Eligibility:</strong> Only players with Free Fire Level 40+ and account age over 30 days may enter.
              </li>
              <li>
                <strong>Hardware:</strong> Only Android and iOS smartphones are allowed. Tablets and PC emulators are strictly prohibited.
              </li>
              <li>
                <strong>Punctuality:</strong> Custom Room ID and Password will be provided inside the portal 15 minutes before the match. Teams must take their designated slot within 10 minutes.
              </li>
              <li>
                <strong>Evidence Requirement:</strong> Captains must capture end-game screenshots displaying team kills and placement. Proof must be submitted within 15 minutes of match conclusion.
              </li>
              <li>
                <strong>Disputes:</strong> Any contestations regarding hackers or teaming must be lodged via ticket with full screen recording within 30 minutes.
              </li>
            </ul>
          </div>

          <div className="lg:col-span-5 bg-[#0E131E] p-6 rounded-2xl border border-[#1C2538] space-y-4 text-xs">
            <h3 className="font-gaming font-bold text-base text-white uppercase tracking-wide">
              Scoring Point Matrix
            </h3>
            <div className="divide-y divide-[#1D2538] border border-[#1D2538] rounded-xl overflow-hidden">
              <div className="flex justify-between p-2.5 bg-[#141A27] font-bold text-[#8E9EB5]">
                <span>Placement</span>
                <span>Points</span>
              </div>
              <div className="flex justify-between p-2.5 text-white">
                <span className="text-[#FFB800] font-bold">1st Place (Booyah)</span>
                <span className="font-bold">15 pts</span>
              </div>
              <div className="flex justify-between p-2.5 text-white">
                <span>2nd Place</span>
                <span>12 pts</span>
              </div>
              <div className="flex justify-between p-2.5 text-white">
                <span>3rd Place</span>
                <span>10 pts</span>
              </div>
              <div className="flex justify-between p-2.5 text-white">
                <span>4th - 5th Place</span>
                <span>8 - 6 pts</span>
              </div>
              <div className="flex justify-between p-2.5 bg-[#141A27] text-[#00F59B] font-bold">
                <span>Each Kill</span>
                <span>+2 pts per frag</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Roster */}
      {activeTabSub === 'ROSTER' && (
        <div className="bg-[#0E131E] rounded-2xl border border-[#1C2538] p-6 space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-[#1C2538]">
            <h3 className="font-gaming font-bold text-base text-white uppercase tracking-wide">
              Registered Squads ({registeredParticipants.length} / {tournament.maxSlots})
            </h3>
            <span className="text-xs text-[#8E9EB5]">Slots assigned sequentially</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {registeredParticipants.map(reg => (
              <div
                key={reg.id}
                className="p-3 rounded-xl bg-[#141A27] border border-[#1D2538] flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-lg bg-[#FF2A4D]/10 text-[#FF2A4D] font-gaming font-bold flex items-center justify-center text-xs">
                    #{reg.slotNumber}
                  </span>
                  <div>
                    <span className="font-bold text-white block truncate max-w-[140px]">{reg.teamName}</span>
                    <span className="text-[10px] text-[#8E9EB5] font-mono">{reg.playerUid}</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#00F59B]/15 text-[#00F59B]">
                  CONFIRMED
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {showJoinModal && (
        <JoinTournamentModal tournament={tournament} onClose={() => setShowJoinModal(false)} />
      )}
    </div>
  );
}
