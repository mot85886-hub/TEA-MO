'use client';

import React, { useState } from 'react';
import { useTournament } from '@/lib/store';
import { KeyRound, Unlock, Lock, Send, CheckCircle2, Swords } from 'lucide-react';

export default function AdminMatchManagement() {
  const { matches, tournaments, adminUpdateMatchCredentials } = useTournament();

  const [editingMatchId, setEditingMatchId] = useState<string | null>(matches[0]?.id || null);
  const [roomIdInput, setRoomIdInput] = useState(matches[0]?.roomId || '6582049');
  const [passwordInput, setPasswordInput] = useState(matches[0]?.password || 'FF#PRO88');

  const selectedMatch = matches.find(m => m.id === editingMatchId) || matches[0];

  const handleSelectMatch = (matchId: string) => {
    setEditingMatchId(matchId);
    const m = matches.find(item => item.id === matchId);
    if (m) {
      setRoomIdInput(m.roomId || '');
      setPasswordInput(m.password || '');
    }
  };

  const handleReleaseCredentials = (releaseNow: boolean) => {
    if (!selectedMatch) return;
    adminUpdateMatchCredentials(selectedMatch.id, roomIdInput, passwordInput, releaseNow);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-gaming font-bold text-xl text-white uppercase tracking-wide">
          Match Room & Credential Operations
        </h2>
        <p className="text-xs text-[#8E9EB5]">
          Manage in-game custom room passwords and automate instantaneous credential releases to verified player slots.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Match List */}
        <div className="lg:col-span-5 bg-[#0E131E] rounded-2xl border border-[#1C2538] p-4 space-y-3">
          <span className="text-xs font-gaming font-bold text-[#8E9EB5] uppercase px-1">
            Scheduled Matches ({matches.length})
          </span>

          <div className="space-y-2">
            {matches.map(m => (
              <button
                key={m.id}
                onClick={() => handleSelectMatch(m.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer ${
                  selectedMatch?.id === m.id
                    ? 'bg-[#182133] border-[#00F59B]/50 text-white'
                    : 'bg-[#141A27] border-[#1D2538] text-[#8E9EB5] hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-gaming font-bold text-sm text-white">
                    Match #{m.matchNumber} — {m.map}
                  </span>
                  {m.credentialsReleased ? (
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#00F59B]/20 text-[#00F59B]">
                      RELEASED
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300">
                      LOCKED
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-300 truncate">
                  {tournaments.find(t => t.id === m.tournamentId)?.name || 'Battle Royale Tournament'}
                </p>
                <span className="text-[10px] text-[#8E9EB5] block mt-1 font-mono">
                  Room: {m.roomId || 'TBA'} • Pass: {m.password || 'TBA'}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Credential Dispatch Editor */}
        <div className="lg:col-span-7 bg-[#0E131E] rounded-2xl border border-[#1C2538] p-6 space-y-6 shadow-xl">
          {selectedMatch ? (
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#1C2538]">
                <div>
                  <h3 className="font-gaming font-bold text-base text-white uppercase">
                    Configure Match #{selectedMatch.matchNumber} Credentials
                  </h3>
                  <span className="text-xs text-[#8E9EB5]">
                    {tournaments.find(t => t.id === selectedMatch.tournamentId)?.name || 'Tournament'}
                  </span>
                </div>
                <span className={`px-2.5 py-1 rounded text-xs font-bold ${
                  selectedMatch.credentialsReleased ? 'bg-[#00F59B]/20 text-[#00F59B]' : 'bg-slate-800 text-slate-400'
                }`}>
                  Status: {selectedMatch.status}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-[#8E9EB5] uppercase mb-1">Custom Room ID</label>
                  <input
                    type="text"
                    value={roomIdInput}
                    onChange={(e) => setRoomIdInput(e.target.value)}
                    placeholder="e.g. 6582049"
                    className="w-full bg-[#141A27] border border-[#232D42] rounded-xl px-3.5 py-2.5 text-sm font-mono font-bold text-white focus:outline-none focus:border-[#00F59B]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#8E9EB5] uppercase mb-1">Custom Room Password</label>
                  <input
                    type="text"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="e.g. FF#PRO88"
                    className="w-full bg-[#141A27] border border-[#232D42] rounded-xl px-3.5 py-2.5 text-sm font-mono font-bold text-[#00F59B] focus:outline-none focus:border-[#00F59B]"
                  />
                </div>
              </div>

              {/* Release Actions */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => handleReleaseCredentials(true)}
                  className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-[#00F59B] to-[#00B0FF] hover:opacity-95 text-slate-950 font-gaming font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#00F59B]/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  Release Credentials to Registered Squads Now
                </button>

                <button
                  type="button"
                  onClick={() => handleReleaseCredentials(false)}
                  className="px-5 py-3.5 rounded-xl bg-[#141A27] hover:bg-[#1E2638] text-amber-400 font-gaming font-bold text-xs uppercase tracking-wider border border-[#232D42] transition-colors cursor-pointer"
                >
                  Lock Room
                </button>
              </div>

              <div className="p-4 rounded-xl bg-[#141A27] border border-[#1D2538] text-xs text-[#8E9EB5] space-y-1">
                <span className="font-bold text-white block">Automated Dispatch Protocol:</span>
                <p>
                  Clicking &ldquo;Release Credentials&rdquo; pushes live in-app notifications and renders the Room ID / Password immediately inside registered players&apos; Match Room view.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-500 text-xs">Select a match to manage credentials.</div>
          )}
        </div>
      </div>
    </div>
  );
}
