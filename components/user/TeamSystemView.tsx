'use client';

import React, { useState } from 'react';
import { useTournament } from '@/lib/store';
import { Users, Crown, Plus, Copy, Check, Shield, Trophy, Swords, Share2 } from 'lucide-react';

export default function TeamSystemView() {
  const { currentUser, teams, createTeam } = useTournament();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamTag, setNewTeamTag] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);

  const userTeam = teams.find(t => t.id === currentUser.teamId) || teams[0];

  const handleCreateTeamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName || !newTeamTag) return;
    createTeam(newTeamName, newTeamTag);
    setShowCreateModal(false);
    setNewTeamName('');
    setNewTeamTag('');
  };

  const handleCopyInvite = () => {
    navigator.clipboard.writeText(`JOIN-${userTeam?.tag || 'FF'}-2026`);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#FF6B00] text-xs font-gaming font-bold uppercase tracking-wider mb-1">
            <Users className="w-4 h-4" />
            <span>Competitive Squad Roster</span>
          </div>
          <h1 className="font-gaming font-extrabold text-3xl sm:text-4xl text-white uppercase tracking-tight">
            Team Management
          </h1>
          <p className="text-xs sm:text-sm text-[#8E9EB5] mt-1">
            Organize team lineups, manage squad roles, and register entire 4-man rosters into official tournaments.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-5 py-3 rounded-xl bg-[#FF2A4D] hover:bg-[#E01E3F] text-white font-gaming font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#FF2A4D]/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Create New Team
        </button>
      </div>

      {userTeam ? (
        <div className="space-y-6">
          {/* Team Profile Header Card */}
          <div className="rounded-3xl bg-[#0E131E] border border-[#232D42] p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
            <div className="flex items-center gap-5 z-10">
              <img
                src={userTeam.logo}
                alt={userTeam.name}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-[#2D3C5C] shadow-lg"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-[#FF6B00]/20 text-[#FF6B00] text-[10px] font-gaming font-bold uppercase">
                    [{userTeam.tag}]
                  </span>
                  <span className="text-xs text-slate-400">Registered Esports Clan</span>
                </div>
                <h2 className="font-gaming font-black text-2xl sm:text-3xl text-white uppercase mt-0.5">
                  {userTeam.name}
                </h2>
                <p className="text-xs text-[#8E9EB5]">
                  Captain: <strong className="text-white">{userTeam.members.find(m => m.role === 'CAPTAIN')?.username || currentUser.username}</strong>
                </p>
              </div>
            </div>

            {/* Invite Button */}
            <div className="flex items-center gap-3 z-10">
              <button
                onClick={handleCopyInvite}
                className="px-4 py-2.5 rounded-xl bg-[#141A27] hover:bg-[#1E2638] text-white font-gaming font-bold text-xs uppercase tracking-wider border border-[#232D42] flex items-center gap-2 transition-colors cursor-pointer"
              >
                {copiedCode ? <Check className="w-4 h-4 text-[#00F59B]" /> : <Share2 className="w-4 h-4" />}
                <span>{copiedCode ? 'Invite Code Copied!' : 'Copy Clan Invite Link'}</span>
              </button>
            </div>
          </div>

          {/* Team Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-[#0E131E] border border-[#1F273B] text-center">
              <span className="text-[10px] text-[#8E9EB5] uppercase font-bold block">Matches Played</span>
              <span className="font-gaming font-black text-2xl text-white mt-1 block">{userTeam.matchesPlayed}</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#0E131E] border border-[#1F273B] text-center">
              <span className="text-[10px] text-[#8E9EB5] uppercase font-bold block">Tournament Booyahs</span>
              <span className="font-gaming font-black text-2xl text-[#FFB800] mt-1 block">{userTeam.wins}</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#0E131E] border border-[#1F273B] text-center">
              <span className="text-[10px] text-[#8E9EB5] uppercase font-bold block">Total Clan Earnings</span>
              <span className="font-gaming font-black text-2xl text-[#00F59B] mt-1 block">
                ₹{userTeam.totalEarnings.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Roster Table */}
          <div className="bg-[#0E131E] rounded-2xl border border-[#1C2538] overflow-hidden shadow-xl p-5 space-y-4">
            <h3 className="font-gaming font-bold text-base text-white uppercase flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#FF2A4D]" /> Active Lineup ({userTeam.members.length} Players)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {userTeam.members.map((member) => (
                <div
                  key={member.userId}
                  className="p-4 rounded-xl bg-[#141A27] border border-[#1E2638] flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#192233] text-white flex items-center justify-center font-bold">
                      {member.role === 'CAPTAIN' ? <Crown className="w-5 h-5 text-[#FFB800]" /> : member.username[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-white text-sm">{member.ign}</span>
                        {member.role === 'CAPTAIN' && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#FFB800]/20 text-[#FFB800]">
                            CAPTAIN
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-[#8E9EB5] font-mono">{member.playerUid}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl bg-[#0E131E] border border-[#1C2538] space-y-3">
          <Users className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="font-gaming font-bold text-white text-lg">No Team Assigned</h3>
          <p className="text-xs text-[#8E9EB5]">Create or join a team to compete in Squad tournaments.</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-5 py-2.5 rounded-xl bg-[#FF2A4D] text-white font-gaming font-bold text-xs uppercase"
          >
            Create Team Now
          </button>
        </div>
      )}

      {/* Create Team Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#0F131C] border border-[#232B3E] rounded-2xl p-6 space-y-5">
            <h3 className="font-gaming font-bold text-lg text-white uppercase">Create Esports Team</h3>

            <form onSubmit={handleCreateTeamSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#8E9EB5] uppercase mb-1">Squad Name</label>
                <input
                  type="text"
                  required
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  placeholder="e.g. Phoenix Rising"
                  className="w-full bg-[#141A27] border border-[#232D42] rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#FF2A4D]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#8E9EB5] uppercase mb-1">Squad Clan Tag (3-5 Chars)</label>
                <input
                  type="text"
                  required
                  maxLength={5}
                  value={newTeamTag}
                  onChange={(e) => setNewTeamTag(e.target.value)}
                  placeholder="PHX"
                  className="w-full bg-[#141A27] border border-[#232D42] rounded-xl px-3.5 py-2.5 text-white uppercase focus:outline-none focus:border-[#FF2A4D]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="w-1/3 py-2.5 rounded-xl bg-[#141A27] text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-2.5 rounded-xl bg-[#FF2A4D] text-white font-gaming font-bold uppercase tracking-wider"
                >
                  Create & Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
